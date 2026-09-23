BIT Clubs & Communities

Discover • Connect • Participate

A full-stack web application for managing university clubs, memberships,
activities, announcements, and club posts at Bannari Amman Institute of
Technology (BIT).

1. Project Overview

BIT Clubs & Communities provides a centralized platform where students
can discover clubs, join clubs, view activities and announcements, while
coordinators can manage club information, members, activities,
announcements and posts.

The application also supports a review/approval workflow for submitted
content.

Core workflow

Student / Student Coordinator
          |
          | Create Activity / Announcement / Post
          v
       PENDING
          |
          v
 Coordinator Review
      /        \
 APPROVE      REJECT
    |            |
    v            v
APPROVED      REJECTED
    |
    v
Student-facing pages

2. Main Features

Student

Register and login

Student dashboard

Explore clubs

Search/filter clubs

View club details

Join clubs

View My Clubs

View activities

View announcements

View approved club updates/posts

Coordinator / Administration

Coordinator dashboard

Pending approval list

Approve/reject submitted content

Manage clubs

Add new clubs

View club members

View member counts

View activity counts

Activate/deactivate clubs

Create activities

Create announcements

Create posts

The current coordinator UI is labelled System Coordinator.

3. Screenshots

Landing Page

<figure>
<img src="screenshots/01-homepage.png" alt="Landing Page" />
<figcaption aria-hidden="true">Landing Page</figcaption>
</figure>

Login

<figure>
<img src="screenshots/02-login.png" alt="Login" />
<figcaption aria-hidden="true">Login</figcaption>
</figure>

Admin Dashboard

<figure>
<img src="screenshots/03-admin-dashboard.png" alt="Admin Dashboard" />
<figcaption aria-hidden="true">Admin Dashboard</figcaption>
</figure>

Create Activity

<figure>
<img src="screenshots/04-create-activity.png" alt="Create Activity" />
<figcaption aria-hidden="true">Create Activity</figcaption>
</figure>

Post Announcement

<figure>
<img src="screenshots/05-post-announcement.png"
alt="Post Announcement" />
<figcaption aria-hidden="true">Post Announcement</figcaption>
</figure>

Create Post

<figure>
<img src="screenshots/06-create-post.png" alt="Create Post" />
<figcaption aria-hidden="true">Create Post</figcaption>
</figure>

Student Login

<figure>
<img src="screenshots/07-student-login.png" alt="Student Login" />
<figcaption aria-hidden="true">Student Login</figcaption>
</figure>

Student Dashboard

<figure>
<img src="screenshots/08-student-dashboard.png"
alt="Student Dashboard" />
<figcaption aria-hidden="true">Student Dashboard</figcaption>
</figure>

Student Activities

<figure>
<img src="screenshots/09-student-activities.png"
alt="Student Activities" />
<figcaption aria-hidden="true">Student Activities</figcaption>
</figure>

Explore Clubs

<figure>
<img src="screenshots/10-explore-clubs.png" alt="Explore Clubs" />
<figcaption aria-hidden="true">Explore Clubs</figcaption>
</figure>

Club Details

<figure>
<img src="screenshots/11-club-details.png" alt="Club Details" />
<figcaption aria-hidden="true">Club Details</figcaption>
</figure>

Club Posts and Updates

<figure>
<img src="screenshots/12-club-posts.png" alt="Club Posts" />
<figcaption aria-hidden="true">Club Posts</figcaption>
</figure>

Announcements

<figure>
<img src="screenshots/13-announcements.png" alt="Announcements" />
<figcaption aria-hidden="true">Announcements</figcaption>
</figure>

Pending Approvals

<figure>
<img src="screenshots/14-coordinator-pending-approvals.png"
alt="Pending Approvals" />
<figcaption aria-hidden="true">Pending Approvals</figcaption>
</figure>

No Pending Approvals

<figure>
<img src="screenshots/15-coordinator-no-pending.png"
alt="No Pending Approvals" />
<figcaption aria-hidden="true">No Pending Approvals</figcaption>
</figure>

