import { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { membershipsApi } from '../../api/memberships';
import type { AdminDashboardData, Member } from '../../types';
import { PageSpinner, EmptyState, Toast } from '../../components/ui/Shared';
import { formatDate, getErrorMessage } from '../../utils';
import { Users, Trash2, Search } from 'lucide-react';

export default function ManageMembers() {
  const [clubSlug, setClubSlug] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    adminApi.getDashboard().then((res) => {
      const data: AdminDashboardData = res.data;
      if (data.club) {
        setClubSlug(data.club.slug);
        membershipsApi.getMembers(data.club.slug)
          .then((mRes) => setMembers(mRes.data))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  const handleRemove = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name} from the club?`)) return;
    try {
      await membershipsApi.removeMember(clubSlug, userId);
      setMembers(members.filter((m) => m.user_id !== userId));
      setToast({ message: `${name} removed successfully`, type: 'success' });
    } catch (err) {
      setToast({ message: getErrorMessage(err), type: 'error' });
    }
  };

  const filtered = members.filter(
    (m) =>
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.roll_number.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageSpinner />;

  return (
    <div className="page-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Manage Members</h1>
          <p className="page-subtitle">{members.length} total members</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
            placeholder="Search members..."
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={search ? 'No matching members' : 'No members yet'}
          description={search ? 'Try a different search term' : 'Members who join your club will appear here'}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Member</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Roll No.</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Department</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Joined</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary-700">
                          {m.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-navy-900">{m.full_name}</div>
                          <div className="text-xs text-gray-500">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">{m.roll_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{m.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">{formatDate(m.joined_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleRemove(m.user_id, m.full_name)}
                        className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
