import api from './axios';
import type { Post, PostCreatePayload, PostUpdatePayload } from '../types';

export const postsApi = {
  listByClub: (clubId: string) =>
    api.get<Post[]>(`/clubs/${clubId}/posts`),

  listByClubAdmin: (clubId: string) =>
    api.get<Post[]>(`/admin/clubs/${clubId}/posts`),

  create: (clubId: string, data: PostCreatePayload) =>
    api.post<Post>(`/admin/clubs/${clubId}/posts`, data),

  update: (id: string, data: PostUpdatePayload) =>
    api.put<Post>(`/admin/posts/${id}`, data),

  delete: (id: string) =>
    api.delete(`/admin/posts/${id}`),
};
