import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsApi } from '../../api/posts';
import { adminApi } from '../../api/admin';
import type { Post } from '../../types';
import { PageSpinner, EmptyState, Toast, Badge } from '../../components/ui/Shared';
import { formatDate, getApprovalBadge } from '../../utils';
import { MessageSquare, Plus, ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function ManagePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [clubId, setClubId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchPosts = async (cId: string) => {
    try {
      const res = await postsApi.listByClubAdmin(cId);
      setPosts(res.data);
    } catch (err: any) {
      setToast({ message: err.response?.data?.detail || 'Failed to load posts', type: 'error' });
    }
  };

  useEffect(() => {
    adminApi.getDashboard().then(res => {
      if (res.data.club) {
        setClubId(res.data.club.id);
        fetchPosts(res.data.club.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="page-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Manage Posts</h1>
          <p className="page-subtitle">Create and manage posts for your club page</p>
        </div>
        {clubId && (
          <Link to="/admin/posts/new" className="btn-primary">
            <Plus className="w-4 h-4" />
            Create Post
          </Link>
        )}
      </div>

      {!clubId ? (
        <EmptyState
          icon={MessageSquare}
          title="No Club Assigned"
          description="You must be an admin of a club to manage posts."
        />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No Posts Yet"
          description="You haven't created any posts yet."
          action={{
            label: "Create Post",
            onClick: () => window.location.href = '/admin/posts/new'
          }}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {posts.map((post) => (
            <div key={post.id} className="p-6 flex flex-col md:flex-row md:items-start gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-navy-900 truncate">
                    {post.title}
                  </h3>
                  {getApprovalBadge(post.approval_status)}
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {post.content}
                </p>

                {post.approval_status === 'REJECTED' && post.rejection_reason && (
                  <div className="mb-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                    <strong>Reason for rejection:</strong> {post.rejection_reason}
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                    Created {formatDate(post.created_at)}
                  </div>
                  {post.image_url && (
                    <div className="flex items-center gap-1 text-primary-600">
                      <ImageIcon className="w-4 h-4" />
                      Image Attached
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
