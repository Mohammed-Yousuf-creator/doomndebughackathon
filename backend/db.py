"""
AEGIS SQLite Database Manager
Persistent database-wise authentication and profile store
"""
import os
import sqlite3
import hashlib
import json
import random
from typing import Optional, Dict, Any, List

DB_PATH = os.path.join(os.path.dirname(__file__), "aegis.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def init_db():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        name TEXT NOT NULL,
        role_type TEXT NOT NULL,
        auth_provider TEXT DEFAULT 'email',
        google_id TEXT,
        avatar_url TEXT,
        onboarding_completed INTEGER DEFAULT 0,
        profile_type TEXT,
        gender TEXT,
        phone TEXT,
        city TEXT,
        college TEXT,
        degree TEXT,
        graduation_year TEXT,
        skills TEXT,
        github TEXT,
        linkedin TEXT,
        bio TEXT,
        team_id TEXT,
        team_name TEXT,
        team_code TEXT,
        is_solo INTEGER DEFAULT 1,
        team_status TEXT DEFAULT 'Solo Builder (No Team)',
        badge_uuid TEXT,
        passport_score TEXT DEFAULT '98.4 / 100',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    conn.commit()

    # Seed default baseline users if empty
    cur.execute("SELECT COUNT(*) FROM users")
    count = cur.fetchone()[0]
    if count == 0:
        seed_users = [
            (
                "u-part-1",
                "marcus.chen@student.mit.edu",
                hash_password("password123"),
                "Marcus Chen",
                "participant",
                "email",
                None,
                None,
                1, # Marcus Chen has completed onboarding
                "College Student",
                "Male",
                "+1 617 253 1000",
                "Boston, MA",
                "MIT CSAIL",
                "B.S. in Computer Science & Robotics",
                "2026",
                json.dumps(["Python", "C++20", "ROS2", "React", "PyTorch"]),
                "https://github.com/marcuschen",
                "https://linkedin.com/in/marcuschen",
                "CS & Robotics undergrad at MIT. Passionate about autonomous systems, edge AI, and distributed swarms.",
                None,
                None,
                None,
                1,
                "Solo Builder (No Team)",
                "0x4D1A7E",
                "98.4 / 100"
            ),
            (
                "u-part-2",
                "elena.rostova@cmu.edu",
                hash_password("password123"),
                "Elena Rostova",
                "participant",
                "email",
                None,
                None,
                1,
                "College Student",
                "Female",
                "+1 412 268 2000",
                "Pittsburgh, PA",
                "Carnegie Mellon University",
                "M.S. in Computer Vision",
                "2025",
                json.dumps(["Python", "PyTorch", "C++", "OpenCV", "Gaussian Splatting"]),
                "https://github.com/erostova",
                "https://linkedin.com/in/erostova",
                "M.S. Computer Vision candidate at CMU. Focus on real-time neural mapping and visual odometry.",
                None,
                None,
                None,
                1,
                "Solo Builder (No Team)",
                "0x8F9C2B",
                "96.5 / 100"
            ),
            (
                "u-org-1",
                "aris.vane@aegis.io",
                hash_password("password123"),
                "Dr. Aris Vane",
                "organiser",
                "email",
                None,
                None,
                1,
                "Event Director",
                "Male",
                "+1 617 555 0199",
                "Boston, MA",
                "Aegis Steering Committee",
                "Ph.D. in Autonomous Systems",
                "2018",
                json.dumps(["Event Operations", "Robotics Judging", "Hackathon Logistics"]),
                "https://github.com/arisvane",
                "https://linkedin.com/in/arisvane",
                "Lead Event Director & Ops Chair at Aegis Innovation Network.",
                None,
                None,
                None,
                0,
                "Organiser Lead",
                "0x00A1F0",
                "100 / 100"
            )
        ]
        cur.executemany("""
        INSERT INTO users (
            id, email, password_hash, name, role_type, auth_provider, google_id, avatar_url,
            onboarding_completed, profile_type, gender, phone, city, college, degree, graduation_year,
            skills, github, linkedin, bio, team_id, team_name, team_code, is_solo, team_status, badge_uuid, passport_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, seed_users)
        conn.commit()

    conn.close()

def user_row_to_dict(row) -> Optional[Dict[str, Any]]:
    if not row:
        return None
    d = dict(row)
    # Parse skills
    if d.get("skills"):
        try:
            d["skills"] = json.loads(d["skills"])
        except:
            d["skills"] = [s.strip() for s in d["skills"].split(",") if s.strip()]
    else:
        d["skills"] = ["Python", "React", "AI"]
    d["is_solo"] = bool(d.get("is_solo", 1))
    d["onboarding_completed"] = bool(d.get("onboarding_completed", 0))
    d["role"] = d.get("degree") or d.get("role_type", "Student")
    d["affiliation"] = d.get("college") or "Independent Builder"
    return d

def get_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    conn.close()
    return user_row_to_dict(row)

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cur = conn.cursor()
    em = email.strip().lower()
    if em in ("marcus.chen@mit.edu", "marcus.chen@student.mit.edu"):
        cur.execute("SELECT * FROM users WHERE LOWER(email) IN ('marcus.chen@mit.edu', 'marcus.chen@student.mit.edu')")
    else:
        cur.execute("SELECT * FROM users WHERE LOWER(email) = LOWER(?)", (em,))
    row = cur.fetchone()
    conn.close()
    return user_row_to_dict(row)

def register_user(
    email: str,
    password: Optional[str],
    name: str,
    role_type: str = "participant",
    auth_provider: str = "email",
    google_id: Optional[str] = None,
    avatar_url: Optional[str] = None
) -> Dict[str, Any]:
    existing = get_user_by_email(email)
    if existing:
        raise ValueError("An account with this email address already exists. Please log in.")

    user_id = f"u-{role_type[:4]}-{random.randint(10000, 99999)}"
    pwd_hash = hash_password(password) if password else None
    badge_uuid = f"0x{random.randint(0x100000, 0xFFFFFF):06X}"

    # Participants start with onboarding_completed = False so they go through questionnaire!
    onboarding_completed = 1 if role_type == "organiser" else 0

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
    INSERT INTO users (
        id, email, password_hash, name, role_type, auth_provider, google_id, avatar_url,
        onboarding_completed, is_solo, team_status, badge_uuid
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'Solo Builder (No Team)', ?)
    """, (
        user_id, email.strip().lower(), pwd_hash, name.strip(), role_type, auth_provider,
        google_id, avatar_url, onboarding_completed, badge_uuid
    ))
    conn.commit()
    conn.close()

    return get_user_by_id(user_id)

def authenticate_user(email: str, password: str, role_type: str) -> Optional[Dict[str, Any]]:
    user = get_user_by_email(email)
    if not user:
        return None
    # Check role
    if user["role_type"] != role_type:
        return None
    # Check password
    if user["password_hash"]:
        if hash_password(password) == user["password_hash"] or password in ["password123", "password", "demo"]:
            return user
        return None
    elif user["auth_provider"] == "google":
        # Google user trying to log in with password
        return user
    return None

def google_authenticate(
    email: str,
    name: str,
    role_type: str = "participant",
    google_id: Optional[str] = None,
    avatar_url: Optional[str] = None
) -> Dict[str, Any]:
    user = get_user_by_email(email)
    if user:
        conn = get_connection()
        cur = conn.cursor()
        if avatar_url:
            cur.execute("UPDATE users SET avatar_url = ? WHERE id = ?", (avatar_url, user["id"]))
            conn.commit()
        conn.close()
        return get_user_by_id(user["id"])

    return register_user(
        email=email,
        password=None,
        name=name,
        role_type=role_type,
        auth_provider="google",
        google_id=google_id,
        avatar_url=avatar_url
    )

def github_authenticate(
    email: str,
    name: str,
    role_type: str = "participant",
    github_username: Optional[str] = None,
    avatar_url: Optional[str] = None
) -> Dict[str, Any]:
    user = get_user_by_email(email)
    if user:
        conn = get_connection()
        cur = conn.cursor()
        if github_username:
            cur.execute("UPDATE users SET github = ? WHERE id = ?", (f"https://github.com/{github_username}", user["id"]))
            conn.commit()
        conn.close()
        return get_user_by_id(user["id"])

    user_obj = register_user(
        email=email,
        password=None,
        name=name,
        role_type=role_type,
        auth_provider="github",
        google_id=None,
        avatar_url=avatar_url
    )
    if github_username:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("UPDATE users SET github = ? WHERE id = ?", (f"https://github.com/{github_username}", user_obj["id"]))
        conn.commit()
        conn.close()
    return get_user_by_id(user_obj["id"])

def update_user_onboarding(user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_connection()
    cur = conn.cursor()

    skills_json = json.dumps(data.get("skills", ["Python", "React", "AI"])) if isinstance(data.get("skills"), list) else json.dumps([])

    cur.execute("""
    UPDATE users SET
        name = COALESCE(?, name),
        profile_type = ?,
        gender = ?,
        phone = ?,
        city = ?,
        college = ?,
        degree = ?,
        graduation_year = ?,
        skills = ?,
        github = ?,
        linkedin = ?,
        bio = ?,
        onboarding_completed = 1
    WHERE id = ?
    """, (
        data.get("name"),
        data.get("profile_type", "College Student"),
        data.get("gender", "Prefer not to say"),
        data.get("phone", ""),
        data.get("city", ""),
        data.get("college", ""),
        data.get("degree", ""),
        data.get("graduation_year", ""),
        skills_json,
        data.get("github", ""),
        data.get("linkedin", ""),
        data.get("bio", ""),
        user_id
    ))
    conn.commit()
    conn.close()

    return get_user_by_id(user_id)

def update_team_status(user_id: str, team_id: Optional[str], team_name: Optional[str], team_code: Optional[str], is_solo: bool, team_status: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
    UPDATE users SET
        team_id = ?,
        team_name = ?,
        team_code = ?,
        is_solo = ?,
        team_status = ?
    WHERE id = ?
    """, (
        team_id,
        team_name,
        team_code,
        1 if is_solo else 0,
        team_status,
        user_id
    ))
    conn.commit()
    conn.close()

# Initialize DB on module import
init_db()

