import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { announcementsApi } from '../../api/announcements';
import type { Announcement } from '../../types';
import { PageSpinner, EmptyState } from '../../components/ui/Shared';
import { timeAgo, getPriorityBadge } from '../../utils';
import { Megaphone, Inbox } from 'lucide-react';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    announcementsApi.listAll()
      .then((res) => setAnnouncements(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="page-container max-w-3xl">
      <div className="mb-8">
        <h1 className="page-title">Announcements</h1>
        <p className="page-subtitle">Latest updates from clubs</p>
      </div>

      {announcements.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No announcements"
          description="Announcements from clubs will appear here"
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Megaphone className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-navy-900">{a.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Link
                        to={`/clubs/${a.club_slug}`}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        {a.club_name}
                      </Link>
                      <span className="text-xs text-gray-400">• {timeAgo(a.created_at)}</span>
                    </div>
                  </div>
                </div>
                <span className={`${getPriorityBadge(a.priority)} shrink-0`}>{a.priority}</span>
              </div>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">{a.content}</p>
              {a.link && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                  <a href={a.link} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-1.5">
                    View Reference Link
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
