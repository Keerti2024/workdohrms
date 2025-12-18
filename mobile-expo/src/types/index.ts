export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  role_display: string;
  permissions: string[];
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    access_token: string;
    token_type: string;
  };
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  meta?: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface DashboardStats {
  total_employees: number;
  present_today: number;
  on_leave: number;
  pending_approvals: number;
}

export interface TimeOffRequest {
  id: number;
  staff_member_id: number;
  time_off_category_id: number;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string;
  status: 'pending' | 'approved' | 'declined';
  created_at: string;
}

export interface TimeOffCategory {
  id: number;
  name: string;
  annual_allowance: number;
  is_paid: boolean;
}

export interface WorkLog {
  id: number;
  staff_member_id: number;
  log_date: string;
  clock_in: string | null;
  clock_out: string | null;
  status: string;
}
