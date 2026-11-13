import asyncio
import json
import os
import random
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import PlainTextResponse, FileResponse
from pydantic import BaseModel

try:
    from backend.data import db
    import backend.db as user_db
except ImportError:
    import data as db
    import db as user_db

app = FastAPI(
    title="AEGIS OS - Forge Innovation Network API",
    version="3.4.0",
    description="Mission Control, Team War Room, Judge Console & Sponsorship Marketplace API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Request Models
class EventSwitchRequest(BaseModel):
    event_name: str

class CheckinRequest(BaseModel):
    attendee: str
    affiliation: str
    checkpoint: str
    badge_uuid: Optional[str] = None
    type: Optional[str] = "gate"

class BroadcastRequest(BaseModel):
    title: str
    message: str
    type: Optional[str] = "info"
    sender: Optional[str] = "Dr. Aris Vane (Organizer Lead)"

class MentorDispatchRequest(BaseModel):
    ticket_id: str
    mentor_name: str

class KanbanTaskCreateRequest(BaseModel):
    title: str
    project: str
    priority: str
    column: str # 'backlog', 'in_progress', 'under_review', 'deployed'
    assignee: Optional[str] = "Unassigned"
    badge: Optional[str] = None

class KanbanTaskMoveRequest(BaseModel):
    task_id: str
    from_column: str
    to_column: str

class ChatMessageRequest(BaseModel):
    author: str
    text: str
    role: Optional[str] = "Builder"

class EvaluationSubmitRequest(BaseModel):
    project_id: str
    scores: Dict[str, float]
    private_notes: Optional[str] = ""
    participant_feedback: Optional[str] = ""
    is_draft: Optional[bool] = False

class InterviewRequest(BaseModel):
    candidate_id: str
    notes: Optional[str] = ""

class ProposalRequest(BaseModel):
    package_id: str
    company_name: str
    contact_email: str
    custom_terms: Optional[str] = ""

class LoginRequest(BaseModel):
    email: str
    password: str
    role_type: str  # 'participant' or 'organiser'

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

class OnboardingRequest(BaseModel):
    user_id: str
    name: Optional[str] = None
    profile_type: Optional[str] = "College Student"
    gender: Optional[str] = "Prefer not to say"
    phone: Optional[str] = ""
    city: Optional[str] = ""
    college: Optional[str] = ""
    degree: Optional[str] = ""
    graduation_year: Optional[str] = ""
    skills: Optional[List[str]] = []
    github: Optional[str] = ""
    linkedin: Optional[str] = ""
    bio: Optional[str] = ""

class ProjectSubmitRequest(BaseModel):
    project_name: str
    tagline: str
    track: str
    repo_url: str
    demo_url: Optional[str] = ""
    deck_url: Optional[str] = ""
    abstract: Optional[str] = ""

class EventRegisterRequest(BaseModel):
    event_id: str
    user_id: Optional[str] = "u-part-1"
    team_name: Optional[str] = None
    role: Optional[str] = None
    mode: Optional[str] = "solo"

class CreateTeamRequest(BaseModel):
    user_id: Optional[str] = "u-part-1"
    event_id: str
    team_name: str
    track: str
    looking_for: Optional[str] = "Frontend / ML Specialist"

class JoinTeamRequest(BaseModel):
    user_id: Optional[str] = "u-part-1"
    event_id: Optional[str] = None
    team_code: Optional[str] = None
    team_id: Optional[str] = None

class CompeteSoloRequest(BaseModel):
    user_id: Optional[str] = "u-part-1"
    event_id: str
    track: Optional[str] = "Track 04 // Swarm Intelligence"

class LeaveTeamRequest(BaseModel):
    user_id: Optional[str] = "u-part-1"

class InviteTeammateRequest(BaseModel):
    user_id: Optional[str] = "u-part-1"
    candidate_id: str


# ---------------- AUTHENTICATION & ACCESS CONTROL ----------------
@app.post("/api/auth/register")
def register(req: RegisterRequest):
    try:
        user = user_db.register_user(
            email=req.email,
            password=req.password,
            name=req.name,
            role_type=req.role_type
        )
        token = f"tok_{user['id']}_{random.randint(100000, 999999)}"
        db.sessions[token] = user
        return {
            "status": "success",
            "token": token,
            "user": user
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/login")
def login(req: LoginRequest):
    # Try SQLite database authentication first
    user = user_db.authenticate_user(req.email, req.password, req.role_type)
    if not user:
        # Fallback to in-memory db
        user = db.authenticate(req.email, req.password, req.role_type)
    if not user:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid email or password for {req.role_type.capitalize()} Portal."
        )
    token = f"tok_{user['id']}_{random.randint(100000, 999999)}"
    db.sessions[token] = user
    return {
        "status": "success",
        "token": token,
        "user": user
    }

@app.post("/api/auth/google")
def google_auth(req: GoogleAuthRequest):
    user = user_db.google_authenticate(
        email=req.email,
        name=req.name,
        role_type=req.role_type,
        google_id=req.google_id,
        avatar_url=req.avatar_url
    )
    token = f"tok_{user['id']}_{random.randint(100000, 999999)}"
    db.sessions[token] = user
    return {
        "status": "success",
        "token": token,
        "user": user
    }

@app.post("/api/auth/github")
def github_auth(req: GitHubAuthRequest):
    user = user_db.github_authenticate(
        email=req.email,
        name=req.name,
        role_type=req.role_type,
        github_username=req.github_username,
        avatar_url=req.avatar_url
    )
    token = f"tok_{user['id']}_{random.randint(100000, 999999)}"
    db.sessions[token] = user
    return {
        "status": "success",
        "token": token,
        "user": user
    }

@app.post("/api/auth/onboarding")
def complete_onboarding(req: OnboardingRequest):
    updated_user = user_db.update_user_onboarding(req.user_id, req.dict())
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    # Update active sessions
    for tok, sess in list(db.sessions.items()):
        if sess.get("id") == req.user_id:
            db.sessions[tok] = updated_user
    return {
        "status": "success",
        "user": updated_user
    }

@app.get("/api/auth/me")
def get_current_user(token: Optional[str] = None):
    if token and token in db.sessions:
        sess_user = db.sessions[token]
        fresh_user = user_db.get_user_by_id(sess_user["id"]) or sess_user
        db.sessions[token] = fresh_user
        return {"authenticated": True, "user": fresh_user}
    return {"authenticated": False, "user": None}

@app.post("/api/auth/logout")
def logout(token: Optional[str] = None):
    if token and token in db.sessions:
        del db.sessions[token]
    return {"status": "logged_out"}


# ---------------- PARTICIPANT DASHBOARD ----------------
@app.get("/api/participant/overview")
def get_participant_overview(user_id: Optional[str] = "u-part-1"):
    user = user_db.get_user_by_id(user_id)
    if not user:
        user = next((u for u in db.users if u["id"] == user_id), db.users[0])
    
    # Enrich discovery_events with user registration status
    user_reg_events = user.get("registered_events", [])
    enriched_events = []
    for evt in db.discovery_events:
        evt_copy = dict(evt)
        is_reg = evt["id"] in user_reg_events or evt.get("registered", False)
        evt_copy["registered"] = is_reg
        if is_reg and user.get("team_name"):
            evt_copy["team"] = user.get("team_name")
        enriched_events.append(evt_copy)

    # Active team war room or solo project workspace
    team_data = None
    if user.get("team_name") and not user.get("is_solo"):
        team_data = dict(db.team_war_room)
        team_data["team_name"] = user["team_name"]
        if user.get("track"):
            team_data["track"] = user["track"]
        if user.get("team_code"):
            team_data["workspace_id"] = user["team_code"]
    elif user.get("team_status") == "Competing Solo":
        team_data = {
            "team_name": user.get("team_name", f"{user['name']} (Solo)"),
            "track": user.get("track") or "Track 04 // Swarm Intelligence",
            "workspace_id": user.get("team_code", f"SOLO-{user['id'][-4:].upper()}"),
            "status": "SOLO WORKSPACE ACTIVE",
            "tagline": "Solo Builder Submission & Bench Workspace",
            "countdown_seconds": db.team_war_room.get("countdown_seconds", 67330),
            "evaluation_wave": "WAVE 03 // 22:00 UTC",
            "repository": {
                "url": user.get("github") or "https://github.com/marcuschen/aegis-solo-project",
                "branch": "main",
                "commit": "#1a0b3f",
                "ci_status": "CI Passing"
            },
            "members": [
                {
                    "id": user["id"],
                    "name": user["name"],
                    "short_name": user["name"].split()[0],
                    "role": "Solo Creator",
                    "avatar": "/assets/asset_12_94c367ea26.png",
                    "status": "online"
                }
            ],
            "kanban_columns": db.team_war_room.get("kanban_columns", {}),
            "orin_telemetry": db.team_war_room.get("orin_telemetry", {}),
            "adr_pinned": db.team_war_room.get("adr_pinned", {}),
            "mission_log": db.team_war_room.get("mission_log", [])
        }
    else:
        # User is not in any team yet (solo builder)
        team_data = None

    return {
        "user": user,
        "active_event": db.sprint_info,
        "events_catalog": enriched_events,
        "open_teams": db.open_teams,
        "solo_builders": db.solo_builders,
        "team": team_data,
        "schedule": db.timeline_events,
        "broadcasts": db.broadcasts,
        "mentor_queue": [m for m in db.mentor_queue if m.get("team") == user.get("team_name")]
    }

@app.post("/api/participant/submit-project")
def submit_participant_project(req: ProjectSubmitRequest):
    db.team_war_room["tagline"] = req.tagline
    db.team_war_room["track"] = req.track
    db.team_war_room["repository"]["url"] = req.repo_url
    if req.demo_url:
        db.team_war_room["demo_url"] = req.demo_url
    if req.deck_url:
        db.team_war_room["deck_url"] = req.deck_url
    return {"status": "submitted", "team": db.team_war_room}

@app.post("/api/participant/register-event")
def register_for_event(req: EventRegisterRequest):
    user = next((u for u in db.users if u["id"] == req.user_id), db.users[0])
    for evt in db.discovery_events:
        if evt["id"] == req.event_id:
            evt["registered"] = True
            if req.event_id not in user.get("registered_events", []):
                user.setdefault("registered_events", []).append(req.event_id)
            if not user.get("track") and evt.get("tracks"):
                user["track"] = evt["tracks"][0]
            evt["participation_mode"] = req.mode or "Solo (Team Formation Open)"
            return {"status": "registered", "event": evt, "user": user}
    raise HTTPException(status_code=404, detail="Event not found")

@app.post("/api/participant/create-team")
def create_participant_team(req: CreateTeamRequest):
    user = next((u for u in db.users if u["id"] == req.user_id), db.users[0])
    prefix = "".join([w[0].upper() for w in req.team_name.split() if w])[:3]
    if len(prefix) < 2:
        prefix = "TM"
    team_code = f"{prefix}-{random.randint(1000, 9999)}"
    team_id = f"team-{team_code.lower()}"
    
    # Update user state
    user["team_id"] = team_id
    user["team_name"] = req.team_name
    user["team_code"] = team_code
    user["is_solo"] = False
    user["team_status"] = f"Team Leader"
    user["track"] = req.track
    if req.event_id not in user.get("registered_events", []):
        user.setdefault("registered_events", []).append(req.event_id)

    # Register in open_teams
    new_team = {
        "id": team_id,
        "name": req.team_name,
        "event_id": req.event_id,
        "team_code": team_code,
        "track": req.track,
        "members_count": 1,
        "max_members": 4,
        "leader": user["name"],
        "current_roles": [user["role"]],
        "looking_for": req.looking_for or "Full-Stack / ML Specialists",
        "match_reason": "Recently created by you."
    }
    db.open_teams.insert(0, new_team)

    # Update team_war_room
    db.team_war_room["team_name"] = req.team_name
    db.team_war_room["track"] = req.track
    db.team_war_room["workspace_id"] = team_code
    db.team_war_room["members"] = [
        {
            "id": user["id"],
            "name": user["name"],
            "short_name": user["name"].split()[0],
            "role": "Team Leader",
            "avatar": "/assets/asset_12_94c367ea26.png",
            "status": "online"
        }
    ]

    # Update event
    for evt in db.discovery_events:
        if evt["id"] == req.event_id:
            evt["registered"] = True
            evt["team"] = req.team_name
            evt["participation_mode"] = f"Team ({req.team_name})"

    return {
        "status": "team_created",
        "team": new_team,
        "user": user,
        "team_code": team_code
    }

@app.post("/api/participant/join-team")
def join_participant_team(req: JoinTeamRequest):
    user = next((u for u in db.users if u["id"] == req.user_id), db.users[0])
    target_team = None
    if req.team_code:
        code_clean = req.team_code.strip().upper()
        target_team = next((t for t in db.open_teams if t.get("team_code", "").upper() == code_clean), None)
    elif req.team_id:
        target_team = next((t for t in db.open_teams if t.get("id") == req.team_id), None)

    if not target_team:
        if req.team_code:
            target_team = {
                "id": f"team-{random.randint(100, 999)}",
                "name": f"Team {req.team_code.upper()}",
                "event_id": req.event_id or "evt-ash-2025",
                "team_code": req.team_code.upper(),
                "track": "Track 04 // Swarm Intelligence",
                "members_count": 2,
                "max_members": 4,
                "leader": "Sarah Connor",
                "current_roles": ["Systems Engineer", "Robotics Dev"],
                "looking_for": "Collaborator",
                "match_reason": "Joined via code invite"
            }
            db.open_teams.append(target_team)
        else:
            raise HTTPException(status_code=404, detail="Team not found with the provided code or ID")

    # Update user state
    user["team_id"] = target_team["id"]
    user["team_name"] = target_team["name"]
    user["team_code"] = target_team.get("team_code")
    user["is_solo"] = False
    user["team_status"] = f"Team Member"
    user["track"] = target_team.get("track")
    if target_team.get("event_id") and target_team["event_id"] not in user.get("registered_events", []):
        user.setdefault("registered_events", []).append(target_team["event_id"])

    target_team["members_count"] = min(target_team.get("members_count", 1) + 1, target_team.get("max_members", 4))
    if user["role"] not in target_team.get("current_roles", []):
        target_team.setdefault("current_roles", []).append(user["role"])

    # Update event
    for evt in db.discovery_events:
        if evt["id"] == target_team.get("event_id"):
            evt["registered"] = True
            evt["team"] = target_team["name"]
            evt["participation_mode"] = f"Team ({target_team['name']})"

    return {
        "status": "team_joined",
        "team": target_team,
        "user": user
    }

@app.post("/api/participant/compete-solo")
def compete_solo(req: CompeteSoloRequest):
    user = next((u for u in db.users if u["id"] == req.user_id), db.users[0])
    user["is_solo"] = True
    user["team_id"] = f"solo-{user['id']}"
    user["team_name"] = f"{user['name']} (Solo)"
    user["team_code"] = f"SOLO-{user['id'][-4:].upper()}"
    user["team_status"] = "Competing Solo"
    user["track"] = req.track
    if req.event_id not in user.get("registered_events", []):
        user.setdefault("registered_events", []).append(req.event_id)

    # Update event
    for evt in db.discovery_events:
        if evt["id"] == req.event_id:
            evt["registered"] = True
            evt["team"] = f"{user['name']} (Solo)"
            evt["participation_mode"] = "Solo Competitor"

    return {"status": "competing_solo", "user": user}

@app.post("/api/participant/leave-team")
def leave_participant_team(req: LeaveTeamRequest):
    user = next((u for u in db.users if u["id"] == req.user_id), db.users[0])
    user["team_id"] = None
    user["team_name"] = None
    user["team_code"] = None
    user["is_solo"] = True
    user["team_status"] = "Solo Builder (No Team)"
    return {"status": "left_team", "user": user}

@app.post("/api/participant/invite-teammate")
def invite_teammate(req: InviteTeammateRequest):
    candidate = next((s for s in db.solo_builders if s["id"] == req.candidate_id), None)
    candidate_name = candidate["name"] if candidate else "Candidate"
    return {
        "status": "invitation_sent",
        "message": f"Teammate invitation dispatched to {candidate_name} via Aegis SkillGraph."
    }


# ---------------- SPRINT & GENERAL ----------------
@app.get("/api/sprint/status")
def get_sprint_status():
    return db.sprint_info

@app.post("/api/sprint/switch-event")
def switch_sprint_event(req: EventSwitchRequest):
    if req.event_name in db.sprint_info["event_options"]:
        db.sprint_info["active_event"] = req.event_name
        return {"status": "success", "active_event": req.event_name}
    raise HTTPException(status_code=400, detail="Invalid event name")


# ---------------- ORGANIZER OPS CONSOLE ----------------
@app.get("/api/organizer")
def get_organizer_overview():
    return {
        "sprint": db.sprint_info,
        "kpis": db.organizer_kpis,
        "timeline": db.timeline_events,
        "telemetry": db.integrity_telemetry,
        "checkin_stream": db.checkin_stream,
        "mentor_queue": db.mentor_queue,
        "broadcasts": db.broadcasts
    }

@app.post("/api/organizer/checkin")
def register_checkin(req: CheckinRequest):
    time_str = datetime.now().strftime("%H:%M:%S")
    badge = req.badge_uuid or f"0x{random.randint(0x100000, 0xFFFFFF):06X}"
    new_entry = {
        "id": f"chk-{len(db.checkin_stream) + 1}",
        "time": time_str,
        "attendee": req.attendee,
        "affiliation": req.affiliation,
        "checkpoint": req.checkpoint,
        "badge_uuid": badge,
        "type": req.type
    }
    db.checkin_stream.insert(0, new_entry)
    # Increment turnout KPI
    db.organizer_kpis["turnout"]["checked_in"] += 1
    pct = round((db.organizer_kpis["turnout"]["checked_in"] / db.organizer_kpis["turnout"]["total"]) * 100, 1)
    db.organizer_kpis["turnout"]["percentage"] = pct
    if "Jetson" in req.checkpoint or "Kit" in req.checkpoint:
        if db.organizer_kpis["compute"]["kits_remaining"] > 0:
            db.organizer_kpis["compute"]["kits_remaining"] -= 1
            db.organizer_kpis["compute"]["jetson_kits_allocated"] += 1
    return {"status": "checked_in", "entry": new_entry, "turnout": db.organizer_kpis["turnout"]}

@app.post("/api/organizer/broadcast")
def create_broadcast(req: BroadcastRequest):
    bc = {
        "id": f"bc-{len(db.broadcasts) + 1}",
        "timestamp": datetime.now().strftime("%H:%M EST"),
        "title": req.title,
        "message": req.message,
        "type": req.type or "info",
        "sender": req.sender or "Command Center"
    }
    db.broadcasts.insert(0, bc)
    return {"status": "broadcast_sent", "broadcast": bc}

@app.post("/api/organizer/dispatch-mentor")
def dispatch_mentor(req: MentorDispatchRequest):
    for item in db.mentor_queue:
        if item["id"] == req.ticket_id:
            item["assigned_mentor"] = req.mentor_name
            item["status"] = "In Progress"
            return {"status": "dispatched", "ticket": item}
    raise HTTPException(status_code=404, detail="Ticket not found")

@app.get("/api/organizer/export-csv")
def export_roll_call_csv():
    lines = ["Time,Attendee,Affiliation,Checkpoint,BadgeUUID,Type"]
    for c in db.checkin_stream:
        lines.append(f'"{c["time"]}","{c["attendee"]}","{c["affiliation"]}","{c["checkpoint"]}","{c["badge_uuid"]}","{c["type"]}"')
    csv_content = "\n".join(lines)
    return PlainTextResponse(content=csv_content, media_type="text/csv", headers={
        "Content-Disposition": "attachment; filename=aegis_roll_call_export.csv"
    })


# ---------------- TEAM WAR ROOM ----------------
@app.get("/api/war-room")
def get_war_room():
    return db.team_war_room

@app.post("/api/war-room/kanban/create")
def create_kanban_task(req: KanbanTaskCreateRequest):
    col = req.column.lower().replace(" ", "_")
    if col not in db.team_war_room["kanban"]:
        col = "backlog"
    task_num = random.randint(30, 99)
    new_task = {
        "id": f"KB-{task_num}",
        "title": req.title,
        "project": req.project,
        "priority": req.priority,
        "assignee": req.assignee,
        "badge": req.badge or ("PR Ready" if col == "under_review" else "")
    }
    db.team_war_room["kanban"][col].insert(0, new_task)
    return {"status": "created", "task": new_task, "column": col}

@app.post("/api/war-room/kanban/move")
def move_kanban_task(req: KanbanTaskMoveRequest):
    from_col = req.from_column.lower().replace(" ", "_")
    to_col = req.to_column.lower().replace(" ", "_")
    kanban = db.team_war_room["kanban"]
    if from_col not in kanban or to_col not in kanban:
        raise HTTPException(status_code=400, detail="Invalid columns")

    target_task = None
    for idx, t in enumerate(kanban[from_col]):
        if t["id"] == req.task_id:
            target_task = kanban[from_col].pop(idx)
            break

    if not target_task:
        raise HTTPException(status_code=404, detail="Task not found in source column")

    kanban[to_col].insert(0, target_task)
    return {"status": "moved", "task": target_task, "to": to_col}

@app.post("/api/war-room/messages")
def send_team_message(req: ChatMessageRequest):
    msg_id = f"msg-{len(db.team_war_room['mission_log']) + 1}"
    user_msg = {
        "id": msg_id,
        "author": req.author,
        "role": req.role or "Engineer",
        "time": "Just now",
        "avatar": "/assets/asset_16_9592fa2f36.png",
        "text": req.text
    }
    db.team_war_room["mission_log"].append(user_msg)

    # Check if asking AI copilot
    ai_reply = None
    text_lower = req.text.lower()
    if any(k in text_lower for k in ["@aegis", "@synthesizer", "@mentor", "@ai-mentor", "mentor", "ai", "tensor", "ros2", "cuda", "help"]):
        ai_reply = {
            "id": f"msg-{len(db.team_war_room['mission_log']) + 2}",
            "author": "AEGIS Synthesizer",
            "role": "AI Copilot",
            "time": "Just now",
            "avatar": "/assets/asset_19_4a08b610d8.png",
            "text": "Advisory telemetry acknowledged. Recommended parameter tuning for Orin Nano TensorRT pipeline: Set `workspace_size=2048MB`, enable FP16 calibration with `builderConfig->setFlag(BuilderFlag::kFP16)`. Ensure ROS2 zero-copy loaning via `rmw_cyclonedds_cpp` with shm enabled.",
            "code_snippet": {
                "filename": "engine_optimizer.py",
                "lang": "Python",
                "code": "config.set_flag(trt.BuilderFlag.FP16)\nconfig.set_memory_pool_limit(trt.MemoryPoolType.WORKSPACE, 2 << 30)\nprofile.set_shape('images', min=(1,3,640,640), opt=(2,3,640,640), max=(4,3,640,640))"
            }
        }
        db.team_war_room["mission_log"].append(ai_reply)

    return {"status": "sent", "message": user_msg, "ai_reply": ai_reply}


# ---------------- JUDGE CONSOLE ----------------
@app.get("/api/judge")
def get_judge_console():
    return {
        "judge_profile": db.judge_profile,
        "submissions": db.submissions,
        "current_project": db.submissions[0]
    }

@app.post("/api/judge/evaluate")
def submit_evaluation(req: EvaluationSubmitRequest):
    sub = None
    for s in db.submissions:
        if s["id"] == req.project_id:
            sub = s
            break
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")

    # Update criteria scores and recalculate composite
    total_score = 0.0
    for crit_key, val in req.scores.items():
        if crit_key in sub["rubric"]:
            sub["rubric"][crit_key]["score"] = val
            weight = sub["rubric"][crit_key]["weight"]
            total_score += (val * 10) * (weight / 100)

    sub["composite_score"] = round(total_score, 1)
    if req.private_notes:
        sub["private_notes"] = req.private_notes
    if req.participant_feedback:
        sub["participant_feedback"] = req.participant_feedback

    if not req.is_draft:
        db.judge_profile["completed_count"] += 1
        db.judge_profile["remaining"] = max(0, db.judge_profile["total_quota"] - db.judge_profile["completed_count"])

    return {
        "status": "draft_saved" if req.is_draft else "evaluation_confirmed",
        "composite_score": sub["composite_score"],
        "project": sub,
        "progress": {
            "completed": db.judge_profile["completed_count"],
            "total": db.judge_profile["total_quota"]
        }
    }


# ---------------- SPONSOR PORTAL ----------------
@app.get("/api/sponsor")
def get_sponsor_portal():
    return db.sponsor_portal

@app.post("/api/sponsor/interview")
def request_interview(req: InterviewRequest):
    candidate = None
    for c in db.sponsor_portal["candidates"]:
        if c["id"] == req.candidate_id:
            candidate = c
            break
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return {
        "status": "interview_requested",
        "candidate": candidate["name"],
        "note": "Invitation dispatched via AEGIS Fast-Track Talent API"
    }

@app.post("/api/sponsor/proposal")
def submit_proposal(req: ProposalRequest):
    return {
        "status": "proposal_received",
        "package_id": req.package_id,
        "message": f"Proposal for {req.company_name} queued for review by the Hackathon Steering Committee."
    }


# ---------------- WEBSOCKET LIVE TELEMETRY ----------------
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

ws_manager = ConnectionManager()

@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            await asyncio.sleep(3.0)
            now_str = datetime.now().strftime("%H:%M:%S EST")
            npu = round(82.0 + random.uniform(0.5, 4.5), 1)
            jitter = round(1.70 + random.uniform(0.02, 0.25), 2)
            temp = round(39.0 + random.uniform(0.1, 0.8), 1)

            payload = {
                "type": "TELEMETRY_PULSE",
                "timestamp": now_str,
                "npu_load": f"{npu}%",
                "sync_jitter": f"{jitter} ms",
                "temp": f"{temp}°C",
                "turnout": db.organizer_kpis["turnout"]["checked_in"],
                "active_teams": db.organizer_kpis["teams"]["active"],
                "live_sync": db.sprint_info["live_sync_percentage"]
            }
            await websocket.send_json(payload)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)


# ---------------- SERVE STATIC ASSETS & PRODUCTION SPA ----------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dist_dir = os.path.join(BASE_DIR, "frontend", "dist")
assets_dir = os.path.join(dist_dir, "assets") if os.path.exists(os.path.join(dist_dir, "assets")) else os.path.join(BASE_DIR, "downloaded_assets")
if not os.path.exists(assets_dir):
    os.makedirs(assets_dir, exist_ok=True)

app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

if os.path.exists(dist_dir):
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("ws"):
            raise HTTPException(status_code=404, detail="Not Found")
        file_path = os.path.join(dist_dir, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="SPA index not found")
