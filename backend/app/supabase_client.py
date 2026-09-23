import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_SECRET_KEY", "")

# Initialize the Supabase client
# You can import `supabase` from this module to interact with Supabase (Database, Auth, Storage)
supabase: Client = create_client(url, key) if url and key else None
