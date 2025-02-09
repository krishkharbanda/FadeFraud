import requests
from flask import Blueprint, request, jsonify
from config.settings import PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV
from database.db import users_collection, transactions_collection

transactions_bp = Blueprint("transactions", __name__)
PLAID_URL = f"https://{PLAID_ENV}.plaid.com"

@transactions_bp.route("/transactions", methods=["POST"])
def get_transactions():
    data = request.json
    user_id = data.get("user_id")

    user = users_collection.find_one({"user_id": user_id})
    if not user or "access_token" not in user:
        return jsonify({"error": "User not found or access token missing"}), 400

    access_token = user["access_token"]

    url = f"{PLAID_URL}/transactions/get"
    payload = {
        "client_id": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
        "access_token": access_token,
        "start_date": "2024-01-01",
        "end_date": "2024-02-01"
    }

    response = requests.post(url, json=payload).json()
    transactions = response.get("transactions", [])

    return jsonify({"success": True, "transactions": transactions})
