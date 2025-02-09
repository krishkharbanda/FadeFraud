# routes/fraudtransactions.py
from flask import Blueprint, request, jsonify
from database.frauddb import FraudDetectionDB

transactions_bp = Blueprint('transactions', __name__)
db = FraudDetectionDB()


@transactions_bp.route('/predict', methods=['POST'])
def predict_fraud():
    try:
        transaction_data = request.get_json()

        if not transaction_data:
            return jsonify({"error": "No data provided"}), 400

        # Get prediction
        result = db.predict_fraud(transaction_data)

        return jsonify({
            "transaction_id": transaction_data.get('Cust_RefID', 'Unknown'),
            "fraud_probability": result['fraud_probability'],
            "risk_level": result['risk_level'],
            "risk_factors": result['risk_factors']
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@transactions_bp.route('/train', methods=['POST'])
def train_model():
    try:
        result = db.train_model()
        return jsonify({
            "message": "Model trained successfully",
            "train_accuracy": result['train_accuracy'],
            "test_accuracy": result['test_accuracy'],
            "model_file": result['model_file']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@transactions_bp.route('/analyze', methods=['POST'])
def analyze_transaction():
    try:
        transaction_data = request.get_json()

        if not transaction_data:
            return jsonify({"error": "No data provided"}), 400

        # Get prediction and detailed analysis
        result = db.predict_fraud(transaction_data)

        return jsonify({
            "transaction_id": transaction_data.get('Cust_RefID', 'Unknown'),
            "analysis": {
                "fraud_probability": result['fraud_probability'],
                "risk_level": result['risk_level'],
                "risk_factors": result['risk_factors'],
                "location_check": {
                    "isp_city": transaction_data.get('ISP City'),
                    "address_city": transaction_data.get('Cust_AddressCity'),
                    "match": transaction_data.get('ISP City') == transaction_data.get('Cust_AddressCity')
                },
                "ip_check": {
                    "session_ip": transaction_data.get('UserSessionInputIP'),
                    "true_ip": transaction_data.get('UserTrueIP'),
                    "match": transaction_data.get('UserSessionInputIP') == transaction_data.get('UserTrueIP')
                },
                "security_flags": {
                    "virtual_machine": bool(transaction_data.get('VirtualMachineSession')),
                    "ip_blacklisted": bool(transaction_data.get('UserIP_Blacklist')),
                    "true_ip_blacklisted": bool(transaction_data.get('TrueIP_Blacklist'))
                }
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500