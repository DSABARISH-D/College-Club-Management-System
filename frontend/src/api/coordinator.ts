import api from './axios';
import type { Activity, Announcement, Post } from '../types';

export interface PendingApprovalsResponse {
  activities: (Activity & { type: string })[];
  announcements: (Announcement & { type: string })[];
  posts: (Post & { type: string })[];
}

export const coordinatorApi = {
  getPendingApprovals: () => 
    api.get<PendingApprovalsResponse>('/coordinator/pending'),
    
  approveActivity: (id: string, status: 'APPROVED' | 'REJECTED', rejection_reason?: string) =>
    api.patch(`/activities/${id}/approval`, { status, rejection_reason }),
    
  approveAnnouncement: (id: string, status: 'APPROVED' | 'REJECTED', rejection_reason?: string) =>
    api.patch(`/announcements/${id}/approval`, { status, rejection_reason }),

  approvePost: (id: string, approval_status: 'APPROVED' | 'REJECTED', rejection_reason?: string) =>
    api.patch(`/posts/${id}/approval`, { approval_status, rejection_reason }),
    
  getClubs: () => api.get('/coordinator/clubs'),
  createClub: (data: { name: string; description?: string; category?: string; admin_email: string }) =>
    api.post('/coordinator/clubs', data),
  updateClub: (id: string, data: { name?: string; description?: string; category?: string; is_active?: boolean }) =>
    api.patch(`/coordinator/clubs/${id}`, data),
  getClubMembers: (id: string) => api.get(`/coordinator/clubs/${id}/members`),
  
  getAnalytics: () => api.get('/coordinator/analytics'),
};
