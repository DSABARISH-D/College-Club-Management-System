import React, { useEffect, useState } from 'react';
import { coordinatorApi } from '../../api/coordinator';
import { PageSpinner, EmptyState, Toast } from '../../components/ui/Shared';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, CalendarDays, FileCheck, Activity as ActivityIcon } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function CoordinatorAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    coordinatorApi.getAnalytics()
      .then(res => setAnalytics(res.data))
      .catch(err => setToast({ message: err.response?.data?.detail || 'Failed to load analytics', type: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageSpinner />;
  if (!analytics) return <EmptyState icon={TrendingUp} title="No Analytics Available" description="Could not load analytics data." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-8">
        <h1 className="page-title">Analytics Dashboard</h1>
        <p className="page-subtitle">Overview of all clubs under your supervision</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 flex items-center gap-4 border-l-4 border-blue-500">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 uppercase">Total Clubs</div>
            <div className="text-2xl font-bold text-navy-900">{analytics.total_clubs}</div>
          </div>
        </div>
        
        <div className="card p-6 flex items-center gap-4 border-l-4 border-green-500">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 uppercase">Total Members</div>
            <div className="text-2xl font-bold text-navy-900">{analytics.total_members}</div>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 border-l-4 border-purple-500">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 uppercase">Total Activities</div>
            <div className="text-2xl font-bold text-navy-900">{analytics.total_activities}</div>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4 border-l-4 border-amber-500">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 uppercase">Pending Approvals</div>
            <div className="text-2xl font-bold text-navy-900">{analytics.pending_approvals}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card p-6">
          <h3 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
            <ActivityIcon className="w-5 h-5 text-primary-500" />
            Activities by Club
          </h3>
          <div className="h-80 w-full">
            {analytics.activities_by_club.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.activities_by_club} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 12}} />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Activities" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-navy-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-500" />
            Members Distribution
          </h3>
          <div className="h-80 w-full">
            {analytics.members_by_club.some((c: any) => c.count > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.members_by_club.filter((c: any) => c.count > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    paddingAngle={5}
                  >
                    {analytics.members_by_club.filter((c: any) => c.count > 0).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No members data available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
