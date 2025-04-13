# CureAI
This project is a FastAPI-based backend integrated with Ollama for AI-powered skin condition analysis via image uploads. It parses LLaVA model responses to identify skin conditions, their severity, and suggested treatments. Built to work seamlessly with a Express.js frontend and a MongoDB user/session store.

---

## Features

- Analyze uploaded skin images using the LLaVA model.
- Detect common skin conditions with tailored treatment suggestions.
- Parse AI output into structured JSON (conditions, severity, medications).
- MongoDB authentication with bcrypt-based password security.
- CORS configured for local frontend development (http://localhost:3000).

---

## Tech Stack

- Backend: FastAPI, Ollama (LLaVA model), Python
- Frontend (expected): Express.js
- Database: MongoDB (Mongoose for session & user schema)
- Other: bcryptjs, express-session (expected)

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/skin-analyzer-api.git
cd skin-analyzer-api
```

### 2. Install Dependencies

```bash
pip install -r Python/requirements.txt
```

### 3. Install & Run Ollama (LLaVA)

Make sure you have [Ollama](https://ollama.com/) installed and the llava model downloaded:

```bash
ollama pull llava
```

### 4. Run the FastAPI Server

```bash
python Python/main.py
```
### 5. Install dev dependencies

```bash
npm install
```
### 6. Run the Express.js

```bash
node Index.js
```
It’ll start on http://127.0.0.1:8000

---

## API Endpoints

### GET /
Returns a simple health check.

### GET /models
Returns available models from Ollama.

### POST /upload-image
Accepts an image via multipart form and returns:
- Raw LLaVA response
- Parsed analysis: detected conditions, severity, and treatments.

*Request example:*

```bash
curl -X POST http://127.0.0.1:8000/upload-image \
  -F "file=@your-image.jpg"
```

---

## MongoDB Models

### User Model (Mongoose)

```js
{
  name: String,
  email: String (unique),
  password: String (hashed),
  images: [
    {
      imagePath: String,
      response: String
    }
  ]
}
```

### Session Model (Mongoose)

```js
{
  userId: ObjectId (ref: 'User'),
  sessionId: String,
  name: String,
  email: String,
  createdAt: Date (default: now)
}
```

---

## Configuration

### CORS
FastAPI is configured to accept requests from:

python
allow_origins=["http://localhost:3000"]


Change this if your frontend is hosted on a different origin.

---

## Prompt Format Used


Analyze the given image for possible skin conditions. Provide your response in the following format:
- Skin Conditions
- Severity
- Recommended Medications

Use bullet points. If uncertain, mention it clearly.


---

## License

This project is licensed under the MIT License.

---
