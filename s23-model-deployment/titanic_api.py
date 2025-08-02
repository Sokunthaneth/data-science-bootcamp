from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

# Load the trained model
model = joblib.load('./titanic_survival_model.joblib')

app = FastAPI()


class Passenger(BaseModel):
    pclass: int
    sex: int  # 0 = male, 1 = female
    age: float
    fare: float
    sibsp: int
    parch: int


@app.post('/predict')
def predict_survival(passenger: Passenger):
    features = np.array([[passenger.pclass, passenger.sex, passenger.age,
                        passenger.fare, passenger.sibsp, passenger.parch]])
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0, 1]
    return {
        'survived': int(prediction),
        'probability': float(probability)
    }

# To run: uvicorn titanic_api:app --reload
