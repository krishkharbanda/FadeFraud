from flask import Blueprint, request, jsonify
from database.db import transactions_collection
import pandas as pd
import os
import joblib

webhooks_bp = Blueprint("webhooks", __name__)

@webhooks_bp.route("/webhook", methods=["POST"])
def handle_webhook():
    data = request.json
    message = data.get("message")
    webhook_type = data.get("webhook_type")
    webhook_code = data.get("webhook_code")

    product_form(message)

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

def get_broken_rules(row):
    broken_rules = []

    if row["Transaction Amount"] > 4000:
        broken_rules.append("Large Transaction")
    if row["Transaction Pattern"] == "High Frequency":
        broken_rules.append("High Frequency Transactions")
    if row["User Agent"] == "Obsolete Browser":
        broken_rules.append("Obsolete Browser")
    if row["Activity Time (s)"] < 30:
        broken_rules.append("Suspiciously Fast Activity")

    return ", ".join(broken_rules) if broken_rules else "None"


def predict_fraud(model_pipeline, transaction):
    transaction_df = pd.DataFrame([transaction])
    fraud_score = model_pipeline.predict(transaction_df)[0]
    broken_rules = get_broken_rules(transaction_df.iloc[0])
    return fraud_score, broken_rules

def product_form(message):
    name, price = message.split("|")
    price = float(price[-1:])

    transaction = {
        "IP Address": "192.168.1.50",
        "Country": "Germany",
        "Device ID": "device_20",
        "Email": "kharbandakrish23@gmail.com",
        "Transaction Amount": price,
        "Transaction Pattern": "High Frequency",
        "User Agent": "Safari",
        "Activity Time (s)": 25,
    }

    model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../model/model.pkl"))
    model_pipeline = joblib.load(model_path)

    fraud_score, broken_rules = predict_fraud(model_pipeline, transaction)
    print(f"Predicted Fraud Score: {fraud_score:.2f}%")
    print(f"Broken Rules: {broken_rules}")
    if fraud_score >= 70:
        send_email(fraud_score, broken_rules, transaction)


import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = os.getenv("EMAIL_USER")
SENDER_PASSWORD = os.getenv("EMAIL_PASSWORD")
RECEIVER_EMAIL = os.getenv("EMAIL_RECEIVER")


def send_email(fraud_score, broken_rules, transaction):
    subject = "Fraud Alert: Suspicious Transaction Detected on your Card"

    body = f"""
    Alert! A potentially fraudulent transaction has been detected.

    **Fraud Score:** {fraud_score:.2f}%
    **Broken Rules:** {broken_rules}

    **Transaction Details:**
    IP Address: {transaction["IP Address"]}
    Country: {transaction["Country"]}
    Device ID: {transaction["Device ID"]}
    Email: {transaction["Email"]}
    Transaction Amount: ${transaction["Transaction Amount"]}
    Transaction Pattern: {transaction["Transaction Pattern"]}
    User Agent: {transaction["User Agent"]}
    Activity Time: {transaction["Activity Time (s)"]} seconds

    Immediate action may be required.
    """

    msg = MIMEMultipart()
    msg["From"] = SENDER_EMAIL
    msg["To"] = RECEIVER_EMAIL
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        server.quit()
        print("Sent")
    except Exception as e:
        print(f"Error sending email: {e}")