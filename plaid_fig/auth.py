import requests
from flask import Blueprint, request, jsonify
from config.settings import PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV
from database.db import users_collection

auth_bp = Blueprint("auth", __name__)
PLAID_URL = f"https://{PLAID_ENV}.plaid.com"

@auth_bp.route("/get_access_token", methods=["POST"])
def get_access_token():
    data = request.json
    public_token = data.get("public_token")
    user_id = data.get("user_id")

    url = f"{PLAID_URL}/item/public_token/exchange"
    payload = {
        "client_id": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
        "public_token": public_token
    }

    response = requests.post(url, json=payload).json()

    if "access_token" in response:
        access_token = response["access_token"]

        users_collection.update_one(
            {"user_id": user_id},
            {"$set": {"access_token": access_token}},
            upsert=True
        )
        return jsonify({"success": True, "access_token": access_token})

    return jsonify(response), 400
