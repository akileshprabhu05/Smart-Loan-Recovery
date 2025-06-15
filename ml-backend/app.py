from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model and encoders
model = joblib.load('loan_strategy_model.pkl')
risk_encoder = joblib.load('risk_encoder.pkl')
status_encoder = joblib.load('status_encoder.pkl')
strategy_encoder = joblib.load('strategy_encoder.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    loan_amount = data.get('loan_amount')
    due_in_days = data.get('due_in_days')
    risk = data.get('risk')
    status = data.get('status')

    # Handle unseen labels
    if risk not in risk_encoder.classes_:
        return jsonify({'error': f'Invalid risk: {risk}. Expected one of {list(risk_encoder.classes_)}'}), 400

    if status not in status_encoder.classes_:
        return jsonify({'error': f'Invalid status: {status}. Expected one of {list(status_encoder.classes_)}'}), 400

    # Encode features
    risk_encoded = risk_encoder.transform([risk])[0]
    status_encoded = status_encoder.transform([status])[0]
    
    # Make prediction
    X = np.array([[loan_amount, due_in_days, risk_encoded, status_encoded]])
    pred_encoded = model.predict(X)[0]
    strategy = strategy_encoder.inverse_transform([pred_encoded])[0]

    return jsonify({'strategy': strategy})

if __name__ == '__main__':
    app.run(debug=True)
