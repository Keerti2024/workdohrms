import { api } from './client';
import { ApiResponse, AuthResponse, DashboardStats, TimeOffRequest, TimeOffCategory, WorkLog, User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/sign-in', { email, password });
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    const response = await api.post('/auth/sign-out');
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get('/dashboard');
    return response.data;
  },
};

export const attendanceService = {
  clockIn: async (): Promise<ApiResponse<WorkLog>> => {
    const response = await api.post('/clock-in');
    return response.data;
  },

  clockOut: async (): Promise<ApiResponse<WorkLog>> => {
    const response = await api.post('/clock-out');
    return response.data;
  },

  getWorkLogs: async (params?: { start_date?: string; end_date?: string }): Promise<ApiResponse<WorkLog[]>> => {
    const response = await api.get('/work-logs', { params });
    return response.data;
  },

  getSummary: async (params: { staff_member_id: number; start_date: string; end_date: string }): Promise<ApiResponse<any>> => {
    const response = await api.get('/attendance-summary', { params });
    return response.data;
  },
};

export const leaveService = {
  getCategories: async (): Promise<ApiResponse<TimeOffCategory[]>> => {
    const response = await api.get('/time-off-categories');
    return response.data;
  },

  getRequests: async (params?: { status?: string }): Promise<ApiResponse<TimeOffRequest[]>> => {
    const response = await api.get('/time-off-requests', { params });
    return response.data;
  },

  createRequest: async (data: {
    time_off_category_id: number;
    start_date: string;
    end_date: string;
    reason: string;
  }): Promise<ApiResponse<TimeOffRequest>> => {
    const response = await api.post('/time-off-requests', data);
    return response.data;
  },

  getBalance: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/time-off-balance');
    return response.data;
  },
};
