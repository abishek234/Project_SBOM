from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
from database import engine, User
from jose import jwt
from datetime import datetime, timedelta
import random
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
import os

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory OTP store (email -> {otp, expiry})
otp_store = {}

SECRET_KEY = "verix-super-secret-key"
ALGORITHM = "HS256"

# Mail Configuration (Using placeholders - User should set these in env)
mail_config = ConnectionConfig(
    MAIL_USERNAME = "abishek.cs21@bitsathy.ac.in",
    MAIL_PASSWORD = "lbbwasevnnervutk",
    MAIL_FROM = "abishek.cs21@bitsathy.ac.in",
    MAIL_PORT = 587,
    MAIL_SERVER = "smtp.gmail.com",
    MAIL_STARTTLS = True,
    MAIL_SSL_TLS = False,
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True
)

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: str

class OTPRequest(BaseModel):
    email: str

class PasswordResetRequest(BaseModel):
    email: str
    otp: str
    new_password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/signup")
async def signup(req: SignupRequest):
    # Check existing
    existing = await engine.find_one(User, User.email == req.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed = pwd_context.hash(req.password)
    user = User(email=req.email, password_hash=hashed, full_name=req.full_name, avatar_url=f"https://api.dicebear.com/7.x/initials/svg?seed={req.full_name}")
    await engine.save(user)
    
    return {"message": "User created successfully"}

@router.post("/login")
async def login(req: LoginRequest):
    user = await engine.find_one(User, User.email == req.email)
    if not user or not pwd_context.verify(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    token = create_access_token({"sub": user.email})
    return {
        "access_token": token, 
        "token_type": "bearer",
        "user": {
            "email": user.email,
            "full_name": user.full_name,
            "avatar_url": user.avatar_url
        }
    }

@router.get("/profile/{email}")
async def get_profile(email: str):
    user = await engine.find_one(User, User.email == email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "email": user.email,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
        "created_at": user.created_at
    }

@router.post("/request-otp")
async def request_otp(req: OTPRequest):
    # Verify user exists
    user = await engine.find_one(User, User.email == req.email)
    if not user:
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
                    <div style="font-size: 32px; font-bold: true; letter-spacing: 10px; margin: 30px 0; color: #D10A8A; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px;">
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
        return {"message": "OTP sent to your email successfully"}
    except Exception as e:
        print(f"MAIL ERROR: {e}")
        # Fallback to console for demo if mail fails
        print(f"DEBUG: OTP for {req.email} is {otp}")
        return {"message": "OTP generated (Service limited, check console)", "debug_otp": otp}

@router.post("/reset-password")
async def reset_password_otp(req: PasswordResetRequest):
    if req.email not in otp_store:
        raise HTTPException(status_code=400, detail="No OTP requested for this email")
    
    stored = otp_store[req.email]
    if datetime.utcnow() > stored["expiry"]:
        del otp_store[req.email]
        raise HTTPException(status_code=400, detail="OTP expired")
    
    if req.otp != stored["otp"]:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # Update password
    user = await engine.find_one(User, User.email == req.email)
    if not user:
         raise HTTPException(status_code=404, detail="User unexpectedly not found")
    
    user.password_hash = pwd_context.hash(req.new_password)
    await engine.save(user)
    
    # Cleanup OTP
    del otp_store[req.email]
    
    return {"message": "Password updated successfully"}
