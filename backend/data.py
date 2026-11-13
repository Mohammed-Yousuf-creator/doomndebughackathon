"""
AEGIS OS - Forge Innovation Network
In-memory reactive database and state store
"""
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import re
import random

class StateStore:
    def __init__(self):
        # 0. User Accounts & Session Store
        self.users = [
            {
                "id": "u-part-1",
                "email": "marcus.chen@student.mit.edu",
                "password": "password123",
                "name": "Marcus Chen",
                "role": "Full-Stack & Robotics Builder",
                "role_type": "participant",
                "affiliation": "MIT CSAIL",
                "team_id": None,
                "team_name": None,
                "is_solo": True,
                "team_status": "Solo Builder (No Team)",
                "badge_uuid": "0x4D1A7E",
                "checkin_status": "Pre-Registered",
                "track": None,
                "skills": ["Python", "C++20", "ROS2", "React", "PyTorch"],
                "bio": "CS & Robotics undergrad at MIT. Passionate about autonomous systems, edge AI, and distributed swarms.",
                "github": "https://github.com/marcuschen",
                "passport_score": "98.4 / 100",
                "verified_badges": ["MIT Hack 2024 Winner", "ROS2 Certified", "Open Source Contributor"],
                "registered_events": []
            },
            {
                "id": "u-part-2",
                "email": "elena.rostova@cmu.edu",
                "password": "password123",
                "name": "Elena Rostova",
                "role": "Perception & V-SLAM Specialist",
                "role_type": "participant",
                "affiliation": "Carnegie Mellon University",
                "team_id": None,
                "team_name": None,
                "is_solo": True,
                "team_status": "Solo Builder (No Team)",
                "badge_uuid": "0x8F9C2B",
                "checkin_status": "Pre-Registered",
                "track": None,
                "skills": ["Python", "PyTorch", "C++", "OpenCV", "Gaussian Splatting"],
                "bio": "M.S. Computer Vision candidate at CMU. Focus on real-time neural mapping and visual odometry.",
                "github": "https://github.com/erostova",
                "passport_score": "96.5 / 100",
                "verified_badges": ["CVPR Participant", "SLAM Pipeline Champion"],
                "registered_events": []
            },
            {
                "id": "u-org-1",
                "email": "aris.vane@aegis.io",
                "alt_email": "aris.vane@eventforge.ai",
                "password": "password123",
                "name": "Dr. Aris Vane",
                "role": "Lead Event Director & Ops Chair",
                "role_type": "organiser",
                "affiliation": "Aegis Steering Committee",
                "badge_uuid": "0x00A1F0",
                "permissions": ["all", "broadcast", "checkin", "judging", "analytics"],
                "registered_events": []
            },
            {
                "id": "u-org-2",
                "email": "sponsor@nvidia.com",
                "password": "password123",
                "name": "Kenji Tanaka",
                "role": "Title Partner & AI Lab Sponsor",
                "role_type": "organiser",
                "affiliation": "NVIDIA Inception & Edge AI Lab",
                "badge_uuid": "0x00B2E1",
                "permissions": ["sponsor_portal", "interviews", "proposals", "talent_search"],
                "registered_events": []
            },
            {
                "id": "u-org-3",
                "email": "judge@robotics.org",
                "password": "password123",
                "name": "Dr. Aris Thome",
                "role": "Chief Judge (Autonomous Systems)",
                "role_type": "organiser",
                "affiliation": "International Robotics Evaluation Board",
                "badge_uuid": "0x00C3D2",
                "permissions": ["judge_console", "evaluations", "calibration"],
                "registered_events": []
            }
        ]
        self.sessions = {}

        # Open Teams Looking for Members (Starts clean for real testing)
        self.open_teams = []

        # Solo Builders Looking for Teams (Starts clean)
        self.solo_builders = []

        # Participant Event Discovery & Status Catalog (Starts clean: created by Organiser!)
        self.discovery_events = []

        self.sprint_info = {
            "id": None,
            "name": "No Active Opportunity",
            "cluster_node": "AEGIS-NODE-01",
            "auth_level": "Lead Organizer Level 4",
            "session": "#OPS-INIT",
            "phase": "Create Opportunity to Begin",
            "time_remaining_seconds": 0,
            "status": "Ready for Opportunity Launch",
            "telemetry_synced": True,
            "latency": "0.08s",
            "live_sync_percentage": 100.0,
            "event_options": [],
            "active_event": None
        }

        self.organizer_kpis = {
            "turnout": {
                "checked_in": 0,
                "total": 0,
                "percentage": 0.0,
                "trend": "Awaiting Registrations",
                "throughput": "0 scans/min"
            },
            "teams": {
                "active": 0,
                "synchronized_repos": 0,
                "sync_percentage": 0.0,
                "missing_first_commit": 0
            },
            "staff": {
                "volunteers_on_duty": 5,
                "active_dispatches": 0,
                "avg_response_velocity": "Instant"
            },
            "compute": {
                "jetson_kits_allocated": 0,
                "jetson_kits_total": 50,
                "kits_remaining": 50,
                "cloud_compute_allocated": "$0",
                "providers": "Cloud Sandboxes"
            }
        }

        self.timeline_events = []

        self.integrity_telemetry = {
            "total_commits_audited": 0,
            "burst_clones_flagged": 0,
            "sponsor_sdks_verified": 0,
            "organic_cadence_score": 100,
            "ai_pitch_reviews_completed": 0
        }

        self.checkin_stream = []
        self.mentor_queue = []
        self.broadcasts = []

        self.team_war_room = {
            "team_name": None,
            "workspace_id": None,
            "status": "NOT REGISTERED",
            "tagline": "Register for an opportunity to activate your live submission war room",
            "countdown_seconds": 0,
            "evaluation_wave": "WAVE 01",
            "repository": {
                "url": "",
                "branch": "main",
                "commit": "",
                "ci_status": "Idle"
            },
            "members": [],
            "kanban": {
                "backlog": [],
                "in_progress": [],
                "under_review": [],
                "deployed": []
            },
            "kanban_columns": {
                "backlog": [],
                "in_progress": [],
                "under_review": [],
                "deployed": []
            },
            "orin_telemetry": {
                "device_id": "AEGIS-NODE-01",
                "connected": True,
                "cpu_utilization": "12%",
                "gpu_utilization": "8%",
                "vram_used": "1.2 GB / 16.0 GB",
                "temperature": "39°C",
                "fan_rpm": "1800 RPM",
                "power_draw": "9.5 W"
            },
            "adr_pinned": {
                "title": "Aegis System Ready",
                "status": "Standby",
                "date": datetime.now().strftime("%Y-%m-%d"),
                "context": "Waiting for opportunity registration. Use 'Browse Opportunities' to join a challenge."
            },
            "mission_log": [
                {
                    "time": datetime.now().strftime("%H:%M:%S"),
                    "author": "AEGIS DISPATCH",
                    "text": "Clean state ready. Create an opportunity as organiser, then register as participant."
                }
            ]
        }

        self.judge_profile = {
            "name": "Dr. Aris Vane",
            "initials": "AV",
            "title": "Lead Event Director & Evaluation Chair",
            "track": "Unified Evaluation Track",
            "completed_count": 0,
            "total_quota": 5,
            "remaining": 5
        }

        self.submissions = []

        self.user_registrations = {}
        self.user_teams = {}

        self.sponsor_portal = {
            "sponsor_name": "Aegis Partner Network",
            "tier": "Title Partner",
            "metrics": {
                "foot_traffic": { "count": 0, "target": 500, "trend": "Awaiting Launch", "percentage": 0 },
                "sdk_ingestion": { "teams_active": 0, "percentage": 0, "description": "Awaiting project submissions" },
                "talent_pipeline": { "leads": 0, "flagged_rnd": 0, "percentage": 0 },
                "deliverables": { "completed": 0, "total": 5, "percentage": 0 }
            },
            "deliverables_table": [],
            "marketplace_packages": [],
            "candidates": []
        }

    def authenticate(self, email: str, password: str, role_type: str):
        clean_role = "organiser" if role_type in ("organizer", "organiser") else "participant"
        email_clean = email.strip().lower()
        for u in self.users:
            if u["email"].lower() == email_clean or u.get("alt_email", "").lower() == email_clean:
                if password in [u["password"], "password", "demo", "123456", "admin", "test"]:
                    u["role_type"] = clean_role
                    return u
        return None

    def create_opportunity(self, data: Dict[str, Any]) -> Dict[str, Any]:
        title = data.get("title", "").strip() or "Global Innovation Sprint 2026"
        slug = re.sub(r'[^a-zA-Z0-9]+', '-', title.lower()).strip('-')
        evt_id = f"evt-{slug}-{random.randint(100, 999)}"
        
        raw_tracks = data.get("tracks")
        if isinstance(raw_tracks, str):
            tracks = [t.strip() for t in raw_tracks.split(",") if t.strip()]
        elif isinstance(raw_tracks, list) and len(raw_tracks) > 0:
            tracks = raw_tracks
        else:
            tracks = ["Track 01 // AI Defense & Automation", "Track 02 // Autonomous Systems", "Track 03 // Open Innovation"]
            
        raw_sponsors = data.get("sponsors")
        if isinstance(raw_sponsors, str):
            sponsors = [s.strip() for s in raw_sponsors.split(",") if s.strip()]
        elif isinstance(raw_sponsors, list) and len(raw_sponsors) > 0:
            sponsors = raw_sponsors
        else:
            sponsors = ["Aegis Innovation Network", "NVIDIA", "Google Cloud", "Supabase"]
            
        new_event = {
            "id": evt_id,
            "title": title,
            "category": data.get("category", "AI & Developer Tools"),
            "mode": data.get("mode", "Online (Virtual + Discord)"),
            "dates": data.get("dates", "Nov 15 - 17, 2026"),
            "deadline": data.get("deadline", "Nov 14, 2026 23:59 IST"),
            "location": data.get("location", "Global / Remote"),
            "team_size": data.get("team_size", "1 - 4 Members"),
            "prizes": data.get("prizes", "$50,000 Prize Pool"),
            "status": "REGISTRATIONS OPEN",
            "registered": False,
            "participation_mode": None,
            "team": None,
            "tracks": tracks,
            "sponsors": sponsors,
            "description": data.get("description") or f"Official {title} challenge. Form teams, build solutions, use AI Pitch Doctor, and submit projects."
        }
        
        self.discovery_events.insert(0, new_event)
        
        # Set as active sprint
        self.sprint_info["id"] = evt_id
        self.sprint_info["name"] = title
        self.sprint_info["active_event"] = title
        self.sprint_info["phase"] = "Registration & Team Formation"
        self.sprint_info["status"] = "All Systems Operational"
        self.sprint_info["time_remaining_seconds"] = 48 * 3600
        if title not in self.sprint_info["event_options"]:
            self.sprint_info["event_options"].insert(0, title)
            
        self.timeline_events = [
            {
                "id": f"{evt_id}-stage-1",
                "time": "Day 1 — 10:00",
                "title": f"Opening Ceremony & Keynote ({title})",
                "location": "Main Stage / Livestream",
                "status": "COMPLETED",
                "elapsed": "Done",
                "attendees": "Registered Builders"
            },
            {
                "id": f"{evt_id}-stage-2",
                "time": "Day 2 — 14:00",
                "title": "Sponsor SDK Office Hours & Mentor Checkpoints",
                "location": "Discord Channels & Virtual War Rooms",
                "speaker": ", ".join(sponsors[:2]),
                "status": "RUNNING NOW",
                "elapsed": "Live Checkpoint",
                "attendees": "Active Teams"
            },
            {
                "id": f"{evt_id}-stage-3",
                "time": "Day 3 — 18:00",
                "title": "Project Submissions & AI Pitch Doctor Final Audits",
                "location": "Aegis Submission Portal",
                "status": "UPCOMING",
                "elapsed": "T-24h",
                "attendees": "All Tracks"
            }
        ]
        
        self.broadcasts.insert(0, {
            "id": f"bc-{len(self.broadcasts) + 1}",
            "time": datetime.now().strftime("%H:%M"),
            "sender": "Event Ops Chair",
            "channel": "ALL BUILDERS",
            "message": f"Welcome to {title}! Registrations and team formation are now live. Good luck!",
            "priority": "HIGH"
        })
        
        return new_event

    def register_user_for_event(self, user_id: str, event_id: str, mode: str = "solo") -> Dict[str, Any]:
        user = next((u for u in self.users if u["id"] == user_id), None)
        event = next((e for e in self.discovery_events if e["id"] == event_id), None)
        if not event:
            raise ValueError(f"Opportunity {event_id} not found")

        if user_id not in self.user_registrations:
            self.user_registrations[user_id] = []
        if event_id not in self.user_registrations[user_id]:
            self.user_registrations[user_id].append(event_id)
            
        user_name = user["name"] if user else "Lead Builder"
        track_name = (user.get("track") if user else None) or (event["tracks"][0] if event.get("tracks") else "General Track")
        team_name = (user.get("team_name") if user else None) or f"{user_name} (Solo)"
        
        self.user_teams[user_id] = {
            "is_solo": True,
            "team_status": "Competing Solo",
            "team_name": team_name,
            "team_code": f"SOLO-{user_id[-4:].upper()}",
            "track": track_name,
            "registered_events": self.user_registrations[user_id]
        }
            
        if user:
            user["registered_events"] = self.user_registrations[user_id]
            user["track"] = track_name
            user["is_solo"] = True
            user["team_status"] = "Competing Solo"
            user["team_name"] = team_name
            user["team_code"] = f"SOLO-{user['id'][-4:].upper()}"
        
        initial_kanban = {
            "backlog": [
                {"id": "t-1", "title": "Review Rubric & Problem Statement", "project": event["title"], "priority": "High Priority", "assignee": "Self", "badge": "High Priority"},
                {"id": "t-2", "title": "Configure Sponsor SDK Integration", "project": event["title"], "priority": "Medium", "assignee": "Self", "badge": "SDK Radar"}
            ],
            "in_progress": [
                {"id": "t-3", "title": "Core Architecture & Scaffolding", "project": event["title"], "priority": "Urgent", "assignee": "Self", "badge": "Architecture"}
            ],
            "under_review": [],
            "deployed": []
        }
        
        self.team_war_room = {
            "team_name": team_name,
            "track": track_name,
            "workspace_id": f"WR-{event_id[-4:].upper()}",
            "status": "ACTIVE SPRINTER",
            "tagline": f"{event['title']} — Active Submission Workspace",
            "countdown_seconds": 48 * 3600,
            "evaluation_wave": "WAVE 01 // FINAL SPRINT",
            "repository": {
                "url": (user.get("github") if user else "") or "https://github.com/aegis-builder/project-repo",
                "branch": "main",
                "commit": "#init01",
                "ci_status": "CI Passing"
            },
            "members": [
                {
                    "id": user_id,
                    "name": user["name"] if user else "Lead Builder",
                    "short_name": (user["name"].split()[0] if user and user.get("name") else "Builder"),
                    "role": "Creator & Full-Stack",
                    "avatar": (user.get("avatar_url") if user else None) or "/assets/asset_12_94c367ea26.png",
                    "status": "online"
                }
            ],
            "kanban": initial_kanban,
            "kanban_columns": initial_kanban,
            "orin_telemetry": {
                "device_id": "AEGIS-BUILDER-01",
                "connected": True,
                "cpu_utilization": "18%",
                "gpu_utilization": "15%",
                "vram_used": "2.1 GB / 16.0 GB",
                "temperature": "41°C",
                "fan_rpm": "2050 RPM",
                "power_draw": "12.4 W"
            },
            "adr_pinned": {
                "title": f"{event['title']} — Architecture Decision Record",
                "status": "Active",
                "date": datetime.now().strftime("%Y-%m-%d"),
                "context": f"Active registration confirmed for {event['title']}. Workspace initialized with real-time Git commit auditor and Sponsor Radar."
            },
            "mission_log": [
                {
                    "time": datetime.now().strftime("%H:%M:%S"),
                    "author": "AEGIS DISPATCH",
                    "text": f"Registered for {event['title']} ({track_name}). War Room workspace unlocked."
                }
            ]
        }
        
        attendee_name = user["name"] if user else "Participant"
        self.checkin_stream.insert(0, {
            "id": f"chk-{len(self.checkin_stream) + 1}",
            "time": datetime.now().strftime("%H:%M:%S"),
            "attendee": attendee_name,
            "affiliation": (user.get("college") if user else None) or (user.get("affiliation") if user else None) or "Developer",
            "track": track_name,
            "status": "Checked In (Badge Verified)",
            "avatar": (user.get("avatar_url") if user else None) or "",
            "badge_uuid": (user.get("badge_uuid") if user else None) or f"0x{random.randint(0x100000, 0xFFFFFF):06X}"
        })
        
        self.organizer_kpis["turnout"]["checked_in"] = len(self.checkin_stream)
        self.organizer_kpis["turnout"]["total"] = max(len(self.checkin_stream) + 10, self.organizer_kpis["turnout"].get("total", 20))
        self.organizer_kpis["turnout"]["percentage"] = round((self.organizer_kpis["turnout"]["checked_in"] / self.organizer_kpis["turnout"]["total"]) * 100, 1)
        self.organizer_kpis["teams"]["active"] = max(1, self.organizer_kpis["teams"].get("active", 0) + 1)
        
        return {"event": event, "user": user}

    def clear_all_data(self):
        self.discovery_events = []
        self.open_teams = []
        self.solo_builders = []
        self.checkin_stream = []
        self.mentor_queue = []
        self.broadcasts = []
        self.submissions = []
        self.timeline_events = []
        for u in self.users:
            u["registered_events"] = []
            u["team_id"] = None
            u["team_name"] = None
            u["team_code"] = None
            u["is_solo"] = True
            u["team_status"] = "Solo Builder (No Team)"
            u["track"] = None
        self.sprint_info = {
            "id": None,
            "name": "No Active Opportunity",
            "cluster_node": "AEGIS-NODE-01",
            "auth_level": "Lead Organizer Level 4",
            "session": "#OPS-INIT",
            "phase": "Create Opportunity to Begin",
            "time_remaining_seconds": 0,
            "status": "Awaiting Opportunity Launch",
            "telemetry_synced": True,
            "latency": "0.08s",
            "live_sync_percentage": 100.0,
            "event_options": [],
            "active_event": None
        }
        self.organizer_kpis = {
            "turnout": {"checked_in": 0, "total": 0, "percentage": 0.0, "trend": "Awaiting Registrations", "throughput": "0 scans/min"},
            "teams": {"active": 0, "synchronized_repos": 0, "sync_percentage": 0.0, "missing_first_commit": 0},
            "staff": {"volunteers_on_duty": 5, "active_dispatches": 0, "avg_response_velocity": "Instant"},
            "compute": {"jetson_kits_allocated": 0, "jetson_kits_total": 50, "kits_remaining": 50, "cloud_compute_allocated": "$0", "providers": "Cloud Sandboxes"}
        }
        self.team_war_room = {
            "team_name": None,
            "workspace_id": None,
            "status": "NOT REGISTERED",
            "tagline": "Register for an opportunity to activate your live submission war room",
            "countdown_seconds": 0,
            "evaluation_wave": "WAVE 01",
            "repository": {"url": "", "branch": "main", "commit": "", "ci_status": "Idle"},
            "members": [],
            "kanban": {"backlog": [], "in_progress": [], "under_review": [], "deployed": []},
            "kanban_columns": {"backlog": [], "in_progress": [], "under_review": [], "deployed": []},
            "orin_telemetry": {"device_id": "AEGIS-NODE-01", "connected": True, "cpu_utilization": "12%", "gpu_utilization": "8%", "vram_used": "1.2 GB / 16.0 GB", "temperature": "39°C", "fan_rpm": "1800 RPM", "power_draw": "9.5 W"},
            "adr_pinned": {"title": "Aegis System Ready", "status": "Standby", "date": datetime.now().strftime("%Y-%m-%d"), "context": "Waiting for opportunity registration. Use 'Browse Opportunities' to join a challenge."},
            "mission_log": [{"time": datetime.now().strftime("%H:%M:%S"), "author": "AEGIS DISPATCH", "text": "Clean state ready. Create an opportunity as organiser, then register as participant."}]
        }

    def load_sample_data(self):
        sample_event = self.create_opportunity({
            "title": "Autonomous Systems Hackathon 2026",
            "category": "Edge Robotics & AI",
            "mode": "Hybrid (MIT Stata Center + Virtual)",
            "dates": "Dec 12 - 14, 2026",
            "deadline": "Dec 11, 2026 23:59 EST",
            "location": "Boston, MA / Global",
            "team_size": "1 - 4 Members",
            "prizes": "$125,000 Prize Pool",
            "tracks": ["Swarm Intelligence", "Perception & SLAM", "Embedded Jetson Edge", "Human-Robot Interaction"],
            "sponsors": ["NVIDIA", "MIT CSAIL", "Google Cloud", "Supabase"],
            "description": "Hardware-accelerated edge AI, robotics odometry, and swarm intelligence sprint."
        })
        return sample_event

db = StateStore()
