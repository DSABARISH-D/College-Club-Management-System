import sqlite3

def create_posts_table():
    conn = sqlite3.connect('bit_clubs.db')
    cursor = conn.cursor()
    
    print("Creating posts table...")
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(36) PRIMARY KEY,
        club_id VARCHAR(36) NOT NULL,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        image_url VARCHAR(500),
        approval_status VARCHAR(50) DEFAULT 'PENDING',
        approved_by VARCHAR(36),
        approved_at DATETIME,
        rejection_reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (club_id) REFERENCES clubs(id),
        FOREIGN KEY (approved_by) REFERENCES users(id)
    );
    """)
    
    conn.commit()
    conn.close()
    print("Successfully created posts table.")

if __name__ == "__main__":
    create_posts_table()
