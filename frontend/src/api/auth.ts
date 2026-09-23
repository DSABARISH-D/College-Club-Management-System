import api from './axios';
import type { LoginPayload, RegisterPayload, TokenResponse, User } from '../types';

export const authApi = {
  register: (data: RegisterPayload) =>
    api.post<TokenResponse>('/auth/register', data),

  login: (data: LoginPayload) =>
    api.post<TokenResponse>('/auth/login', data),

  me: () =>
    api.get<User>('/auth/me'),
};
