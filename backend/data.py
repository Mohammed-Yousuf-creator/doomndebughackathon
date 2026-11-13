"""
AEGIS OS - Forge Innovation Network
In-memory reactive database and state store
"""
from datetime import datetime, timezone
from typing import List, Dict, Any

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
                "registered_events": ["evt-ash-2025"]
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
                "permissions": ["all", "broadcast", "checkin", "judging", "analytics"]
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
                "permissions": ["sponsor_portal", "interviews", "proposals", "talent_search"]
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
                "permissions": ["judge_console", "evaluations", "calibration"]
            }
        ]
        self.sessions = {}

        # Open Teams Looking for Members (for Devfolio/Unstop Matchmaking)
        self.open_teams = [
            {
                "id": "team-aeropulse",
                "name": "Team AeroPulse",
                "event_id": "evt-ash-2025",
                "team_code": "AP-7741",
                "track": "Track 02 // Embedded Jetson Edge",
                "members_count": 3,
                "max_members": 4,
                "leader": "Julian Thorne",
                "current_roles": ["Frontend Developer", "Hardware Prototyper", "Embedded Linux Dev"],
                "looking_for": "1 ML / Perception Engineer (ROS2 / PyTorch)",
                "match_reason": "98% Skill Match: Your ROS2 and PyTorch background perfectly fits their missing gap."
            },
            {
                "id": "team-neuralmesh",
                "name": "Team NeuralMesh",
                "event_id": "evt-ash-2025",
                "team_code": "NM-2089",
                "track": "Track 04 // Swarm Intelligence",
                "members_count": 2,
                "max_members": 4,
                "leader": "Amina Diallo",
                "current_roles": ["Backend Go Dev", "Systems Architect"],
                "looking_for": "1 C++ Robotics Engineer & 1 UI Designer",
                "match_reason": "94% Track Fit: They need your C++ robotics systems expertise."
            },
            {
                "id": "team-bioswarm",
                "name": "Team BioSwarm",
                "event_id": "evt-deeptech-berlin",
                "team_code": "BS-4491",
                "track": "Protein Folding AI",
                "members_count": 2,
                "max_members": 4,
                "leader": "Lukas Weber",
                "current_roles": ["Bioinformatics Specialist", "Data Scientist"],
                "looking_for": "1 Full-Stack / React Engineer",
                "match_reason": "High Relevance: Team needs your React & Full-Stack architecture skills."
            }
        ]

        # Solo Builders Looking for Teams (Unstop Style "Find Teammates")
        self.solo_builders = [
            {
                "id": "solo-1",
                "name": "Elena Rostova",
                "college": "Carnegie Mellon",
                "skills": ["PyTorch", "OpenCV", "Gaussian Splatting", "V-SLAM"],
                "preferred_track": "Track 01 // Perception & SLAM",
                "bio": "M.S. Computer Vision candidate at CMU. Looking for a systems/firmware engineer to build an edge perception drone.",
                "match_score": "98% Fit"
            },
            {
                "id": "solo-2",
                "name": "Liam Vance",
                "college": "Stanford University",
                "skills": ["React", "TypeScript", "Tailwind", "Three.js", "WebXR"],
                "preferred_track": "Track 03 // Human-Robot Interaction",
                "bio": "Frontend & 3D visualization specialist. Want to build real-time teleoperation cockpit dashboards.",
                "match_score": "94% Fit"
            },
            {
                "id": "solo-3",
                "name": "Priya Nair",
                "college": "UC Berkeley",
                "skills": ["FPGA", "Verilog", "Embedded C", "Circuit Design"],
                "preferred_track": "Track 02 // Embedded Jetson Edge",
                "bio": "Hardware wizard. Bringing custom camera breakout boards and motor controllers.",
                "match_score": "96% Fit"
            }
        ]

        # Participant Event Discovery & Status Catalog (Devfolio / Unstop Style)
        self.discovery_events = [
            {
                "id": "evt-ash-2025",
                "title": "Autonomous Systems Hackathon 2025",
                "category": "Edge Robotics & AI",
                "mode": "Hybrid (MIT Stata Center + Virtual)",
                "dates": "Nov 14 - 16, 2025",
                "deadline": "Nov 13, 23:59 EST",
                "location": "Boston, MA",
                "team_size": "1 - 4 Members",
                "prizes": "$125,000 Prize Pool",
                "status": "LIVE SPRINT ACTIVE",
                "registered": True,
                "participation_mode": "Solo (Team Formation Open)",
                "team": None,
                "tracks": ["Swarm Intelligence", "Perception & SLAM", "Embedded Jetson Edge", "Human-Robot Interaction"]
            },
            {
                "id": "evt-deeptech-berlin",
                "title": "DeepTech BioInnovation Summit",
                "category": "BioTech & Synthetic Biology",
                "mode": "In-Person (Berlin Innovation Hub)",
                "dates": "Dec 05 - 07, 2025",
                "deadline": "Nov 28, 2025",
                "location": "Berlin, Germany",
                "team_size": "1 - 5 Members",
                "prizes": "€80,000 + Venture Incubator",
                "status": "REGISTRATIONS OPEN",
                "registered": False,
                "participation_mode": None,
                "team": None,
                "tracks": ["Protein Folding AI", "Cryo-EM Automation", "Lab Automation"]
            },
            {
                "id": "evt-biodesign-singapore",
                "title": "Quantum Leap Climate Challenge",
                "category": "CleanTech & Quantum Sim",
                "mode": "Virtual / Online",
                "dates": "Jan 18 - 20, 2026",
                "deadline": "Jan 10, 2026",
                "location": "Singapore / Global",
                "team_size": "1 - 4 Members",
                "prizes": "$150,000 Non-Dilutive Grant",
                "status": "UPCOMING",
                "registered": False,
                "participation_mode": None,
                "team": None,
                "tracks": ["Carbon Sequestration AI", "Smart Grid Optimization", "Quantum Materials"]
            },
            {
                "id": "evt-vision-sf",
                "title": "Autonomous Vision Challenge 2026",
                "category": "Spatial AI & Vision",
                "mode": "In-Person (SF Pier 48)",
                "dates": "Feb 22 - 24, 2026",
                "deadline": "Feb 15, 2026",
                "location": "San Francisco, CA",
                "team_size": "1 - 3 Members",
                "prizes": "$60,000 Seed Bounty",
                "status": "REGISTRATIONS OPEN",
                "registered": False,
                "participation_mode": None,
                "team": None,
                "tracks": ["3D Gaussian Splatting", "Event Cameras", "NeRF Localization"]
            }
        ]

        self.sprint_info = {
            "id": "MIT-2025-AUTONOMY",
            "name": "Autonomous Systems Hackathon 2025",
            "cluster_node": "MIT-CSAIL-RBL-04",
            "auth_level": "Lead Organizer Level 4",
            "session": "#908-OPS",
            "phase": "Day 2 — Mid-Sprint Checkpoint",
            "time_remaining_seconds": 18 * 3600 + 42 * 60 + 10,
            "status": "All Systems Operational",
            "telemetry_synced": True,
            "latency": "0.14s",
            "live_sync_percentage": 99.98,
            "event_options": [
                "Global Sprint 2025 (North America)",
                "DeepTech Hackathon Berlin",
                "BioDesign Summit Singapore"
            ],
            "active_event": "Global Sprint 2025 (North America)"
        }

        self.organizer_kpis = {
            "turnout": {
                "checked_in": 1420,
                "total": 1500,
                "percentage": 94.6,
                "trend": "+8.4% vs T-12h",
                "throughput": "~38 scans/min avg"
            },
            "teams": {
                "active": 348,
                "synchronized_repos": 312,
                "sync_percentage": 89.6,
                "missing_first_commit": 36
            },
            "staff": {
                "volunteers_on_duty": 42,
                "active_dispatches": 18,
                "avg_response_velocity": "4.2 min avg"
            },
            "compute": {
                "jetson_kits_allocated": 128,
                "jetson_kits_total": 140,
                "kits_remaining": 12,
                "cloud_compute_allocated": "$64,000",
                "providers": "AWS / Lambda Labs"
            }
        }

        self.timeline_events = [
            {
                "id": "evt-1",
                "time": "10:00 - 11:30 EST",
                "title": "Hardware Desk Opens & Sensor Kit Pickup",
                "location": "Stata Center 4th Floor Lab",
                "status": "COMPLETED",
                "elapsed": "Done",
                "attendees": "312 Collected"
            },
            {
                "id": "evt-2",
                "time": "14:00 - 15:30 EST",
                "title": "Workshop: Zero-Copy ROS2 Architecture",
                "location": "D-Auditorium & Discord Channel #stream-a",
                "speaker": "Dr. Kenji Tanaka (NVIDIA Autonomy Lab)",
                "status": "RUNNING NOW",
                "elapsed": "Running 34 mins",
                "attendees": "210 in Room · 440 Stream"
            },
            {
                "id": "evt-3",
                "time": "16:30 EST",
                "title": "Milestone 2: Repo Freeze & CI Check",
                "location": "Automated Validator",
                "description": "Enforces build pipeline validation on main branch.",
                "status": "IN 1H 58M"
            },
            {
                "id": "evt-4",
                "time": "19:00 EST",
                "title": "Catered Dinner & Lead Mentor Office Hours",
                "location": "Central Atrium / Mentors Desk 1-8",
                "status": "UPCOMING"
            },
            {
                "id": "evt-5",
                "time": "22:00 EST",
                "title": "Midnight Diagnostic Blitz & Cloud Scale-Up",
                "location": "DevOps sprint teams standby.",
                "status": "UPCOMING"
            }
        ]

        self.integrity_telemetry = {
            "github_sync": {
                "name": "GitHub Enterprise Webhook Sync",
                "push_events": 2491,
                "status": "STABLE"
            },
            "ast_scanner": {
                "name": "AST Plagiarism & Origin Scanner",
                "description": "Pre-existing open source base check",
                "flags_detected": 0,
                "status": "0 FLAGS DETECTED"
            },
            "docker_runners": {
                "name": "Docker Build Runners (AWS ECS)",
                "healthy_workers": "32/32 worker instances healthy",
                "status": "100% PASS"
            },
            "cluster_metrics": {
                "cpu_utilization": "41.2%",
                "ram_usage": "64.8GB / 128GB"
            }
        }

        self.checkin_stream = [
            {
                "id": "chk-1",
                "time": "14:31:54",
                "attendee": "Elena Rostova",
                "affiliation": "Carnegie Mellon (Team V-SLAM)",
                "checkpoint": "Gate B - Hardware Desk",
                "badge_uuid": "0x8F9C2B",
                "type": "gate"
            },
            {
                "id": "chk-2",
                "time": "14:30:12",
                "attendee": "Marcus Chen",
                "affiliation": "Stanford Robotics (AeroPulse)",
                "checkpoint": "Collected Jetson AGX Kit #084",
                "badge_uuid": "0x4D1A7E",
                "type": "hardware"
            },
            {
                "id": "chk-3",
                "time": "14:28:44",
                "attendee": "Amina Diallo",
                "affiliation": "MIT CSAIL (Autonomous Ag)",
                "checkpoint": "Gate A - Main Rotunda",
                "badge_uuid": "0x99AE12",
                "type": "gate"
            },
            {
                "id": "chk-4",
                "time": "14:26:09",
                "attendee": "Julian Thorne",
                "affiliation": "Imperial College London (QuadZero)",
                "checkpoint": "Gate C - West Concourse",
                "badge_uuid": "0x3B66D0",
                "type": "gate"
            }
        ]

        self.mentor_queue = [
            {
                "id": "mq-1",
                "team": "Team DeepDrive",
                "location": "Lab Desk 4B",
                "category": "Embedded Linux / Kernel",
                "issue": "Orin Xavier DSI display driver kernel panic during camera loop initialization",
                "urgency": "High",
                "wait_time": "12m",
                "assigned_mentor": "Dr. Sarah Lin",
                "status": "In Progress"
            },
            {
                "id": "mq-2",
                "team": "Team BioSwarm",
                "location": "Dev Table 12",
                "category": "Deep Learning / CUDA",
                "issue": "PyTorch CUDA out-of-memory when batching segmented microscopy frames",
                "urgency": "Medium",
                "wait_time": "6m",
                "assigned_mentor": "Alex Vance",
                "status": "Dispatched"
            },
            {
                "id": "mq-3",
                "team": "Team SkyVision",
                "location": "Flight Bay 2",
                "category": "PX4 / Drone Telemetry",
                "issue": "Mavlink telemetry packet dropped over 5.8GHz ad-hoc radio bridge",
                "urgency": "Urgent",
                "wait_time": "3m",
                "assigned_mentor": "Kenji Tanaka",
                "status": "In Progress"
            },
            {
                "id": "mq-4",
                "team": "Team NeuroPath",
                "location": "Lab Desk 8A",
                "category": "ROS2 Navigation2",
                "issue": "Costmap inflation layer oscillation in narrow corridor simulation",
                "urgency": "Low",
                "wait_time": "1m",
                "assigned_mentor": "Unassigned",
                "status": "Queued"
            }
        ]

        self.broadcasts = [
            {
                "id": "bc-1",
                "timestamp": "14:15 EST",
                "title": "Workshop Starting: Zero-Copy ROS2",
                "message": "NVIDIA Lab workshop beginning now in Auditorium D. Streaming on Discord channel #stream-a.",
                "type": "info",
                "sender": "Dr. Aris Vane (Organizer Lead)"
            }
        ]

        # 2. Team War Room Data
        self.team_war_room = {
            "team_name": "Team VectorSwarm",
            "track": "TRACK 04 // SWARM INTELLIGENCE",
            "workspace_id": "VS-9920-ALPHA",
            "status": "BENCH VERIFIED",
            "tagline": "Autonomous Robotics & Swarm Navigation Pipeline",
            "countdown_seconds": 18 * 3600 + 42 * 60 + 10,
            "evaluation_wave": "WAVE 03 // 22:00 UTC",
            "repository": {
                "url": "https://github.com/aegis-sprint/vectorswarm-nav",
                "branch": "main",
                "commit": "#8f2a1b",
                "ci_status": "CI Passing (3m ago)"
            },
            "members": [
                {
                    "id": "m-1",
                    "name": "Marcus Chen",
                    "short_name": "M. Chen",
                    "role": "Lead Architect",
                    "avatar": "/assets/asset_12_94c367ea26.png",
                    "status": "online"
                },
                {
                    "id": "m-2",
                    "name": "Sofia Ramos",
                    "short_name": "S. Ramos",
                    "role": "ROS2 / Firmware",
                    "avatar": "/assets/asset_00_d1991ce1c9.png",
                    "status": "online"
                },
                {
                    "id": "m-3",
                    "name": "Devansh Kulkarni",
                    "short_name": "D. Kulkarni",
                    "role": "ML Perception",
                    "avatar": "/assets/asset_14_f88e4618e1.png",
                    "status": "online"
                },
                {
                    "id": "m-4",
                    "name": "Ananya Patel",
                    "short_name": "A. Patel",
                    "role": "Systems Integrator",
                    "avatar": "/assets/asset_13_3ba37bd9df.png",
                    "status": "online"
                }
            ],
            "kanban": {
                "backlog": [
                    {
                        "id": "KB-24",
                        "title": "Calibrate Stereo Depth Baseline in Simulation",
                        "project": "Gazebo Swarm Sim Harness",
                        "priority": "P2 Normal",
                        "assignee": "Unassigned"
                    },
                    {
                        "id": "KB-29",
                        "title": "Implement Fallback Peer-to-Peer Heartbeat",
                        "project": "Network Protocol",
                        "priority": "P3 Backlog",
                        "assignee": "v0.4-prep"
                    }
                ],
                "in_progress": [
                    {
                        "id": "KB-14",
                        "title": "TensorRT Engine FP16 Quantization & Memory Leak",
                        "project": "TensorRT Engine Pipeline",
                        "priority": "URGENT",
                        "assignee": "Devansh Kulkarni",
                        "assignee_avatar": "/assets/asset_05_82ac7a7ff6.png",
                        "badge": "CUDA Error 702"
                    },
                    {
                        "id": "KB-18",
                        "title": "LiDAR Fast-LIO2 Odometry EKF State Prediction Tuning",
                        "project": "LiDAR Odometry Fusion",
                        "priority": "HIGH",
                        "assignee": "Marcus Chen",
                        "assignee_avatar": "/assets/asset_02_5585e36d1e.png",
                        "badge": "Est: 1.5h"
                    },
                    {
                        "id": "KB-21",
                        "title": "Fast-DDS Intra-Process Zero-Copy Shm Configuration",
                        "project": "ROS2 Middleware",
                        "priority": "NORMAL",
                        "assignee": "Sofia Ramos",
                        "assignee_avatar": "/assets/asset_17_94eefa4a9d.png",
                        "badge": "< 2.4ms jitter"
                    }
                ],
                "under_review": [
                    {
                        "id": "KB-12",
                        "title": "Gazebo Multi-Drone Swarm Physics Harness (4 Units)",
                        "project": "Gazebo Swarm Sim Harness",
                        "priority": "PR Ready",
                        "assignee": "Ananya Patel",
                        "assignee_avatar": "/assets/asset_08_0f45d20a7a.png",
                        "badge": "1 Approval Req"
                    }
                ],
                "deployed": [
                    {
                        "id": "KB-08",
                        "title": "Swarm Formation UDP Protocol",
                        "project": "Network",
                        "note": "Merged by M. Chen in #8f2a1b"
                    },
                    {
                        "id": "KB-05",
                        "title": "Containerized ROS2 Humble Base",
                        "project": "DevOps",
                        "note": "Image: vectorswarm/runtime:arm64"
                    },
                    {
                        "id": "KB-02",
                        "title": "Bench Telemetry Protocol Buffers",
                        "project": "Protocols",
                        "note": "Verified by S. Ramos"
                    }
                ]
            },
            "orin_telemetry": {
                "temperature": "39.4°C",
                "status": "NOMINAL",
                "npu_load": "84.2%",
                "vram_alloc": "6.8 / 8GB",
                "sync_jitter": "1.82 ms",
                "sparkline_npu": [18, 14, 19, 8, 11, 4, 7, 5, 8, 6, 9, 7],
                "sparkline_vram": [20, 18, 16, 12, 10, 6, 8, 7, 8, 7, 6, 6],
                "sparkline_jitter": [10, 12, 8, 14, 11, 9, 10, 8, 9, 7, 8, 8]
            },
            "adr_pinned": {
                "id": "ADR-004",
                "title": "Architecture Consensus: ADR-004",
                "ratified": "Ratified 1h ago",
                "decision": "Fallback from centralized coordinator to peer-to-peer relative consensus over CycloneDDS if RSSI drops below -82dBm. No master node single-point-of-failure."
            },
            "mission_log": [
                {
                    "id": "msg-1",
                    "author": "Marcus Chen",
                    "role": "Lead",
                    "time": "14m ago",
                    "avatar": "/assets/asset_03_743055e3e7.png",
                    "text": "Pushed fix for LiDAR distortion compensation during high yaw rate turns. Notice the new timestamp alignment:",
                    "code_snippet": {
                        "filename": "pointcloud_deskew.cpp",
                        "lang": "C++20",
                        "code": "const double dt = pt.time - scan_start;\nEigen::Vector3d p_comp = transform.interpolate(dt) * pt.raw_pos;\npublish_corrected_cloud(p_comp, qos_profile);"
                    }
                },
                {
                    "id": "msg-2",
                    "author": "GitHub Action Bot",
                    "role": "Bot",
                    "time": "28m ago",
                    "icon": "merge_type",
                    "text": "Merged PR #19: fix(qos): reduce lidar topic queue depth to 1 with volatile durability"
                },
                {
                    "id": "msg-3",
                    "author": "Sofia Ramos",
                    "role": "ROS2",
                    "time": "42m ago",
                    "avatar": "/assets/asset_11_d2eb74ae79.png",
                    "text": "Flushed ROS2 bags from the 4-drone indoor corridor test. Spatial drift bounded under 3.2cm over 45 seconds trajectory. Video clip attached to submission assets."
                },
                {
                    "id": "msg-4",
                    "author": "Devansh Kulkarni",
                    "role": "ML",
                    "time": "1h ago",
                    "avatar": "/assets/asset_15_2b9ed78595.png",
                    "text": "@AEGIS Synthesizer - TensorRT engine running on the Orin is throwing OOM when batch size reaches 4 with YOLOV8x-obb. Looking for optimization params."
                }
            ]
        }

        # 3. Judge Evaluation Console Data
        self.judge_profile = {
            "name": "Dr. Aris Thome",
            "initials": "AT",
            "title": "Head of Edge Computing, Boston Tech",
            "track": "Track 01: Multi-Agent Perception & Edge Robotics",
            "protocol_lock": "Double-Blind Active",
            "completed_count": 4,
            "total_quota": 12,
            "remaining": 8
        }

        self.submissions = [
            {
                "id": "PRJ-8824",
                "title": "Decentralized LiDAR SLAM on Low-Power Orin Swarms",
                "tag": "Hardware Validated",
                "category": "Multi-Agent Perception Under Low-Light",
                "description": "Hardware-accelerated sub-15ms LiDAR odometry and distributed pose-graph optimization across 4 cooperative ground rovers operating in zero-lux subterranean conduits.",
                "dataset": "TartanAir-Conduit-v3",
                "caption": "4-Node Ad-Hoc Mesh Topology in Degraded Environment",
                "video_url": "/assets/asset_07_940ce03e1c.png",
                "deck_slide_url": "/assets/asset_18_11df169078.png",
                "architecture_url": "/assets/asset_01_f6d18c8079.png",
                "tech_stack": [
                    {"label": "Core Compute", "value": "Jetson Orin Nano"},
                    {"label": "Middleware", "value": "ROS2 Humble Hawks"},
                    {"label": "Acceleration", "value": "CUDA C++ / TensorRT"},
                    {"label": "Swarm Sync", "value": "Zenoh P2P Mesh"}
                ],
                "verification": {
                    "build_status": "SANDBOX-BUILD: PASS",
                    "commit": "#d9e14a",
                    "docker_sla": "11.4ms latency",
                    "unit_tests": "98.4% (124/126 Unit Tests)",
                    "replay_target": "AWS Graviton3 edge emulator"
                },
                "rubric": {
                    "technical_rigor": {"weight": 30, "score": 9, "desc": "Architectural complexity, clean modular C++, low-level efficiency, thread safety."},
                    "algorithmic_novelty": {"weight": 25, "score": 8, "desc": "Original approach to distributed pose-graph optimization and low-bandwidth telemetry."},
                    "edge_performance": {"weight": 20, "score": 9, "desc": "Meets sub-15ms SLA on physical Jetson Orin with sustainable thermal dissipation."},
                    "documentation": {"weight": 15, "score": 8, "desc": "Exemplary README, clear ROSbag playback scripts, concise visual exposition."},
                    "track_alignment": {"weight": 10, "score": 10, "desc": "Direct fulfillment of low-light multi-agent autonomous perimeter mapping mandates."}
                },
                "composite_score": 88.5,
                "tier": "Top 5% Tier",
                "median_track_score": 74.2,
                "private_notes": "",
                "participant_feedback": "Sub-15ms loop closure latency is exceptional on physical Orin units. The distributed pose graph fusion is very clean. Recommend clarifying dynamic obstacle rejection in degraded lighting."
            },
            {
                "id": "PRJ-8825",
                "title": "Quadruped Agile Sub-Surface Traverser with Tactile EKF",
                "tag": "Hardware Validated",
                "category": "Multi-Agent Perception & Legged Locomotion",
                "description": "Proprioceptive contact estimation fused with solid-state LiDAR for extreme slope recovery on Boston Dynamics Spot & Unitree Go2 platforms.",
                "dataset": "DARPA-SubT-Vault-v2",
                "caption": "Dynamic Stance Re-planning on Uneven Terrains",
                "video_url": "/assets/asset_07_940ce03e1c.png",
                "deck_slide_url": "/assets/asset_18_11df169078.png",
                "architecture_url": "/assets/asset_01_f6d18c8079.png",
                "tech_stack": [
                    {"label": "Core Compute", "value": "Jetson AGX Orin 64GB"},
                    {"label": "Middleware", "value": "ROS2 Iron"},
                    {"label": "Control", "value": "MPC / Convex Quadratic QP"},
                    {"label": "Sensors", "value": "Livox Mid-360 + IMU"}
                ],
                "verification": {
                    "build_status": "SANDBOX-BUILD: PASS",
                    "commit": "#c38a90",
                    "docker_sla": "8.2ms control loop",
                    "unit_tests": "100% (96/96 Unit Tests)",
                    "replay_target": "JetPack 6.1 RT Kernel"
                },
                "rubric": {
                    "technical_rigor": {"weight": 30, "score": 10, "desc": "Architectural complexity, clean modular C++, low-level efficiency, thread safety."},
                    "algorithmic_novelty": {"weight": 25, "score": 9, "desc": "Original approach to distributed pose-graph optimization and low-bandwidth telemetry."},
                    "edge_performance": {"weight": 20, "score": 9, "desc": "Meets sub-15ms SLA on physical Jetson Orin with sustainable thermal dissipation."},
                    "documentation": {"weight": 15, "score": 9, "desc": "Exemplary README, clear ROSbag playback scripts, concise visual exposition."},
                    "track_alignment": {"weight": 10, "score": 9, "desc": "Direct fulfillment of low-light multi-agent autonomous perimeter mapping mandates."}
                },
                "composite_score": 93.0,
                "tier": "Top 1% Tier",
                "median_track_score": 74.2,
                "private_notes": "Stellar footstep planner implementation. Real-time QP solver executes in under 2ms.",
                "participant_feedback": "Phenomenal hardware demo. Highly recommended for commercial trial track."
            }
        ]

        # 4. Sponsor Portal Data
        self.sponsor_portal = {
            "partner_name": "NVIDIA Inception & Edge AI Lab",
            "tier": "Tier-1 Title Partner",
            "campaign": "Autonomous Systems Hackathon 2025",
            "node": "SF Pier 48 + Global Virtual Stream",
            "logo": "/assets/asset_09_5517e51afc.png",
            "metrics": {
                "foot_traffic": {
                    "count": 840,
                    "target": 1000,
                    "trend": "+18% vs Target",
                    "percentage": 84
                },
                "sdk_ingestion": {
                    "teams_active": 312,
                    "percentage": 68,
                    "description": "JetPack 6.0 & TensorRT deployed"
                },
                "talent_pipeline": {
                    "leads": 142,
                    "flagged_rnd": 62,
                    "percentage": 71
                },
                "deliverables": {
                    "completed": 8,
                    "total": 10,
                    "percentage": 80,
                    "note": "2 milestones awaiting Day 3 final"
                }
            },
            "deliverables_table": [
                {
                    "node": "Keynote Presentation Slot (Opening Ceremony)",
                    "sub": "Delivered by VP of Autonomous Systems",
                    "channel": "Auditorium Main Stage + 4K Stream",
                    "reach": "1,420 Live Attendees",
                    "status": "Completed",
                    "audit": "TX-091A8 // VERIFIED",
                    "icon": "co_present"
                },
                {
                    "node": "Custom Hardware Workshop: Jetson Orin TensorRT",
                    "sub": "Hands-on edge quantization and profiling masterclass",
                    "channel": "DevLab Arena B • 90 min session",
                    "reach": "188 Registered Seats (100% cap)",
                    "status": "Completed",
                    "audit": "TX-092E4 // VERIFIED",
                    "icon": "laptop_chromebook"
                },
                {
                    "node": "Hardware Lab Desk & Swag Distribution",
                    "sub": "40x Orin Nano developer kits on live hardware loan",
                    "channel": "Main Expo Floor Booth #12",
                    "reach": "840 Builders Checked-in",
                    "status": "Active Now",
                    "audit": "LIVE // TELEMETRY",
                    "icon": "inventory_2"
                },
                {
                    "node": "Sponsored Track Bounties ($25k Award Distribution)",
                    "sub": "1st: $15k • 2nd: $7k • 3rd: $3k in Edge Robotics",
                    "channel": "Award Ceremony & Protocol Escrow",
                    "reach": "All 42 Eligible Finalists",
                    "status": "Scheduled: Day 3 (18:00)",
                    "audit": "ESCROW-LOCKED",
                    "icon": "military_tech"
                },
                {
                    "node": "Double-Blind Judging Panel Seat",
                    "sub": "Assigned Juror: Dr. Aris Thome (Staff Research Scientist)",
                    "channel": "AEGIS Rubric System (Jury Portal #4)",
                    "reach": "24 Final Project Pitches",
                    "status": "Assigned & Onboarded",
                    "audit": "JURY-TOKEN // SET",
                    "icon": "gavel"
                }
            ],
            "marketplace_packages": [
                {
                    "id": "pkg-1",
                    "title": "Global Climate Compute Sprint",
                    "description": "Decarbonization, high-fidelity earth observation models, and synthetic carbon credit validation nodes.",
                    "status": "Open for Bidding",
                    "price": "$35,000",
                    "cohort": "2,800 Developers",
                    "nodes": "12 Academic Institutions",
                    "datacenter": "Zurich & Remote",
                    "perks": "Includes 1x Mainstage Keynote + Exclusive Cloud Credit Track",
                    "color": "primary"
                },
                {
                    "id": "pkg-2",
                    "title": "Next-Gen BioCompute Hackathon",
                    "description": "Protein folding algorithms, generative cellular imaging, and automated microfluidic lab controls.",
                    "status": "Exclusive Hardware Seat",
                    "price": "$20,000",
                    "cohort": "450 Post-Docs & Engineers",
                    "nodes": "Stanford BioDesign",
                    "datacenter": "Edge Inference for Wet Labs",
                    "perks": "Includes Dedicated Hardware Demo Rig + Mentor Desk",
                    "color": "secondary"
                },
                {
                    "id": "pkg-3",
                    "title": "Decentralized Infrastructure Challenge",
                    "description": "P2P orchestration, decentralized machine learning clusters, zero-knowledge proofs for dataset validation.",
                    "status": "2 Slots Available",
                    "price": "$15,000",
                    "cohort": "1,600 Global Systems Devs",
                    "nodes": "$100,000 Total Escrow",
                    "datacenter": "Rust, Wasm, GPU Overlays",
                    "perks": "Includes Dedicated Technical Bounty & API Showcase",
                    "color": "outline"
                }
            ],
            "candidates": [
                {
                    "id": "cand-1",
                    "name": "Alexei Morozov",
                    "school": "Carnegie Mellon • Robotics Ph.D.",
                    "badge": "Top 1%",
                    "avatar": "/assets/asset_06_50dd1fcd27.png",
                    "project_name": "Autonomous Drone Swarm",
                    "project_summary": "Implemented zero-copy CUDA IPC with TensorRT-LLM on Jetson Orin Nano for sub-8ms perception pipelines.",
                    "skills": ["C++20", "CUDA 12", "ROS2 Humble", "TensorRT"],
                    "score": "98.4/100"
                },
                {
                    "id": "cand-2",
                    "name": "Mei-Ling Zhou",
                    "school": "Stanford • Computer Vision M.S.",
                    "badge": "Top 2%",
                    "avatar": "/assets/asset_04_73392dcdf2.png",
                    "project_name": "Neural Radiance SLAM",
                    "project_summary": "Real-time 3D Gaussian Splatting optimization running on embedded mobile GPUs with custom fp16 kernels.",
                    "skills": ["PyTorch", "CUDA", "C++20", "Triton Inference"],
                    "score": "96.8/100"
                },
                {
                    "id": "cand-3",
                    "name": "Tariq Mansoor",
                    "school": "UC Berkeley • EECS B.S.",
                    "badge": "Top 3%",
                    "avatar": "/assets/asset_10_75d2ce55a1.png",
                    "project_name": "Event-Camera High-Speed Tracker",
                    "project_summary": "Sub-millisecond optical flow on neuromorphic event-based camera data fused with IMU on ARM Cortex.",
                    "skills": ["C++20", "ROS2", "Embedded Linux", "CUDA"],
                    "score": "95.2/100"
                }
            ]
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

db = StateStore()

