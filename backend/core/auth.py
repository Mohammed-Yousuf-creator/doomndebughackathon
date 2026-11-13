from typing import Optional, Dict, Any
from fastapi import Header
from pydantic import BaseModel


class DemoUser(BaseModel):
    id: int
    name: str
    email: str
    role: str
    metadata_json: Dict[str, Any] = {}


DEMO_USERS: Dict[str, DemoUser] = {
    "participant": DemoUser(
        id=1,
        name="Alex Rivera",
        email="alex@participant.hackos",
        role="participant",
        metadata_json={"skills": ["React", "TypeScript", "Python"], "team_id": None}
    ),
    "organizer": DemoUser(
        id=2,
        name="Jordan Lee",
        email="jordan@organizer.hackos",
        role="organizer",
        metadata_json={"permissions": ["admin", "events", "judging"]}
    ),
    "judge": DemoUser(
        id=3,
        name="Dr. Sarah Chen",
        email="sarah@judge.hackos",
        role="judge",
        metadata_json={"track": "AI & Systems"}
    ),
    "sponsor": DemoUser(
        id=4,
        name="Marcus Vance",
        email="marcus@sponsor.hackos",
        role="sponsor",
        metadata_json={"company": "VentureAI Labs"}
    ),
}


async def get_current_user(
    x_demo_role: Optional[str] = Header(default="participant", alias="X-Demo-Role")
) -> DemoUser:
    """
    FastAPI dependency that reads the 'X-Demo-Role' header (defaults to 'participant')
    and returns a seeded user object so all 4 teammates can test endpoints without auth blockers.
    """
    role = (x_demo_role or "participant").lower().strip()
    if role in DEMO_USERS:
        return DEMO_USERS[role]
    return DemoUser(
        id=99,
        name=f"Demo {role.capitalize()} User",
        email=f"{role}@hackos.dev",
        role=role,
        metadata_json={}
    )

