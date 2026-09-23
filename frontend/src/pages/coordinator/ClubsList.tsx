import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { coordinatorApi } from '../../api/coordinator';
import { PageSpinner, EmptyState, Toast } from '../../components/ui/Shared';
import { Users, Plus, Edit, ShieldBan, ShieldCheck, UserCheck } from 'lucide-react';
import { formatDateTime } from '../../utils';

export default function CoordinatorClubsList() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClub, setNewClub] = useState({ name: '', description: '', category: '', admin_email: '' });
  const [processing, setProcessing] = useState(false);

  const fetchClubs = async () => {
    try {
      const res = await coordinatorApi.getClubs();
      setClubs(res.data);
    } catch (err: any) {
      setToast({ message: err.response?.data?.detail || 'Failed to load clubs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleToggleActive = async (id: string, currentStatus: boolean, name: string) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} ${name}?`)) return;
    
    try {
      await coordinatorApi.updateClub(id, { is_active: !currentStatus });
      setToast({ message: `Club ${action}d successfully`, type: 'success' });
      fetchClubs();
    } catch (err: any) {
      setToast({ message: err.response?.data?.detail || `Failed to ${action} club`, type: 'error' });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await coordinatorApi.createClub(newClub);
      setToast({ message: 'Club created successfully!', type: 'success' });
      setShowCreateModal(false);
      setNewClub({ name: '', description: '', category: '', admin_email: '' });
      fetchClubs();
    } catch (err: any) {
      setToast({ message: err.response?.data?.detail || 'Failed to create club', type: 'error' });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Manage Clubs</h1>
          <p className="page-subtitle">View and manage all clubs under your supervision.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add New Club
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map(club => (
          <div key={club.id} className={`card p-6 flex flex-col ${!club.is_active ? 'opacity-75 bg-gray-50' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-navy-900 text-lg">{club.name}</h3>
                <span className="text-xs text-gray-500 uppercase tracking-wider">{club.category || 'General'}</span>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${club.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {club.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 my-4 flex-1">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-primary-600">{club.member_count}</div>
                <div className="text-xs text-gray-500 uppercase">Members</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-amber-500">{club.activity_count}</div>
                <div className="text-xs text-gray-500 uppercase">Activities</div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <Link to={`/coordinator/clubs/${club.id}/members`} className="flex-1 btn border border-gray-200 hover:bg-gray-50 text-gray-700 justify-center">
                <UserCheck className="w-4 h-4 mr-1.5" />
                Members
              </Link>
              <button 
                onClick={() => handleToggleActive(club.id, club.is_active, club.name)}
                className={`flex-1 btn justify-center ${club.is_active ? 'border border-red-200 text-red-600 hover:bg-red-50' : 'border border-green-200 text-green-600 hover:bg-green-50'}`}
              >
                {club.is_active ? (
                  <><ShieldBan className="w-4 h-4 mr-1.5" /> Deactivate</>
                ) : (
                  <><ShieldCheck className="w-4 h-4 mr-1.5" /> Activate</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {clubs.length === 0 && (
        <div className="p-12">
          <EmptyState
            icon={Users}
            title="No clubs managed"
            description="You are not currently managing any clubs."
            action={
              <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                Create First Club
              </button>
            }
          />
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-navy-900">Create New Club</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="input-label">Club Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    className="input"
                    value={newClub.name}
                    onChange={e => setNewClub({...newClub, name: e.target.value})}
                    placeholder="e.g. Photography Club"
                  />
                </div>
                
                <div>
                  <label className="input-label">Category</label>
                  <input
                    type="text"
                    className="input"
                    value={newClub.category}
                    onChange={e => setNewClub({...newClub, category: e.target.value})}
                    placeholder="e.g. Arts & Culture"
                  />
                </div>
                
                <div>
                  <label className="input-label">Description</label>
                  <textarea
                    rows={3}
                    className="input resize-none"
                    value={newClub.description}
                    onChange={e => setNewClub({...newClub, description: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="input-label">Student Coordinator Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    className="input"
                    value={newClub.admin_email}
                    onChange={e => setNewClub({...newClub, admin_email: e.target.value})}
                    placeholder="e.g. student@bit.edu"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This user will become the Student Coordinator for this club. They must already be registered.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-ghost">
                  Cancel
                </button>
                <button type="submit" disabled={processing} className="btn-primary">
                  {processing ? 'Creating...' : 'Create Club'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
