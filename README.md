# AI Web App (React + FastAPI)

## Overview
This project showcases AI text and image generation using OpenAI APIs with a React frontend and FastAPI backend.

---

# 🧠 AI Backend (FastAPI)

This backend powers the AI content generation and image generation features. It connects with OpenAI’s API to generate responses and images.

---

## 🚀 Features
- Text generation using OpenAI Chat Completions API
- Image generation endpoint
- Markdown formatting support
- FastAPI + Uvicorn setup
- CORS enabled for frontend access

---

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-backend.git
cd ai-backend
```

### 2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows use venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Add your OpenAI API key
Create a `.env` file in the root directory:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 5. Run the backend
```bash
uvicorn main:app --reload
```

---

## 🧩 API Endpoints

### **POST /generate**
Generate AI text responses.
```json
{
  "prompt": "Write a haiku about the moon."
}
```

### **POST /generate-image**
Generate an AI image based on the prompt.
```json
{
  "prompt": "A futuristic city at night, neon lights, flying cars."
}
```

---

## ⚙️ Deployment (AWS Example)
1. Create an EC2 instance (Ubuntu or Amazon Linux).
2. Install Python, Git, and Nginx.
3. Clone the repository and set up a virtual environment.
4. Use **Uvicorn + Gunicorn** for production.
5. Configure Nginx to reverse proxy to the app.

---

## 📜 License
MIT License © 2025 Your Name


---

# 🌐 AI Frontend (React)

This is the frontend for the AI content and image generation web app. It allows users to enter prompts and view AI-generated text or images dynamically.

---

## 🚀 Features
- React + Vite setup for fast development
- Markdown-rendered AI responses with syntax highlighting
- Image generation interface
- Responsive UI with Tailwind CSS
- Fetches from FastAPI backend

---

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-frontend.git
cd ai-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API URL
Create a `.env` file:
```
VITE_API_URL=http://localhost:8000
```

### 4. Run the development server
```bash
npm run dev
```

---

## 🧩 Available Scripts

| Command | Description |
|----------|--------------|
| `npm run dev` | Start local dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## ⚙️ Deployment (AWS Example)
1. Build the app using `npm run build`.
2. Serve the `/dist` folder via Nginx or AWS S3 + CloudFront.
3. Ensure CORS is enabled on the backend for production domain.

---

## 📜 License
MIT License © 2025 Solomon K
