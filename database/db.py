from pymongo import MongoClient
from config.settings import MONGO_URI, DATABASE_NAME

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]

transactions_collection = db["transactions"]
users_collection = db["users"]