from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_service import generate_questions, explain_answer

router = APIRouter()

class GenerateRequest(BaseModel):
    topic: str
    difficulty: str = "medium"
    count: int = 5

class ExplainRequest(BaseModel):
    question: str
    user_answer: str
    correct_answer: str

@router.post("/generate")
def generate(req: GenerateRequest):
    try:
        questions = generate_questions(req.topic, req.difficulty, req.count)
        return {"questions": questions}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/explain")
def explain(req: ExplainRequest):
    try:
        explanation = explain_answer(req.question, req.user_answer, req.correct_answer)
        return {"explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))