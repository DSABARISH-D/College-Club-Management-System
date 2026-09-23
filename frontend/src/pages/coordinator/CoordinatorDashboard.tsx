import React, { useEffect, useState } from 'react';
import { coordinatorApi, PendingApprovalsResponse } from '../../api/coordinator';
import { formatDateTime } from '../../utils';
import { Check, X, CalendarDays, Megaphone, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { PageSpinner, EmptyState } from '../../components/ui/Shared';

export default function CoordinatorDashboard() {
  const [data, setData] = useState<PendingApprovalsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<{id: string, type: string} | null>(null);

  const fetchPending = async () => {
    try {
      const res = await coordinatorApi.getPendingApprovals();
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: string, type: string) => {
    setProcessingId(id);
    try {
      if (type === 'Activity') {
        await coordinatorApi.approveActivity(id, 'APPROVED');
      } else if (type === 'Announcement') {
        await coordinatorApi.approveAnnouncement(id, 'APPROVED');
      } else if (type === 'Post') {
        await coordinatorApi.approvePost(id, 'APPROVED');
      }
      fetchPending();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error approving content');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRejectModal) return;
    
    setProcessingId(showRejectModal.id);
    try {
      if (showRejectModal.type === 'Activity') {
        await coordinatorApi.approveActivity(showRejectModal.id, 'REJECTED', rejectionReason);
      } else if (showRejectModal.type === 'Announcement') {
        await coordinatorApi.approveAnnouncement(showRejectModal.id, 'REJECTED', rejectionReason);
      } else if (showRejectModal.type === 'Post') {
        await coordinatorApi.approvePost(showRejectModal.id, 'REJECTED', rejectionReason);
      }
      setShowRejectModal(null);
      setRejectionReason('');
      fetchPending();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Error rejecting content');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <PageSpinner />;
  
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block">
          <AlertCircle className="w-8 h-8 mx-auto mb-2" />
          {error}
        </div>
      </div>
    );
  }

  const allPending = [...(data?.activities || []), ...(data?.announcements || []), ...(data?.posts || [])]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="page-title">Coordinator Dashboard</h1>
        <p className="page-subtitle">Review and manage content from Student Coordinators.</p>
      </div>

      <div className="card">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-navy-900">Pending Approvals</h2>
          <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {allPending.length} pending
          </span>
        </div>

        {allPending.length === 0 ? (
          <div className="p-12">
            <EmptyState
              icon={Check}
              title="All caught up!"
              description="There are no pending activities or announcements to review."
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {allPending.map(item => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex gap-4 items-start">
                  <div className={`p-3 rounded-xl shrink-0 ${
                    item.type === 'Activity' ? 'bg-blue-50 text-blue-600' :
                    item.type === 'Announcement' ? 'bg-purple-50 text-purple-600' :
                    'bg-emerald-50 text-emerald-600'
                  }`}>
                    {item.type === 'Activity' ? <CalendarDays className="w-6 h-6" /> :
                     item.type === 'Announcement' ? <Megaphone className="w-6 h-6" /> :
                     <ImageIcon className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        {item.type}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{item.club_name}</span>
                    </div>
                    <h3 className="font-semibold text-navy-900 text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500">Submitted {formatDateTime(item.created_at)}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleApprove(item.id, item.type)}
                    disabled={processingId === item.id}
                    className="flex-1 sm:flex-none btn border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal({ id: item.id, type: item.type })}
                    disabled={processingId === item.id}
                    className="flex-1 sm:flex-none btn border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-navy-900 mb-2">Reject Content</h3>
              <p className="text-gray-500 text-sm mb-6">
                Please provide a reason for rejecting this {showRejectModal.type.toLowerCase()}. The student coordinator will see this reason.
              </p>
              
              <form onSubmit={handleReject}>
                <div className="mb-6">
                  <label className="input-label">Rejection Reason</label>
                  <textarea
                    required
                    rows={3}
                    className="input resize-none"
                    placeholder="e.g. Please clarify the event timings..."
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(null);
                      setRejectionReason('');
                    }}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={processingId === showRejectModal.id}
                    className="btn border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  >
                    {processingId === showRejectModal.id ? 'Rejecting...' : 'Confirm Rejection'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
