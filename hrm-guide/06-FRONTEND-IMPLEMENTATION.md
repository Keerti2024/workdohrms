# WorkDo HRM - Frontend Implementation Guide (React)

## Table of Contents
1. Project Setup
2. Project Configuration
3. State Management (Redux Toolkit)
4. API Integration (Axios)
5. Authentication Implementation
6. Routing & Navigation
7. Layout Components
8. Common Components
9. Feature Modules
10. Form Handling
11. Testing

---

## 1. Project Setup

### Create React Project with Vite
```bash
npm create vite@latest hrm-frontend -- --template react-ts
cd hrm-frontend
```

### Install Dependencies
```bash
# Core dependencies
npm install react-router-dom @reduxjs/toolkit react-redux axios

# UI Components
npm install @headlessui/react @heroicons/react
npm install tailwindcss postcss autoprefixer
npm install clsx tailwind-merge

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Date handling
npm install date-fns

# Charts
npm install recharts

# Tables
npm install @tanstack/react-table

# Toast notifications
npm install react-hot-toast

# File upload
npm install react-dropzone

# Rich text editor
npm install @tiptap/react @tiptap/starter-kit

# Development
npm install -D @types/node
```

### Initialize Tailwind CSS
```bash
npx tailwindcss init -p
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900 antialiased;
  }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors;
  }
  
  .btn-primary {
    @apply btn bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
  }
  
  .btn-secondary {
    @apply btn bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-primary-500;
  }
  
  .btn-danger {
    @apply btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
  }
  
  .input {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500;
  }
  
  .input-error {
    @apply border-red-300 focus:ring-red-500 focus:border-red-500;
  }
  
  .label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200;
  }
}
```

---

## 2. Project Configuration

### src/config/index.ts
```typescript
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  appName: 'WorkDo HRM',
  tokenKey: 'hrm_token',
  userKey: 'hrm_user',
  defaultPageSize: 15,
  dateFormat: 'yyyy-MM-dd',
  dateTimeFormat: 'yyyy-MM-dd HH:mm',
  timeFormat: 'HH:mm',
};
```

