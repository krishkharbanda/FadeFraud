import pandas as pd
import numpy as np
from faker import Faker
import random
from datetime import datetime
import uuid

# Set random seed for reproducibility
np.random.seed(42)
fake = Faker()


def generate_synthetic_data(n_samples=1000):
    data = []

    # Common email domains
    email_domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'protonmail.com', 'icloud.com']

    # Device manufacturers
    manufacturers = ['Apple Inc.', 'Samsung Electronics Co., Ltd.', 'Google LLC', 'Huawei', 'Dell Inc.', 'Lenovo']

    # Connection types
    connection_types = ['Fixed Broadband (Fibre/Cable/DSL)', 'Mobile Broadband', 'Satellite', '4G/5G']

    # US Cities and States
    cities_states = [
        ('New York', 'New York', 'NY'), ('Los Angeles', 'California', 'CA'),
        ('Chicago', 'Illinois', 'IL'), ('Houston', 'Texas', 'TX'),
        ('Phoenix', 'Arizona', 'AZ'), ('Philadelphia', 'Pennsylvania', 'PA'),
        ('San Antonio', 'Texas', 'TX'), ('San Diego', 'California', 'CA'),
        ('Dallas', 'Texas', 'TX'), ('San Jose', 'California', 'CA')
    ]

    # ISPs
    isps = ['Comcast', 'AT&T', 'Verizon', 'Charter Spectrum', 'T-Mobile', 'Cox Communications']

    # Operating Systems
    os_types = ['Windows', 'MacOS', 'iOS', 'Android', 'Linux']

    for _ in range(n_samples):
        # Determine if this will be a suspicious transaction
        is_suspicious = random.random() < 0.3  # 30% chance of suspicious transaction

        # Basic customer info
        city_state = random.choice(cities_states)
        first_name = fake.first_name()
        last_name = fake.last_name()
        email_domain = random.choice(email_domains)

        # Generate base transaction
        transaction = {
            'Cust_RefID': str(uuid.uuid4())[:16].upper(),
            'Cust_FirstName': first_name,
            'Cust_LastName': last_name,
            'Cust_PhoneNo': fake.phone_number(),
            'Cust_EmailAddress': f"{first_name}_{last_name}@{email_domain}",
            'Cust_EmailDomain': email_domain,
            'Cust_StreetAddress': fake.street_address(),
            'Cust_Zip': random.randint(10000, 99999),
            'Cust_AddressCity': city_state[0],
            'Cust_AddressState': city_state[1],
            'Cust_AddressStateISO': city_state[2],
            'Cust_AddressCountry': 'US',
            'Cust_Acct_IBAN': f"US{random.randint(10000000000000000000, 99999999999999999999)}",
            'Device_Manufacturer': random.choice(manufacturers),
            'Connection Type': random.choice(connection_types),
            'UA_OS': random.choice(os_types)
        }

        # Generate IP addresses and location info
        if is_suspicious:
            # For suspicious transactions, create mismatches and red flags
            transaction['ISP City'] = random.choice(cities_states)[0]  # Different city
            transaction['UserIP_Blacklist'] = random.random() if random.random() < 0.7 else 0
            transaction['TrueIP_Blacklist'] = random.random() if random.random() < 0.7 else 0
            transaction['VirtualMachineSession'] = 1 if random.random() < 0.6 else 0
            transaction['Page activity time'] = random.randint(100, 10000)  # Very short sessions
        else:
            # For normal transactions
            transaction['ISP City'] = city_state[0]  # Matching city
            transaction['UserIP_Blacklist'] = 0
            transaction['TrueIP_Blacklist'] = 0
            transaction['VirtualMachineSession'] = 0
            transaction['Page activity time'] = random.randint(30000, 300000)  # Normal session lengths

        # Generate IPs
        base_ip = f"{random.randint(1, 255)}.{random.randint(0, 255)}"
        transaction['Cust_EstablishedIP'] = f"{base_ip}.{random.randint(0, 255)}.{random.randint(0, 255)}"
        if is_suspicious and random.random() < 0.7:
            # Different IPs for suspicious transactions
            transaction[
                'UserSessionInputIP'] = f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"
            transaction[
                'UserTrueIP'] = f"{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}"
        else:
            # Same IPs for normal transactions
            transaction['UserSessionInputIP'] = transaction['Cust_EstablishedIP']
            transaction['UserTrueIP'] = transaction['Cust_EstablishedIP']

        # Set ISP
        transaction['ISP'] = random.choice(isps)

        # Generate Device ID
        transaction['Device_ID'] = f"{uuid.uuid4().hex[:32]}"

        # Generate UserAgent
        os_version = f"{random.randint(10, 15)}" if transaction['UA_OS'] == 'Windows' else f"{random.randint(10, 14)}"
        transaction['UserAgent'] = f"Mozilla/5.0 ({transaction['UA_OS']}; {os_version}) AppleWebKit/537.36"

        # Calculate final score based on risk factors
        base_score = 100
        if transaction['UserIP_Blacklist'] > 0: base_score -= 30
        if transaction['TrueIP_Blacklist'] > 0: base_score -= 30
        if transaction['VirtualMachineSession'] == 1: base_score -= 20
        if transaction['ISP City'] != transaction['Cust_AddressCity']: base_score -= 15
        if transaction['UserSessionInputIP'] != transaction['UserTrueIP']: base_score -= 15
        if transaction['Page activity time'] < 10000: base_score -= 20

        transaction['FinalScore'] = max(min(base_score + random.randint(-10, 10), 100), 0)

        data.append(transaction)

    return pd.DataFrame(data)


# Generate the data
df = generate_synthetic_data(1000)

# Save to CSV
df.to_csv('synthetic_fraud_data.csv', index=False)

print("Dataset statistics:")
print(f"Total transactions: {len(df)}")
print(f"High risk (score < 70): {len(df[df['FinalScore'] < 70])}")
print(f"Medium risk (score 70-85): {len(df[df['FinalScore'].between(70, 85)])}")
print(f"Low risk (score > 85): {len(df[df['FinalScore'] > 85])}")