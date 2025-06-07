from flask import Flask, request, jsonify
from joblib import load
import numpy as np

app = Flask(__name__)


def get_symptoms_list():
    # Đọc danh sách triệu chứng từ file symptoms.txt
    try:
        with open('training/notebooks/symptom_list.txt', 'r') as file:
            symptoms = [line.strip() for line in file if line.strip()]
        return symptoms
    except FileNotFoundError:
        print('symptoms.txt not found! Please ensure the file exists in the model folder.')
        return []

# Load the trained model
model = load('training/models/random_forest_model.joblib')
label_encoder = load('training/models/label_encoder.joblib')
# API to get the list of symptoms
@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    symptoms = get_symptoms_list()
    return jsonify({"symptoms": symptoms}), 200

# API to predict disease based on symptoms
@app.route('/predict', methods=['POST'])
def predict_disease():
    try:
        data = request.json
        input_symptoms = data.get('symptoms')

        if not input_symptoms or not isinstance(input_symptoms, list):
            return jsonify({"error": "Invalid input format. Expected a list of symptom names."}), 400

        # Lấy danh sách triệu chứng đầy đủ
        all_symptoms = get_symptoms_list()
        symptom_vector = [1 if symptom in input_symptoms else 0 for symptom in all_symptoms]

        if len(symptom_vector) != len(all_symptoms):
            return jsonify({"error": f"Expected {len(all_symptoms)} symptom values, but got {len(symptom_vector)}."}), 400

        symptoms_array = np.array(symptom_vector).reshape(1, -1)
        prediction = model.predict(symptoms_array)

        # Mapping kết quả với tên bệnh sử dụng Label Encoder
        disease_name = label_encoder.inverse_transform([int(prediction[0])])[0]

        return jsonify({"predicted_disease": disease_name}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
