from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import Model, Field, AIOEngine
from typing import List, Optional, Dict, Any
from datetime import datetime

class User(Model):
    email: str = Field(unique=True)
    password_hash: str
    full_name: str
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ScanReport(Model):
    user_email: str
    project_name: str
    scan_type: Optional[str] = "single"
    risk_score: Optional[int] = 0
    components: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
class DiffReport(Model):
    user_email: str
    project_name: str
    v1_score: Optional[int] = 0
    v2_score: Optional[int] = 0
    added: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    removed: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    updated: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    v1_components: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    v2_components: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Vulnerability(Model):
    name: str = Field(index=True)
    cve: str
    cvss: float
    severity: str
    explanation: str
    remediation: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Database Connection
import os
from dotenv import load_dotenv

# Load from the root .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

if not MONGODB_URL:
    raise RuntimeError("MONGODB_URL not found in environment variables. Please check your .env file.")
if not DATABASE_NAME:
    raise RuntimeError("DATABASE_NAME not found in environment variables. Please check your .env file.")

client = AsyncIOMotorClient(MONGODB_URL)
engine = AIOEngine(client=client, database=DATABASE_NAME)


async def get_engine():
    return engine
