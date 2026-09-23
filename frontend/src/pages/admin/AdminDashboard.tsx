import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import type { AdminDashboardData } from '../../types';
import { PageSpinner } from '../../components/ui/Shared';
import { formatDate } from '../../utils';
import {
  Users,
  CalendarDays,
  Megaphone,
  Settings,
  Plus,
  ArrowRight,
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;
  if (!data?.club) {
    return (
      <div className="page-container text-center">
        <p className="text-gray-500">No club associated with your account.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">{data.club.name}</h1>
          <p className="page-subtitle">Admin Dashboard</p>
        </div>
        <Link to="/admin/settings" className="btn-secondary">
          <Settings className="w-4 h-4" />
          Club Settings
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/members" className="stat-card hover:border-primary-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <div className="stat-value">{data.member_count}</div>
              <div className="stat-label">Members</div>
            </div>
          </div>
        </Link>
        <Link to="/admin/activities" className="stat-card hover:border-emerald-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="stat-value">{data.activity_count}</div>
              <div className="stat-label">Activities</div>
            </div>
          </div>
        </Link>
        <Link to="/admin/announcements" className="stat-card hover:border-amber-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Megaphone className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="stat-value">{data.announcement_count}</div>
              <div className="stat-label">Announcements</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions + Recent Members */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="font-semibold text-navy-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/activities/new" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-navy-900">Create Activity</div>
                <div className="text-xs text-gray-500">Add a new event or workshop</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link to="/admin/announcements/new" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-navy-900">Post Announcement</div>
                <div className="text-xs text-gray-500">Share updates with members</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link to="/admin/posts/new" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-navy-900">Create Post</div>
                <div className="text-xs text-gray-500">Share a club update or gallery post</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </div>

        {/* Recent Members */}
        <div className="card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-navy-900">Recent Members</h2>
            <Link to="/admin/members" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {data.recent_members.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No members yet</p>
            ) : (
              data.recent_members.map((m) => (
                <div key={m.id} className="px-6 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary-700">
                    {m.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-navy-900 truncate">{m.full_name}</div>
                    <div className="text-xs text-gray-500">{m.department}</div>
                  </div>
                  <div className="text-xs text-gray-400 shrink-0">
                    {m.joined_at ? formatDate(m.joined_at) : ''}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
