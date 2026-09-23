// ============================================================================
// BIT Clubs & Communities — TypeScript Type Definitions
// ============================================================================

// ---------------------------------------------------------------------------
// User & Auth
// ---------------------------------------------------------------------------

export type UserRole = 'STUDENT' | 'CLUB_ADMIN';

export interface User {
  id: string;
  email: string;
  full_name: string;
  roll_number: string;
  department: string;
  role: UserRole;
  created_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  roll_number: string;
  department: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ---------------------------------------------------------------------------
// Club
// ---------------------------------------------------------------------------

export interface Club {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  logo_url: string | null;
  banner_url: string | null;
  admin_id: string;
  created_at: string;
  member_count: number;
  is_member: boolean;
}

export interface ClubUpdatePayload {
  name?: string;
  description?: string;
  category?: string;
  logo_url?: string;
  banner_url?: string;
}

// ---------------------------------------------------------------------------
// Membership
// ---------------------------------------------------------------------------

export interface Member {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  roll_number: string;
  department: string;
  joined_at: string;
}

export interface MyClub {
  id: string;
  club_id: string;
  club_name: string;
  club_slug: string;
  club_category: string | null;
  club_logo_url: string | null;
  joined_at: string;
}

// ---------------------------------------------------------------------------
// Activity
// ---------------------------------------------------------------------------

export type ActivityStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface Activity {
  id: string;
  club_id: string;
  club_name: string;
  club_slug: string;
  title: string;
  description: string | null;
  venue: string | null;
  link: string | null;
  start_date: string;
  end_date: string | null;
  status: ActivityStatus;
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityCreatePayload {
  title: string;
  description?: string;
  venue?: string;
  link?: string;
  start_date: string;
  end_date?: string;
  status?: ActivityStatus;
}

export interface ActivityUpdatePayload extends Partial<ActivityCreatePayload> {}

// ---------------------------------------------------------------------------
// Announcement
// ---------------------------------------------------------------------------

export type AnnouncementPriority = 'LOW' | 'NORMAL' | 'HIGH';

export interface Announcement {
  id: string;
  club_id: string;
  club_name: string;
  club_slug: string;
  title: string;
  content: string;
  link: string | null;
  priority: AnnouncementPriority;
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementCreatePayload {
  title: string;
  content: string;
  link?: string;
  priority?: AnnouncementPriority;
}

export interface AnnouncementUpdatePayload {
  title?: string;
  content?: string;
  link?: string;
  priority?: AnnouncementPriority;
}

// ---------------------------------------------------------------------------
// Post
// ---------------------------------------------------------------------------

export interface Post {
  id: string;
  club_id: string;
  title: string;
  content: string;
  image_url?: string | null;
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostCreatePayload {
  title: string;
  content: string;
  image_url?: string;
}

export interface PostUpdatePayload {
  title?: string;
  content?: string;
  image_url?: string;
}

// ---------------------------------------------------------------------------
// Admin Dashboard
// ---------------------------------------------------------------------------

export interface AdminDashboardData {
  club: {
    id: string;
    name: string;
    slug: string;
    category: string | null;
  } | null;
  member_count: number;
  activity_count: number;
  announcement_count: number;
  recent_members: {
    id: string;
    full_name: string;
    email: string;
    department: string;
    joined_at: string;
  }[];
}
