import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer

df = pd.read_csv("data.csv")

X = df.drop(columns=["Fraud Score (%)", "Fraudulent"])
y = df["Fraud Score (%)"]

categorical_features = ["Country", "Transaction Pattern", "User Agent"]
numerical_features = ["Transaction Amount", "Activity Time (s)"]

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_features),
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
    ]
)

model_pipeline = Pipeline(
    steps=[("preprocessor", preprocessor),
           ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))]
)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model_pipeline.fit(X_train, y_train)

joblib.dump(model_pipeline, "model.pkl")