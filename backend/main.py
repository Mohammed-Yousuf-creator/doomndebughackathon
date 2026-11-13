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

from backend.data import db

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
dist_dir = "frontend/dist"
assets_dir = os.path.join(dist_dir, "assets") if os.path.exists(dist_dir) else "downloaded_assets"

app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

if os.path.exists(dist_dir):
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path.startswith("ws"):
            raise HTTPException(status_code=404, detail="Not Found")
        file_path = os.path.join(dist_dir, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(dist_dir, "index.html"))
