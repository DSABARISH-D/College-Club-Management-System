import sqlite3
import os

db_path = "d:/club manage ment system/backend/bit_clubs.db"

def migrate():
    print(f"Connecting to {db_path}...")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    migrations = [
        # clubs table
        "ALTER TABLE clubs ADD COLUMN coordinator_id VARCHAR(36);",
        "ALTER TABLE clubs ADD COLUMN is_active BOOLEAN DEFAULT 1;",
        
        # activities table
        "ALTER TABLE activities ADD COLUMN approval_status VARCHAR(50) NOT NULL DEFAULT 'APPROVED';",
        "ALTER TABLE activities ADD COLUMN approved_by VARCHAR(36);",
        "ALTER TABLE activities ADD COLUMN approved_at DATETIME;",
        "ALTER TABLE activities ADD COLUMN rejection_reason TEXT;",

        # announcements table
        "ALTER TABLE announcements ADD COLUMN approval_status VARCHAR(50) NOT NULL DEFAULT 'APPROVED';",
        "ALTER TABLE announcements ADD COLUMN approved_by VARCHAR(36);",
        "ALTER TABLE announcements ADD COLUMN approved_at DATETIME;",
        "ALTER TABLE announcements ADD COLUMN rejection_reason TEXT;",
    ]

    for q in migrations:
        try:
            cursor.execute(q)
            print(f"Executed: {q}")
        except Exception as e:
            print(f"Failed or already applied: {q}")
            print(f"Error: {e}")

    conn.commit()
    conn.close()
    print("Migration complete!")

if __name__ == "__main__":
    migrate()
