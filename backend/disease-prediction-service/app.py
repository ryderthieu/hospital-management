from flask import Flask, request, jsonify
from joblib import load, dump
import numpy as np
import json
import gc
import os
from difflib import get_close_matches
import re
import random

# Cấu hình NumPy để sử dụng float32 thay vì float64
os.environ["NUMPY_DTYPE"] = "float32"
np.set_printoptions(precision=3, suppress=True)

app = Flask(__name__)

# Từ điển chứa các từ đồng nghĩa và biến thể của triệu chứng
# Chỉ định nghĩa các biến thể đặc biệt, các biến thể cơ bản sẽ được tạo tự động
symptom_variants = {
    "đau đầu": ["nhức đầu", "đầu đau", "đau ở đầu", "đau vùng đầu"],
    "đau bụng": ["đau dạ dày", "đau bao tử", "đau vùng bụng", "bụng đau"],
    "sốt": ["nóng người", "người nóng", "sốt cao", "nóng sốt"],
    "ho": ["ho khan", "ho có đờm", "ho nhiều", "bị ho"],
    "khó thở": ["thở khó", "thở dốc", "thở gấp", "hụt hơi"],
    "mệt mỏi": ["mệt", "uể oải", "không có sức", "kiệt sức"],
    "chóng mặt": ["hoa mắt", "váng đầu", "choáng váng", "xây xẩm"],
    "buồn nôn": ["buồn ói", "muốn nôn", "nôn nao", "khó chịu trong người"],
    "tiêu chảy": ["đi ngoài", "phân lỏng", "đi lỏng", "đi nhiều lần"],
    "đau ngực": ["tức ngực", "đau vùng ngực", "ngực đau", "đau thắt ngực"],
    "cảm giác nóng lạnh": ["cảm thấy nóng lạnh", "nóng lạnh", "lúc nóng lúc lạnh", "người nóng lạnh"]
}

def normalize_text(text):
    """Chuẩn hóa text: bỏ dấu, lowercase, bỏ khoảng trắng thừa"""
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def get_levenshtein_distance(s1, s2):
    """Tính khoảng cách Levenshtein giữa hai chuỗi"""
    if len(s1) < len(s2):
        return get_levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    
    return previous_row[-1]

def find_best_match(text, candidates, threshold=0.8):
    """Tìm từ gần đúng nhất trong danh sách candidates"""
    text = normalize_text(text)
    best_match = None
    best_ratio = 0
    
    for candidate in candidates:
        candidate = normalize_text(candidate)
        # Tính tỷ lệ giống nhau dựa trên khoảng cách Levenshtein
        max_len = max(len(text), len(candidate))
        if max_len == 0:
            continue
        distance = get_levenshtein_distance(text, candidate)
        ratio = 1 - (distance / max_len)
        
        if ratio > threshold and ratio > best_ratio:
            best_match = candidate
            best_ratio = ratio
    
    return best_match

def load_model_in_chunks():
    try:
        print("Loading model...")
        # Load model thông thường
        model = load('models/random_forest_model.joblib')
        print("Model loaded successfully")
        return model
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return None

# Load model và label encoder
model = load_model_in_chunks()
if model is None:
    print("Failed to load model!")
    exit(1)

print("Loading label encoder...")
label_encoder = load('models/label_encoder.joblib')
print("Label encoder loaded successfully")

# Load từ điển ánh xạ
def load_dictionary(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"{file_path} not found!")
        return {}

print("Loading mappings...")
symptom_mapping = load_dictionary('data_info/symptom_mapping.json')
disease_mapping = load_dictionary('data_info/disease_mapping.json')
print("Mappings loaded successfully")

# Cache danh sách triệu chứng và mapping
_symptoms_list = None
_vi_to_en_symptoms = None

def get_symptoms_list():
    global _symptoms_list
    if _symptoms_list is None:
        try:
            with open('data_info/symptom_list.txt', 'r') as file:
                _symptoms_list = [line.strip() for line in file if line.strip()]
        except FileNotFoundError:
            print('symptom_list.txt not found!')
            _symptoms_list = []
    return _symptoms_list

def generate_symptom_variants(symptom):
    """Tạo các biến thể cơ bản cho một triệu chứng"""
    variants = {symptom}
    
    # Thêm biến thể với "bị" ở đầu
    variants.add(f"bị {symptom}")
    
    # Thêm biến thể với "cảm thấy" cho các triệu chứng cảm giác
    if any(word in symptom for word in ["đau", "mệt", "khó", "buồn", "chóng", "nóng", "lạnh"]):
        variants.add(f"cảm thấy {symptom}")
    
    # Nếu triệu chứng bắt đầu bằng "đau", thêm biến thể đảo vị trí
    if symptom.startswith("đau "):
        part = symptom[4:]  # bỏ "đau " ở đầu
        variants.add(f"{part} đau")
    
    return variants

def get_vi_to_en_symptoms():
    global _vi_to_en_symptoms
    if _vi_to_en_symptoms is None:
        _vi_to_en_symptoms = {}
        all_vi_symptoms = set()
        
        # Đầu tiên, thêm tất cả triệu chứng từ symptom_mapping
        for en, vi in symptom_mapping.items():
            vi = vi.lower()
            _vi_to_en_symptoms[vi] = en
            all_vi_symptoms.add(vi)
            
            # Tạo các biến thể cơ bản
            variants = generate_symptom_variants(vi)
            for variant in variants:
                _vi_to_en_symptoms[variant] = en
            
            # Thêm các biến thể đặc biệt nếu có
            if vi in symptom_variants:
                for variant in symptom_variants[vi]:
                    variant = variant.lower()
                    _vi_to_en_symptoms[variant] = en
                    all_vi_symptoms.add(variant)
    
    return _vi_to_en_symptoms

