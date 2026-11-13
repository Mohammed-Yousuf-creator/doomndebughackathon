from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.db import engine, Base
import core.models  # Ensure all SQLAlchemy models are registered
from features.participant_teams.router import router as participant_teams_router
from features.participant_hub.router import router as participant_hub_router
from features.organizer_ops.router import router as organizer_ops_router
from features.sponsor_intel.router import router as sponsor_intel_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables on startup
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="HackOS Backend API",
    description="AI Hackathon & Tech Event Intelligence Platform Core & Feature Routers",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount 4 Isolated Feature Routers
app.include_router(
    participant_teams_router,
    prefix="/api/participant/teams",
    tags=["Participant: Teams & Matching"]
)
app.include_router(
    participant_hub_router,
    prefix="/api/participant/hub",
    tags=["Participant: Hub & Submissions"]
)
app.include_router(
    organizer_ops_router,
    prefix="/api/organizer",
    tags=["Organizer: Ops & Judging"]
)
app.include_router(
    sponsor_intel_router,
    prefix="/api/sponsor",
    tags=["Sponsor: Intelligence & Talent"]
)


@app.get("/")
async def root():
    return {
        "message": "Welcome to HackOS API",
        "status": "online",
        "docs": "/docs",
        "endpoints": {
            "participant_teams": "/api/participant/teams/status",
            "participant_hub": "/api/participant/hub/status",
            "organizer_ops": "/api/organizer/status",
            "sponsor_intel": "/api/sponsor/status"
        }
    }


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "hackos-backend"}

