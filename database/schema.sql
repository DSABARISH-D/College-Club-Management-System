-- BIT Clubs & Communities — Reference Schema (PostgreSQL)
-- This file is for documentation. Actual schema is managed by SQLAlchemy + Alembic.

CREATE TYPE user_role AS ENUM ('STUDENT', 'CLUB_ADMIN');
CREATE TYPE activity_status AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');
CREATE TYPE announcement_priority AS ENUM ('LOW', 'NORMAL', 'HIGH');
CREATE TYPE approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE clubs (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50),
    logo_url VARCHAR(500),
    banner_url VARCHAR(500),
    admin_id VARCHAR(36) NOT NULL REFERENCES users(id),
    coordinator_id VARCHAR(36) REFERENCES users(id),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE club_memberships (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    club_id VARCHAR(36) NOT NULL REFERENCES clubs(id),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, club_id)
);

CREATE TABLE activities (
    id VARCHAR(36) PRIMARY KEY,
    club_id VARCHAR(36) NOT NULL REFERENCES clubs(id),
    title VARCHAR(300) NOT NULL,
    description TEXT,
    venue VARCHAR(200),
    link VARCHAR(500),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    status activity_status NOT NULL DEFAULT 'UPCOMING',
    approval_status approval_status NOT NULL DEFAULT 'APPROVED',
    approved_by VARCHAR(36) REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE announcements (
    id VARCHAR(36) PRIMARY KEY,
    club_id VARCHAR(36) NOT NULL REFERENCES clubs(id),
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    link VARCHAR(500),
    priority announcement_priority NOT NULL DEFAULT 'NORMAL',
    approval_status approval_status NOT NULL DEFAULT 'APPROVED',
    approved_by VARCHAR(36) REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_clubs_slug ON clubs(slug);
CREATE INDEX idx_memberships_user ON club_memberships(user_id);
CREATE INDEX idx_memberships_club ON club_memberships(club_id);
CREATE INDEX idx_activities_club ON activities(club_id);
CREATE INDEX idx_announcements_club ON announcements(club_id);
