# 🧠 GenAI Test Platform

An AI-powered online quiz platform that generates questions locally using **Phi-3 Mini** via Ollama — no external AI API needed, 100% offline.

## ✨ Features
- 🤖 AI-generated questions on any topic
- 🎯 Easy / Medium / Hard difficulty
- ⏱️ Countdown timer per test
- 💡 AI explains wrong answers instantly
- 📊 Results page with score breakdown
- 🔒 Fully local AI — no data leaves your machine

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS + Framer Motion |
| Backend | Python + FastAPI |
| AI Engine | Phi-3 Mini via Ollama (local) |
| API | REST via Axios |

## ⚙️ Prerequisites
- Node.js 18+
- Python 3.11+
- [Ollama](https://ollama.com/download/windows) installed
- Phi-3 Mini pulled: `ollama pull phi3:mini`

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Heptha06/genai-test-platform.git
cd genai-test-platform
```

### 2. Start Ollama (runs in background automatically after install)
```bash
ollama serve
```

### 3. Start Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Open the app