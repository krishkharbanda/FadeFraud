# database/frauddb.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from datetime import datetime
import joblib
import os


class FraudDetectionDB:
    def __init__(self):
        self.data_file = 'EnrichmentFields_dataset_complete.csv'
        self.model_file = 'fraud_model.joblib'
        self.df = None
        self.model = None
        self.load_data()

    def load_data(self):
        """Load data from CSV file"""
        try:
            self.df = pd.read_csv(self.data_file)
            print(f"Loaded {len(self.df)} records from CSV")
        except Exception as e:
            print(f"Error loading CSV: {str(e)}")
            raise

    def prepare_features(self, transaction):
        """Convert transaction data into model features"""
        features = np.zeros(7)

        # Location mismatch (ISP City vs Address City)
        features[0] = int(transaction.get('ISP City', '') != transaction.get('Cust_AddressCity', ''))

        # IP mismatch (Session IP vs True IP)
        features[1] = int(transaction.get('UserSessionInputIP', '') != transaction.get('UserTrueIP', ''))

        # Blacklist checks
        features[2] = float(transaction.get('UserIP_Blacklist', 0))
        features[3] = float(transaction.get('TrueIP_Blacklist', 0))

        # Virtual Machine check
        features[4] = float(transaction.get('VirtualMachineSession', 0))

        # Page activity time (normalized)
        features[5] = min(float(transaction.get('Page activity time', 0)) / 300000, 1.0)

        # Connection type risk (higher risk for mobile)
        features[6] = 1 if 'mobile' in str(transaction.get('Connection Type', '')).lower() else 0

        return features

    def train_model(self):
        """Train the fraud detection model using CSV data"""
        # Prepare features for all data
        feature_matrix = np.zeros((len(self.df), 7))

        for i, row in self.df.iterrows():
            feature_matrix[i] = self.prepare_features(row)

        # Use FinalScore to create labels (assuming scores below 70 indicate fraud)
        labels = (self.df['FinalScore'] < 70).astype(int)

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            feature_matrix, labels, test_size=0.2, random_state=42
        )

        # Train model
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train, y_train)

        # Save model
        joblib.dump(self.model, self.model_file)

        # Calculate and return accuracy
        train_accuracy = self.model.score(X_train, y_train)
        test_accuracy = self.model.score(X_test, y_test)

        return {
            "train_accuracy": train_accuracy,
            "test_accuracy": test_accuracy,
            "model_file": self.model_file
        }

    def predict_fraud(self, transaction_data):
        """Predict fraud probability for a transaction"""
        if self.model is None:
            if os.path.exists(self.model_file):
                self.model = joblib.load(self.model_file)
            else:
                result = self.train_model()
                print(f"Model trained with accuracy: {result['test_accuracy']}")

        features = self.prepare_features(transaction_data)
        fraud_probability = self.model.predict_proba(features.reshape(1, -1))[0][1]

        return {
            "fraud_probability": float(fraud_probability),
            "risk_level": "high" if fraud_probability > 0.7 else "medium" if fraud_probability > 0.3 else "low",
            "risk_factors": self.get_risk_factors(transaction_data, fraud_probability)
        }

    def get_risk_factors(self, transaction, probability):
        """Analyze and return specific risk factors"""
        risk_factors = []

        if transaction.get('ISP City') != transaction.get('Cust_AddressCity'):
            risk_factors.append("Location mismatch")

        if transaction.get('UserSessionInputIP') != transaction.get('UserTrueIP'):
            risk_factors.append("IP address mismatch")

        if transaction.get('UserIP_Blacklist') > 0:
            risk_factors.append("IP appears in blacklist")

        if transaction.get('VirtualMachineSession') > 0:
            risk_factors.append("Virtual machine detected")

        if float(transaction.get('Page activity time', 0)) < 30000:
            risk_factors.append("Suspicious page activity time")

        return risk_factors