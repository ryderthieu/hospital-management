from flask import Flask, request, jsonify
from joblib import load
import numpy as np
import spacy
import json

app = Flask(__name__)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Load mô hình đã train và label encoder
model = load('models/random_forest_model.joblib')
label_encoder = load('models/label_encoder.joblib')

# Load từ điển ánh xạ
def load_dictionary(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"{file_path} not found!")
        return {}

symptom_mapping = load_dictionary('data_info/symptom_mapping.json')
disease_mapping = load_dictionary('data_info/disease_mapping.json')

# Danh sách triệu chứng từ file symptom_list.txt
def get_symptoms_list():
    try:
        with open('data_info/symptom_list.txt', 'r') as file:
            symptoms = [line.strip() for line in file if line.strip()]
        return symptoms
    except FileNotFoundError:
        print('symptom_list.txt not found! Please ensure the file exists in the model folder.')
        return []

# Hàm trích xuất triệu chứng từ văn bản tiếng Việt
def extract_symptoms(text):
    doc = nlp(text.lower())
    tokens = [token.text for token in doc]

    extracted_symptoms = set()
    
    # Ánh xạ tiếng Việt sang tiếng Anh
    for vi_symptom, en_symptom in symptom_mapping.items():
        if vi_symptom in text:
            extracted_symptoms.add(en_symptom)
    
    return list(extracted_symptoms)

# API dự đoán bệnh từ văn bản tiếng Việt
@app.route('/predict-nlp-vn', methods=['POST'])
def predict_disease_vn():
    try:
        data = request.json
        input_text = data.get('text')

        if not input_text or not isinstance(input_text, str):
            return jsonify({"error": "Invalid input format. Expected a natural text."}), 400

        # Trích xuất triệu chứng
        input_symptoms = extract_symptoms(input_text)

        if not input_symptoms:
            return jsonify({"error": "Không tìm thấy triệu chứng."}), 400

        all_symptoms = get_symptoms_list()
        if not all_symptoms:
            return jsonify({"error": "Danh sách triệu chứng không tồn tại hoặc rỗng."}), 500

        symptom_vector = [1 if symptom in input_symptoms else 0 for symptom in all_symptoms]

        symptoms_array = np.array(symptom_vector).reshape(1, -1)

        # Lấy xác suất dự đoán từ model
        probabilities = model.predict_proba(symptoms_array)[0]

        # Lấy top 3 bệnh có xác suất cao nhất
        top_indices = np.argsort(probabilities)[-3:][::-1]
        top_diseases = []

        for idx in top_indices:
            disease_en = label_encoder.inverse_transform([idx])[0]
            disease_vi = disease_mapping.get(disease_en, disease_en)  # Nếu không có trong dict thì trả lại tên tiếng Anh
            probability = round(float(probabilities[idx]) * 100, 2)
            top_diseases.append({
                "disease": disease_vi,
                "probability": f"{probability}%"
            })

        return jsonify({"top_3_predictions": top_diseases}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
