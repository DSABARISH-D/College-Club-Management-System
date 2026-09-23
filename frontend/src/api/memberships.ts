import api from './axios';
import type { Member, MyClub } from '../types';

export const membershipsApi = {
  join: (slug: string) =>
    api.post(`/clubs/${slug}/join`),

  leave: (slug: string) =>
    api.delete(`/clubs/${slug}/leave`),

  getMembers: (slug: string) =>
    api.get<Member[]>(`/clubs/${slug}/members`),

  removeMember: (slug: string, userId: string) =>
    api.delete(`/clubs/${slug}/members/${userId}`),

  myClubs: () =>
    api.get<MyClub[]>('/me/clubs'),
};
