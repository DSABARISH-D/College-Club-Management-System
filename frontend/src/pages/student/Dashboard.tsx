import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { membershipsApi } from '../../api/memberships';
import { activitiesApi } from '../../api/activities';
import { announcementsApi } from '../../api/announcements';
import type { MyClub, Activity, Announcement } from '../../types';
import { PageSpinner, EmptyState } from '../../components/ui/Shared';
import { formatDateTime, getStatusBadge, getPriorityBadge } from '../../utils';
import {
  Compass,
  CalendarDays,
  Megaphone,
  Users,
  ArrowRight,
  Inbox,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [myClubs, setMyClubs] = useState<MyClub[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      membershipsApi.myClubs(),
      activitiesApi.listAll('UPCOMING'),
      announcementsApi.listAll(),
    ])
      .then(([clubsRes, activitiesRes, announcementsRes]) => {
        setMyClubs(clubsRes.data);
        setActivities(activitiesRes.data.slice(0, 5));
        setAnnouncements(announcementsRes.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="page-container">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="page-title">
          Welcome back, {user?.full_name?.split(' ')[0]}! 👋
        </h1>
        <p className="page-subtitle">
          Here's what's happening across your clubs
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="stat-value text-2xl">{myClubs.length}</div>
              <div className="stat-label">Clubs Joined</div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="stat-value text-2xl">{activities.length}</div>
              <div className="stat-label">Upcoming</div>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="stat-value text-2xl">{announcements.length}</div>
              <div className="stat-label">Announcements</div>
            </div>
          </div>
        </div>
        <Link to="/explore" className="stat-card hover:border-primary-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <Compass className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-navy-900">Explore</div>
              <div className="stat-label">Find new clubs</div>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Activities */}
        <div className="card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-navy-900">Upcoming Activities</h2>
            <Link to="/activities" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {activities.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={CalendarDays}
                  title="No upcoming activities"
                  description="Check back later for new events"
                />
              </div>
            ) : (
              activities.map((a) => (
                <Link
                  key={a.id}
                  to={`/activities/${a.id}`}
                  className="flex items-start gap-3 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-navy-900 truncate">{a.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{a.club_name}</div>
                    <div className="text-xs text-gray-400 mt-1">{formatDateTime(a.start_date)}</div>
                  </div>
                  <span className={`${getStatusBadge(a.status)} shrink-0 mt-0.5`}>{a.status}</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-navy-900">Recent Announcements</h2>
            <Link to="/announcements" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {announcements.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={Inbox}
                  title="No announcements"
                  description="Announcements from your clubs will appear here"
                />
              </div>
            ) : (
              announcements.map((a) => (
                <div key={a.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-navy-900 truncate">{a.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{a.club_name}</div>
                    </div>
                    <span className={`${getPriorityBadge(a.priority)} shrink-0`}>{a.priority}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">{a.content}</p>
                  {a.link && (
                    <div className="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                      <a href={a.link} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 text-xs font-medium">
                        Reference Link
                      </a>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
