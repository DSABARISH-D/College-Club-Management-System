BIT Clubs & Communities
Discover • Connect • Participate

A full‑stack web application for managing university clubs, activities, announcements, and posts. It includes role‑based approval workflows for club coordinators and administrators, and now integrates with Supabase for storage and authentication.

Table of Contents
Project Overview
Tech Stack
Prerequisites
Setup (Backend)
Setup (Frontend)
Supabase Integration
Database Migration
Running the Application
API Docs
Testing
FAQ & Troubleshooting
License
Project Overview
The BIT Clubs & Communities platform enables:

Students to create and join clubs.
Club coordinators to submit activities, events, and announcements for approval.
Administrators to approve/reject submissions with optional rejection reasons.
Rich dashboards showing club analytics, member counts, and engagement metrics.
Note: Existing features (student workflows, dashboard UI, announcements, posts) remain untouched. The new Supabase integration adds a scalable backend while preserving the original SQLite‑based development flow.

Tech Stack
Layer	Technology
Backend	FastAPI, Pydantic, SQLAlchemy (SQLite) – now also Supabase Python client
Frontend	Vite + React (TypeScript), vanilla CSS
Database	SQLite (local dev) → Supabase PostgreSQL (production)
Auth	JWT (custom) – Supabase JWT/JWKS for optional migration
Deployment	uvicorn for API, Vite dev server for UI
Prerequisites
Python 3.12+ (virtual environment recommended)
Node.js 20+ with npm
Git (optional, for version control)
Supabase account – project created with URL, publishable key, secret key, and JWKS URL (already provided in .env)
SQLite comes bundled with Python – no extra install needed for local dev.
Setup – Backend
bash

# Clone the repo (if you haven't already)
git clone <repo-url>
cd "d:/club manage ment system/backend"
# Create & activate a virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
# Install dependencies
pip install -r requirements.txt
# Install Supabase client & PyJWT (already done by the script, but keep for reference)
pip install supabase PyJWT[crypto]
# Configure environment variables
cp .env.example .env   # copy template if exists
# Edit .env and ensure the following variables are set:
#   DATABASE_URL=sqlite:///./bit_clubs.db   (dev) or postgres://… (prod)
#   JWT_SECRET_KEY, JWT_ALGORITHM, JWT_ACCESS_TOKEN_EXPIRE_MINUTES, CORS_ORIGINS
#   SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SECRET_KEY, SUPABASE_JWKS_URL
# Run database migrations (initial SQLite schema)
python -c "import sqlite3, pathlib; con = sqlite3.connect('bit_clubs.db'); con.executescript(open('..\\database\\schema.sql').read()); con.commit()"
Setup – Frontend
bash

cd "d:/club manage ment system/frontend"
# Install dependencies
npm install
# Create a .env file for the Vite app (if not already present)
# Example variables (replace with your Supabase keys):
# VITE_SUPABASE_URL=<your‑supabase‑url>
# VITE_SUPABASE_PUBLISHABLE_KEY=<your‑publishable‑key>
# Start the dev server
npm run dev   # Vite serves at http://localhost:5173
Supabase Integration
Environment Variables – already added to backend/.env and frontend/.env (or Vite .env).
Client Initialisation
Backend: backend/app/supabase_client.py creates a supabase: Client instance using SUPABASE_URL and SUPABASE_SECRET_KEY.
Frontend: frontend/src/lib/supabase.ts exports an initialized Supabase client for auth, storage, and direct DB queries.
Auth (Optional) – You can now use Supabase Auth via the JWKS endpoint for JWT validation. Existing JWT logic still works; switch by updating app/config.py to use the JWKS URL if desired.
Database Tables – Ensure the tables defined in database/schema.sql are created in Supabase (see Database Migration below).
Database Migration
The project ships with a helper script to copy all existing SQLite data into Supabase.

bash

python migrate_to_supabase.py
Before running:

Create the tables in Supabase by executing the SQL in the Supabase Dashboard → SQL Editor (see the full CREATE statements in database/schema.sql).
Verify that SUPABASE_URL and SUPABASE_SECRET_KEY are correctly set in .env.
The script will upsert rows for the following tables: users, clubs, club_memberships, activities, announcements, posts.
Running the Application
bash

# Start backend (API)
cd "d:/club manage ment system/backend"
uvicorn app.main:app --host 127.0.0.1 --port 8000
# In a separate terminal, start the frontend
cd "d:/club manage ment system/frontend"
npm run dev
Open your browser and navigate to http://localhost:5173. Use the Coordinator view (/coordinator) to see pending approvals.

API Docs
FastAPI automatically generates Swagger UI and ReDoc:

Swagger UI: http://127.0.0.1:8000/docs
ReDoc: http://127.0.0.1:8000/redoc All endpoints are grouped under /api/... (auth, clubs, activities, announcements, posts, coordinator, admin).
Testing
The repo includes a basic pytest suite. To run:

bash

cd "d:/club manage ment system/backend"
pytest
Add more tests as needed for new Supabase‑based services.

FAQ & Troubleshooting
"Could not find the table … in the schema cache" – The Supabase tables haven’t been created yet. Run the SQL in the dashboard first.
Authentication errors – Ensure SUPABASE_JWKS_URL matches the JWKS endpoint from your Supabase project and that the JWT secret matches the one used for token generation.
CORS issues – CORS_ORIGINS in .env should include http://localhost:5173 for local development.
Missing environment variables – Double‑check the .env file is in the backend root and that Vite reads its .env (VITE_ prefix).
License
This project is licensed under the MIT License – see the LICENSE file for details.



Happy coding! 🎉

