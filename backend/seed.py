"""
Seed script — creates demo clubs, admin accounts, sample students,
activities, and announcements for the hackathon demo.

Usage:
    python seed.py
"""

import sys
import os

# Add parent dir to path so we can import app
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime, timedelta, timezone
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.club import Club
from app.models.membership import ClubMembership
from app.models.activity import Activity
from app.models.announcement import Announcement
from app.utils.security import hash_password

# Create all tables
Base.metadata.create_all(bind=engine)


def seed():
    db = SessionLocal()

    try:
        # Check if data already exists
        if db.query(User).first():
            print("Database already has data. Skipping seed.")
            print("To re-seed, drop all tables first.")
            return

        print("Seeding database...")

        # ---------------------------------------------------------------
        # Admin users
        # ---------------------------------------------------------------
        admin1 = User(
            email="coding.admin@bit.edu",
            password_hash=hash_password("admin123"),
            full_name="Priya Sharma",
            roll_number="ADM001",
            department="CSE",
            role="CLUB_ADMIN",
        )
        admin2 = User(
            email="robotics.admin@bit.edu",
            password_hash=hash_password("admin123"),
            full_name="Arjun Patel",
            roll_number="ADM002",
            department="ECE",
            role="CLUB_ADMIN",
        )
        admin3 = User(
            email="photography.admin@bit.edu",
            password_hash=hash_password("admin123"),
            full_name="Meera Krishnan",
            roll_number="ADM003",
            department="IT",
            role="CLUB_ADMIN",
        )
        admin4 = User(
            email="literary.admin@bit.edu",
            password_hash=hash_password("admin123"),
            full_name="Rahul Menon",
            roll_number="ADM004",
            department="MECH",
            role="CLUB_ADMIN",
        )
        admin5 = User(
            email="sports.admin@bit.edu",
            password_hash=hash_password("admin123"),
            full_name="Deepa Venkatesh",
            roll_number="ADM005",
            department="CIVIL",
            role="CLUB_ADMIN",
        )
        admin6 = User(
            email="music.admin@bit.edu",
            password_hash=hash_password("admin123"),
            full_name="Karthik Rajan",
            roll_number="ADM006",
            department="EEE",
            role="CLUB_ADMIN",
        )

        admins = [admin1, admin2, admin3, admin4, admin5, admin6]
        db.add_all(admins)
        db.flush()

        # ---------------------------------------------------------------
        # Student users
        # ---------------------------------------------------------------
        student1 = User(
            email="student@bit.edu",
            password_hash=hash_password("student123"),
            full_name="Arun Kumar",
            roll_number="20CS101",
            department="CSE",
            role="STUDENT",
        )
        student2 = User(
            email="kavitha@bit.edu",
            password_hash=hash_password("student123"),
            full_name="Kavitha Sundaram",
            roll_number="20EC102",
            department="ECE",
            role="STUDENT",
        )
        student3 = User(
            email="vijay@bit.edu",
            password_hash=hash_password("student123"),
            full_name="Vijay Anand",
            roll_number="20ME103",
            department="MECH",
            role="STUDENT",
        )

        students = [student1, student2, student3]
        db.add_all(students)
        db.flush()

        # ---------------------------------------------------------------
        # Clubs
        # ---------------------------------------------------------------
        club1 = Club(
            name="Coding Club",
            slug="coding-club",
            description="The Coding Club at BIT is a community of passionate programmers who explore competitive programming, open-source contributions, hackathons, and emerging technologies. We host weekly coding challenges, tech talks, and collaborative projects to sharpen our skills and build innovative solutions together.",
            category="Technical",
            admin_id=admin1.id,
            logo_url="https://api.dicebear.com/7.x/identicon/svg?seed=coding",
        )
        club2 = Club(
            name="Robotics Club",
            slug="robotics-club",
            description="The Robotics Club brings together engineering enthusiasts who design, build, and program robots. From line followers to autonomous drones, we participate in national-level robotics competitions and conduct hands-on workshops for students of all skill levels.",
            category="Technical",
            admin_id=admin2.id,
            logo_url="https://api.dicebear.com/7.x/identicon/svg?seed=robotics",
        )
        club3 = Club(
            name="Photography Club",
            slug="photography-club",
            description="Capture the world through your lens! The Photography Club at BIT organizes photo walks, editing workshops, exhibitions, and photography contests. Whether you shoot on a DSLR or your phone, everyone is welcome to learn and share their perspective.",
            category="Creative",
            admin_id=admin3.id,
            logo_url="https://api.dicebear.com/7.x/identicon/svg?seed=photography",
        )
        club4 = Club(
            name="Literary Club",
            slug="literary-club",
            description="A haven for writers, poets, and storytellers. The Literary Club hosts creative writing sessions, poetry slams, debate competitions, and book discussions. Express yourself through words and discover the power of language with fellow literature enthusiasts.",
            category="Cultural",
            admin_id=admin4.id,
            logo_url="https://api.dicebear.com/7.x/identicon/svg?seed=literary",
        )
        club5 = Club(
            name="Sports Club",
            slug="sports-club",
            description="Stay fit, play hard! The Sports Club manages inter-departmental tournaments, fitness sessions, and sports day events. From cricket and football to badminton and athletics, we promote sportsmanship and physical well-being across campus.",
            category="Sports",
            admin_id=admin5.id,
            logo_url="https://api.dicebear.com/7.x/identicon/svg?seed=sports",
        )
        club6 = Club(
            name="Music Club",
            slug="music-club",
            description="The Music Club is the heartbeat of campus culture. We bring together vocalists, instrumentalists, and music producers for jam sessions, concerts, and cultural fest performances. All genres and skill levels welcome — come make some noise!",
            category="Cultural",
            admin_id=admin6.id,
            logo_url="https://api.dicebear.com/7.x/identicon/svg?seed=music",
        )

        clubs = [club1, club2, club3, club4, club5, club6]
        db.add_all(clubs)
        db.flush()

        # ---------------------------------------------------------------
        # Memberships — students join some clubs
        # ---------------------------------------------------------------
        memberships = [
            ClubMembership(user_id=student1.id, club_id=club1.id),
            ClubMembership(user_id=student1.id, club_id=club2.id),
            ClubMembership(user_id=student2.id, club_id=club1.id),
            ClubMembership(user_id=student2.id, club_id=club3.id),
            ClubMembership(user_id=student3.id, club_id=club5.id),
            ClubMembership(user_id=student3.id, club_id=club6.id),
        ]
        db.add_all(memberships)
        db.flush()

        # ---------------------------------------------------------------
        # Activities
        # ---------------------------------------------------------------
        now = datetime.now(timezone.utc)
        activities_data = [
            Activity(
                club_id=club1.id,
                title="Hackathon 2026",
                description="24-hour hackathon open to all departments. Build something amazing with a team of 3-4 members. Prizes worth ₹50,000!",
                venue="Main Auditorium",
                start_date=now + timedelta(days=7),
                end_date=now + timedelta(days=8),
                status="UPCOMING",
            ),
            Activity(
                club_id=club1.id,
                title="Python Workshop",
                description="Introduction to Python programming for beginners. Learn the basics of Python, data structures, and build your first project.",
                venue="CS Lab 3",
                start_date=now + timedelta(days=3),
                end_date=now + timedelta(days=3, hours=3),
                status="UPCOMING",
            ),
            Activity(
                club_id=club2.id,
                title="Arduino Workshop",
                description="Hands-on workshop on Arduino programming and sensor interfacing. Build a line-following robot from scratch!",
                venue="ECE Lab 2",
                start_date=now + timedelta(days=5),
                end_date=now + timedelta(days=5, hours=4),
                status="UPCOMING",
            ),
            Activity(
                club_id=club3.id,
                title="Campus Photo Walk",
                description="Explore the beautiful BIT campus through your lens. Learn composition techniques and landscape photography tips from experienced photographers.",
                venue="Campus Grounds",
                start_date=now + timedelta(days=2),
                end_date=now + timedelta(days=2, hours=2),
                status="UPCOMING",
            ),
            Activity(
                club_id=club5.id,
                title="Inter-Department Cricket Tournament",
                description="Annual cricket tournament between all departments. Register your team of 11 players. Trophy and cash prizes for winners!",
                venue="BIT Sports Ground",
                start_date=now + timedelta(days=14),
                end_date=now + timedelta(days=21),
                status="UPCOMING",
            ),
            Activity(
                club_id=club4.id,
                title="Poetry Slam Night",
                description="Share your original poems or perform spoken word pieces. Open mic format — everyone is welcome to participate or just enjoy the performances.",
                venue="Seminar Hall B",
                start_date=now - timedelta(days=3),
                end_date=now - timedelta(days=3, hours=-2),
                status="COMPLETED",
            ),
        ]
        db.add_all(activities_data)
        db.flush()

        # ---------------------------------------------------------------
        # Announcements
        # ---------------------------------------------------------------
        announcements_data = [
            Announcement(
                club_id=club1.id,
                title="Hackathon Registration Open!",
                content="Registrations for Hackathon 2026 are now open. Form teams of 3-4 members and register before the deadline. Limited spots available!",
                priority="HIGH",
            ),
            Announcement(
                club_id=club1.id,
                title="Weekly Coding Challenge #15",
                content="This week's coding challenge is live on our platform. Solve the problem set and submit your solutions by Sunday 11:59 PM. Top 3 scorers get certificates!",
                priority="NORMAL",
            ),
            Announcement(
                club_id=club2.id,
                title="New Arduino Kits Available",
                content="We have received 20 new Arduino Uno kits for club members. Visit the ECE lab during club hours to get yours. First come, first served!",
                priority="NORMAL",
            ),
            Announcement(
                club_id=club3.id,
                title="Photo Contest Results",
                content="The results of our monthly photo contest are out. Congratulations to all winners! Check the notice board for the complete results.",
                priority="LOW",
            ),
            Announcement(
                club_id=club5.id,
                title="Cricket Tournament Schedule Released",
                content="The schedule for the inter-department cricket tournament has been finalized. Check your match timings and ensure your team is ready. No rescheduling allowed.",
                priority="HIGH",
            ),
            Announcement(
                club_id=club6.id,
                title="Open Jam Session This Friday",
                content="Join us for an open jam session this Friday at 5 PM in the Music Room. Bring your instruments — amps and drums are available. All skill levels welcome!",
                priority="NORMAL",
            ),
        ]
        db.add_all(announcements_data)

        db.commit()
        print("✓ Seed complete!")
        print()
        print("Demo accounts:")
        print("  Student:  student@bit.edu / student123")
        print("  Admin:    coding.admin@bit.edu / admin123")
        print("  Admin:    robotics.admin@bit.edu / admin123")
        print("  Admin:    photography.admin@bit.edu / admin123")
        print("  Admin:    literary.admin@bit.edu / admin123")
        print("  Admin:    sports.admin@bit.edu / admin123")
        print("  Admin:    music.admin@bit.edu / admin123")

    except Exception as e:
        db.rollback()
        print(f"✗ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
