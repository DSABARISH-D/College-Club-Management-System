import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { activitiesApi } from '../../api/activities';
import type { AdminDashboardData, ActivityCreatePayload, ActivityStatus } from '../../types';
import { PageSpinner, Toast } from '../../components/ui/Shared';
import { getErrorMessage } from '../../utils';
import { Save, ArrowLeft } from 'lucide-react';

export default function ActivityForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [clubSlug, setClubSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState<ActivityCreatePayload>({
    title: '',
    description: '',
    venue: '',
    link: '',
    start_date: '',
    end_date: '',
    status: 'UPCOMING',
  });

  useEffect(() => {
    adminApi.getDashboard().then(async (res) => {
      const data: AdminDashboardData = res.data;
      if (data.club) {
        setClubSlug(data.club.slug);
      }

      if (isEdit && id) {
        const actRes = await activitiesApi.getById(id);
        const act = actRes.data;
        setForm({
          title: act.title,
          description: act.description || '',
          venue: act.venue || '',
          link: act.link || '',
          start_date: act.start_date ? act.start_date.slice(0, 16) : '',
          end_date: act.end_date ? act.end_date.slice(0, 16) : '',
          status: act.status,
        });
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
      const payload = {
        ...form,
        start_date: new Date(form.start_date).toISOString(),
        end_date: form.end_date ? new Date(form.end_date).toISOString() : undefined,
      };

      if (isEdit && id) {
        await activitiesApi.update(id, payload);
        setToast({ message: 'Activity updated!', type: 'success' });
      } else {
        await activitiesApi.create(clubSlug, payload);
        setToast({ message: 'Activity created!', type: 'success' });
      }
      setTimeout(() => navigate('/admin/activities'), 800);
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
        onClick={() => navigate('/admin/activities')}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Activities
      </button>

      <h1 className="page-title mb-6">{isEdit ? 'Edit Activity' : 'Create Activity'}</h1>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="act-title" className="input-label">Title *</label>
            <input
              id="act-title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g. Hackathon 2026"
              required
            />
          </div>

          <div>
            <label htmlFor="act-desc" className="input-label">Description</label>
            <textarea
              id="act-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input min-h-[120px] resize-y"
              placeholder="Describe the activity..."
              rows={4}
            />
          </div>

          <div>
            <label htmlFor="act-venue" className="input-label">Venue</label>
            <input
              id="act-venue"
              name="venue"
              type="text"
              value={form.venue}
              onChange={handleChange}
              className="input"
              placeholder="e.g. Main Auditorium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="act-start" className="input-label">Start Date & Time *</label>
              <input
                id="act-start"
                name="start_date"
                type="datetime-local"
                value={form.start_date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label htmlFor="act-end" className="input-label">End Date & Time</label>
              <input
                id="act-end"
                name="end_date"
                type="datetime-local"
                value={form.end_date}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div>
            <label htmlFor="act-link" className="input-label">Registration/Reference Link</label>
            <input
              id="act-link"
              name="link"
              type="url"
              value={form.link || ''}
              onChange={handleChange}
              className="input"
              placeholder="https://docs.google.com/forms/..."
            />
          </div>

          <div>
            <label htmlFor="act-status" className="input-label">Status</label>
            <select
              id="act-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input"
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : isEdit ? 'Update Activity' : 'Create Activity'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/activities')}
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
