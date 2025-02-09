from flask import Blueprint, request, jsonify
from database.db import transactions_collection

webhooks_bp = Blueprint("webhooks", __name__)

@webhooks_bp.route("/webhook", methods=["POST"])
def handle_webhook():
    data = request.json
    webhook_type = data.get("webhook_type")
    webhook_code = data.get("webhook_code")

    print(webhook_type, webhook_code)

    if webhook_type == "TRANSACTIONS":
        if webhook_code == "DEFAULT_UPDATE":
            new_transactions = data.get("added", [])
            print(new_transactions)
            for txn in new_transactions:
                txn["user_id"] = txn.get("account_id")
                transactions_collection.update_one(
                    {"transaction_id": txn["transaction_id"]},
                    {"$set": txn},
                    upsert=True
                )

            print(f"New transactions received: {new_transactions}")

    return jsonify({"status": "Webhook received"}), 200
