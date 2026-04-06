# database.py
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

if not MONGODB_URL:
    raise RuntimeError("MONGODB_URL not found in environment variables. Please check your .env file.")
if not DATABASE_NAME:
    raise RuntimeError("DATABASE_NAME not found in environment variables. Please check your .env file.")

client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

# ── Collections ───────────────────────────────────────────────────────────────
users_collection         = db["user"]
scan_reports_collection  = db["scan_report"]
diff_reports_collection  = db["diff_report"]
vulnerabilities_collection = db["vulnerability"]


# ── Pydantic Models ───────────────────────────────────────────────────────────

class UserModel(BaseModel):
    email: str
    password_hash: str
    full_name: str
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ScanReportModel(BaseModel):
    user_email: str
    project_name: str
    scan_type: Optional[str] = "single"
    risk_score: Optional[int] = 0
    components: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class DiffReportModel(BaseModel):
    user_email: str
    project_name: str
    v1_score: Optional[int] = 0
    v2_score: Optional[int] = 0
    added: Optional[List[Dict[str, Any]]]    = Field(default_factory=list)
    removed: Optional[List[Dict[str, Any]]]  = Field(default_factory=list)
    updated: Optional[List[Dict[str, Any]]]  = Field(default_factory=list)
    v1_components: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    v2_components: Optional[List[Dict[str, Any]]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class VulnerabilityModel(BaseModel):
    name: str
    cve: str
    cvss: float
    severity: str
    explanation: str
    remediation: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ── Engine: unified motor wrapper matching odmantic call-sites ────────────────

class _Engine:
    """
    Thin wrapper around motor so that existing odmantic-style call-sites
    (engine.find, engine.find_one, engine.save, engine.delete, engine.count)
    keep working without changes in main.py / risk_engine.py.
    """

    # ── collection routing ────────────────────────────────────────────────────
    def _col(self, model_cls):
        mapping = {
            "ScanReport":    scan_reports_collection,
            "DiffReport":    diff_reports_collection,
            "Vulnerability": vulnerabilities_collection,
            "User":          users_collection,
        }
        return mapping[model_cls.__name__]

    # ── odmantic-style query helpers ──────────────────────────────────────────
    @staticmethod
    def _build_filter(expressions) -> dict:
        """
        Convert odmantic-style expressions such as
            ScanReport.user_email == email
            ScanReport.id == ObjectId(report_id)
        into plain motor filter dicts.
        Each expression is a (_QueryExpression | dict).
        """
        if not expressions:
            return {}
        merged = {}
        for expr in expressions:
            if isinstance(expr, dict):
                merged.update(expr)
            elif hasattr(expr, "__dict__"):
                merged.update(vars(expr))
        return merged

    # ── public API ────────────────────────────────────────────────────────────
    async def find(self, model_cls, *expressions, sort=None, limit: int = 0):
        col = self._col(model_cls)
        filt = _Engine._build_filter(expressions)
        cursor = col.find(filt)
        if sort:
            cursor = cursor.sort(sort)
        if limit:
            cursor = cursor.limit(limit)
        docs = await cursor.to_list(length=limit or None)
        return [_DocProxy(d) for d in docs]

    async def find_one(self, model_cls, *expressions):
        col = self._col(model_cls)
        filt = _Engine._build_filter(expressions)
        doc = await col.find_one(filt)
        return _DocProxy(doc) if doc else None

    async def save(self, instance):
        """
        Accepts either a _DocProxy (returned by find/find_one) or
        a plain dict-like object created via ScanReport(**data) etc.
        """
        if isinstance(instance, _DocProxy):
            col = self._col(instance._model_cls) if instance._model_cls else None
            data = instance._data.copy()
            _id = data.pop("_id", None)
            if col is None:
                raise ValueError("Cannot save _DocProxy without _model_cls")
            if _id:
                await col.replace_one({"_id": _id}, {"_id": _id, **data}, upsert=True)
                instance._data["_id"] = _id
            else:
                result = await col.insert_one(data)
                instance._data["_id"] = result.inserted_id
            return instance

        if isinstance(instance, _ModelInstance):
            col = self._col(instance.__class__)
            data = instance._to_dict()
            _id = data.pop("_id", None)
            if _id:
                await col.replace_one({"_id": _id}, {"_id": _id, **data}, upsert=True)
                instance._id = _id
            else:
                result = await col.insert_one(data)
                instance._id = result.inserted_id
            return instance

        raise TypeError(f"engine.save() does not support type {type(instance)}")

    async def delete(self, instance):
        if isinstance(instance, _DocProxy):
            col = self._col(instance._model_cls)
            await col.delete_one({"_id": instance._data["_id"]})
        elif isinstance(instance, _ModelInstance):
            col = self._col(instance.__class__)
            await col.delete_one({"_id": instance._id})
        else:
            raise TypeError(f"engine.delete() does not support type {type(instance)}")

    async def count(self, model_cls, *expressions):
        col = self._col(model_cls)
        filt = _Engine._build_filter(expressions)
        return await col.count_documents(filt)

    # motor client passthrough (used in startup ping)
    @property
    def client(self):
        return client


# ── Proxy returned by find / find_one ────────────────────────────────────────

class _DocProxy:
    """Wraps a raw mongo dict and exposes fields as attributes (like odmantic instances)."""

    def __init__(self, data: dict, model_cls=None):
        object.__setattr__(self, "_data", data or {})
        object.__setattr__(self, "_model_cls", model_cls)

    def __getattr__(self, name):
        data = object.__getattribute__(self, "_data")
        if name == "id":
            return data.get("_id")
        if name in data:
            return data[name]
        raise AttributeError(f"_DocProxy has no attribute '{name}'")

    def __setattr__(self, name, value):
        if name in ("_data", "_model_cls"):
            object.__setattr__(self, name, value)
        else:
            self._data[name] = value


# ── Model instances created via ScanReport(**data), Vulnerability(**data) etc ─

class _ModelInstance:
    """
    Base for the model shim classes below.
    Stores field values and exposes .id after engine.save().
    """
    _fields: tuple = ()

    def __init__(self, **kwargs):
        self._id = None
        for f in self._fields:
            setattr(self, f, kwargs.get(f))

    def _to_dict(self) -> dict:
        d = {}
        if self._id:
            d["_id"] = self._id
        for f in self._fields:
            d[f] = getattr(self, f)
        return d

    @property
    def id(self):
        return self._id


# ── Query expression helpers (mimic odmantic Model.field == value) ────────────

class _FieldExpr:
    def __init__(self, field_name: str):
        self._field = field_name

    def __eq__(self, other):
        key = "_id" if self._field == "id" else self._field
        return {key: other}

    def __ne__(self, other):
        return {self._field: {"$ne": other}}


class _ModelMeta(type):
    """Metaclass that returns _FieldExpr when accessing class attributes."""
    def __getattr__(cls, name):
        return _FieldExpr(name)


# ── Concrete model shims ──────────────────────────────────────────────────────

class ScanReport(_ModelInstance, metaclass=_ModelMeta):
    _fields = ("user_email", "project_name", "scan_type", "risk_score",
                "components", "created_at")

    def __init__(self, **kwargs):
        kwargs.setdefault("scan_type", "single")
        kwargs.setdefault("risk_score", 0)
        kwargs.setdefault("components", [])
        kwargs.setdefault("created_at", datetime.utcnow())
        super().__init__(**kwargs)


class DiffReport(_ModelInstance, metaclass=_ModelMeta):
    _fields = ("user_email", "project_name", "v1_score", "v2_score",
                "added", "removed", "updated",
                "v1_components", "v2_components", "created_at")

    def __init__(self, **kwargs):
        kwargs.setdefault("v1_score", 0)
        kwargs.setdefault("v2_score", 0)
        for f in ("added", "removed", "updated", "v1_components", "v2_components"):
            kwargs.setdefault(f, [])
        kwargs.setdefault("created_at", datetime.utcnow())
        super().__init__(**kwargs)


class Vulnerability(_ModelInstance, metaclass=_ModelMeta):
    _fields = ("name", "cve", "cvss", "severity", "explanation",
                "remediation", "created_at")

    def __init__(self, **kwargs):
        kwargs.setdefault("created_at", datetime.utcnow())
        super().__init__(**kwargs)


class User(_ModelInstance, metaclass=_ModelMeta):
    _fields = ("email", "password_hash", "full_name", "avatar_url", "created_at")

    def __init__(self, **kwargs):
        kwargs.setdefault("created_at", datetime.utcnow())
        super().__init__(**kwargs)


# ── Singleton engine instance ─────────────────────────────────────────────────
engine = _Engine()


async def get_engine():
    return engine