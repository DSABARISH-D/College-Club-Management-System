import api from './axios';
import type { Activity, ActivityCreatePayload, ActivityUpdatePayload } from '../types';

export const activitiesApi = {
  listAll: (status?: string) =>
    api.get<Activity[]>('/activities', { params: status ? { status } : {} }),

  getById: (id: string) =>
    api.get<Activity>(`/activities/${id}`),

  listByClub: (slug: string) =>
    api.get<Activity[]>(`/clubs/${slug}/activities`),

  create: (slug: string, data: ActivityCreatePayload) =>
    api.post<Activity>(`/clubs/${slug}/activities`, data),

  update: (id: string, data: ActivityUpdatePayload) =>
    api.put<Activity>(`/activities/${id}`, data),

  delete: (id: string) =>
    api.delete(`/activities/${id}`),
};
