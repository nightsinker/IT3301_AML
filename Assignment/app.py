from fastapi import FastAPI, Request
from pydantic import BaseModel
import joblib
from transformers import pipeline
from fastapi.middleware.cors import CORSMiddleware
import os

# Load Random Forest Model (use absolute path if necessary)
rf_model_path = 'C:/Users/User/IT3301_AML/Assignment/finetuned_rf_model.pkl'
rf_model = joblib.load(rf_model_path)

# Set Up LLM Pipeline (Using a smaller, free model)
llm_pipeline = pipeline('text-generation', model='distilgpt2')

# Define Request and Response Models
class Features(BaseModel):
    features: list[float]

class PredictionResponse(BaseModel):
    prediction: float
    explanation: str

# Initialize FastAPI App
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.post("/predict", response_model=PredictionResponse)
async def predict(features: Features):
    # Get Random Forest Prediction
    prediction = rf_model.predict([features.features])
    
    # Generate LLM Response
    llm_input = f"Explain the prediction {prediction[0]}"
    llm_response = llm_pipeline(llm_input, max_length=100)
    
    response = PredictionResponse(
        prediction=prediction[0],
        explanation=llm_response[0]['generated_text']
    )
    
    return response

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
