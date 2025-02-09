# test_api.py
import requests
import json

BASE_URL = "http://localhost:5001/api/v1/fraud"


def test_api():
    # Test 1: Train the model
    print("\nTest 1: Training the model...")
    response = requests.post(f"{BASE_URL}/train")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

    # Test 2: Predict fraud for a suspicious transaction
    print("\nTest 2: Testing fraud prediction for suspicious transaction...")
    suspicious_transaction = {
        "Cust_RefID": "TEST456",
        "Cust_AddressCity": "New York",
        "ISP City": "Mumbai",
        "UserSessionInputIP": "192.168.1.1",
        "UserTrueIP": "10.0.0.1",
        "UserIP_Blacklist": 1,
        "TrueIP_Blacklist": 1,
        "VirtualMachineSession": 1,
        "Page activity time": 1000,
        "Connection Type": "Mobile Broadband"
    }

    response = requests.post(f"{BASE_URL}/predict", json=suspicious_transaction)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

    # Test 3: Analyze a normal transaction
    print("\nTest 3: Testing analysis for normal transaction...")
    normal_transaction = {
        "Cust_RefID": "TEST789",
        "Cust_AddressCity": "New York",
        "ISP City": "New York",
        "UserSessionInputIP": "192.168.1.1",
        "UserTrueIP": "192.168.1.1",
        "UserIP_Blacklist": 0,
        "TrueIP_Blacklist": 0,
        "VirtualMachineSession": 0,
        "Page activity time": 150000,
        "Connection Type": "Fixed Broadband"
    }

    response = requests.post(f"{BASE_URL}/analyze", json=normal_transaction)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")


if __name__ == "__main__":
    test_api()