### src/types/index.ts
```typescript
// Common types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  role?: Role;
  permissions?: string[];
  employee?: Employee;
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
  permissions_count?: number;
  users_count?: number;
}

export interface Permission {
  id: number;
  name: string;
}

// Employee types
export interface Employee {
  id: number;
  employee_id: string;
  user?: User;
  personal_info: {
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other';
    marital_status?: 'single' | 'married' | 'divorced' | 'widowed';
  };
  employment_details: {
    branch?: Branch;
    department?: Department;
    designation?: Designation;
    date_of_joining: string;
    employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
    employment_status: 'active' | 'inactive' | 'terminated' | 'resigned';
    shift?: Shift;
  };
  contact_info: {
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    full_address?: string;
  };
  emergency_contact: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  banking_info?: {
    bank_name?: string;
    account_holder_name?: string;
    account_number?: string;
    bank_identifier_code?: string;
  };
  documents?: EmployeeDocument[];
  awards?: Award[];
  leave_balances?: LeaveBalance[];
  statistics?: {
    total_awards: number;
    total_warnings: number;
  };
  created_at: string;
  updated_at: string;
}

// Organization types
export interface Branch {
  id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  status: 'active' | 'inactive';
}

export interface Department {
  id: number;
  branch_id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  branch?: Branch;
}

export interface Designation {
  id: number;
  department_id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  department?: Department;
}

// Leave types
export interface LeaveType {
  id: number;
  name: string;
  description?: string;
  max_days_per_year: number;
  leave_type: 'paid' | 'unpaid';
  color: string;
  status: 'active' | 'inactive';
}

export interface LeaveApplication {
  id: number;
  employee_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approved_by?: number;
  approved_at?: string;
  rejection_reason?: string;
  employee?: Employee;
  leave_type?: LeaveType;
  approver?: User;
  created_at: string;
}

export interface LeaveBalance {
  id: number;
  employee_id: number;
  leave_type_id: number;
  year: number;
  allocated_days: number;
  used_days: number;
  carried_forward_days: number;
  remaining_days: number;
  leave_type?: LeaveType;
}

// Attendance types
export interface Shift {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  break_duration_minutes: number;
  working_hours: number;
  grace_period_minutes: number;
  shift_type: 'day' | 'night' | 'rotating';
}

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  shift_id?: number;
  attendance_date: string;
  clock_in_time?: string;
  clock_out_time?: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_leave';
  overtime_hours?: number;
  notes?: string;
  employee?: Employee;
  shift?: Shift;
}

// Payroll types
export interface SalaryComponent {
  id: number;
  name: string;
  component_type: 'earning' | 'deduction';
  calculation_type: 'fixed' | 'percentage';
  percentage?: number;
  is_taxable: boolean;
  is_mandatory: boolean;
}

export interface Payslip {
  id: number;
  payroll_run_id: number;
  employee_id: number;
  base_salary: number;
  total_earnings: number;
  total_deductions: number;
  net_pay: number;
  earnings_breakdown: Record<string, number>;
  deductions_breakdown: Record<string, number>;
  status: 'generated' | 'sent' | 'paid';
  employee?: Employee;
  period?: string;
}

// Document types
export interface EmployeeDocument {
  id: number;
  employee_id: number;
  document_type_id: number;
  file_path: string;
  file_name: string;
  expiry_date?: string;
  document_type?: DocumentType;
}

export interface DocumentType {
  id: number;
  name: string;
  description?: string;
  is_required: boolean;
}

// Award types
export interface Award {
  id: number;
  employee_id: number;
  award_type_id: number;
  award_date: string;
  gift?: string;
  monetary_value?: number;
  description?: string;
  award_type?: AwardType;
}

export interface AwardType {
  id: number;
  name: string;
  description?: string;
}

// Recruitment types
export interface JobPosting {
  id: number;
  title: string;
  job_type_id: number;
  job_location_id: number;
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements: string;
  benefits?: string;
  is_featured: boolean;
  deadline?: string;
  status: 'draft' | 'published' | 'closed';
  job_type?: JobType;
  job_location?: JobLocation;
}

export interface JobType {
  id: number;
  name: string;
}

export interface JobLocation {
  id: number;
  name: string;
  city?: string;
  country?: string;
}

export interface Candidate {
  id: number;
  job_posting_id: number;
  name: string;
  email: string;
  phone?: string;
  experience_years?: number;
  expected_salary?: number;
  resume_url?: string;
  cover_letter?: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  job_posting?: JobPosting;
}

// Meeting types
export interface Meeting {
  id: number;
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime: string;
  location?: string;
  agenda?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meeting_type?: MeetingType;
  meeting_room?: MeetingRoom;
  attendees?: Employee[];
}

export interface MeetingType {
  id: number;
  name: string;
}

export interface MeetingRoom {
  id: number;
  name: string;
  capacity: number;
  location?: string;
}

// Dashboard types
export interface DashboardStats {
  total_employees: number;
  total_branches: number;
  total_departments: number;
  attendance_rate: number;
  pending_leaves: number;
  active_jobs: number;
  total_candidates: number;
  department_distribution: { name: string; count: number }[];
  hiring_trend: { month: string; hires: number }[];
  candidate_status: { status: string; count: number }[];
  leave_types: { type: string; used: number; total: number }[];
}
```

---

## 3. State Management (Redux Toolkit)

### src/store/index.ts
```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### src/store/hooks.ts
```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### src/store/slices/authSlice.ts
```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';
import { User } from '../../types';
import { config } from '../../config';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem(config.userKey) || 'null'),
  token: localStorage.getItem(config.tokenKey),
  isAuthenticated: !!localStorage.getItem(config.tokenKey),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.me();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem(config.tokenKey, action.payload.token);
      localStorage.setItem(config.userKey, JSON.stringify(action.payload.user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem(config.tokenKey);
      localStorage.removeItem(config.userKey);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem(config.tokenKey, action.payload.token);
        localStorage.setItem(config.userKey, JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem(config.tokenKey);
        localStorage.removeItem(config.userKey);
      })
      // Fetch current user
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem(config.userKey, JSON.stringify(action.payload));
      });
  },
});

export const { setCredentials, clearCredentials, clearError } = authSlice.actions;
export default authSlice.reducer;
```