def extract_symptoms(text):
    print(f"Input text: {text}")
    # Chuẩn hóa text: lowercase và bỏ dấu câu ở cuối từ
    text = text.lower()
    text = re.sub(r'[,\.\?!]+', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    extracted_symptoms = set()
    
    # Lấy mapping từ cache
    vi_to_en = get_vi_to_en_symptoms()
    
    # Tạo danh sách các triệu chứng tiếng Việt và biến thể
    all_vi_symptoms = set(vi_to_en.keys())
    
    # Tìm triệu chứng trong text
    found_symptoms = []
    words = text.split()
    
    # Xử lý từng cụm từ có độ dài khác nhau
    for i in range(len(words)):
        for j in range(i + 1, min(i + 6, len(words) + 1)):  # Xem xét tối đa 5 từ liên tiếp
            phrase = " ".join(words[i:j])
            
            # Bỏ qua các từ không cần thiết ở đầu cụm
            phrase = re.sub(r'^(tôi|và|rồi|thì|là)\s+', '', phrase)
            
            # Tìm triệu chứng khớp chính xác
            if phrase in all_vi_symptoms:
                en_symptom = vi_to_en[phrase]
                found_symptoms.append((phrase, en_symptom))
                extracted_symptoms.add(en_symptom)
                continue
            
            # Tìm triệu chứng gần đúng
            best_match = find_best_match(phrase, all_vi_symptoms)
            if best_match:
                en_symptom = vi_to_en[best_match]
                found_symptoms.append((phrase, en_symptom))
                extracted_symptoms.add(en_symptom)
    
    print("Found symptoms:")
    for found, en in found_symptoms:
        print(f"Found '{found}' -> mapped to '{en}'")
    
    return list(extracted_symptoms)

def get_random_symptoms(n=5):
    """Lấy ngẫu nhiên n triệu chứng từ danh sách để gợi ý"""
    all_symptoms = list(symptom_mapping.values())
    return random.sample(all_symptoms, min(n, len(all_symptoms)))

@app.route('/disease-predict', methods=['POST'])
def predict_disease_vn():
    try:
        data = request.json
        input_text = data.get('text')
        print(f"\n=== New request ===")
        print(f"Received text: {input_text}")

        if not input_text or not isinstance(input_text, str):
            return jsonify({"error": "Invalid input format. Expected a natural text."}), 400

        # Trích xuất triệu chứng
        input_symptoms = extract_symptoms(input_text)
        print(f"Extracted symptoms: {input_symptoms}")

        if not input_symptoms:
            suggested_symptoms = get_random_symptoms()
            return jsonify({
                "error": "Không tìm thấy triệu chứng.",
                "message": "Vui lòng mô tả thêm các triệu chứng bạn đang gặp phải. Ví dụ như: " + ", ".join(suggested_symptoms)
            }), 400

        all_symptoms = get_symptoms_list()
        if not all_symptoms:
            return jsonify({"error": "Danh sách triệu chứng không tồn tại hoặc rỗng."}), 500

        # Tạo vector với dtype nhỏ hơn và xử lý từng phần
        symptom_vector = np.zeros(len(all_symptoms), dtype=np.float32)
        for symptom in input_symptoms:
            if symptom in all_symptoms:
                idx = all_symptoms.index(symptom)
                symptom_vector[idx] = 1
                print(f"Set symptom '{symptom}' at index {idx}")

        # Reshape và dự đoán
        symptoms_array = symptom_vector.reshape(1, -1)
        
        # Dự đoán từng cây và tổng hợp kết quả
        n_classes = len(label_encoder.classes_)
        probas = np.zeros((1, n_classes), dtype=np.float32)
        
        # Xử lý từng cây một để tiết kiệm bộ nhớ
        for estimator in model.estimators_:
            proba = estimator.predict_proba(symptoms_array.astype(np.float32))
            probas += proba
            # Giải phóng bộ nhớ sau mỗi lần dự đoán
            gc.collect()
        
        # Tính trung bình xác suất
        probas /= len(model.estimators_)
        
        # Giải phóng bộ nhớ
        del symptoms_array
        gc.collect()

        # Lấy top 3 bệnh có xác suất cao nhất
        top_indices = np.argsort(probas[0])[-3:][::-1]
        top_diseases = []
        max_probability = 0

        for idx in top_indices:
            disease_en = label_encoder.inverse_transform([idx])[0]
            disease_vi = disease_mapping.get(disease_en, disease_en)
            probability = round(float(probas[0][idx]) * 100, 2)
            if probability > max_probability:
                max_probability = probability
            top_diseases.append({
                "disease": disease_vi,
                "probability": f"{probability}%"
            })

        # Tạo thông báo phù hợp
        message = ""
        if max_probability < 20:
            # Lấy các triệu chứng gợi ý liên quan đến top 3 bệnh
            suggested_symptoms = get_random_symptoms()
            message = "Xác suất dự đoán còn thấp. Vui lòng mô tả thêm các triệu chứng bạn đang gặp phải. Ví dụ như: " + ", ".join(suggested_symptoms)
        else:
            message = f"Dựa trên các triệu chứng bạn mô tả, có khả năng cao bạn đang mắc bệnh {top_diseases[0]['disease']}. Vui lòng đến gặp bác sĩ để được khám và chẩn đoán chính xác. Bạn có thể đặt lịch khám ngay để được tư vấn sớm nhất."

        # Giải phóng bộ nhớ
        del probas
        gc.collect()

        return jsonify({
            "top_3_predictions": top_diseases,
            "message": message,
            "found_symptoms": [symptom_mapping.get(s, s) for s in input_symptoms]  # Trả về các triệu chứng đã tìm thấy
        }), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
