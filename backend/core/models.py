from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from core.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    role = Column(String(50), nullable=False, default="participant")
    created_at = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(JSON, default=dict)


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, default="")
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    phase = Column(String(50), default="registration")
    metadata_json = Column(JSON, default=dict)


class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    leader_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(JSON, default=dict)


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    title = Column(String(200), nullable=False)
    repo_url = Column(String(500), default="")
    demo_url = Column(String(500), default="")
    description = Column(Text, default="")
    submitted_at = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(JSON, default=dict)


class Score(Base):
    __tablename__ = "scores"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"), nullable=False)
    judge_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    score = Column(Float, nullable=False, default=0.0)
    feedback = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(JSON, default=dict)

