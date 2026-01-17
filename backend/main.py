import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os

app = FastAPI()

# Add this block right after creating 'app'
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (Make this specific for production security)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and mapping (Check if files exist to avoid crash)
if os.path.exists('sleep_health_pipeline.pkl'):
    model = joblib.load('sleep_health_pipeline.pkl')
    label_map = joblib.load('label_mapping.pkl')
else:
    print("CRITICAL WARNING: Model files not found.")
    model = None

# Define the Input Schema (Must match your React form exactly)
class SleepInput(BaseModel):
    Gender: str
    Age: int
    Occupation: str
    Sleep_Duration: float
    Quality_of_Sleep: int
    Physical_Activity_Level: int
    Stress_Level: int
    BMI_Category: str
    Heart_Rate: int
    Daily_Steps: int
    BP_Systolic: int
    BP_Diastolic: int

@app.get("/")
def home():
    return {"message": "Sleep Health API is running!"}

@app.post("/predict")
def predict_sleep_health(data: SleepInput):
    if not model:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # Convert incoming JSON to DataFrame
    input_data = pd.DataFrame([{
        'Gender': data.Gender,
        'Age': data.Age,
        'Occupation': data.Occupation,
        'Sleep Duration': data.Sleep_Duration, # Note: Space in name must match training data
        'Quality of Sleep': data.Quality_of_Sleep,
        'Physical Activity Level': data.Physical_Activity_Level,
        'Stress Level': data.Stress_Level,
        'BMI Category': data.BMI_Category,
        'Heart Rate': data.Heart_Rate,
        'Daily Steps': data.Daily_Steps,
        'BP_Systolic': data.BP_Systolic,
        'BP_Diastolic': data.BP_Diastolic
    }])
    
    # Predict
    prediction_id = model.predict(input_data)[0]
    prediction_label = label_map[prediction_id]
    
    # Get probability (optional confidence score)
    probability = model.predict_proba(input_data).max()
    
    return {
        "prediction": prediction_label,
        "confidence": float(probability)
    }

# Trigerring CI/CD Pipeline