import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clubsApi } from '../../api/clubs';
import { membershipsApi } from '../../api/memberships';
import { activitiesApi } from '../../api/activities';
import { announcementsApi } from '../../api/announcements';
import { postsApi } from '../../api/posts';
import type { Club, Activity, Announcement, Post } from '../../types';
import { PageSpinner, Toast } from '../../components/ui/Shared';
import { formatDateTime, getStatusBadge, getPriorityBadge, getErrorMessage } from '../../utils';
import {
  Users,
  CalendarDays,
  Megaphone,
  LogIn,
  LogOut,
  MapPin,
  ArrowLeft,
} from 'lucide-react';

export default function ClubDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [club, setClub] = useState<Club | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchData = async () => {
    if (!slug) return;
    try {
      const [clubRes, activitiesRes, announcementsRes, postsRes] = await Promise.all([
        clubsApi.getBySlug(slug),
        activitiesApi.listByClub(slug),
        announcementsApi.listByClub(slug),
        postsApi.listByClub(slug),
      ]);
      setClub(clubRes.data);
      setActivities(activitiesRes.data);
      setAnnouncements(announcementsRes.data);
      setPosts(postsRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);

  const handleJoin = async () => {
    if (!slug) return;
    setActionLoading(true);
    try {
      await membershipsApi.join(slug);
      setToast({ message: `Joined ${club?.name}!`, type: 'success' });
      await fetchData();
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!slug) return;
    setActionLoading(true);
    try {
      await membershipsApi.leave(slug);
      setToast({ message: `Left ${club?.name}`, type: 'success' });
      await fetchData();
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!club) return <div className="page-container text-center text-gray-500">Club not found</div>;

  return (
    <div className="page-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Back link */}
      <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Explore
      </Link>

      {/* Club header */}
      <div className="card overflow-hidden mb-8">
        <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-700 relative">
          {club.banner_url && (
            <img src={club.banner_url} alt="" className="w-full h-full object-cover absolute inset-0" />
          )}
        </div>
        <div className="px-6 pb-6 -mt-10 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-20 h-20 bg-white rounded-xl border-4 border-white shadow-sm flex items-center justify-center shrink-0">
              {club.logo_url ? (
                <img src={club.logo_url} alt={club.name} className="w-14 h-14 rounded-lg" />
              ) : (
                <span className="text-3xl font-bold text-primary-600">{club.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h1 className="text-2xl font-bold text-navy-900">{club.name}</h1>
                {club.category && <span className="badge-primary">{club.category}</span>}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {club.member_count} members
                </span>
              </div>
            </div>
            <div className="shrink-0">
              {club.is_member ? (
                <button
                  onClick={handleLeave}
                  disabled={actionLoading}
                  className="btn-secondary"
                >
                  <LogOut className="w-4 h-4" />
                  Leave Club
                </button>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={actionLoading}
                  className="btn-primary"
                >
                  <LogIn className="w-4 h-4" />
                  Join Club
                </button>
              )}
            </div>
          </div>
          {club.description && (
            <p className="mt-4 text-gray-600 text-sm leading-relaxed">{club.description}</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activities */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary-600" />
            <h2 className="font-semibold text-navy-900">Activities</h2>
            <span className="badge-gray ml-auto">{activities.length}</span>
          </div>
          <div className="divide-y divide-gray-100">
            {activities.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No activities yet</p>
            ) : (
              activities.map((a) => (
                <Link
                  key={a.id}
                  to={`/activities/${a.id}`}
                  className="px-6 py-4 block hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-navy-900">{a.title}</div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>{formatDateTime(a.start_date)}</span>
                        {a.venue && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" />
                            {a.venue}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`${getStatusBadge(a.status)} shrink-0`}>{a.status}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Announcements */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-600" />
            <h2 className="font-semibold text-navy-900">Announcements</h2>
            <span className="badge-gray ml-auto">{announcements.length}</span>
          </div>
          <div className="divide-y divide-gray-100">
            {announcements.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No announcements yet</p>
            ) : (
              announcements.map((a) => (
                <div key={a.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-sm text-navy-900">{a.title}</div>
                    <span className={`${getPriorityBadge(a.priority)} shrink-0`}>{a.priority}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-3">{a.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-6 card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-navy-900">Club Posts & Updates</h2>
          <span className="badge-gray">{posts.length}</span>
        </div>
        <div className="divide-y divide-gray-100">
          {posts.length === 0 ? (
            <p className="px-6 py-8 text-sm text-gray-400 text-center">No posts yet</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="p-6">
                <h3 className="font-semibold text-navy-900 mb-2">{post.title}</h3>
                <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">{post.content}</p>
                {post.image_url && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-gray-100 max-h-96 bg-gray-50 flex items-center justify-center">
                    <img src={post.image_url} alt="Post attached" className="max-w-full max-h-96 object-contain" />
                  </div>
                )}
                <div className="mt-4 text-xs text-gray-400 flex items-center gap-2">
                  <span>{formatDateTime(post.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
