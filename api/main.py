from fastapi import FastAPI, HTTPException, UploadFile, File
import ollama
import os
import re
import uuid
import shutil
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Ollama client once
client = ollama.Client()

def parse_skin_conditions(llava_response: str) -> dict:
    response_lower = llava_response.lower()

    condition_definitions = {
        "Acne": {
            "keywords": ["acne", "pimples", "breakouts"],
            "treatments": ["Benzoyl Peroxide", "Topical Retinoids"]
        },
        "Hyperpigmentation": {
            "keywords": ["hyperpigmentation"],
            "treatments": ["Niacinamide", "Vitamin C serum"]
        },
        "Scarring": {
            "keywords": ["scarring", "marks"],
            "treatments": ["Silicone gel", "Retinoid cream"]
        },
        "Rosacea": {
            "keywords": ["rosacea", "facial redness", "flushing"],
            "treatments": ["Metronidazole cream", "Azelaic acid", "Gentle skincare"]
        },
        "Eczema": {
            "keywords": ["eczema", "atopic dermatitis"],
            "treatments": ["Hydrocortisone cream", "Moisturizers", "Avoid irritants"]
        },
        "Psoriasis": {
            "keywords": ["psoriasis", "plaque", "scaly patches"],
            "treatments": ["Coal tar", "Topical steroids", "Vitamin D analogs"]
        },
        "Melasma": {
            "keywords": ["melasma", "dark patches"],
            "treatments": ["Hydroquinone", "Sunscreen", "Azelaic acid"]
        },
        "Dermatitis": {
            "keywords": ["dermatitis", "skin inflammation"],
            "treatments": ["Topical steroids", "Antihistamines", "Barrier creams"]
        },
        "Keratosis Pilaris": {
            "keywords": ["keratosis pilaris", "chicken skin", "rough bumps"],
            "treatments": ["Lactic acid", "Urea cream", "Gentle exfoliation"]
        },
        "Fungal Infection": {
            "keywords": ["fungal infection", "ringworm", "tinea", "yeast infection"],
            "treatments": ["Clotrimazole", "Ketoconazole", "Antifungal creams"]
        },
        "Sunburn": {
            "keywords": ["sunburn", "burnt skin", "sun exposure"],
            "treatments": ["Aloe vera gel", "Cool compresses", "Hydration"]
        },
        "Redness": {
            "keywords": ["redness", "red patches", "blotchy skin"],
            "treatments": ["Calming creams", "Green-tinted moisturizers", "Cold compress"]
        },
        "Inflammation": {
            "keywords": ["inflammation", "inflamed", "swelling", "irritation"],
            "treatments": ["Anti-inflammatory creams", "Hydrocortisone", "Cool compresses"]
        }
    }

    compiled_conditions = {
        condition: [re.compile(rf"\b{re.escape(keyword)}\b", re.IGNORECASE)
                    for keyword in data["keywords"]]
        for condition, data in condition_definitions.items()
    }

    detected_conditions = [
        condition for condition, patterns in compiled_conditions.items()
        if any(pattern.search(response_lower) for pattern in patterns)
    ]

    def guess_severity(text: str, condition: str) -> str:
        severity_keywords = {
            "Severe": ["severe", "extreme", "inflamed", "cystic", "widespread", "intense"],
            "Mild": ["mild", "slight", "minor", "faint"],
            "Moderate": ["moderate", "noticeable", "persistent"]
        }
        for level, keywords in severity_keywords.items():
            for kw in keywords:
                if kw in text and condition in text:
                    return level
        return "Moderate"

    structured_output = {
        "Skin Conditions": detected_conditions,
        "Severity": {},
        "Recommended Medications": {}
    }

    for condition in detected_conditions:
        cond_lower = condition.lower()
        structured_output["Severity"][condition] = guess_severity(response_lower, cond_lower)
        structured_output["Recommended Medications"][condition] = condition_definitions[condition]["treatments"]

    return structured_output


@app.get("/")
def root():
    return {"message": "Skin Condition Analyzer with Ollama + FastAPI"}


@app.get("/models")
def list_models():
    models = ollama.list()
    return {"available_models": [m.model for m in models['models']]}


@app.post("/upload-image")
def upload_image(file: UploadFile = File(...)):
    # Save uploaded file to temp directory
    if not os.path.exists("temp"):
        os.makedirs("temp")

    filename = f"temp/{uuid.uuid4().hex}_{file.filename}"
    with open(filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    prompt = """Analyze the given image for possible skin conditions. Provide your response in the following format:

Skin Conditions: [List of detected conditions, e.g., acne, redness, eczema]

Severity (per condition): [Mild / Moderate / Severe]

Recommended Medications or Treatments: [Suggested over-the-counter or prescription treatments for each condition]

Respond concisely and use bullet points for each condition. If uncertain, note it clearly."""

    try:
        response = client.chat(
            model='llava',
            messages=[
                {
                    'role': 'user',
                    'content': prompt,
                    'images': [filename]
                }
            ]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    response_text = response['message']['content']
    parsed = parse_skin_conditions(response_text)

    return {
        "llava_response": response_text,
        "parsed_analysis": parsed
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
