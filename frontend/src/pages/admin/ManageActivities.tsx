import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { activitiesApi } from '../../api/activities';
import type { AdminDashboardData, Activity } from '../../types';
import { PageSpinner, EmptyState, Toast } from '../../components/ui/Shared';
import { formatDateTime, getStatusBadge, getApprovalBadge, getErrorMessage } from '../../utils';
import { CalendarDays, Plus, Edit, Trash2, MapPin } from 'lucide-react';

export default function ManageActivities() {
  const [clubSlug, setClubSlug] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    adminApi.getDashboard().then((res) => {
      const data: AdminDashboardData = res.data;
      if (data.club) {
        setClubSlug(data.club.slug);
        activitiesApi.listByClub(data.club.slug)
          .then((aRes) => setActivities(aRes.data))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await activitiesApi.delete(id);
      setActivities(activities.filter((a) => a.id !== id));
      setToast({ message: 'Activity deleted', type: 'success' });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: 'error' });
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="page-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Manage Activities</h1>
          <p className="page-subtitle">{activities.length} activities</p>
        </div>
        <Link to="/admin/activities/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Create Activity
        </Link>
      </div>

      {activities.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No activities yet"
          description="Create your first activity to get started"
          action={
            <Link to="/admin/activities/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              Create Activity
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-navy-900">{a.title}</h3>
                    <span className={getStatusBadge(a.status)}>{a.status}</span>
                    <span className={getApprovalBadge(a.approval_status)}>{a.approval_status}</span>
                  </div>
                  {a.approval_status === 'REJECTED' && a.rejection_reason && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
                      <strong>Reason for rejection:</strong> {a.rejection_reason}
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-gray-500">
                    <span>{formatDateTime(a.start_date)}</span>
                    {a.venue && (
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {a.venue}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/admin/activities/${a.id}/edit`}
                    className="btn-secondary btn-sm"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(a.id, a.title)}
                    className="btn-ghost btn-sm text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
