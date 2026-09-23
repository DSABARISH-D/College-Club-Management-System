import sqlite3
import os
import json
from datetime import datetime
from supabase import create_client, Client
from app.config import settings

def main():
    print("Starting migration to Supabase...")
    
    # Initialize Supabase client
    url: str = getattr(settings, "SUPABASE_URL", os.environ.get("SUPABASE_URL"))
    key: str = getattr(settings, "SUPABASE_SECRET_KEY", os.environ.get("SUPABASE_SECRET_KEY"))
    if not url or not key:
        print("Error: SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env")
        return
        
    supabase: Client = create_client(url, key)
    
    # Connect to SQLite
    db_path = "bit_clubs.db"
    if not os.path.exists(db_path):
        print(f"Error: Database {db_path} not found.")
        return
        
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    tables = [
        "users",
        "clubs",
        "club_memberships",
        "activities",
        "announcements",
        "club_posts"
    ]
    
    for table in tables:
        print(f"\nMigrating table: {table}")
        try:
            cursor.execute(f"SELECT * FROM {table}")
            rows = cursor.fetchall()
            
            if not rows:
                print(f"No data found in {table}, skipping.")
                continue
                
            data_to_insert = []
            for row in rows:
                row_dict = dict(row)
                data_to_insert.append(row_dict)
                
            # Supabase API limits batches, but for our scale, one batch per table is fine
            response = supabase.table(table).upsert(data_to_insert).execute()
            print(f"Successfully migrated {len(data_to_insert)} records to {table}")
            
        except sqlite3.OperationalError as e:
            print(f"Table {table} does not exist in SQLite: {e}")
        except Exception as e:
            print(f"Error migrating {table}: {e}")
            
    conn.close()
    print("\nMigration complete!")

if __name__ == "__main__":
    main()