Manage Clubs

<figure>
<img src="screenshots/16-manage-clubs.png" alt="Manage Clubs" />
<figcaption aria-hidden="true">Manage Clubs</figcaption>
</figure>

Create New Club

<figure>
<img src="screenshots/17-create-new-club.png" alt="Create New Club" />
<figcaption aria-hidden="true">Create New Club</figcaption>
</figure>

Club Members

<figure>
<img src="screenshots/18-club-members.png" alt="Club Members" />
<figcaption aria-hidden="true">Club Members</figcaption>
</figure>

My Clubs

<figure>
<img src="screenshots/19-my-clubs.png" alt="My Clubs" />
<figcaption aria-hidden="true">My Clubs</figcaption>
</figure>

Music Club Details

<figure>
<img src="screenshots/20-music-club-details.png"
alt="Music Club Details" />
<figcaption aria-hidden="true">Music Club Details</figcaption>
</figure>

4. Technology Stack

Layer

Technology

Purpose

Frontend

React + TypeScript

Component-based web UI

Build

Vite

Fast development/build tooling

Styling

CSS

Responsive application styling

Backend

FastAPI

REST API and business logic

Validation

Pydantic

Request/response validation

ORM

SQLAlchemy

Database access

Local DB

SQLite

Local development

Cloud DB

Supabase PostgreSQL

Hosted relational database

Authentication

Custom JWT

Existing application authentication

Optional Auth

Supabase JWT/JWKS

Optional migration path

Supabase

Python client

Supabase integration

Testing

Pytest

Backend testing

Server

Uvicorn

FastAPI server

Version Control

Git/GitHub

Collaboration and version control

5. Architecture

Browser
   |
   v
React + TypeScript + Vite
   |
   | REST / HTTP
   v
FastAPI
   |
   +--> Authentication
   +--> Authorization
   +--> Validation
   +--> Approval Logic
   |
   v
SQLAlchemy
   |
   +-------------------+
   |                   |
   v                   v
SQLite             Supabase PostgreSQL
(Local Dev)        (Hosted/Production)

The frontend normally communicates with the backend API rather than
connecting directly to the database.

6. User Flow

Student

Register / Login
      |
      v
Dashboard
      |
      +--> Explore Clubs --> Club Details --> Join Club
      |
      +--> My Clubs
      |
      +--> Activities
      |
      +--> Announcements

Content submission and approval

Create Content
      |
      v
   PENDING
      |
      v
Coordinator Review
   /          \
Approve       Reject
  |             |
  v             v
Approved      Rejected
  |
  v
Student-facing visibility

7. Supabase Integration

The project supports moving from local SQLite development to Supabase
PostgreSQL.

Local development

FastAPI -> SQLAlchemy -> SQLite

Hosted database

FastAPI -> SQLAlchemy / Supabase Client -> Supabase PostgreSQL

The repository includes a migration helper for existing SQLite data.

Backend environment variables

SUPABASE_URL=<your-supabase-project-url>
SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>
SUPABASE_SECRET_KEY=<your-secret-key>
SUPABASE_JWKS_URL=<your-jwks-url>

Frontend environment variables

VITE_SUPABASE_URL=<your-supabase-project-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-key>

Important: never expose SUPABASE_SECRET_KEY in frontend code.

8. Database

Main application entities:

users
clubs
club_memberships
activities
announcements
posts

Relationship overview:

Users <----> Club Memberships <----> Clubs
                                      |
                     +----------------+----------------+
                     |                |                |
                Activities      Announcements       Posts

The relational structure supports member counts, club-based filtering,
activity records and announcements.

9. Database Migration to Supabase

Before migration:

Create a Supabase project.

Open Supabase Dashboard → SQL Editor.

Execute the SQL from database/schema.sql.

Verify that the required tables exist.

Configure the backend .env.

Run:

python migrate_to_supabase.py

The migration helper is intended to upsert:

users
clubs
club_memberships
activities
announcements
posts

