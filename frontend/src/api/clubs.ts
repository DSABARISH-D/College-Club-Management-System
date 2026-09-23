import api from './axios';
import type { Club, ClubUpdatePayload } from '../types';

export const clubsApi = {
  list: (params?: { search?: string; category?: string }) =>
    api.get<Club[]>('/clubs', { params }),

  getBySlug: (slug: string) =>
    api.get<Club>(`/clubs/${slug}`),

  update: (slug: string, data: ClubUpdatePayload) =>
    api.put<Club>(`/clubs/${slug}`, data),

  getCategories: () =>
    api.get<string[]>('/clubs/categories'),
};
