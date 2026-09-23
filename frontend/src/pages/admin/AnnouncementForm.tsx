import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { announcementsApi } from '../../api/announcements';
import type { AdminDashboardData, AnnouncementCreatePayload } from '../../types';
import { PageSpinner, Toast } from '../../components/ui/Shared';
import { getErrorMessage } from '../../utils';
import { Save, ArrowLeft } from 'lucide-react';

export default function AnnouncementForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [clubSlug, setClubSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState<AnnouncementCreatePayload>({
    title: '',
    content: '',
    link: '',
    priority: 'NORMAL',
  });

  useEffect(() => {
    adminApi.getDashboard().then(async (res) => {
      const data: AdminDashboardData = res.data;
      if (data.club) {
        setClubSlug(data.club.slug);
      }

      if (isEdit && id) {
        // Fetch existing announcement data
        const allAnns = await announcementsApi.listByClub(data.club?.slug || '');
        const ann = allAnns.data.find((a) => a.id === id);
        if (ann) {
          setForm({
            title: ann.title,
            content: ann.content,
            link: ann.link || '',
            priority: ann.priority,
          });
        }
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEdit && id) {
        await announcementsApi.update(id, form);
        setToast({ message: 'Announcement updated!', type: 'success' });
      } else {
        await announcementsApi.create(clubSlug, form);
        setToast({ message: 'Announcement posted!', type: 'success' });
      }
      setTimeout(() => navigate('/admin/announcements'), 800);
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="page-container max-w-2xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <button
        onClick={() => navigate('/admin/announcements')}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Announcements
      </button>

      <h1 className="page-title mb-6">{isEdit ? 'Edit Announcement' : 'Post Announcement'}</h1>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="ann-title" className="input-label">Title *</label>
            <input
              id="ann-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g. Important: Registration Deadline"
              required
            />
          </div>

          <div>
            <label htmlFor="ann-content" className="input-label">Content *</label>
            <textarea
              id="ann-content"
              name="content"
              value={form.content}
              onChange={handleChange}
              className="input min-h-[160px] resize-y"
              placeholder="Write your announcement..."
              rows={6}
              required
            />
          </div>

          <div>
            <label htmlFor="ann-link" className="input-label">Reference Link</label>
            <input
              id="ann-link"
              name="link"
              type="url"
              value={form.link || ''}
              onChange={handleChange}
              className="input"
              placeholder="https://example.com/..."
            />
          </div>

          <div>
            <label htmlFor="ann-priority" className="input-label">Priority</label>
            <select
              id="ann-priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="input"
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : isEdit ? 'Update' : 'Post Announcement'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/announcements')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