10. Authentication

The existing application uses custom JWT authentication.

Login
  |
  v
FastAPI validates credentials
  |
  v
JWT token
  |
  v
Authenticated API requests
  |
  v
FastAPI validates token

The project documentation also provides Supabase JWT/JWKS as an optional
authentication migration path.

11. Authorization

Authentication identifies the user; authorization controls what that
user can do.

Typical permissions are:

Student
  -> Explore clubs
  -> Join clubs
  -> View student-facing content

Student / Club Coordinator
  -> Submit/manage allowed club content

Coordinator / Administrator
  -> Review pending submissions
  -> Approve/reject
  -> Manage clubs
  -> View members

The final role-to-permission mapping should follow the current backend
implementation.

12. API

FastAPI exposes API groups under /api/....

Typical groups include:

/api/auth
/api/clubs
/api/activities
/api/announcements
/api/posts
/api/coordinator
/api/admin

Swagger

http://127.0.0.1:8000/docs

ReDoc

http://127.0.0.1:8000/redoc

Swagger is useful for review because it exposes the API methods, request
bodies, parameters, responses and authentication requirements.

13. Backend Setup

cd "d:/club manage ment system/backend"

python -m venv venv

# Windows
venv\Scripts\activate

pip install -r requirements.txt

If required:

pip install supabase PyJWT[crypto]

Configure .env, then start:

uvicorn app.main:app --host 127.0.0.1 --port 8000

14. Frontend Setup

cd "d:/club manage ment system/frontend"

npm install
npm run dev

Open:

http://localhost:5173

15. Complete Local Run

Terminal 1

cd backend
venv\Scripts\activate
uvicorn app.main:app --host 127.0.0.1 --port 8000

Terminal 2

cd frontend
npm run dev

Then open:

http://localhost:5173

16. Project Structure

College-Club-Management-System/
|
+-- backend/
|   +-- app/
|   |   +-- main.py
|   |   +-- config.py
|   |   +-- supabase_client.py
|   |   +-- ...
|   +-- requirements.txt
|   +-- .env
|
+-- frontend/
|   +-- src/
|   |   +-- components/
|   |   +-- pages/
|   |   +-- lib/
|   |       +-- supabase.ts
|   +-- package.json
|   +-- .env
|
+-- database/
|   +-- schema.sql
|
+-- migrate_to_supabase.py
+-- README.md
+-- LICENSE

17. Reviewer Demonstration

A clear review sequence is:

Open the landing page.

Login as a student.

Show the student dashboard.

Explore clubs.

Open a club.

Show My Clubs.

Show activities and announcements.

Login as coordinator.

Create an activity/announcement/post.

Show that the submission enters the pending workflow.

Open Pending Approvals.

Approve or reject the submission.

Return to the student-facing interface and demonstrate the resulting
visibility.

Open Manage Clubs.

Create a club.

Open club members.

Show the API documentation at /docs.

18. Testing Checklist

Authentication

Registration works

Login works

Invalid login is rejected

Protected routes require authentication

Logout works

Student

Dashboard loads

Explore works

Search/filter works

Club details load

Join club works

My Clubs loads

Activities load

Announcements load

Coordinator

Dashboard loads

Pending approvals load

Approve works

Reject works

Manage Clubs loads

Add Club works

Members page works

Activate/deactivate works

Content

Activity creation works

Announcement creation works

Post creation works

Approval state is preserved

Approved content appears where expected

Database

SQLite works locally

Supabase tables are created

Migration script runs

Supabase data can be read

Secret keys are not exposed

19. Troubleshooting

Supabase table not found

If you see:

Could not find the table ... in the schema cache

Run the required SQL from:

database/schema.sql

in the Supabase SQL Editor and verify that the table exists.

CORS error

Ensure backend CORS configuration allows:

http://localhost:5173

Frontend Supabase variables not working

Vite variables must use the VITE_ prefix:

VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...

Restart Vite after changing .env.

Backend startup problem

python --version
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000

20. Security

