import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clubsApi } from '../../api/clubs';
import type { Club } from '../../types';
import { PageSpinner, EmptyState } from '../../components/ui/Shared';
import { Search, Users, Filter, Inbox } from 'lucide-react';

export default function ExploreClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchClubs = () => {
    setLoading(true);
    clubsApi
      .list({ search: search || undefined, category: category || undefined })
      .then((res) => setClubs(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    clubsApi.getCategories().then((res) => setCategories(res.data));
    fetchClubs();
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchClubs, 300);
    return () => clearTimeout(timer);
  }, [search, category]);

  return (
    <div className="page-container">
      <div className="mb-8">
        <h1 className="page-title">Explore Clubs</h1>
        <p className="page-subtitle">Discover clubs and communities at BIT</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
            placeholder="Search clubs by name..."
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input pl-10 pr-8 min-w-[160px]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clubs grid */}
      {loading ? (
        <PageSpinner />
      ) : clubs.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No clubs found"
          description={search || category ? 'Try adjusting your search or filter' : 'No clubs are available yet'}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <Link key={club.id} to={`/clubs/${club.slug}`} className="card-hover group">
              {/* Club logo/header */}
              <div className="h-32 bg-gradient-to-br from-primary-100 to-primary-50 rounded-t-xl flex items-center justify-center relative overflow-hidden">
                {club.logo_url ? (
                  <img
                    src={club.logo_url}
                    alt={club.name}
                    className="w-16 h-16 rounded-xl bg-white p-2 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-2xl font-bold text-primary-600">
                      {club.name.charAt(0)}
                    </span>
                  </div>
                )}
                {club.category && (
                  <span className="absolute top-3 right-3 badge-primary">{club.category}</span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-navy-900 group-hover:text-primary-600 transition-colors">
                  {club.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">
                  {club.description || 'No description available'}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{club.member_count} members</span>
                  </div>
                  {club.is_member && (
                    <span className="badge-green">Joined</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
