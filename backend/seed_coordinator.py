import sqlite3
import os
import bcrypt
import uuid
from datetime import datetime

db_path = "d:/club manage ment system/backend/bit_clubs.db"

def hash_password(password: str) -> str:
    # Use bcrypt to hash the password
    salt = bcrypt.gensalt()
    pwd_bytes = password.encode('utf-8')
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def seed_coordinator():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    email = "coordinator@bit.edu"
    password = "coordinator123"
    
    # Check if exists
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    
    if user:
        user_id = user[0]
        print(f"Coordinator already exists with id {user_id}")
    else:
        user_id = str(uuid.uuid4())
        hashed = hash_password(password)
        now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        
        cursor.execute("""
            INSERT INTO users (id, email, password_hash, full_name, roll_number, department, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (user_id, email, hashed, "System Coordinator", "COORD001", "ADMIN", "CLUB_COORDINATOR", now, now))
        
        print(f"Created coordinator user: {email} / {password}")

    # Set as coordinator for some clubs (e.g., Coding Club)
    cursor.execute("UPDATE clubs SET coordinator_id = ? WHERE slug = 'coding-club'", (user_id,))
    cursor.execute("UPDATE clubs SET coordinator_id = ? WHERE slug = 'robotics-club'", (user_id,))
    
    conn.commit()
    conn.close()
    print("Assigned to Coding Club and Robotics Club.")

if __name__ == "__main__":
    seed_coordinator()