### src/store/slices/uiSlice.ts
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface UIState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  theme: 'light' | 'dark';
  language: string;
  notifications: Notification[];
}

const initialState: UIState = {
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  language: localStorage.getItem('language') || 'en',
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.sidebarMobileOpen = !state.sidebarMobileOpen;
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarMobileOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      state.notifications.push({
        ...action.payload,
        id: Date.now().toString(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  setTheme,
  setLanguage,
  addNotification,
  removeNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
```

---

## 4. API Integration (Axios)

### src/services/api.ts
```typescript
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { config } from '../config';
import { store } from '../store';
import { clearCredentials } from '../store/slices/authSlice';

const api: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (axiosConfig: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(config.tokenKey);
    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }
    return axiosConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      store.dispatch(clearCredentials());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### src/services/auth.service.ts
```typescript
import api from './api';
import { ApiResponse, User } from '../types';

interface LoginResponse {
  user: User;
  token: string;
  token_type: string;
  expires_at: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', credentials),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<ApiResponse<User>>('/auth/me'),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (data: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }) => api.post('/auth/reset-password', data),
};
```

### src/services/employee.service.ts
```typescript
import api from './api';
import { ApiResponse, PaginatedResponse, Employee } from '../types';

interface EmployeeFilters {
  page?: number;
  per_page?: number;
  search?: string;
  branch_id?: number;
  department_id?: number;
  designation_id?: number;
  employment_status?: string;
  employment_type?: string;
}

interface CreateEmployeeData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  employee_id: string;
  branch_id: number;
  department_id: number;
  designation_id: number;
  date_of_birth?: string;
  gender?: string;
  date_of_joining: string;
  employment_type: string;
  // ... other fields
}

export const employeeService = {
  getAll: (filters: EmployeeFilters = {}) =>
    api.get<ApiResponse<PaginatedResponse<Employee>>>('/employees', {
      params: filters,
    }),

  getById: (id: number) =>
    api.get<ApiResponse<Employee>>(`/employees/${id}`),

  getProfile: () =>
    api.get<ApiResponse<Employee>>('/employees/profile'),

  create: (data: CreateEmployeeData) =>
    api.post<ApiResponse<Employee>>('/employees', data),

  update: (id: number, data: Partial<CreateEmployeeData>) =>
    api.put<ApiResponse<Employee>>(`/employees/${id}`, data),

  delete: (id: number) =>
    api.delete(`/employees/${id}`),
};
```

### src/services/leave.service.ts
```typescript
import api from './api';
import { ApiResponse, PaginatedResponse, LeaveApplication, LeaveBalance } from '../types';

interface LeaveFilters {
  page?: number;
  per_page?: number;
  employee_id?: number;
  leave_type_id?: number;
  status?: string;
  date_from?: string;
  date_to?: string;
}

interface ApplyLeaveData {
  leave_type_id: number;
  start_date: string;
  end_date: string;
  reason?: string;
}

export const leaveService = {
  getAll: (filters: LeaveFilters = {}) =>
    api.get<ApiResponse<PaginatedResponse<LeaveApplication>>>('/leave', {
      params: filters,
    }),

  getById: (id: number) =>
    api.get<ApiResponse<LeaveApplication>>(`/leave/${id}`),

  apply: (data: ApplyLeaveData) =>
    api.post<ApiResponse<LeaveApplication>>('/leave', data),

  approve: (id: number) =>
    api.patch<ApiResponse<LeaveApplication>>(`/leave/${id}/approve`),

  reject: (id: number, rejection_reason: string) =>
    api.patch<ApiResponse<LeaveApplication>>(`/leave/${id}/reject`, {
      rejection_reason,
    }),

  cancel: (id: number) =>
    api.patch<ApiResponse<LeaveApplication>>(`/leave/${id}/cancel`),

  getBalances: (employeeId?: number, year?: number) =>
    api.get<ApiResponse<LeaveBalance[]>>('/leave/balances', {
      params: { employee_id: employeeId, year },
    }),
};
```

### src/services/attendance.service.ts
```typescript
import api from './api';
import { ApiResponse, AttendanceRecord } from '../types';

export const attendanceService = {
  getTodayStatus: () =>
    api.get<ApiResponse<{
      attendance: AttendanceRecord | null;
      shift: any;
      is_clocked_in: boolean;
    }>>('/attendance/today'),

  clockIn: (notes?: string) =>
    api.post<ApiResponse<AttendanceRecord>>('/attendance/clock-in', { notes }),

  clockOut: (notes?: string) =>
    api.post<ApiResponse<AttendanceRecord>>('/attendance/clock-out', { notes }),

  getRecords: (filters: {
    employee_id?: number;
    date_from?: string;
    date_to?: string;
    status?: string;
  } = {}) =>
    api.get<ApiResponse<AttendanceRecord[]>>('/attendance', { params: filters }),
};
```

---

## 5. Authentication Implementation

### src/pages/auth/Login.tsx
```tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login, clearError } from '../../store/slices/authSlice';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(login(data)).unwrap();
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the slice
    }
  };

  const handleDemoLogin = (role: 'company' | 'hr' | 'employee') => {
    const credentials = {
      company: { email: 'company@example.com', password: 'password' },
      hr: { email: 'hr@example.com', password: 'password' },
      employee: { email: 'employee@example.com', password: 'password' },
    };
    dispatch(login(credentials[role]));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold mb-4">WorkDo HRM</h1>
          <p className="text-lg text-primary-100">
            Streamline your HR operations with our comprehensive human resource
            management system.
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Log in to your account
            </h2>
            <p className="mt-2 text-gray-600">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className={`input ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="label">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password')}
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo Quick Access */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Demo Quick Access
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('company')}
                className="btn-secondary text-sm"
              >
                Company
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('hr')}
                className="btn-secondary text-sm"
              >
                HR
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('employee')}
                className="btn-secondary text-sm"
              >
                Employee
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 6. Routing & Navigation

### src/routes.tsx
```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth pages
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Staff
import Users from './pages/staff/Users';
import Roles from './pages/staff/Roles';

// HR Management
import Branches from './pages/hr-management/Branches';
import Departments from './pages/hr-management/Departments';
import Designations from './pages/hr-management/Designations';
import Employees from './pages/hr-management/Employees';
import EmployeeProfile from './pages/hr-management/EmployeeProfile';
import Awards from './pages/hr-management/Awards';
import Promotions from './pages/hr-management/Promotions';
import Holidays from './pages/hr-management/Holidays';
import Announcements from './pages/hr-management/Announcements';

// Leave
import LeaveTypes from './pages/leave/LeaveTypes';
import LeaveApplications from './pages/leave/LeaveApplications';
import LeaveBalances from './pages/leave/LeaveBalances';

// Attendance
import Shifts from './pages/attendance/Shifts';
import AttendanceRecords from './pages/attendance/AttendanceRecords';

// Payroll
import SalaryComponents from './pages/payroll/SalaryComponents';
import Payslips from './pages/payroll/Payslips';

// Settings
import Settings from './pages/settings/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      
      // Staff
      {
        path: '/staff/users',
        element: (
          <ProtectedRoute permission="view_users">
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/staff/roles',
        element: (
          <ProtectedRoute permission="view_roles">
            <Roles />
          </ProtectedRoute>
        ),
      },
      
      // HR Management
      { path: '/hr-management/branches', element: <Branches /> },
      { path: '/hr-management/departments', element: <Departments /> },
      { path: '/hr-management/designations', element: <Designations /> },
      { path: '/hr-management/employees', element: <Employees /> },
      { path: '/hr-management/employees/:id', element: <EmployeeProfile /> },
      { path: '/hr-management/awards', element: <Awards /> },
      { path: '/hr-management/promotions', element: <Promotions /> },
      { path: '/hr-management/holidays', element: <Holidays /> },
      { path: '/hr-management/announcements', element: <Announcements /> },
      
      // Leave
      { path: '/leave/types', element: <LeaveTypes /> },
      { path: '/leave/applications', element: <LeaveApplications /> },
      { path: '/leave/balances', element: <LeaveBalances /> },
      
      // Attendance
      { path: '/attendance/shifts', element: <Shifts /> },
      { path: '/attendance/records', element: <AttendanceRecords /> },
      
      // Payroll
      { path: '/payroll/components', element: <SalaryComponents /> },
      { path: '/payroll/payslips', element: <Payslips /> },
      
      // Settings
      {
        path: '/settings',
        element: (
          <ProtectedRoute permission="view_settings">
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
```

### src/components/auth/ProtectedRoute.tsx
```tsx
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { usePermissions } from '../../hooks/usePermissions';

interface ProtectedRouteProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
}

export default function ProtectedRoute({
  children,
  permission,
  permissions,
  requireAll = false,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check multiple permissions
  if (permissions) {
    const hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
    
    if (!hasAccess) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
```

---

## 7. Layout Components

### src/components/layout/MainLayout.tsx
```tsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppSelector } from '../../store/hooks';

export default function MainLayout() {
  const { sidebarCollapsed, sidebarMobileOpen } = useAppSelector(
    (state) => state.ui
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <Header />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

### src/components/layout/Sidebar.tsx
```tsx
import { Link, useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setMobileSidebarOpen } from '../../store/slices/uiSlice';
import { usePermissions } from '../../hooks/usePermissions';
import clsx from 'clsx';

interface NavItem {
  name: string;
  href?: string;
  icon: any;
  permission?: string;
  children?: {
    name: string;
    href: string;
    permission?: string;
  }[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Staff',
    icon: UsersIcon,
    permission: 'view_users',
    children: [
      { name: 'Users', href: '/staff/users', permission: 'view_users' },
      { name: 'Roles', href: '/staff/roles', permission: 'view_roles' },
    ],
  },
  {
    name: 'HR Management',
    icon: UserGroupIcon,
    children: [
      { name: 'Branches', href: '/hr-management/branches' },
      { name: 'Departments', href: '/hr-management/departments' },
      { name: 'Designations', href: '/hr-management/designations' },
      { name: 'Employees', href: '/hr-management/employees' },
      { name: 'Awards', href: '/hr-management/awards' },
      { name: 'Promotions', href: '/hr-management/promotions' },
      { name: 'Holidays', href: '/hr-management/holidays' },
      { name: 'Announcements', href: '/hr-management/announcements' },
    ],
  },
  {
    name: 'Leave',
    icon: CalendarIcon,
    children: [
      { name: 'Leave Types', href: '/leave/types' },
      { name: 'Applications', href: '/leave/applications' },
      { name: 'Balances', href: '/leave/balances' },
    ],
  },
  {
    name: 'Attendance',
    icon: ClockIcon,
    children: [
      { name: 'Shifts', href: '/attendance/shifts' },
      { name: 'Records', href: '/attendance/records' },
    ],
  },
  {
    name: 'Payroll',
    icon: CurrencyDollarIcon,
    children: [
      { name: 'Salary Components', href: '/payroll/components' },
      { name: 'Payslips', href: '/payroll/payslips' },
    ],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Cog6ToothIcon,
    permission: 'view_settings',
  },
];

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { sidebarCollapsed, sidebarMobileOpen } = useAppSelector(
    (state) => state.ui
  );
  const { hasPermission } = usePermissions();

  const filteredNavigation = navigation.filter((item) => {
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }
    if (item.children) {
      item.children = item.children.filter(
        (child) => !child.permission || hasPermission(child.permission)
      );
      return item.children.length > 0;
    }
    return true;
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center">
          <span className="text-xl font-bold text-primary-600">
            {sidebarCollapsed ? 'HRM' : 'WorkDo HRM'}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => (
          <NavItemComponent
            key={item.name}
            item={item}
            collapsed={sidebarCollapsed}
            currentPath={location.pathname}
          />
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarMobileOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 lg:hidden"
          onClose={() => dispatch(setMobileSidebarOpen(false))}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5"
                    onClick={() => dispatch(setMobileSidebarOpen(false))}
                  >
                    <XMarkIcon className="h-6 w-6 text-white" />
                  </button>
                </div>

                <div className="flex grow flex-col bg-white">
                  <SidebarContent />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div
        className={clsx(
          'hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col bg-white border-r border-gray-200 transition-all duration-300',
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}

interface NavItemComponentProps {
  item: NavItem;
  collapsed: boolean;
  currentPath: string;
}

function NavItemComponent({ item, collapsed, currentPath }: NavItemComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = item.href
    ? currentPath === item.href
    : item.children?.some((child) => currentPath.startsWith(child.href));

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            isActive
              ? 'bg-primary-50 text-primary-600'
              : 'text-gray-700 hover:bg-gray-50'
          )}
        >
          <item.icon className="h-5 w-5 flex-shrink-0" />
          {!collapsed && (
            <>
              <span className="ml-3 flex-1 text-left">{item.name}</span>
              <ChevronDownIcon
                className={clsx(
                  'h-4 w-4 transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </>
          )}
        </button>

        {!collapsed && isOpen && (
          <div className="ml-8 mt-1 space-y-1">
            {item.children.map((child) => (
              <Link
                key={child.href}
                to={child.href}
                className={clsx(
                  'block px-3 py-2 text-sm rounded-md transition-colors',
                  currentPath === child.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                )}
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      to={item.href!}
      className={clsx(
        'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
        isActive
          ? 'bg-primary-50 text-primary-600'
          : 'text-gray-700 hover:bg-gray-50'
      )}
    >
      <item.icon className="h-5 w-5 flex-shrink-0" />
      {!collapsed && <span className="ml-3">{item.name}</span>}
    </Link>
  );
}
```

### src/components/layout/Header.tsx
```tsx
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleSidebar, toggleMobileSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import clsx from 'clsx';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left side */}
        <div className="flex items-center">
          <button
            type="button"
            className="p-2 text-gray-500 rounded-md hover:bg-gray-100 lg:hidden"
            onClick={() => dispatch(toggleMobileSidebar())}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="hidden lg:block p-2 text-gray-500 rounded-md hover:bg-gray-100"
            onClick={() => dispatch(toggleSidebar())}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Language selector */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center px-3 py-1.5 text-sm text-gray-700 rounded-md hover:bg-gray-100">
              EN
              <ChevronDownIcon className="ml-1 h-4 w-4" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {['English', 'Español', 'Français', 'Deutsch'].map((lang) => (
                    <Menu.Item key={lang}>
                      {({ active }) => (
                        <button
                          className={clsx(
                            'block w-full px-4 py-2 text-left text-sm',
                            active ? 'bg-gray-100' : ''
                          )}
                        >
                          {lang}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Notifications */}
          <button
            type="button"
            className="relative p-2 text-gray-500 rounded-md hover:bg-gray-100"
          >
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* User menu */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-100">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
              )}
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role?.name}
                </p>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate('/profile')}
                        className={clsx(
                          'flex w-full items-center px-4 py-2 text-sm',
                          active ? 'bg-gray-100' : ''
                        )}
                      >
                        <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                        Profile
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate('/settings')}
                        className={clsx(
                          'flex w-full items-center px-4 py-2 text-sm',
                          active ? 'bg-gray-100' : ''
                        )}
                      >
                        <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
                        Settings
                      </button>
                    )}
                  </Menu.Item>
                  <div className="border-t border-gray-100" />
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={clsx(
                          'flex w-full items-center px-4 py-2 text-sm text-red-600',
                          active ? 'bg-gray-100' : ''
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  );
}
```

---

## 8. Common Components

### src/components/common/Button.tsx
```tsx
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary:
        'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-primary-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
```

### src/components/common/Modal.tsx
```tsx
import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: ReactNode;
  footer?: ReactNode;
}

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
}: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  'w-full transform overflow-hidden rounded-lg bg-white shadow-xl transition-all',
                  sizes[size]
                )}
              >
                {title && (
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <Dialog.Title className="text-lg font-semibold text-gray-900">
                      {title}
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-1 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}

                <div className="px-6 py-4">{children}</div>

                {footer && (
                  <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
```

### src/components/common/DataTable.tsx
```tsx
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  loading?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  data,
  columns,
  loading = false,
  pageSize = 10,
  onRowClick,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
          className="input max-w-xs"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={clsx(
                          'flex items-center gap-2',
                          header.column.getCanSort() && 'cursor-pointer select-none'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ChevronUpIcon className="h-4 w-4" />,
                          desc: <ChevronDownIcon className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={clsx(
                    'hover:bg-gray-50',
                    onRowClick && 'cursor-pointer'
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing{' '}
          <span className="font-medium">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
          </span>{' '}
          to{' '}
          <span className="font-medium">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              data.length
            )}
          </span>{' '}
          of <span className="font-medium">{data.length}</span> results
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-700">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

### src/components/common/Badge.tsx
```tsx
import clsx from 'clsx';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

const variants = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  default: 'bg-gray-100 text-gray-800',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
};

export default function Badge({
  variant = 'default',
  size = 'sm',
  children,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        variants[variant],
        sizes[size]
      )}
    >
      {children}
    </span>
  );
}
```

---

## 9. Feature Modules

### src/pages/dashboard/Dashboard.tsx
```tsx
import { useEffect, useState } from 'react';
import {
  UsersIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAppSelector } from '../../store/hooks';
import { dashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../types';
import StatCard from '../../components/dashboard/StatCard';
import AttendanceWidget from '../../components/dashboard/AttendanceWidget';
import AnnouncementsWidget from '../../components/dashboard/AnnouncementsWidget';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const isEmployee = user?.role?.name === 'employee';

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 rounded-lg" />
          <div className="h-80 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  if (isEmployee) {
    return <EmployeeDashboard />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employees"
          value={stats?.total_employees || 0}
          icon={<UsersIcon className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Branches"
          value={stats?.total_branches || 0}
          subtitle={`${stats?.total_departments || 0} departments`}
          icon={<BuildingOfficeIcon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.attendance_rate || 0}%`}
          icon={<ClockIcon className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Pending Leaves"
          value={stats?.pending_leaves || 0}
          icon={<CalendarDaysIcon className="h-6 w-6" />}
          color="red"
        />
      </div>

      {/* Recruitment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Active Jobs"
          value={stats?.active_jobs || 0}
          icon={<BriefcaseIcon className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Total Candidates"
          value={stats?.total_candidates || 0}
          icon={<UserPlusIcon className="h-6 w-6" />}
          color="blue"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Department Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.department_distribution || []}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {stats?.department_distribution?.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hiring Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hiring Trend (Last 6 Months)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.hiring_trend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hires" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Candidate Status & Leave Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Status */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Candidate Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.candidate_status || []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  label
                >
                  {stats?.candidate_status?.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Types */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Leave Types Usage
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.leave_types || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="used" fill="#3B82F6" name="Used" />
                <Bar dataKey="total" fill="#E5E7EB" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Welcome, Employee!
        </h2>
        <p className="text-gray-600">
          Stay updated with company announcements and manage your work.
        </p>
      </div>

      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Awards"
          value={2}
          icon={<UsersIcon className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Total Warnings"
          value={0}
          icon={<UsersIcon className="h-6 w-6" />}
          color="yellow"
        />
        <StatCard
          title="Total Complaints"
          value={0}
          icon={<UsersIcon className="h-6 w-6" />}
          color="red"
        />
      </div>

      {/* Attendance Widget */}
      <AttendanceWidget />

      {/* Announcements & Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnnouncementsWidget />
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Meetings
          </h3>
          <p className="text-gray-500">No upcoming meetings</p>
        </div>
      </div>
    </div>
  );
}
```

### src/components/dashboard/AttendanceWidget.tsx
```tsx
import { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { attendanceService } from '../../services/attendance.service';
import { format } from 'date-fns';
import Button from '../common/Button';
import toast from 'react-hot-toast';

export default function AttendanceWidget() {
  const [attendance, setAttendance] = useState<any>(null);
  const [shift, setShift] = useState<any>(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const fetchTodayStatus = async () => {
    try {
      const response = await attendanceService.getTodayStatus();
      const data = response.data.data;
      setAttendance(data.attendance);
      setShift(data.shift);
      setIsClockedIn(data.is_clocked_in);
    } catch (error) {
      console.error('Failed to fetch attendance status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    setActionLoading(true);
    try {
      await attendanceService.clockIn();
      toast.success('Clocked in successfully');
      fetchTodayStatus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clock in');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    setActionLoading(true);
    try {
      await attendanceService.clockOut();
      toast.success('Clocked out successfully');
      fetchTodayStatus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to clock out');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-20 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Attendance</h3>
        <ClockIcon className="h-6 w-6 text-gray-400" />
      </div>

      {shift && (
        <p className="text-sm text-gray-600 mb-4">
          {shift.name}: {shift.start_time} to {shift.end_time}
        </p>
      )}

      <div className="flex gap-4 mb-6">
        <Button
          onClick={handleClockIn}
          disabled={isClockedIn}
          loading={actionLoading}
          variant={isClockedIn ? 'secondary' : 'primary'}
        >
          Clock In
        </Button>
        <Button
          onClick={handleClockOut}
          disabled={!isClockedIn}
          loading={actionLoading}
          variant={!isClockedIn ? 'secondary' : 'primary'}
        >
          Clock Out
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Clock In Time</p>
          <p className="text-lg font-medium">
            {attendance?.clock_in_time
              ? format(new Date(attendance.clock_in_time), 'hh:mm a')
              : '--:-- --'}
          </p>
          <p className="text-xs text-gray-400">
            {attendance?.clock_in_time ? 'Clocked in' : 'Not clocked in'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Clock Out Time</p>
          <p className="text-lg font-medium">
            {attendance?.clock_out_time
              ? format(new Date(attendance.clock_out_time), 'hh:mm a')
              : '--:-- --'}
          </p>
          <p className="text-xs text-gray-400">
            {attendance?.clock_out_time ? 'Clocked out' : 'Not clocked out'}
          </p>
        </div>
      </div>
    </div>
  );
}
```

---

## 10. Custom Hooks

### src/hooks/usePermissions.ts
```typescript
import { useAppSelector } from '../store/hooks';

export function usePermissions() {
  const { user } = useAppSelector((state) => state.auth);
  const permissions = user?.permissions || [];

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some((p) => permissions.includes(p));
  };

  const hasAllPermissions = (perms: string[]): boolean => {
    return perms.every((p) => permissions.includes(p));
  };

  const isRole = (role: string): boolean => {
    return user?.role?.name === role;
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isRole,
  };
}
```

### src/hooks/useApi.ts
```typescript
import { useState, useCallback } from 'react';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useApi<T>(
  apiCall: (...args: any[]) => Promise<{ data: { data: T } }>,
  options?: UseApiOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiCall(...args);
        setData(response.data.data);
        options?.onSuccess?.(response.data.data);
        return response.data.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || 'An error occurred';
        setError(errorMessage);
        options?.onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiCall, options]
  );

  return { data, loading, error, execute };
}
```

### src/hooks/useDebounce.ts
```typescript
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

---

## 11. App Entry Point

### src/App.tsx
```tsx
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { router } from './routes';

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Provider>
  );
}
```

### src/main.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## Next Steps
- See `07-DEPLOYMENT.md` for deployment instructions
- See `08-TESTING.md` for testing guide