Never commit real secrets to GitHub.

Do not expose:

SUPABASE_SECRET_KEY

in frontend code.

Use .env.example to document variable names without real credentials.

21. Deployment Architecture

                    Internet
                       |
          +------------+------------+
          |                         |
          v                         v
       Vercel                 Render / Railway
      Frontend                    Backend
          |                         |
          +------ REST API ---------+
                                    |
                                    v
                           Supabase PostgreSQL

The frontend can be built with:

npm run build

The FastAPI backend can be deployed behind an ASGI server.

22. Why This Architecture?

React

Used for reusable, component-based screens and dashboards.

TypeScript

Provides type safety for structured entities such as users, clubs,
memberships and activities.

FastAPI

Provides the API boundary and centralizes authentication, authorization,
validation and business logic.

SQLAlchemy

Provides structured database access and keeps database operations
separate from UI code.

PostgreSQL / Supabase

Provides a hosted relational database suitable for users, clubs,
memberships, activities, announcements and posts.

SQLite

Keeps local development simple without requiring a separate database
server.

JWT

Provides stateless authentication for the existing application.

Supabase

Provides hosted PostgreSQL and supporting backend services for cloud
deployment.

23. One-Minute Reviewer Explanation

BIT Clubs & Communities is a centralized web platform for managing
college clubs and communities. Students can discover and join clubs,
view activities and announcements, and manage their joined clubs.
Coordinators can manage club members and create activities,
announcements and posts. Submitted content can pass through a pending
approval workflow where an authorized coordinator reviews it and
approves or rejects it. The frontend uses React and TypeScript, the
backend uses FastAPI with Pydantic and SQLAlchemy, and the database
can run on SQLite during local development and Supabase PostgreSQL for
hosted deployment.

24. Technical Request Flow

Browser
   |
   v
React
   |
   | HTTP Request
   v
FastAPI
   |
   +--> Authentication
   +--> Authorization
   +--> Validation
   +--> Business Rules
   |
   v
SQLAlchemy
   |
   v
Database

Example activity creation:

Activity Form
    |
    v
POST /api/activities
    |
    v
FastAPI
    |
    +--> Validate user
    +--> Validate request
    +--> Apply business rules
    |
    v
Database

Approval:

PENDING
   |
   +----> APPROVE ----> APPROVED
   |
   +----> REJECT -----> REJECTED

25. Screenshot Index

#

Screen

File

1

Landing Page

01-homepage.png

2

Login

02-login.png

3

Admin Dashboard

03-admin-dashboard.png

4

Create Activity

04-create-activity.png

5

Post Announcement

05-post-announcement.png

6

Create Post

06-create-post.png

7

Student Login

07-student-login.png

8

Student Dashboard

08-student-dashboard.png

9

Student Activities

09-student-activities.png

10

Explore Clubs

10-explore-clubs.png

11

Club Details

11-club-details.png

12

Club Posts

12-club-posts.png

13

Announcements

13-announcements.png

14

Pending Approvals

14-coordinator-pending-approvals.png

15

No Pending Approvals

15-coordinator-no-pending.png

16

Manage Clubs

16-manage-clubs.png

17

Create New Club

17-create-new-club.png

18

Club Members

18-club-members.png

19

My Clubs

19-my-clubs.png

20

Music Club Details

20-music-club-details.png

26. Final Summary

BIT Clubs & Communities
        |
        +--> Students
        |      +--> Discover clubs
        |      +--> Join clubs
        |      +--> View activities
        |      +--> View announcements
        |
        +--> Coordinators
        |      +--> Manage club
        |      +--> Manage members
        |      +--> Create content
        |
        +--> Approval
        |      +--> Pending
        |      +--> Approve
        |      +--> Reject
        |
        +--> Backend
        |      +--> FastAPI
        |      +--> SQLAlchemy
        |
        +--> Database
               +--> SQLite
               +--> Supabase PostgreSQL

BIT Clubs & Communities
Bannari Amman Institute of Technology

Discover • Connect • Participate
