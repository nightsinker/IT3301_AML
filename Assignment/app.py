import pandas as pd
import joblib
from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline, AutoModelForSeq2SeqLM, AutoTokenizer

# Load dataset
df = pd.read_csv(r'C:\Users\User\IT3301_AML\Assignment\house_pricing.csv')

# Load random forest model
rf_model_path = 'C:/Users/User/IT3301_AML/Assignment/finetuned_rf_model.pkl'
rf_model = joblib.load(rf_model_path)

# Load language model
tokenizer = AutoTokenizer.from_pretrained("facebook/bart-large-cnn")
model = AutoModelForSeq2SeqLM.from_pretrained("facebook/bart-large-cnn")
query_pipeline = pipeline('text2text-generation', model=model, tokenizer=tokenizer)

# FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserQuery(BaseModel):
    query: str
    budget: float

def interpret_query(query):
    response = query_pipeline(query)
    return response[0]['generated_text']

def recommend_houses(preferences, budget, df, model):
    # Convert preferences to a format suitable for the model
    # This needs to be implemented based on your dataset and model
    filtered_df = df.copy() # Apply filtering logic here
    predictions = model.predict(filtered_df)
    filtered_df['predicted_price'] = predictions
    recommendations = filtered_df[filtered_df['predicted_price'] <= budget]
    return recommendations

@app.post("/recommend")
async def recommend(user_query: UserQuery):
    preferences = interpret_query(user_query.query)
    recommendations = recommend_houses(preferences, user_query.budget, df, rf_model)
    return recommendations.to_dict(orient='records')

# Run the server
if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
