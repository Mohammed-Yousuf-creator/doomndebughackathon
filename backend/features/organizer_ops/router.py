from fastapi import APIRouter, Depends
from core.auth import get_current_user, DemoUser

router = APIRouter()


@router.get("/status")
async def get_status(current_user: DemoUser = Depends(get_current_user)):
    return {
        "feature": "organizer_ops",
        "status": "ready",
        "description": "Event Setup, Phase Control, AI Repo Audit, Judging & Leaderboard",
        "active_user": current_user.dict()
    }

