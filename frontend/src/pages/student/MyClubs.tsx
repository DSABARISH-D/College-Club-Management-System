import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { membershipsApi } from '../../api/memberships';
import type { MyClub } from '../../types';
import { PageSpinner, EmptyState } from '../../components/ui/Shared';
import { formatDate } from '../../utils';
import { Users, Compass, ArrowRight } from 'lucide-react';

export default function MyClubs() {
  const [clubs, setClubs] = useState<MyClub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    membershipsApi.myClubs()
      .then((res) => setClubs(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title">My Clubs</h1>
        <p className="page-subtitle">Clubs you've joined</p>
      </div>

      {clubs.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clubs joined yet"
          description="Explore clubs and find communities that interest you"
          action={
            <Link to="/explore" className="btn-primary">
              <Compass className="w-4 h-4" />
              Explore Clubs
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <Link key={club.id} to={`/clubs/${club.club_slug}`} className="card-hover group p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                  {club.club_logo_url ? (
                    <img src={club.club_logo_url} alt={club.club_name} className="w-8 h-8 rounded-lg" />
                  ) : (
                    <span className="text-lg font-bold text-primary-600">{club.club_name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-navy-900 group-hover:text-primary-600 transition-colors truncate">
                    {club.club_name}
                  </h3>
                  {club.club_category && (
                    <span className="badge-primary mt-1">{club.club_category}</span>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Joined {formatDate(club.joined_at)}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
