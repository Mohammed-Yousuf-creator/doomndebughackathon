# AEGIS OS — Forge Innovation Network

**AEGIS OS** (Autonomous Hackathon Operating Infrastructure) is a full-stack web application built with **React** and **FastAPI**, converted from the **Forge Innovation Network** project on Google Stitch (Project ID: `15818413402992954506`).

---

## 🚀 Live Demo & Starting the Application

The FastAPI backend serves both the interactive REST APIs, WebSockets, and the optimized production React SPA.

### Quick Start (Single Command):
```bash
python run_server.py
```
Or on Windows:
```cmd
start.bat
```
Then open your browser to **[http://localhost:8000](http://localhost:8000)**.

---

## 🏛️ Architecture & System Modules

AEGIS OS unifies all 4 screens from the Stitch design into an aesthetic, cohesive operating system with seamless navigation:

```
                          ┌──────────────────────────┐
                          │   AEGIS OS Top Navbar    │
                          │   Live Telemetry & Auth  │
                          └─────────────┬────────────┘
                                        │
        ┌───────────────────┬───────────┴───────────┬───────────────────┐
        ▼                   ▼                       ▼                   ▼
┌───────────────┐   ┌───────────────┐       ┌───────────────┐   ┌───────────────┐
│ Ops Console   │   │ Team War Room │       │ Judge Console │   │ Sponsor Node  │
│ (Live Ops &   │   │ (Engineering  │       │ (Double-Blind │   │ (Marketplace  │
│  Turnout)     │   │  Kanban/Logs) │       │  Rubric Eval) │   │  & Talent)    │
└───────────────┘   └───────────────┘       └───────────────┘   └───────────────┘
```

### 1. Organizer Command Center & Live Ops (`/ops`)
- **Stitch Screen**: `5d6e2db3ed354161a21855d620a0fc51`
- **Features**:
  - **Cluster Node Status**: MIT-CSAIL-RBL-04, 0.14s latency telemetry sync.
  - **Operations Command Bar**: Live master clock, active sprint phase beacon, ID `MIT-2025-AUTONOMY`.
  - **4 Live KPI Cards**: Attendance & Turnout (1,420/1,500, 94.6%), Active Teams & Synced Repos (348 teams, 89.6% sync), Volunteer/Mentor Fleet, Compute & Jetson AGX Kit Reserves (128/140 checked out).
  - **Run-of-Show Timetable**: Live chronological stages with active workshop status and attendee counters.
  - **Code & Integrity Telemetry**: GitHub enterprise webhook sync (2,491 events), AST Plagiarism Scanner, Docker build runners (100% pass), and cluster CPU/RAM monitoring.
  - **Live Check-in & Station Distribution**: Real-time participant search and **Fast Manual Scan** modal that dynamically registers attendees and issues hardware kit loans.
  - **Mentor & Help Queue**: Real-time tickets with urgency status pills, wait times, and one-click mentor assignment.
  - **Actions**: Real CSV roll call export download, system-wide broadcast modal, and emergency alert dispatch.

### 2. Team War Room & Engineering Bench (`/war-room`)
- **Stitch Screen**: `2e7ef39ec1064982927451145f1755f9`
- **Features**:
  - **Team VectorSwarm**: Track 04 Swarm Intelligence, Workspace `VS-9920-ALPHA`, Bench Verified status.
  - **Unit Roster**: Marcus Chen (Lead), Sofia Ramos (ROS2), Devansh Kulkarni (ML), Ananya Patel (Integrator), with live active beacons and `+ Invite Teammate` modal.
  - **Live Sprint Countdown**: Real-time timer counting down to Evaluation Wave 03.
  - **Interactive Kanban Board**: Backlog, In Progress, Under Review, Deployed/Done columns with real-time task creation and stage progression.
  - **Orin Edge Compute Telemetry**: Temperature sensor (39.4°C), animated SVG sparklines for NPU load (84.2%), VRAM allocation (6.8/8GB), and sync jitter (1.82ms).
  - **Mission Log & Collaboration Channel**: Pinned architectural consensus (ADR-004), formatted C++20 / Python code blocks, git merge alerts, and audio huddle indicator.
  - **AEGIS Synthesizer AI Copilot**: Type `@AEGIS Synthesizer` or ask questions in chat to receive instant edge AI & ROS2 middleware tuning advisories with drop-in code snippets.
  - **Sprint Deliverables Checklist**: Interactive task completion ledger.

### 3. Judge Evaluation Console (`/judge`)
- **Stitch Screen**: `60cea297854a4c42b12d99d0a4365524`
- **Features**:
  - **Juror Context**: Dr. Aris Thome, Track 01 Multi-Agent Perception & Edge Robotics, Double-Blind Protocol Lock active.
  - **Jury Quota Tracker**: Progress indicator tracking reviewed submissions.
  - **Submission Inspector**:
    - **Video Demonstration Player**: 4K 60FPS telemetry replay with seekable timestamp chapters (01:15 Live Hardware Test, 03:20 Failure Edge Cases).
    - **Pitch Deck Viewer**: Interactive 10-slide deck navigator with Previous/Next and Zoom controls.
    - **Architecture & Tech Stack**: High-resolution systems diagram and component badges (Jetson Orin Nano, ROS2 Humble, CUDA C++, Zenoh P2P).
    - **Automated Verification Protocol**: Build pass token, one-click commit hash copy (`#d9e14a`), Docker SLA benchmark (11.4ms), 98.4% unit test pass rate, and expandable log stream modal.
  - **Weighted Scoring Rubric Matrix**:
    - 5 interactive range sliders (Technical Rigor 30%, Algorithmic Novelty 25%, Real-World Edge Performance 20%, Documentation 15%, Track Alignment 10%).
    - Live recalculation of cumulative composite score (e.g. 88.5 / 100) and track percentile tier.
    - Private Jury Deliberation Notes (internal only) and Participant Feedback fields.
    - One-click "Submit Evaluation & Advance" and "Save Evaluation Draft" buttons.

### 4. Sponsorship Marketplace & Partner Portal (`/sponsor`)
- **Stitch Screen**: `f9b179d4a29a47469c4db90c5b43567f`
- **Features**:
  - **Title Partner**: NVIDIA Inception & Edge AI Lab, Pier 48 + Virtual Stream.
  - **Telemetry Snapshot**: Booth Foot Traffic (840/1,000 badges, +18%), SDK/API Ingestion (312 teams), Talent Pipeline (142 leads), Deliverable Fulfillment (80%).
  - **Deliverables & Activation Table**: Keynote slot, custom workshop, hardware loan desk, $25k sponsored bounties, double-blind judging seat with audit hashes (`TX-091A8`, `LIVE TELEMETRY`, `ESCROW-LOCKED`).
  - **AEGIS Sponsorship Marketplace**:
    - Global Climate Compute Sprint ($35,000, 2,800 Devs)
    - Next-Gen BioCompute Hackathon ($20,000, 450 Fellows)
    - Decentralized Infrastructure Challenge ($15,000, 1,600 Devs)
    - Custom proposal modal to submit new sponsorship packages.
  - **Verified Talent Discovery & Candidate Pipeline**:
    - Real-time multi-skill filters (CUDA, TensorRT, C++20, ROS2, PyTorch, Triton Inference).
    - Live text search across candidate names, universities, and project descriptions.
    - Candidate dossiers with scores, avatars, and one-click **Request Interview** invitation dispatch.

---

## 🎨 Aesthetic & Design Enhancements

The application preserves the exact design tokens and typography from the original Stitch project while modernizing the interactivity:
- **Color Palette**: Deep Forest Emerald (`#0f412e`, `#2a5944`, `#bbeed2`), Warm Terracotta Amber (`#924b1c`, `#ffa26c`, `#ffdbc9`), and Warm Off-White / Ivory Canvas (`#fafaf3`, `#f4f4ed`, `#eeeee7`).
- **Typography**: Crisp dual pairing of **Geist** (editorial sans-serif) and **JetBrains Mono** (cyber-industrial telemetry and monospace stats).
- **Micro-interactions**: Animated ping beacons, live pulse rings on online units, smooth slider recalibrations, and toast notification banners.
- **WebSocket Telemetry**: Background WebSocket stream continuously pushes live jitter, NPU load, and temperature variations.
- **Perspective Switcher**: Top-right profile menu allows seamless toggling between Organizer Lead, Builder Lead, Judge, and Sponsor perspectives.

---

## 📁 Project Structure

```
doomsday_hack/
├── backend/
│   ├── __init__.py
│   ├── main.py               # FastAPI application, REST endpoints, WebSocket
│   └── data.py               # In-memory reactive state database & seed data
├── frontend/
│   ├── public/
│   │   └── assets/           # Downloaded image assets, logos, and diagrams
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Master app navigation & perspective switch
│   │   │   ├── OrganizerConsole.jsx  # Screen 1: Command Center & Live Ops
│   │   │   ├── WarRoom.jsx           # Screen 2: Team War Room & Kanban
│   │   │   ├── JudgeConsole.jsx      # Screen 3: Judge Evaluation Console
│   │   │   ├── SponsorPortal.jsx     # Screen 4: Sponsorship Marketplace & Talent
│   │   │   └── Modals.jsx            # Interactive dialogs & toast alerts
│   │   ├── api.js            # Frontend REST client
│   │   ├── App.jsx           # Master state & route coordinator
│   │   ├── main.jsx          # React DOM entry
│   │   └── index.css         # Tailwind & custom scrollbar styles
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
├── downloaded_assets/        # Original downloaded high-res assets from Stitch
├── stitch_screenshots/       # Original Stitch screen PNGs
├── stitch_source/            # Original Stitch HTML source files
├── run_server.py             # Server launcher script
├── start.bat                 # Windows CMD launcher
└── start.ps1                 # Windows PowerShell launcher
```

---

## 🛠️ Development Mode (Optional)

If modifying frontend React components with instant hot module reloading:

1. **Start FastAPI Backend**:
   ```bash
   python -m uvicorn backend.main:app --port 8000 --reload
   ```
2. **Start Vite Dev Server**:
   ```bash
   cd frontend
   npm run dev
   ```
   Open `http://localhost:5173`.

