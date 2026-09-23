import api from './axios';
import type { AdminDashboardData } from '../types';

export const adminApi = {
  getDashboard: () =>
    api.get<AdminDashboardData>('/admin/dashboard'),
};
