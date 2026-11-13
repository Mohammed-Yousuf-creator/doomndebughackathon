from fastapi import APIRouter, Depends
from core.auth import get_current_user, DemoUser

router = APIRouter()


@router.get("/status")
async def get_status(current_user: DemoUser = Depends(get_current_user)):
    return {
        "feature": "participant_hub",
        "status": "ready",
        "description": "Live Timeline, Announcements/Q&A, Project Submission",
        "active_user": current_user.dict()
    }

