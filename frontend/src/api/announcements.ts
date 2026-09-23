import api from './axios';
import type { Announcement, AnnouncementCreatePayload, AnnouncementUpdatePayload } from '../types';

export const announcementsApi = {
  listAll: () =>
    api.get<Announcement[]>('/announcements'),

  listByClub: (slug: string) =>
    api.get<Announcement[]>(`/clubs/${slug}/announcements`),

  create: (slug: string, data: AnnouncementCreatePayload) =>
    api.post<Announcement>(`/clubs/${slug}/announcements`, data),

  update: (id: string, data: AnnouncementUpdatePayload) =>
    api.put<Announcement>(`/announcements/${id}`, data),

  delete: (id: string) =>
    api.delete(`/announcements/${id}`),
};
