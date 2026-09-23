import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { clubsApi } from '../../api/clubs';
import type { AdminDashboardData, ClubUpdatePayload } from '../../types';
import { PageSpinner, Toast } from '../../components/ui/Shared';
import { getErrorMessage } from '../../utils';
import { Save, Settings } from 'lucide-react';

export default function ClubSettings() {
  const navigate = useNavigate();
  const [clubSlug, setClubSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState<ClubUpdatePayload>({
    name: '',
    description: '',
    category: '',
    logo_url: '',
    banner_url: '',
  });

  useEffect(() => {
    adminApi.getDashboard().then(async (res) => {
      const data: AdminDashboardData = res.data;
      if (data.club) {
        setClubSlug(data.club.slug);
        const clubRes = await clubsApi.getBySlug(data.club.slug);
        const club = clubRes.data;
        setForm({
          name: club.name,
          description: club.description || '',
          category: club.category || '',
          logo_url: club.logo_url || '',
          banner_url: club.banner_url || '',
        });
      }
      setLoading(false);
    });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const result = await clubsApi.update(clubSlug, form);
      setClubSlug(result.data.slug);
      setToast({ message: 'Club settings updated!', type: 'success' });
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

      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-gray-400" />
        <h1 className="page-title">Club Settings</h1>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="club-name" className="input-label">Club Name</label>
            <input
              id="club-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label htmlFor="club-desc" className="input-label">Description</label>
            <textarea
              id="club-desc"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input min-h-[120px] resize-y"
              rows={4}
            />
          </div>

          <div>
            <label htmlFor="club-category" className="input-label">Category</label>
            <select
              id="club-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select Category</option>
              <option value="Technical">Technical</option>
              <option value="Cultural">Cultural</option>
              <option value="Sports">Sports</option>
              <option value="Creative">Creative</option>
              <option value="Social">Social</option>
              <option value="Academic">Academic</option>
            </select>
          </div>

          <div>
            <label htmlFor="club-logo" className="input-label">Logo URL</label>
            <input
              id="club-logo"
              name="logo_url"
              type="url"
              value={form.logo_url}
              onChange={handleChange}
              className="input"
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div>
            <label htmlFor="club-banner" className="input-label">Banner URL</label>
            <input
              id="club-banner"
              name="banner_url"
              type="url"
              value={form.banner_url}
              onChange={handleChange}
              className="input"
              placeholder="https://example.com/banner.jpg"
            />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={saving} className="btn-primary">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
