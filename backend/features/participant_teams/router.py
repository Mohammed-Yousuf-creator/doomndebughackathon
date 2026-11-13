from fastapi import APIRouter, Depends
from core.auth import get_current_user, DemoUser

router = APIRouter()


@router.get("/status")
async def get_status(current_user: DemoUser = Depends(get_current_user)):
    return {
        "feature": "participant_teams",
        "status": "ready",
        "description": "Registration, Team Builder, AI Skill & Matchmaking",
        "active_user": current_user.dict()
    }

