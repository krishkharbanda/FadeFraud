# fraudmain.py
from flask import Flask, jsonify
from flask_cors import CORS
from routes.fraudtransactions import transactions_bp
from database.frauddb import FraudDetectionDB


def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes

    # Initialize database
    app.db = FraudDetectionDB()

    # Register blueprints
    app.register_blueprint(transactions_bp, url_prefix='/api/v1/fraud')

    @app.route('/')
    def home():
        return jsonify({"message": "FadeFraud Detection API is running"})

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5001, debug=True)