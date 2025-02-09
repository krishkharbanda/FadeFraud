# test_fraud_scenarios.py
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5001/api/v1/fraud"

def print_test_result(name, response):
    print(f"\n=== {name} ===")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    print("=" * 50)

def run_fraud_tests():
    # Test Case 1: Obvious Fraud
    print("\nRunning Test Case 1: High-Risk Transaction")
    high_risk_transaction = {
        "Cust_RefID": "TEST_HIGH_RISK",
        "Cust_AddressCity": "New York",
        "ISP City": "Moscow",  # Location mismatch
        "UserSessionInputIP": "192.168.1.1",
        "UserTrueIP": "10.0.0.1",  # IP mismatch
        "UserIP_Blacklist": 1,  # Blacklisted IP
        "TrueIP_Blacklist": 1,
        "VirtualMachineSession": 1,  # VM detected
        "Page activity time": 500,  # Suspiciously short
        "Connection Type": "Mobile Broadband",
        "Device_ID": "SUSPICIOUS_DEVICE",
        "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    response = requests.post(f"{BASE_URL}/analyze", json=high_risk_transaction)
    print_test_result("High Risk Transaction", response)

    # Test Case 2: Legitimate Transaction
    print("\nRunning Test Case 2: Low-Risk Transaction")
    low_risk_transaction = {
        "Cust_RefID": "TEST_LOW_RISK",
        "Cust_AddressCity": "San Francisco",
        "ISP City": "San Francisco",  # Location match
        "UserSessionInputIP": "192.168.1.1",
        "UserTrueIP": "192.168.1.1",  # IP match
        "UserIP_Blacklist": 0,  # Clean IP
        "TrueIP_Blacklist": 0,
        "VirtualMachineSession": 0,  # No VM
        "Page activity time": 180000,  # Normal activity time
        "Connection Type": "Fixed Broadband",
        "Device_ID": "KNOWN_DEVICE",
        "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    response = requests.post(f"{BASE_URL}/analyze", json=low_risk_transaction)
    print_test_result("Low Risk Transaction", response)

    # Test Case 3: Mixed Signals
    print("\nRunning Test Case 3: Medium-Risk Transaction")
    medium_risk_transaction = {
        "Cust_RefID": "TEST_MEDIUM_RISK",
        "Cust_AddressCity": "Chicago",
        "ISP City": "Chicago",  # Location match
        "UserSessionInputIP": "192.168.1.1",
        "UserTrueIP": "10.0.0.1",  # IP mismatch
        "UserIP_Blacklist": 0,  # Clean IP
        "TrueIP_Blacklist": 0,
        "VirtualMachineSession": 1,  # VM detected
        "Page activity time": 60000,  # Moderate activity time
        "Connection Type": "Mobile Broadband",
        "Device_ID": "NEW_DEVICE",
        "UserAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15"
    }
    response = requests.post(f"{BASE_URL}/analyze", json=medium_risk_transaction)
    print_test_result("Medium Risk Transaction", response)

    # Test Case 4: Missing Data
    print("\nRunning Test Case 4: Incomplete Transaction Data")
    incomplete_transaction = {
        "Cust_RefID": "TEST_INCOMPLETE",
        "Cust_AddressCity": "Miami",
        "ISP City": "Miami",
        # Missing several fields
        "Page activity time": 120000,
        "Connection Type": "Fixed Broadband"
    }
    response = requests.post(f"{BASE_URL}/analyze", json=incomplete_transaction)
    print_test_result("Incomplete Transaction", response)

    # Test Case 5: Edge Case - Very Long Activity Time
    print("\nRunning Test Case 5: Edge Case - Long Activity")
    long_activity_transaction = {
        "Cust_RefID": "TEST_LONG_ACTIVITY",
        "Cust_AddressCity": "Seattle",
        "ISP City": "Seattle",
        "UserSessionInputIP": "192.168.1.1",
        "UserTrueIP": "192.168.1.1",
        "UserIP_Blacklist": 0,
        "TrueIP_Blacklist": 0,
        "VirtualMachineSession": 0,
        "Page activity time": 900000,  # Very long activity time
        "Connection Type": "Fixed Broadband",
        "Device_ID": "KNOWN_DEVICE",
        "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    response = requests.post(f"{BASE_URL}/analyze", json=long_activity_transaction)
    print_test_result("Long Activity Transaction", response)

    # Test Case 6: Edge Case - Zero Activity Time
    print("\nRunning Test Case 6: Edge Case - Zero Activity")
    zero_activity_transaction = {
        "Cust_RefID": "TEST_ZERO_ACTIVITY",
        "Cust_AddressCity": "Boston",
        "ISP City": "Boston",
        "UserSessionInputIP": "192.168.1.1",
        "UserTrueIP": "192.168.1.1",
        "UserIP_Blacklist": 0,
        "TrueIP_Blacklist": 0,
        "VirtualMachineSession": 0,
        "Page activity time": 0,  # Zero activity time
        "Connection Type": "Fixed Broadband",
        "Device_ID": "KNOWN_DEVICE",
        "UserAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    response = requests.post(f"{BASE_URL}/analyze", json=zero_activity_transaction)
    print_test_result("Zero Activity Transaction", response)

if __name__ == "__main__":
    print(f"Starting fraud detection tests at {datetime.now()}")
    run_fraud_tests()
    print(f"\nCompleted fraud detection tests at {datetime.now()}")