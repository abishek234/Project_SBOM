# migrate_passwords.py
import asyncio
from database import users_collection
from auth import otp_store, mail_config
from fastapi_mail import FastMail, MessageSchema, MessageType
from datetime import datetime, timedelta
import random

async def migrate_all_users():
    """
    Send password reset OTPs to all users with bcrypt hashes
    """
    # Find users with bcrypt hashes
    bcrypt_users = await users_collection.find(
        {"password_hash": {"$regex": "^\\$2[aby]\\$"}}
    ).to_list(length=None)
    
    if not bcrypt_users:
        print("✅ No users need migration!")
        return
    
    print(f"Found {len(bcrypt_users)} users with bcrypt hashes")
    
    fm = FastMail(mail_config)
    migrated_count = 0
    
    for user in bcrypt_users:
        email = user["email"]
        
        # Generate OTP
        otp = "".join([str(random.randint(0, 9)) for _ in range(6)])
        expiry = datetime.utcnow() + timedelta(hours=24)  # 24 hours for migration
        
        otp_store[email] = {"otp": otp, "expiry": expiry}
        
        # Send email
        message = MessageSchema(
            subject="🔐 Verix SBOM - Security Update: Password Reset Required",
            recipients=[email],
            body=f"""
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #0c0c1e; color: white; padding: 40px;">
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #F26A06; text-align: center;">Security Update</h1>
                        
                        <p style="color: #ccc; line-height: 1.6;">
                            Hello,<br><br>
                            We've upgraded our password security system to provide better protection for your account.
                            As part of this update, you need to reset your password.
                        </p>
                        
                        <p style="color: #ccc; line-height: 1.6;">
                            Use this One-Time Password (OTP) to reset your password:
                        </p>
                        
                        <div style="text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 10px; margin: 30px 0; color: #D10A8A; background: rgba(0,0,0,0.3); padding: 25px; border-radius: 10px;">
                            {otp}
                        </div>
                        
                        <p style="color: #ccc; line-height: 1.6;">
                            <strong>Steps to reset your password:</strong><br>
                            1. Go to the Verix SBOM login page<br>
                            2. Click "Forgot Password"<br>
                            3. Enter your email: <strong style="color: #F26A06;">{email}</strong><br>
                            4. Enter the OTP above<br>
                            5. Set your new password
                        </p>
                        
                        <p style="font-size: 12px; color: #666; margin-top: 30px; text-align: center;">
                            This OTP expires in 24 hours.<br>
                            If you didn't request this, please contact support immediately.
                        </p>
                        
                        <p style="font-size: 12px; color: #666; text-align: center; margin-top: 20px;">
                            — Verix Security Team
                        </p>
                    </div>
                </body>
            </html>
            """,
            subtype=MessageType.html
        )
        
        try:
            await fm.send_message(message)
            print(f"✅ Sent reset email to {email}")
            migrated_count += 1
        except Exception as e:
            print(f"❌ Failed to send to {email}: {e}")
            print(f"   Manual OTP for {email}: {otp}")
    
    print(f"\n✅ Migration complete! Sent {migrated_count}/{len(bcrypt_users)} emails")
    print(f"OTPs stored in memory - users have 24 hours to reset")

if __name__ == "__main__":
    asyncio.run(migrate_all_users())