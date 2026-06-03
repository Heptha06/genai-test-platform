import os
import re
import requests
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "phi3:mini")


def ask_ollama(prompt: str, max_tokens: int = 500) -> str:
    response = requests.post(
        f"{OLLAMA_URL}/api/generate",
        json={
            "model": OLLAMA_MODEL,
            "prompt": prompt,
            "stream": False,
            "options": {
                "num_predict": max_tokens,
                "temperature": 0.3,
            }
        },
        timeout=180
    )
    response.raise_for_status()
    return response.json()["response"].strip()


def parse_single_question(raw: str, index: int) -> dict:
    """Parse one question from plain text output."""
    lines = [l.strip() for l in raw.strip().splitlines() if l.strip()]

    question = ""
    options = []
    correct = ""
    explanation = ""

    for line in lines:
        line_up = line.upper()

        # Extract question
        if line.startswith("Q:") or line.startswith("Question:"):
            question = re.sub(r'^(Q:|Question:)\s*', '', line, flags=re.IGNORECASE).strip()

        # Extract options A B C D
        elif re.match(r'^[A-D][):\.]', line):
            letter = line[0].upper()
            text = re.sub(r'^[A-D][):\.]\s*', '', line).strip()
            options.append(f"{letter}) {text}")

        # Extract correct answer
        elif "correct" in line_up or "answer" in line_up:
            match = re.search(r'\b([A-D])\b', line.upper())
            if match:
                correct = match.group(1)

        # Extract explanation
        elif "explanation" in line_up or "because" in line_up or line.startswith("Exp"):
            explanation = re.sub(r'^(Explanation:|Because:)\s*', '', line, flags=re.IGNORECASE).strip()

    # Fallbacks
    if not question and lines:
        question = lines[0]
    if not correct and lines:
        for line in lines:
            match = re.search(r'correct[^A-D]*([A-D])', line, re.IGNORECASE)
            if match:
                correct = match.group(1).upper()
                break
    if not correct:
        correct = "A"
    if not explanation:
        explanation = f"Option {correct} is the correct answer for this question."

    # Pad options if less than 4
    while len(options) < 4:
        letters = ["A", "B", "C", "D"]
        options.append(f"{letters[len(options)]}) (no option)")

    return {
        "question": question or f"Question {index + 1}",
        "options": options[:4],
        "correct": correct,
        "explanation": explanation
    }


def generate_single_question(topic: str, difficulty: str, index: int) -> dict:
    prompt = f"""Create one multiple choice question about "{topic}" at {difficulty} difficulty.

Use exactly this format:
Q: Write your question here?
A) First option
B) Second option
C) Third option
D) Fourth option
Correct: B
Explanation: Why B is correct.

Now write question {index + 1}:"""

    print(f"🤖 Generating question {index + 1}...")
    raw = ask_ollama(prompt, max_tokens=300)
    print(f"✅ Question {index + 1} done")
    return parse_single_question(raw, index)


def generate_questions(topic: str, difficulty: str, count: int = 5) -> list:
    questions = []
    for i in range(count):
        try:
            q = generate_single_question(topic, difficulty, i)
            questions.append(q)
        except Exception as e:
            print(f"⚠️ Question {i+1} failed: {e}")
            questions.append({
                "question": f"What is an important concept in {topic}?",
                "options": ["A) Concept A", "B) Concept B", "C) Concept C", "D) Concept D"],
                "correct": "A",
                "explanation": f"This relates to a key concept in {topic}."
            })
    return questions


def explain_answer(question: str, user_answer: str, correct_answer: str) -> str:
    prompt = f"""A student got this question wrong.
Question: {question}
They answered: {user_answer}
Correct answer: {correct_answer}

Write 2 friendly sentences explaining why {correct_answer} is correct:"""

    try:
        return ask_ollama(prompt, max_tokens=150)
    except Exception:
        return "Review this topic to understand the correct answer better. Keep practicing!"