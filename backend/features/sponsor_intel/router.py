from fastapi import APIRouter, Depends
from core.auth import get_current_user, DemoUser

router = APIRouter()


@router.get("/status")
async def get_status(current_user: DemoUser = Depends(get_current_user)):
    return {
        "feature": "sponsor_intel",
        "status": "ready",
        "description": "Sponsor ROI Dashboard, Tech Filter, Shortlist Export, AI Talent Scout",
        "active_user": current_user.dict()
    }

