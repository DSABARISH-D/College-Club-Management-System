import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { activitiesApi } from '../../api/activities';
import type { Activity } from '../../types';
import { PageSpinner, EmptyState } from '../../components/ui/Shared';
import { formatDateTime, getStatusBadge } from '../../utils';
import { CalendarDays, MapPin, ArrowLeft, Clock } from 'lucide-react';

// Activities listing page
export function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    activitiesApi.listAll(filter || undefined)
      .then((res) => setActivities(res.data))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Activities</h1>
          <p className="page-subtitle">Events and activities across all clubs</p>
        </div>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setLoading(true); }}
          className="input max-w-[180px]"
        >
          <option value="">All Status</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <PageSpinner />
      ) : activities.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No activities found"
          description={filter ? 'Try a different status filter' : 'No activities have been posted yet'}
        />
      ) : (
        <div className="space-y-4">
          {activities.map((a) => (
            <Link key={a.id} to={`/activities/${a.id}`} className="card-hover block p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-navy-900">{a.title}</h3>
                    <span className={getStatusBadge(a.status)}>{a.status}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDateTime(a.start_date)}
                    </span>
                    {a.venue && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {a.venue}
                      </span>
                    )}
                  </div>
                </div>
                <span className="badge-primary shrink-0">{a.club_name}</span>
              </div>
              {a.description && (
                <p className="text-sm text-gray-500 mt-3 line-clamp-2">{a.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Activity detail page
export function ActivityDetail() {
  const { id } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      activitiesApi.getById(id)
        .then((res) => setActivity(res.data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <PageSpinner />;
  if (!activity) return <div className="page-container text-center text-gray-500">Activity not found</div>;

  return (
    <div className="page-container max-w-3xl">
      <Link to="/activities" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Activities
      </Link>

      <div className="card p-8">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">{activity.title}</h1>
            <Link to={`/clubs/${activity.club_slug}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-1 inline-block">
              {activity.club_name}
            </Link>
          </div>
          <span className={`${getStatusBadge(activity.status)} text-sm`}>{activity.status}</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-gray-500">Start</div>
              <div className="font-medium text-navy-900">{formatDateTime(activity.start_date)}</div>
            </div>
          </div>
          {activity.end_date && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-gray-500">End</div>
                <div className="font-medium text-navy-900">{formatDateTime(activity.end_date)}</div>
              </div>
            </div>
          )}
          {activity.venue && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-gray-500">Venue</div>
                <div className="font-medium text-navy-900">{activity.venue}</div>
              </div>
            </div>
          )}
        </div>

        {activity.description && (
          <div className="mt-6">
            <h2 className="font-semibold text-navy-900 mb-2">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{activity.description}</p>
          </div>
        )}

        {activity.link && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <a href={activity.link} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Register / Reference Link
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
