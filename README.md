# FadeFraud

## Overview
FadeFraud is an ML model that evaluates transactions for fraud using a specific set of rules and a Random Forest Regression algorithm to determine a fraud score for each transaction and the reasons why. This model is integrated into 2 projects:

### Consumer-Facing:
This application tracks credit card transactions in real-time using the **Plaid API** and evaluates them for fraud using the model. The model is hosted as a **RESTful API** using Flask. If a transaction is flagged as fraudulent, the system immediately notifies the user via email.

### Corporate-Facinng
This application uploads a CSV of secure transactions made by users to the dashboard and uses the model, also hosted as a **RESTful API** using Flask, to evaluate them all at once. The transactions are then separated by high, medium, and low risk, and the reasons why each transaction is flagged.

## Features
- **Real-time transaction monitoring** via Plaid API
- **Machine learning-based fraud detection** using a trained model
- **RESTful API** for seamless integration
- **Email alerts** for fraudulent transactions

## Technologies Used
- **Backend:** Python, Flask
- **Machine Learning:** scikit-learn
- **Data Processing:** pandas, NumPy
- **API Integration:** Plaid API
- **Email Notification:** SMTP

## Branch Structure
- **frontend:** Branch for frontend of corporate facing product.
- **backend:** Branch for backend of corporate facing product.
- **storefront:** Branch for frontend of the test storefront and the ML model for both products.

## System Architecture
1. **Transaction Retrieval:** The system retrieves real-time credit card transactions from Plaid.
2. **Fraud Analysis:** Transactions are sent to the machine learning model via a Flask-based REST API.
3. **Fraud Detection Decision:** If the transaction is classified as fraudulent, an alert is generated.
4. **User Notification:** The system sends an email to the user with transaction details and fraud alert information.

## License
This project is licensed under the MIT License. See `LICENSE` for more details.
