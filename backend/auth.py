# auth.py - FIXED VERSION
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from database import engine, User, users_collection
from jose import jwt
from datetime import datetime, timedelta
import random
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

router = APIRouter()

# ✅ FIXED: Use Argon2 instead of bcrypt (no 72-byte limit, more secure)
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],  # Support both for migration
    deprecated="auto",
    argon2__memory_cost=65536,
    argon2__time_cost=3,
    argon2__parallelism=4,
)

# In-memory OTP store (email -> {otp, expiry})
otp_store = {}

SECRET_KEY = os.getenv("SECRET_KEY", "change-this-in-production-use-long-random-string")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Mail Configuration
mail_config = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True").lower() == "true",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False").lower() == "true",
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str


class OTPRequest(BaseModel):
    email: EmailStr


class PasswordResetRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/signup")
async def signup(req: SignupRequest):
    """Register a new user"""
    # Check if user exists
    existing = await users_collection.find_one({"email": req.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # ✅ Hash password with Argon2 (no truncation needed!)
    hashed = pwd_context.hash(req.password)
    
    user = User(
        email=req.email,
        password_hash=hashed,
        full_name=req.full_name,
        created_at=datetime.utcnow()
    )
    await engine.save(user)
    
    token = create_access_token({"sub": req.email})
    
    return {
        "status": "success",
        "token": token,
        "user": {
            "email": user.email,
            "full_name": user.full_name
        }
    }


@router.post("/login")
async def login(req: LoginRequest):
    """Login user"""
    # Find user
    user_doc = await users_collection.find_one({"email": req.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # ✅ Verify password with Argon2 (no truncation needed!)
    try:
        is_valid = pwd_context.verify(req.password, user_doc["password_hash"])
    except Exception as e:
        print(f"Password verification error: {e}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": req.email})
    
    return {
        "status": "success",
        "token": token,
        "user": {
            "email": user_doc["email"],
            "full_name": user_doc.get("full_name", ""),
            "avatar_url": user_doc.get("avatar_url", None)
        }
    }


@router.get("/profile/{email}")
async def get_profile(email: str):
    """Get user profile"""
    user_doc = await users_collection.find_one({"email": email})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "email": user_doc["email"],
        "full_name": user_doc.get("full_name", ""),
        "avatar_url": user_doc.get("avatar_url", None),
        "created_at": user_doc.get("created_at", datetime.utcnow()).isoformat()
    }


@router.post("/request-otp")
async def request_otp(req: OTPRequest):
    """Request OTP for password reset"""
    # Verify user exists
    user_doc = await users_collection.find_one({"email": req.email})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate 6-digit OTP
    otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
    expiry = datetime.utcnow() + timedelta(minutes=10)
    
    otp_store[req.email] = {"otp": otp, "expiry": expiry}
    
    # Send Email
    message = MessageSchema(
        subject="Verix SBOM - Password Reset OTP",
        recipients=[req.email],
        body=f"""
        <html>
            <body style="font-family: Arial, sans-serif; background-color: #0c0c1e; color: white; padding: 40px; text-align: center;">
                <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 40px;">
                    <h1 style="color: #F26A06;">Verix Security</h1>
                    <p style="color: #ccc;">You requested a password reset. Use the code below to verify your identity:</p>
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 10px; margin: 30px 0; color: #D10A8A; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px;">
                        {otp}
                    </div>
                    <p style="font-size: 12px; color: #666;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
                </div>
            </body>
        </html>
        """,
        subtype=MessageType.html
    )

    fm = FastMail(mail_config)
    try:
        await fm.send_message(message)
        return {"status": "success", "message": "OTP sent to your email"}
    except Exception as e:
        print(f"❌ MAIL ERROR: {e}")
        # Fallback to console for demo if mail fails
        print(f"🔐 DEBUG OTP for {req.email}: {otp}")
        return {
            "status": "success",
            "message": "OTP generated (check server logs)",
            "debug_otp": otp if os.getenv("DEBUG") == "true" else None
        }


@router.post("/reset-password")
async def reset_password_otp(req: PasswordResetRequest):
    """Reset password using OTP"""
    if req.email not in otp_store:
        raise HTTPException(status_code=400, detail="No OTP requested for this email")
    
    stored = otp_store[req.email]
    if datetime.utcnow() > stored["expiry"]:
        del otp_store[req.email]
        raise HTTPException(status_code=400, detail="OTP expired")
    
    if req.otp != stored["otp"]:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Update password with Argon2
    hashed = pwd_context.hash(req.new_password)
    
    result = await users_collection.update_one(
        {"email": req.email},
        {"$set": {"password_hash": hashed}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Cleanup OTP
    del otp_store[req.email]
    
    return {"status": "success", "message": "Password updated successfully"}