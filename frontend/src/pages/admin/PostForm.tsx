import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admin';
import { postsApi } from '../../api/posts';
import { PageSpinner, Toast } from '../../components/ui/Shared';
import { ArrowLeft, Save, Info } from 'lucide-react';
import type { PostCreatePayload } from '../../types';

export default function PostForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clubId, setClubId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState<PostCreatePayload>({
    title: '',
    content: '',
    image_url: ''
  });

  useEffect(() => {
    adminApi.getDashboard().then(res => {
      if (res.data.club) {
        setClubId(res.data.club.id);
      } else {
        setToast({ message: 'You must be assigned to a club to create a post.', type: 'error' });
      }
    }).catch(() => {
      setToast({ message: 'Failed to load club details.', type: 'error' });
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId) return;

    try {
      setSubmitting(true);
      await postsApi.create(clubId, formData);
      navigate('/admin/posts', { state: { message: 'Post submitted for approval.' } });
    } catch (err: any) {
      setToast({ message: err.response?.data?.detail || 'Failed to submit post', type: 'error' });
      setSubmitting(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <button onClick={() => navigate('/admin/posts')} className="flex items-center gap-2 text-gray-500 hover:text-navy-900 transition-colors mb-6 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back to Posts
      </button>

      <div className="mb-8">
        <h1 className="page-title">Create Post</h1>
        <p className="page-subtitle">Publish a new update or gallery post on your club page</p>
      </div>
      
      <div className="mb-6 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-100 flex items-start gap-3">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm font-medium">
          Posts require approval from the Club Coordinator before they are publicly visible on the club page.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="form-label">Post Title *</label>
            <input
              type="text"
              id="title"
              required
              className="form-input"
              placeholder="e.g., Highlights from our recent Hackathon!"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="content" className="form-label">Content *</label>
            <textarea
              id="content"
              required
              rows={5}
              className="form-input resize-none"
              placeholder="Write your post content here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="image_url" className="form-label">Image URL (Optional)</label>
            <input
              type="url"
              id="image_url"
              className="form-input"
              placeholder="https://example.com/image.png"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
            <p className="mt-1 text-xs text-gray-500">Provide a direct link to an image file to display alongside your post.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/posts')}
            className="btn-secondary mr-3"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={submitting || !clubId}
          >
            <Save className="w-4 h-4 mr-2" />
            {submitting ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
}
