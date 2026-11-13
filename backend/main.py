"""
AEGIS / FORGE - Kaggle Architecture FastAPI Backend Server
Real-time AI Competitions, Automated Benchmark Evaluations, Live Leaderboards,
Discussion Forums, and Organizer Command Console.
Zero Dummy Data — All records persist cleanly in SQLite.
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import random
import db

app = FastAPI(
    title="Aegis / Forge Competitions API",
    description="Kaggle-like platform for hosting and competing in AI benchmark competitions.",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sessions: Dict[str, Dict[str, Any]] = {}


# ---------------- REQUEST MODELS ----------------

class LoginRequest(BaseModel):
    email: str
    password: str
    role_type: str = "participant"

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    role_type: str = "participant"

class GoogleAuthRequest(BaseModel):
    email: str
    name: str
    role_type: str = "participant"
    google_id: Optional[str] = None
    avatar_url: Optional[str] = None

class GitHubAuthRequest(BaseModel):
    email: str
    name: str
    role_type: str = "participant"
    github_username: Optional[str] = None
    avatar_url: Optional[str] = None

class CreateCompetitionRequest(BaseModel):
    title: str
    subtitle: str
    category: Optional[str] = "Featured"
    prize_pool: Optional[str] = "$50,000"
    evaluation_metric: Optional[str] = "F1-Score"
    deadline: Optional[str] = "Dec 31, 2026"
    description: Optional[str] = ""
    dataset_overview: Optional[str] = ""
    rules: Optional[str] = ""
    host_id: Optional[str] = "u-org-1"
    host_name: Optional[str] = "Dr. Aris Vane"

class JoinCompetitionRequest(BaseModel):
    user_id: str
    team_name: Optional[str] = None

class SubmitPredictionRequest(BaseModel):
    user_id: str
    submission_name: str
    repo_or_file_url: str
    notes: Optional[str] = ""

class CreateDiscussionRequest(BaseModel):
    author_id: str
    title: str
    content: str
    tag: Optional[str] = "General"

class CommentRequest(BaseModel):
    author_id: str
    content: str


# ---------------- HEALTH & SYSTEM ----------------

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Aegis Competitions Engine (Kaggle Architecture)",
        "version": "3.0.0",
        "database": "SQLite (aegis.db)"
    }


# ---------------- AUTHENTICATION ----------------

@app.post("/api/auth/register")
def register(req: RegisterRequest):
    try:
        user = db.register_user(
            email=req.email,
            password=req.password,
            name=req.name,
            role_type=req.role_type
        )
        token = f"tok_{user['id']}_{random.randint(100000, 999999)}"
        sessions[token] = user
        return {"status": "success", "token": token, "user": user}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
def login(req: LoginRequest):
    user = db.authenticate_user(req.email, req.password, req.role_type)
    if not user:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid email or password for {req.role_type.capitalize()} portal."
        )
    token = f"tok_{user['id']}_{random.randint(100000, 999999)}"
    sessions[token] = user
    return {"status": "success", "token": token, "user": user}

@app.post("/api/auth/google")
def google_auth(req: GoogleAuthRequest):
    user = db.google_authenticate(
        email=req.email,
        name=req.name,
        role_type=req.role_type,
        google_id=req.google_id,
        avatar_url=req.avatar_url
    )
    token = f"tok_{user['id']}_{random.randint(100000, 999999)}"
    sessions[token] = user
    return {"status": "success", "token": token, "user": user}

@app.post("/api/auth/github")
def github_auth(req: GitHubAuthRequest):
    user = db.github_authenticate(
        email=req.email,
        name=req.name,
        role_type=req.role_type,
        github_username=req.github_username,
        avatar_url=req.avatar_url
    )
    token = f"tok_{user['id']}_{random.randint(100000, 999999)}"
    sessions[token] = user
    return {"status": "success", "token": token, "user": user}

@app.get("/api/auth/me")
def get_me(token: Optional[str] = None):
    if token and token in sessions:
        user = sessions[token]
        fresh = db.get_user_by_id(user["id"]) or user
        return {"authenticated": True, "user": fresh}
    return {"authenticated": False, "user": None}

@app.post("/api/auth/logout")
def logout(token: Optional[str] = None):
    if token and token in sessions:
        del sessions[token]
    return {"status": "logged_out"}


# ---------------- COMPETITIONS ----------------

@app.get("/api/competitions")
def list_competitions(category: Optional[str] = "all", search: Optional[str] = None):
    comps = db.get_competitions(category=category, search=search)
    return {"competitions": comps, "count": len(comps)}

@app.post("/api/competitions")
def create_competition(req: CreateCompetitionRequest):
    try:
        new_comp = db.create_competition(
            data=req.dict(),
            host_id=req.host_id,
            host_name=req.host_name
        )
        return {
            "status": "success",
            "message": f"Competition '{new_comp['title']}' published to Kaggle competitions hub.",
            "competition": new_comp
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/competitions/{comp_id}")
def get_competition(comp_id: str, user_id: Optional[str] = None):
    comp = db.get_competition_by_id(comp_id, user_id)
    if not comp:
        raise HTTPException(status_code=404, detail="Competition not found.")
    return comp

@app.post("/api/competitions/{comp_id}/join")
def join_competition(comp_id: str, req: JoinCompetitionRequest):
    try:
        res = db.join_competition(comp_id, req.user_id, req.team_name)
        return {"status": "success", "message": "Joined competition successfully.", "details": res}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ---------------- SUBMISSIONS & LEADERBOARD ----------------

@app.post("/api/competitions/{comp_id}/submit")
def submit_prediction(comp_id: str, req: SubmitPredictionRequest):
    try:
        sub = db.submit_to_competition(
            comp_id=comp_id,
            user_id=req.user_id,
            submission_name=req.submission_name,
            repo_or_file_url=req.repo_or_file_url,
            notes=req.notes
        )
        # Fetch updated leaderboard to give immediate rank
        leaderboard = db.get_competition_leaderboard(comp_id)
        user_entry = next((e for e in leaderboard if e["user_id"] == req.user_id), None)
        sub["current_rank"] = user_entry["rank"] if user_entry else None
        sub["current_medal"] = user_entry["medal"] if user_entry else None

        return {
            "status": "evaluated",
            "message": f"Submission successfully evaluated against {sub['metric']} benchmark.",
            "submission": sub
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/competitions/{comp_id}/submissions")
def list_user_submissions(comp_id: str, user_id: str = Query(...)):
    subs = db.get_competition_submissions(comp_id, user_id)
    return {"submissions": subs, "count": len(subs)}

@app.get("/api/competitions/{comp_id}/leaderboard")
def get_leaderboard(comp_id: str):
    leaderboard = db.get_competition_leaderboard(comp_id)
    return {
        "competition_id": comp_id,
        "leaderboard": leaderboard,
        "total_teams": len(leaderboard)
    }


# ---------------- DISCUSSIONS & COMMUNITY ----------------

@app.get("/api/competitions/{comp_id}/discussions")
def list_discussions(comp_id: str):
    discs = db.get_competition_discussions(comp_id)
    return {"discussions": discs, "count": len(discs)}

@app.post("/api/competitions/{comp_id}/discussions")
def post_discussion(comp_id: str, req: CreateDiscussionRequest):
    try:
        disc = db.create_discussion(
            comp_id=comp_id,
            author_id=req.author_id,
            title=req.title,
            content=req.content,
            tag=req.tag
        )
        return {"status": "success", "discussion": disc}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/discussions/{disc_id}/comment")
def post_comment(disc_id: str, req: CommentRequest):
    try:
        comment = db.add_discussion_comment(disc_id, req.author_id, req.content)
        return {"status": "success", "comment": comment}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/discussions/{disc_id}/upvote")
def upvote(disc_id: str):
    votes = db.upvote_discussion(disc_id)
    return {"status": "success", "upvotes": votes}


# ---------------- USER PROFILE & ORGANIZER CONSOLE ----------------

class ProfileUpdateRequest(BaseModel):
    user_id: str
    name: Optional[str] = None
    profile_type: Optional[str] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    college: Optional[str] = None
    degree: Optional[str] = None
    graduation_year: Optional[str] = None
    skills: Optional[Any] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    bio: Optional[str] = None

@app.post("/api/user/profile")
@app.post("/api/participant/onboarding")
def update_profile(req: ProfileUpdateRequest):
    try:
        updated = db.update_user_profile(req.user_id, req.dict())
        return {"status": "success", "user": updated}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/user/profile")
def get_profile(user_id: str = Query(...)):
    try:
        profile = db.get_user_profile(user_id)
        return profile
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/api/organizer/dashboard")
def get_organizer_dashboard(host_id: str = Query("u-org-1")):
    data = db.get_organizer_dashboard_data(host_id)
    return data

@app.post("/api/organizer/reset-data")
def reset_system_data(mode: Optional[str] = "clean"):
    if mode == "sample":
        comp = db.load_sample_competition()
        msg = f"Sample competition '{comp['title']}' loaded."
    else:
        db.clear_all_competitions_data()
        msg = "All competition data, submissions, and discussions cleared."
    return {"status": "success", "message": msg}
