import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { announcementsApi } from '../../api/announcements';
import type { AdminDashboardData, Announcement } from '../../types';
import { PageSpinner, EmptyState, Toast } from '../../components/ui/Shared';
import { timeAgo, getPriorityBadge, getApprovalBadge, getErrorMessage } from '../../utils';
import { Megaphone, Plus, Edit, Trash2 } from 'lucide-react';

export default function ManageAnnouncements() {
  const [clubSlug, setClubSlug] = useState('');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    adminApi.getDashboard().then((res) => {
      const data: AdminDashboardData = res.data;
      if (data.club) {
        setClubSlug(data.club.slug);
        announcementsApi.listByClub(data.club.slug)
          .then((aRes) => setAnnouncements(aRes.data))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await announcementsApi.delete(id);
      setAnnouncements(announcements.filter((a) => a.id !== id));
      setToast({ message: 'Announcement deleted', type: 'success' });
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
          <h1 className="page-title">Manage Announcements</h1>
          <p className="page-subtitle">{announcements.length} announcements</p>
        </div>
        <Link to="/admin/announcements/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          Post Announcement
        </Link>
      </div>

      {announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements yet"
          description="Post your first announcement to share updates with members"
          action={
            <Link to="/admin/announcements/new" className="btn-primary">
              <Plus className="w-4 h-4" />
              Post Announcement
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-navy-900">{a.title}</h3>
                    <span className={getPriorityBadge(a.priority)}>{a.priority}</span>
                    <span className={getApprovalBadge(a.approval_status)}>{a.approval_status}</span>
                  </div>
                  {a.approval_status === 'REJECTED' && a.rejection_reason && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-100">
                      <strong>Reason for rejection:</strong> {a.rejection_reason}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{a.content}</p>
                  <span className="text-xs text-gray-400 mt-2 inline-block">{timeAgo(a.created_at)}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/admin/announcements/${a.id}/edit`}
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
