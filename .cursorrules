# HackOS — AI Agent Development & Boundary Rules

You are working on HackOS, an AI Hackathon & Tech Event Intelligence Platform (PS 27).
The codebase follows a locked shared core architecture with 4 strictly isolated vertical feature modules.

## 1. Strict Boundary Rules
- **ONLY create or modify files inside your assigned vertical feature folders:**
  - Person 1 (Side A): `frontend/src/features/participant-teams/` & `backend/features/participant_teams/`
  - Person 2 (Side A): `frontend/src/features/participant-hub/` & `backend/features/participant_hub/`
  - Person 3 (Side B): `frontend/src/features/organizer-ops/` & `backend/features/organizer_ops/`
  - Person 4 (Side B): `frontend/src/features/sponsor-intel/` & `backend/features/sponsor_intel/`
- **FORBIDDEN FILES (DO NOT MODIFY WITHOUT TEAM APPROVAL):**
  - `frontend/src/App.tsx`
  - `frontend/src/components/Navbar.tsx`
  - `frontend/src/lib/*` (`api.ts`, `auth.tsx`, `types.ts`, etc.)
  - `backend/core/*` (`db.py`, `models.py`, `auth.py`, `llm.py`, etc.)
  - `backend/main.py`

## 2. Database Schema Extension Rules
- **DO NOT ALTER CORE TABLE SCHEMAS.**
- Store any new feature-specific fields inside the `metadata_json` JSON column provided on all core SQLAlchemy models (`User`, `Event`, `Team`, `Submission`, `Score`).
- Example: Store team skills, AI match scores, audit results, sponsor tags inside `metadata_json`.

## 3. Frontend Standards
- ALWAYS use `useUser()` from `@/lib/auth` for current user information and active role state.
- ALWAYS use the typed `api` client from `@/lib/api` for all backend requests. It automatically injects the active demo role via the `X-Demo-Role` header.
- Use Tailwind CSS and Lucide React icons for all UI components.
- Maintain dark-mode consistent aesthetics across all feature modules.

## 4. Backend Standards
- Create endpoints using FastAPI's `APIRouter` inside your feature's `router.py`.
- Inject the current user using `Depends(get_current_user)` from `core.auth`.
- Access the database session using `Depends(get_db)` from `core.db`.
- For AI/LLM operations, call `ask_llm(prompt, system_prompt)` from `core.llm`.

