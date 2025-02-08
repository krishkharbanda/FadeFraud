from flask import Blueprint, request, jsonify
from database.db import transactions_collection

user_transactions_bp = Blueprint("user_transactions", __name__)

@user_transactions_bp.route("/get_user_transactions", methods=["GET"])
def get_user_transactions():
    user_id = request.args.get("user_id")

    transactions = list(transactions_collection.find({"user_id": user_id}, {"_id": 0}))
    return jsonify({"transactions": transactions})
