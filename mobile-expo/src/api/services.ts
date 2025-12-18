import { api } from './client';
import {
  ApiResponse,
  AuthResponse,
  DashboardStats,
  TimeOffRequest,
  TimeOffCategory,
  WorkLog,
  User,
  LeaveBalance,
  Shift,
  Timesheet,
  TimesheetProject,
  ExtraHoursRecord,
  AttendanceRegularization,
  SalarySlip,
  SalaryAdvance,
  StaffBenefit,
  BenefitType,
  BonusPayment,
  RecurringDeduction,
  TaxSlab,
  Job,
  JobCategory,
  JobStage,
  Candidate,
  JobApplication,
  InterviewSchedule,
  Offer,
  PerformanceObjective,
  AppraisalCycle,
  AppraisalRecord,
  RecognitionRecord,
  RecognitionCategory,
  StaffMember,
  Contract,
  ContractType,
  OnboardingTemplate,
  EmployeeOnboarding,
  Grievance,
  DisciplineNote,
  Offboarding,
  ExitCategory,
  OfficeLocation,
  Division,
  JobTitle,
  OrganizationPolicy,
  OrganizationDocument,
  AssetType,
  Asset,
  CompanyEvent,
  CompanyHoliday,
  CompanyNotice,
  Meeting,
  MeetingType,
  MeetingRoom,
  MeetingActionItem,
  TrainingType,
  TrainingProgram,
  TrainingSession,
  HrDocument,
  DocumentCategory,
  LetterTemplate,
  GeneratedLetter,
  MediaFile,
  MediaDirectory,
  SystemConfiguration,
  AllowedIpAddress,
  BusinessTrip,
} from '../types';

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

  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: { current_password: string; new_password: string; new_password_confirmation: string }): Promise<ApiResponse<null>> => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },
};

export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  getEmployeeStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get('/dashboard/employee');
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

  getWorkLogs: async (params?: { start_date?: string; end_date?: string; staff_member_id?: number }): Promise<ApiResponse<WorkLog[]>> => {
    const response = await api.get('/work-logs', { params });
    return response.data;
  },

  getWorkLog: async (id: number): Promise<ApiResponse<WorkLog>> => {
    const response = await api.get(`/work-logs/${id}`);
    return response.data;
  },

  getSummary: async (params: { staff_member_id: number; start_date: string; end_date: string }): Promise<ApiResponse<any>> => {
    const response = await api.get('/attendance-summary', { params });
    return response.data;
  },

  getShifts: async (): Promise<ApiResponse<Shift[]>> => {
    const response = await api.get('/shifts');
    return response.data;
  },

  getShift: async (id: number): Promise<ApiResponse<Shift>> => {
    const response = await api.get(`/shifts/${id}`);
    return response.data;
  },

  createShift: async (data: Partial<Shift>): Promise<ApiResponse<Shift>> => {
    const response = await api.post('/shifts', data);
    return response.data;
  },

  updateShift: async (id: number, data: Partial<Shift>): Promise<ApiResponse<Shift>> => {
    const response = await api.put(`/shifts/${id}`, data);
    return response.data;
  },

  deleteShift: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/shifts/${id}`);
    return response.data;
  },

  getTimesheetProjects: async (): Promise<ApiResponse<TimesheetProject[]>> => {
    const response = await api.get('/timesheet-projects');
    return response.data;
  },

  getTimesheets: async (params?: { start_date?: string; end_date?: string; status?: string }): Promise<ApiResponse<Timesheet[]>> => {
    const response = await api.get('/timesheets', { params });
    return response.data;
  },

  createTimesheet: async (data: Partial<Timesheet>): Promise<ApiResponse<Timesheet>> => {
    const response = await api.post('/timesheets', data);
    return response.data;
  },

  updateTimesheet: async (id: number, data: Partial<Timesheet>): Promise<ApiResponse<Timesheet>> => {
    const response = await api.put(`/timesheets/${id}`, data);
    return response.data;
  },

  submitTimesheet: async (id: number): Promise<ApiResponse<Timesheet>> => {
    const response = await api.post(`/timesheets/${id}/submit`);
    return response.data;
  },

  getExtraHours: async (params?: { start_date?: string; end_date?: string }): Promise<ApiResponse<ExtraHoursRecord[]>> => {
    const response = await api.get('/extra-hours', { params });
    return response.data;
  },

  createExtraHours: async (data: Partial<ExtraHoursRecord>): Promise<ApiResponse<ExtraHoursRecord>> => {
    const response = await api.post('/extra-hours', data);
    return response.data;
  },

  getRegularizations: async (params?: { status?: string }): Promise<ApiResponse<AttendanceRegularization[]>> => {
    const response = await api.get('/attendance-regularizations', { params });
    return response.data;
  },

  createRegularization: async (data: Partial<AttendanceRegularization>): Promise<ApiResponse<AttendanceRegularization>> => {
    const response = await api.post('/attendance-regularizations', data);
    return response.data;
  },

  approveRegularization: async (id: number): Promise<ApiResponse<AttendanceRegularization>> => {
    const response = await api.post(`/attendance-regularizations/${id}/approve`);
    return response.data;
  },

  rejectRegularization: async (id: number, reason: string): Promise<ApiResponse<AttendanceRegularization>> => {
    const response = await api.post(`/attendance-regularizations/${id}/reject`, { reason });
    return response.data;
  },
};

export const leaveService = {
  getCategories: async (): Promise<ApiResponse<TimeOffCategory[]>> => {
    const response = await api.get('/time-off-categories');
    return response.data;
  },

  getCategory: async (id: number): Promise<ApiResponse<TimeOffCategory>> => {
    const response = await api.get(`/time-off-categories/${id}`);
    return response.data;
  },

  createCategory: async (data: Partial<TimeOffCategory>): Promise<ApiResponse<TimeOffCategory>> => {
    const response = await api.post('/time-off-categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: Partial<TimeOffCategory>): Promise<ApiResponse<TimeOffCategory>> => {
    const response = await api.put(`/time-off-categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/time-off-categories/${id}`);
    return response.data;
  },

  getRequests: async (params?: { status?: string; staff_member_id?: number }): Promise<ApiResponse<TimeOffRequest[]>> => {
    const response = await api.get('/time-off-requests', { params });
    return response.data;
  },

  getRequest: async (id: number): Promise<ApiResponse<TimeOffRequest>> => {
    const response = await api.get(`/time-off-requests/${id}`);
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

  updateRequest: async (id: number, data: Partial<TimeOffRequest>): Promise<ApiResponse<TimeOffRequest>> => {
    const response = await api.put(`/time-off-requests/${id}`, data);
    return response.data;
  },

  cancelRequest: async (id: number): Promise<ApiResponse<TimeOffRequest>> => {
    const response = await api.post(`/time-off-requests/${id}/cancel`);
    return response.data;
  },

  approveRequest: async (id: number, remarks?: string): Promise<ApiResponse<TimeOffRequest>> => {
    const response = await api.post(`/time-off-requests/${id}/approve`, { remarks });
    return response.data;
  },

  declineRequest: async (id: number, remarks: string): Promise<ApiResponse<TimeOffRequest>> => {
    const response = await api.post(`/time-off-requests/${id}/decline`, { remarks });
    return response.data;
  },

  getBalance: async (staffMemberId?: number): Promise<ApiResponse<LeaveBalance[]>> => {
    const response = await api.get('/time-off-balance', { params: { staff_member_id: staffMemberId } });
    return response.data;
  },
};

export const payrollService = {
  getSalarySlips: async (params?: { staff_member_id?: number; period?: string; status?: string }): Promise<ApiResponse<SalarySlip[]>> => {
    const response = await api.get('/salary-slips', { params });
    return response.data;
  },

  getSalarySlip: async (id: number): Promise<ApiResponse<SalarySlip>> => {
    const response = await api.get(`/salary-slips/${id}`);
    return response.data;
  },

  generateSalarySlip: async (data: { staff_member_id: number; salary_period: string }): Promise<ApiResponse<SalarySlip>> => {
    const response = await api.post('/salary-slips/generate', data);
    return response.data;
  },

  markAsPaid: async (id: number): Promise<ApiResponse<SalarySlip>> => {
    const response = await api.post(`/salary-slips/${id}/mark-paid`);
    return response.data;
  },

  downloadSalarySlip: async (id: number): Promise<Blob> => {
    const response = await api.get(`/salary-slips/${id}/download`, { responseType: 'blob' });
    return response.data;
  },

  getAdvances: async (params?: { staff_member_id?: number; status?: string }): Promise<ApiResponse<SalaryAdvance[]>> => {
    const response = await api.get('/salary-advances', { params });
    return response.data;
  },

  getAdvance: async (id: number): Promise<ApiResponse<SalaryAdvance>> => {
    const response = await api.get(`/salary-advances/${id}`);
    return response.data;
  },

  createAdvance: async (data: Partial<SalaryAdvance>): Promise<ApiResponse<SalaryAdvance>> => {
    const response = await api.post('/salary-advances', data);
    return response.data;
  },

  approveAdvance: async (id: number): Promise<ApiResponse<SalaryAdvance>> => {
    const response = await api.post(`/salary-advances/${id}/approve`);
    return response.data;
  },

  rejectAdvance: async (id: number, reason: string): Promise<ApiResponse<SalaryAdvance>> => {
    const response = await api.post(`/salary-advances/${id}/reject`, { reason });
    return response.data;
  },

  getBenefitTypes: async (): Promise<ApiResponse<BenefitType[]>> => {
    const response = await api.get('/benefit-types');
    return response.data;
  },

  createBenefitType: async (data: Partial<BenefitType>): Promise<ApiResponse<BenefitType>> => {
    const response = await api.post('/benefit-types', data);
    return response.data;
  },

  getStaffBenefits: async (staffMemberId?: number): Promise<ApiResponse<StaffBenefit[]>> => {
    const response = await api.get('/staff-benefits', { params: { staff_member_id: staffMemberId } });
    return response.data;
  },

  createStaffBenefit: async (data: Partial<StaffBenefit>): Promise<ApiResponse<StaffBenefit>> => {
    const response = await api.post('/staff-benefits', data);
    return response.data;
  },

  updateStaffBenefit: async (id: number, data: Partial<StaffBenefit>): Promise<ApiResponse<StaffBenefit>> => {
    const response = await api.put(`/staff-benefits/${id}`, data);
    return response.data;
  },

  deleteStaffBenefit: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/staff-benefits/${id}`);
    return response.data;
  },

  getBonusPayments: async (params?: { staff_member_id?: number }): Promise<ApiResponse<BonusPayment[]>> => {
    const response = await api.get('/bonus-payments', { params });
    return response.data;
  },

  createBonusPayment: async (data: Partial<BonusPayment>): Promise<ApiResponse<BonusPayment>> => {
    const response = await api.post('/bonus-payments', data);
    return response.data;
  },

  getRecurringDeductions: async (staffMemberId?: number): Promise<ApiResponse<RecurringDeduction[]>> => {
    const response = await api.get('/recurring-deductions', { params: { staff_member_id: staffMemberId } });
    return response.data;
  },

  createRecurringDeduction: async (data: Partial<RecurringDeduction>): Promise<ApiResponse<RecurringDeduction>> => {
    const response = await api.post('/recurring-deductions', data);
    return response.data;
  },

  getTaxSlabs: async (): Promise<ApiResponse<TaxSlab[]>> => {
    const response = await api.get('/tax-slabs');
    return response.data;
  },
};

export const recruitmentService = {
  getJobs: async (params?: { status?: string; category_id?: number }): Promise<ApiResponse<Job[]>> => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  getJob: async (id: number): Promise<ApiResponse<Job>> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  createJob: async (data: Partial<Job>): Promise<ApiResponse<Job>> => {
    const response = await api.post('/jobs', data);
    return response.data;
  },

  updateJob: async (id: number, data: Partial<Job>): Promise<ApiResponse<Job>> => {
    const response = await api.put(`/jobs/${id}`, data);
    return response.data;
  },

  deleteJob: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  publishJob: async (id: number): Promise<ApiResponse<Job>> => {
    const response = await api.post(`/jobs/${id}/publish`);
    return response.data;
  },

  closeJob: async (id: number): Promise<ApiResponse<Job>> => {
    const response = await api.post(`/jobs/${id}/close`);
    return response.data;
  },

  getJobCategories: async (): Promise<ApiResponse<JobCategory[]>> => {
    const response = await api.get('/job-categories');
    return response.data;
  },

  createJobCategory: async (data: Partial<JobCategory>): Promise<ApiResponse<JobCategory>> => {
    const response = await api.post('/job-categories', data);
    return response.data;
  },

  getJobStages: async (): Promise<ApiResponse<JobStage[]>> => {
    const response = await api.get('/job-stages');
    return response.data;
  },

  getCandidates: async (params?: { status?: string }): Promise<ApiResponse<Candidate[]>> => {
    const response = await api.get('/candidates', { params });
    return response.data;
  },

  getCandidate: async (id: number): Promise<ApiResponse<Candidate>> => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  createCandidate: async (data: Partial<Candidate>): Promise<ApiResponse<Candidate>> => {
    const response = await api.post('/candidates', data);
    return response.data;
  },

  updateCandidate: async (id: number, data: Partial<Candidate>): Promise<ApiResponse<Candidate>> => {
    const response = await api.put(`/candidates/${id}`, data);
    return response.data;
  },

  getApplications: async (params?: { job_id?: number; status?: string }): Promise<ApiResponse<JobApplication[]>> => {
    const response = await api.get('/job-applications', { params });
    return response.data;
  },

  getApplication: async (id: number): Promise<ApiResponse<JobApplication>> => {
    const response = await api.get(`/job-applications/${id}`);
    return response.data;
  },

  createApplication: async (data: { job_id: number; candidate_id: number }): Promise<ApiResponse<JobApplication>> => {
    const response = await api.post('/job-applications', data);
    return response.data;
  },

  updateApplicationStage: async (id: number, stageId: number): Promise<ApiResponse<JobApplication>> => {
    const response = await api.post(`/job-applications/${id}/move-stage`, { job_stage_id: stageId });
    return response.data;
  },

  shortlistApplication: async (id: number): Promise<ApiResponse<JobApplication>> => {
    const response = await api.post(`/job-applications/${id}/shortlist`);
    return response.data;
  },

  rejectApplication: async (id: number, reason: string): Promise<ApiResponse<JobApplication>> => {
    const response = await api.post(`/job-applications/${id}/reject`, { reason });
    return response.data;
  },

  getInterviews: async (params?: { application_id?: number; status?: string }): Promise<ApiResponse<InterviewSchedule[]>> => {
    const response = await api.get('/interview-schedules', { params });
    return response.data;
  },

  getInterview: async (id: number): Promise<ApiResponse<InterviewSchedule>> => {
    const response = await api.get(`/interview-schedules/${id}`);
    return response.data;
  },

  createInterview: async (data: Partial<InterviewSchedule>): Promise<ApiResponse<InterviewSchedule>> => {
    const response = await api.post('/interview-schedules', data);
    return response.data;
  },

  updateInterview: async (id: number, data: Partial<InterviewSchedule>): Promise<ApiResponse<InterviewSchedule>> => {
    const response = await api.put(`/interview-schedules/${id}`, data);
    return response.data;
  },

  submitInterviewFeedback: async (id: number, data: { feedback: string; rating: number; recommendation: string }): Promise<ApiResponse<InterviewSchedule>> => {
    const response = await api.post(`/interview-schedules/${id}/feedback`, data);
    return response.data;
  },

  getOffers: async (params?: { status?: string }): Promise<ApiResponse<Offer[]>> => {
    const response = await api.get('/offers', { params });
    return response.data;
  },

  getOffer: async (id: number): Promise<ApiResponse<Offer>> => {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  },

  createOffer: async (data: Partial<Offer>): Promise<ApiResponse<Offer>> => {
    const response = await api.post('/offers', data);
    return response.data;
  },

  sendOffer: async (id: number): Promise<ApiResponse<Offer>> => {
    const response = await api.post(`/offers/${id}/send`);
    return response.data;
  },

  withdrawOffer: async (id: number): Promise<ApiResponse<Offer>> => {
    const response = await api.post(`/offers/${id}/withdraw`);
    return response.data;
  },
};

export const performanceService = {
  getObjectives: async (params?: { staff_member_id?: number; status?: string }): Promise<ApiResponse<PerformanceObjective[]>> => {
    const response = await api.get('/performance-objectives', { params });
    return response.data;
  },

  getObjective: async (id: number): Promise<ApiResponse<PerformanceObjective>> => {
    const response = await api.get(`/performance-objectives/${id}`);
    return response.data;
  },

  createObjective: async (data: Partial<PerformanceObjective>): Promise<ApiResponse<PerformanceObjective>> => {
    const response = await api.post('/performance-objectives', data);
    return response.data;
  },

  updateObjective: async (id: number, data: Partial<PerformanceObjective>): Promise<ApiResponse<PerformanceObjective>> => {
    const response = await api.put(`/performance-objectives/${id}`, data);
    return response.data;
  },

  deleteObjective: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/performance-objectives/${id}`);
    return response.data;
  },

  updateProgress: async (id: number, progress: number): Promise<ApiResponse<PerformanceObjective>> => {
    const response = await api.post(`/performance-objectives/${id}/progress`, { progress });
    return response.data;
  },

  getAppraisalCycles: async (): Promise<ApiResponse<AppraisalCycle[]>> => {
    const response = await api.get('/appraisal-cycles');
    return response.data;
  },

  getAppraisalCycle: async (id: number): Promise<ApiResponse<AppraisalCycle>> => {
    const response = await api.get(`/appraisal-cycles/${id}`);
    return response.data;
  },

  createAppraisalCycle: async (data: Partial<AppraisalCycle>): Promise<ApiResponse<AppraisalCycle>> => {
    const response = await api.post('/appraisal-cycles', data);
    return response.data;
  },

  getAppraisalRecords: async (params?: { cycle_id?: number; staff_member_id?: number }): Promise<ApiResponse<AppraisalRecord[]>> => {
    const response = await api.get('/appraisal-records', { params });
    return response.data;
  },

  getAppraisalRecord: async (id: number): Promise<ApiResponse<AppraisalRecord>> => {
    const response = await api.get(`/appraisal-records/${id}`);
    return response.data;
  },

  submitSelfReview: async (id: number, data: { self_rating: number; self_comments: string }): Promise<ApiResponse<AppraisalRecord>> => {
    const response = await api.post(`/appraisal-records/${id}/self-review`, data);
    return response.data;
  },

  submitManagerReview: async (id: number, data: { manager_rating: number; manager_comments: string }): Promise<ApiResponse<AppraisalRecord>> => {
    const response = await api.post(`/appraisal-records/${id}/manager-review`, data);
    return response.data;
  },

  getRecognitionCategories: async (): Promise<ApiResponse<RecognitionCategory[]>> => {
    const response = await api.get('/recognition-categories');
    return response.data;
  },

  createRecognitionCategory: async (data: Partial<RecognitionCategory>): Promise<ApiResponse<RecognitionCategory>> => {
    const response = await api.post('/recognition-categories', data);
    return response.data;
  },

  getRecognitions: async (params?: { staff_member_id?: number }): Promise<ApiResponse<RecognitionRecord[]>> => {
    const response = await api.get('/recognition-records', { params });
    return response.data;
  },

  createRecognition: async (data: Partial<RecognitionRecord>): Promise<ApiResponse<RecognitionRecord>> => {
    const response = await api.post('/recognition-records', data);
    return response.data;
  },
};

export const staffService = {
  getStaffMembers: async (params?: { status?: string; division_id?: number; location_id?: number }): Promise<ApiResponse<StaffMember[]>> => {
    const response = await api.get('/staff-members', { params });
    return response.data;
  },

  getStaffMember: async (id: number): Promise<ApiResponse<StaffMember>> => {
    const response = await api.get(`/staff-members/${id}`);
    return response.data;
  },

  createStaffMember: async (data: Partial<StaffMember>): Promise<ApiResponse<StaffMember>> => {
    const response = await api.post('/staff-members', data);
    return response.data;
  },

  updateStaffMember: async (id: number, data: Partial<StaffMember>): Promise<ApiResponse<StaffMember>> => {
    const response = await api.put(`/staff-members/${id}`, data);
    return response.data;
  },

  deleteStaffMember: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/staff-members/${id}`);
    return response.data;
  },

  getContracts: async (params?: { staff_member_id?: number; status?: string }): Promise<ApiResponse<Contract[]>> => {
    const response = await api.get('/contracts', { params });
    return response.data;
  },

  getContract: async (id: number): Promise<ApiResponse<Contract>> => {
    const response = await api.get(`/contracts/${id}`);
    return response.data;
  },

  createContract: async (data: Partial<Contract>): Promise<ApiResponse<Contract>> => {
    const response = await api.post('/contracts', data);
    return response.data;
  },

  updateContract: async (id: number, data: Partial<Contract>): Promise<ApiResponse<Contract>> => {
    const response = await api.put(`/contracts/${id}`, data);
    return response.data;
  },

  renewContract: async (id: number, data: { end_date: string; salary?: number }): Promise<ApiResponse<Contract>> => {
    const response = await api.post(`/contracts/${id}/renew`, data);
    return response.data;
  },

  terminateContract: async (id: number, reason: string): Promise<ApiResponse<Contract>> => {
    const response = await api.post(`/contracts/${id}/terminate`, { reason });
    return response.data;
  },

  getContractTypes: async (): Promise<ApiResponse<ContractType[]>> => {
    const response = await api.get('/contract-types');
    return response.data;
  },

  createContractType: async (data: Partial<ContractType>): Promise<ApiResponse<ContractType>> => {
    const response = await api.post('/contract-types', data);
    return response.data;
  },

  getOnboardingTemplates: async (): Promise<ApiResponse<OnboardingTemplate[]>> => {
    const response = await api.get('/onboarding-templates');
    return response.data;
  },

  getOnboardingTemplate: async (id: number): Promise<ApiResponse<OnboardingTemplate>> => {
    const response = await api.get(`/onboarding-templates/${id}`);
    return response.data;
  },

  createOnboardingTemplate: async (data: Partial<OnboardingTemplate>): Promise<ApiResponse<OnboardingTemplate>> => {
    const response = await api.post('/onboarding-templates', data);
    return response.data;
  },

  getEmployeeOnboardings: async (params?: { staff_member_id?: number; status?: string }): Promise<ApiResponse<EmployeeOnboarding[]>> => {
    const response = await api.get('/employee-onboardings', { params });
    return response.data;
  },

  getEmployeeOnboarding: async (id: number): Promise<ApiResponse<EmployeeOnboarding>> => {
    const response = await api.get(`/employee-onboardings/${id}`);
    return response.data;
  },

  startOnboarding: async (data: { staff_member_id: number; onboarding_template_id: number }): Promise<ApiResponse<EmployeeOnboarding>> => {
    const response = await api.post('/employee-onboardings', data);
    return response.data;
  },

  completeOnboardingTask: async (onboardingId: number, taskId: number): Promise<ApiResponse<EmployeeOnboarding>> => {
    const response = await api.post(`/employee-onboardings/${onboardingId}/tasks/${taskId}/complete`);
    return response.data;
  },

  getGrievances: async (params?: { staff_member_id?: number; status?: string }): Promise<ApiResponse<Grievance[]>> => {
    const response = await api.get('/grievances', { params });
    return response.data;
  },

  getGrievance: async (id: number): Promise<ApiResponse<Grievance>> => {
    const response = await api.get(`/grievances/${id}`);
    return response.data;
  },

  createGrievance: async (data: Partial<Grievance>): Promise<ApiResponse<Grievance>> => {
    const response = await api.post('/grievances', data);
    return response.data;
  },

  updateGrievance: async (id: number, data: Partial<Grievance>): Promise<ApiResponse<Grievance>> => {
    const response = await api.put(`/grievances/${id}`, data);
    return response.data;
  },

  resolveGrievance: async (id: number, resolution: string): Promise<ApiResponse<Grievance>> => {
    const response = await api.post(`/grievances/${id}/resolve`, { resolution });
    return response.data;
  },

  getDisciplineNotes: async (params?: { staff_member_id?: number }): Promise<ApiResponse<DisciplineNote[]>> => {
    const response = await api.get('/discipline-notes', { params });
    return response.data;
  },

  createDisciplineNote: async (data: Partial<DisciplineNote>): Promise<ApiResponse<DisciplineNote>> => {
    const response = await api.post('/discipline-notes', data);
    return response.data;
  },

  getExitCategories: async (): Promise<ApiResponse<ExitCategory[]>> => {
    const response = await api.get('/exit-categories');
    return response.data;
  },

  getOffboardings: async (params?: { staff_member_id?: number; status?: string }): Promise<ApiResponse<Offboarding[]>> => {
    const response = await api.get('/offboardings', { params });
    return response.data;
  },

  getOffboarding: async (id: number): Promise<ApiResponse<Offboarding>> => {
    const response = await api.get(`/offboardings/${id}`);
    return response.data;
  },

  createOffboarding: async (data: Partial<Offboarding>): Promise<ApiResponse<Offboarding>> => {
    const response = await api.post('/offboardings', data);
    return response.data;
  },

  completeOffboarding: async (id: number): Promise<ApiResponse<Offboarding>> => {
    const response = await api.post(`/offboardings/${id}/complete`);
    return response.data;
  },
};

export const organizationService = {
  getOfficeLocations: async (): Promise<ApiResponse<OfficeLocation[]>> => {
    const response = await api.get('/office-locations');
    return response.data;
  },

  getOfficeLocation: async (id: number): Promise<ApiResponse<OfficeLocation>> => {
    const response = await api.get(`/office-locations/${id}`);
    return response.data;
  },

  createOfficeLocation: async (data: Partial<OfficeLocation>): Promise<ApiResponse<OfficeLocation>> => {
    const response = await api.post('/office-locations', data);
    return response.data;
  },

  updateOfficeLocation: async (id: number, data: Partial<OfficeLocation>): Promise<ApiResponse<OfficeLocation>> => {
    const response = await api.put(`/office-locations/${id}`, data);
    return response.data;
  },

  deleteOfficeLocation: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/office-locations/${id}`);
    return response.data;
  },

  getDivisions: async (params?: { office_location_id?: number }): Promise<ApiResponse<Division[]>> => {
    const response = await api.get('/divisions', { params });
    return response.data;
  },

  getDivision: async (id: number): Promise<ApiResponse<Division>> => {
    const response = await api.get(`/divisions/${id}`);
    return response.data;
  },

  createDivision: async (data: Partial<Division>): Promise<ApiResponse<Division>> => {
    const response = await api.post('/divisions', data);
    return response.data;
  },

  updateDivision: async (id: number, data: Partial<Division>): Promise<ApiResponse<Division>> => {
    const response = await api.put(`/divisions/${id}`, data);
    return response.data;
  },

  deleteDivision: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/divisions/${id}`);
    return response.data;
  },

  getJobTitles: async (params?: { division_id?: number }): Promise<ApiResponse<JobTitle[]>> => {
    const response = await api.get('/job-titles', { params });
    return response.data;
  },

  getJobTitle: async (id: number): Promise<ApiResponse<JobTitle>> => {
    const response = await api.get(`/job-titles/${id}`);
    return response.data;
  },

  createJobTitle: async (data: Partial<JobTitle>): Promise<ApiResponse<JobTitle>> => {
    const response = await api.post('/job-titles', data);
    return response.data;
  },

  updateJobTitle: async (id: number, data: Partial<JobTitle>): Promise<ApiResponse<JobTitle>> => {
    const response = await api.put(`/job-titles/${id}`, data);
    return response.data;
  },

  deleteJobTitle: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/job-titles/${id}`);
    return response.data;
  },

  getPolicies: async (): Promise<ApiResponse<OrganizationPolicy[]>> => {
    const response = await api.get('/organization-policies');
    return response.data;
  },

  getPolicy: async (id: number): Promise<ApiResponse<OrganizationPolicy>> => {
    const response = await api.get(`/organization-policies/${id}`);
    return response.data;
  },

  createPolicy: async (data: Partial<OrganizationPolicy>): Promise<ApiResponse<OrganizationPolicy>> => {
    const response = await api.post('/organization-policies', data);
    return response.data;
  },

  updatePolicy: async (id: number, data: Partial<OrganizationPolicy>): Promise<ApiResponse<OrganizationPolicy>> => {
    const response = await api.put(`/organization-policies/${id}`, data);
    return response.data;
  },

  acknowledgePolicy: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.post(`/organization-policies/${id}/acknowledge`);
    return response.data;
  },

  getDocuments: async (): Promise<ApiResponse<OrganizationDocument[]>> => {
    const response = await api.get('/organization-documents');
    return response.data;
  },

  getDocument: async (id: number): Promise<ApiResponse<OrganizationDocument>> => {
    const response = await api.get(`/organization-documents/${id}`);
    return response.data;
  },

  uploadDocument: async (formData: FormData): Promise<ApiResponse<OrganizationDocument>> => {
    const response = await api.post('/organization-documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  downloadDocument: async (id: number): Promise<Blob> => {
    const response = await api.get(`/organization-documents/${id}/download`, { responseType: 'blob' });
    return response.data;
  },
};

export const assetService = {
  getAssetTypes: async (): Promise<ApiResponse<AssetType[]>> => {
    const response = await api.get('/asset-types');
    return response.data;
  },

  getAssetType: async (id: number): Promise<ApiResponse<AssetType>> => {
    const response = await api.get(`/asset-types/${id}`);
    return response.data;
  },

  createAssetType: async (data: Partial<AssetType>): Promise<ApiResponse<AssetType>> => {
    const response = await api.post('/asset-types', data);
    return response.data;
  },

  updateAssetType: async (id: number, data: Partial<AssetType>): Promise<ApiResponse<AssetType>> => {
    const response = await api.put(`/asset-types/${id}`, data);
    return response.data;
  },

  deleteAssetType: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/asset-types/${id}`);
    return response.data;
  },

  getAssets: async (params?: { type_id?: number; status?: string; assigned_to?: number }): Promise<ApiResponse<Asset[]>> => {
    const response = await api.get('/assets', { params });
    return response.data;
  },

  getAsset: async (id: number): Promise<ApiResponse<Asset>> => {
    const response = await api.get(`/assets/${id}`);
    return response.data;
  },

  createAsset: async (data: Partial<Asset>): Promise<ApiResponse<Asset>> => {
    const response = await api.post('/assets', data);
    return response.data;
  },

  updateAsset: async (id: number, data: Partial<Asset>): Promise<ApiResponse<Asset>> => {
    const response = await api.put(`/assets/${id}`, data);
    return response.data;
  },

  deleteAsset: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/assets/${id}`);
    return response.data;
  },

  assignAsset: async (id: number, staffMemberId: number): Promise<ApiResponse<Asset>> => {
    const response = await api.post(`/assets/${id}/assign`, { staff_member_id: staffMemberId });
    return response.data;
  },

  unassignAsset: async (id: number): Promise<ApiResponse<Asset>> => {
    const response = await api.post(`/assets/${id}/unassign`);
    return response.data;
  },

  getMyAssets: async (): Promise<ApiResponse<Asset[]>> => {
    const response = await api.get('/my-assets');
    return response.data;
  },
};

export const companyService = {
  getEvents: async (params?: { start_date?: string; end_date?: string }): Promise<ApiResponse<CompanyEvent[]>> => {
    const response = await api.get('/company-events', { params });
    return response.data;
  },

  getEvent: async (id: number): Promise<ApiResponse<CompanyEvent>> => {
    const response = await api.get(`/company-events/${id}`);
    return response.data;
  },

  createEvent: async (data: Partial<CompanyEvent>): Promise<ApiResponse<CompanyEvent>> => {
    const response = await api.post('/company-events', data);
    return response.data;
  },

  updateEvent: async (id: number, data: Partial<CompanyEvent>): Promise<ApiResponse<CompanyEvent>> => {
    const response = await api.put(`/company-events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/company-events/${id}`);
    return response.data;
  },

  rsvpEvent: async (id: number, status: 'attending' | 'not_attending' | 'maybe'): Promise<ApiResponse<CompanyEvent>> => {
    const response = await api.post(`/company-events/${id}/rsvp`, { status });
    return response.data;
  },

  getHolidays: async (params?: { year?: number }): Promise<ApiResponse<CompanyHoliday[]>> => {
    const response = await api.get('/company-holidays', { params });
    return response.data;
  },

  getHoliday: async (id: number): Promise<ApiResponse<CompanyHoliday>> => {
    const response = await api.get(`/company-holidays/${id}`);
    return response.data;
  },

  createHoliday: async (data: Partial<CompanyHoliday>): Promise<ApiResponse<CompanyHoliday>> => {
    const response = await api.post('/company-holidays', data);
    return response.data;
  },

  updateHoliday: async (id: number, data: Partial<CompanyHoliday>): Promise<ApiResponse<CompanyHoliday>> => {
    const response = await api.put(`/company-holidays/${id}`, data);
    return response.data;
  },

  deleteHoliday: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/company-holidays/${id}`);
    return response.data;
  },

  getNotices: async (params?: { is_read?: boolean }): Promise<ApiResponse<CompanyNotice[]>> => {
    const response = await api.get('/company-notices', { params });
    return response.data;
  },

  getNotice: async (id: number): Promise<ApiResponse<CompanyNotice>> => {
    const response = await api.get(`/company-notices/${id}`);
    return response.data;
  },

  createNotice: async (data: Partial<CompanyNotice>): Promise<ApiResponse<CompanyNotice>> => {
    const response = await api.post('/company-notices', data);
    return response.data;
  },

  updateNotice: async (id: number, data: Partial<CompanyNotice>): Promise<ApiResponse<CompanyNotice>> => {
    const response = await api.put(`/company-notices/${id}`, data);
    return response.data;
  },

  deleteNotice: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/company-notices/${id}`);
    return response.data;
  },

  markNoticeAsRead: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.post(`/company-notices/${id}/mark-read`);
    return response.data;
  },

  getMeetingTypes: async (): Promise<ApiResponse<MeetingType[]>> => {
    const response = await api.get('/meeting-types');
    return response.data;
  },

  createMeetingType: async (data: Partial<MeetingType>): Promise<ApiResponse<MeetingType>> => {
    const response = await api.post('/meeting-types', data);
    return response.data;
  },

  getMeetingRooms: async (): Promise<ApiResponse<MeetingRoom[]>> => {
    const response = await api.get('/meeting-rooms');
    return response.data;
  },

  createMeetingRoom: async (data: Partial<MeetingRoom>): Promise<ApiResponse<MeetingRoom>> => {
    const response = await api.post('/meeting-rooms', data);
    return response.data;
  },

  getMeetings: async (params?: { start_date?: string; end_date?: string; status?: string }): Promise<ApiResponse<Meeting[]>> => {
    const response = await api.get('/meetings', { params });
    return response.data;
  },

  getMeeting: async (id: number): Promise<ApiResponse<Meeting>> => {
    const response = await api.get(`/meetings/${id}`);
    return response.data;
  },

  createMeeting: async (data: Partial<Meeting>): Promise<ApiResponse<Meeting>> => {
    const response = await api.post('/meetings', data);
    return response.data;
  },

  updateMeeting: async (id: number, data: Partial<Meeting>): Promise<ApiResponse<Meeting>> => {
    const response = await api.put(`/meetings/${id}`, data);
    return response.data;
  },

  deleteMeeting: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/meetings/${id}`);
    return response.data;
  },

  addMeetingMinutes: async (id: number, minutes: string): Promise<ApiResponse<Meeting>> => {
    const response = await api.post(`/meetings/${id}/minutes`, { minutes });
    return response.data;
  },

  addMeetingActionItem: async (meetingId: number, data: Partial<MeetingActionItem>): Promise<ApiResponse<MeetingActionItem>> => {
    const response = await api.post(`/meetings/${meetingId}/action-items`, data);
    return response.data;
  },

  completeMeetingActionItem: async (meetingId: number, itemId: number): Promise<ApiResponse<MeetingActionItem>> => {
    const response = await api.post(`/meetings/${meetingId}/action-items/${itemId}/complete`);
    return response.data;
  },
};

export const trainingService = {
  getTrainingTypes: async (): Promise<ApiResponse<TrainingType[]>> => {
    const response = await api.get('/training-types');
    return response.data;
  },

  getTrainingType: async (id: number): Promise<ApiResponse<TrainingType>> => {
    const response = await api.get(`/training-types/${id}`);
    return response.data;
  },

  createTrainingType: async (data: Partial<TrainingType>): Promise<ApiResponse<TrainingType>> => {
    const response = await api.post('/training-types', data);
    return response.data;
  },

  updateTrainingType: async (id: number, data: Partial<TrainingType>): Promise<ApiResponse<TrainingType>> => {
    const response = await api.put(`/training-types/${id}`, data);
    return response.data;
  },

  deleteTrainingType: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/training-types/${id}`);
    return response.data;
  },

  getPrograms: async (params?: { type_id?: number }): Promise<ApiResponse<TrainingProgram[]>> => {
    const response = await api.get('/training-programs', { params });
    return response.data;
  },

  getProgram: async (id: number): Promise<ApiResponse<TrainingProgram>> => {
    const response = await api.get(`/training-programs/${id}`);
    return response.data;
  },

  createProgram: async (data: Partial<TrainingProgram>): Promise<ApiResponse<TrainingProgram>> => {
    const response = await api.post('/training-programs', data);
    return response.data;
  },

  updateProgram: async (id: number, data: Partial<TrainingProgram>): Promise<ApiResponse<TrainingProgram>> => {
    const response = await api.put(`/training-programs/${id}`, data);
    return response.data;
  },

  deleteProgram: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/training-programs/${id}`);
    return response.data;
  },

  getSessions: async (params?: { program_id?: number; status?: string }): Promise<ApiResponse<TrainingSession[]>> => {
    const response = await api.get('/training-sessions', { params });
    return response.data;
  },

  getSession: async (id: number): Promise<ApiResponse<TrainingSession>> => {
    const response = await api.get(`/training-sessions/${id}`);
    return response.data;
  },

  createSession: async (data: Partial<TrainingSession>): Promise<ApiResponse<TrainingSession>> => {
    const response = await api.post('/training-sessions', data);
    return response.data;
  },

  updateSession: async (id: number, data: Partial<TrainingSession>): Promise<ApiResponse<TrainingSession>> => {
    const response = await api.put(`/training-sessions/${id}`, data);
    return response.data;
  },

  deleteSession: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/training-sessions/${id}`);
    return response.data;
  },

  enrollInSession: async (id: number): Promise<ApiResponse<TrainingSession>> => {
    const response = await api.post(`/training-sessions/${id}/enroll`);
    return response.data;
  },

  unenrollFromSession: async (id: number): Promise<ApiResponse<TrainingSession>> => {
    const response = await api.post(`/training-sessions/${id}/unenroll`);
    return response.data;
  },

  getMyTrainings: async (): Promise<ApiResponse<TrainingSession[]>> => {
    const response = await api.get('/my-trainings');
    return response.data;
  },
};

export const documentService = {
  getDocumentCategories: async (): Promise<ApiResponse<DocumentCategory[]>> => {
    const response = await api.get('/document-categories');
    return response.data;
  },

  createDocumentCategory: async (data: Partial<DocumentCategory>): Promise<ApiResponse<DocumentCategory>> => {
    const response = await api.post('/document-categories', data);
    return response.data;
  },

  getHrDocuments: async (params?: { category_id?: number }): Promise<ApiResponse<HrDocument[]>> => {
    const response = await api.get('/hr-documents', { params });
    return response.data;
  },

  getHrDocument: async (id: number): Promise<ApiResponse<HrDocument>> => {
    const response = await api.get(`/hr-documents/${id}`);
    return response.data;
  },

  uploadHrDocument: async (formData: FormData): Promise<ApiResponse<HrDocument>> => {
    const response = await api.post('/hr-documents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  downloadHrDocument: async (id: number): Promise<Blob> => {
    const response = await api.get(`/hr-documents/${id}/download`, { responseType: 'blob' });
    return response.data;
  },

  acknowledgeHrDocument: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.post(`/hr-documents/${id}/acknowledge`);
    return response.data;
  },

  getPendingAcknowledgments: async (): Promise<ApiResponse<HrDocument[]>> => {
    const response = await api.get('/pending-acknowledgments');
    return response.data;
  },

  getLetterTemplates: async (): Promise<ApiResponse<LetterTemplate[]>> => {
    const response = await api.get('/letter-templates');
    return response.data;
  },

  getLetterTemplate: async (id: number): Promise<ApiResponse<LetterTemplate>> => {
    const response = await api.get(`/letter-templates/${id}`);
    return response.data;
  },

  createLetterTemplate: async (data: Partial<LetterTemplate>): Promise<ApiResponse<LetterTemplate>> => {
    const response = await api.post('/letter-templates', data);
    return response.data;
  },

  updateLetterTemplate: async (id: number, data: Partial<LetterTemplate>): Promise<ApiResponse<LetterTemplate>> => {
    const response = await api.put(`/letter-templates/${id}`, data);
    return response.data;
  },

  getGeneratedLetters: async (params?: { staff_member_id?: number }): Promise<ApiResponse<GeneratedLetter[]>> => {
    const response = await api.get('/generated-letters', { params });
    return response.data;
  },

  generateLetter: async (data: { staff_member_id: number; letter_template_id: number }): Promise<ApiResponse<GeneratedLetter>> => {
    const response = await api.post('/generated-letters/generate', data);
    return response.data;
  },

  previewLetter: async (id: number): Promise<ApiResponse<{ content: string }>> => {
    const response = await api.get(`/generated-letters/${id}/preview`);
    return response.data;
  },

  getMediaDirectories: async (params?: { parent_id?: number }): Promise<ApiResponse<MediaDirectory[]>> => {
    const response = await api.get('/media-directories', { params });
    return response.data;
  },

  createMediaDirectory: async (data: Partial<MediaDirectory>): Promise<ApiResponse<MediaDirectory>> => {
    const response = await api.post('/media-directories', data);
    return response.data;
  },

  getMediaFiles: async (params?: { directory_id?: number }): Promise<ApiResponse<MediaFile[]>> => {
    const response = await api.get('/media-files', { params });
    return response.data;
  },

  uploadMediaFile: async (formData: FormData): Promise<ApiResponse<MediaFile>> => {
    const response = await api.post('/media-files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  downloadMediaFile: async (id: number): Promise<Blob> => {
    const response = await api.get(`/media-files/${id}/download`, { responseType: 'blob' });
    return response.data;
  },

  deleteMediaFile: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/media-files/${id}`);
    return response.data;
  },
};

export const reportService = {
  getAttendanceReport: async (params: { start_date: string; end_date: string; staff_member_id?: number }): Promise<ApiResponse<any>> => {
    const response = await api.get('/reports/attendance', { params });
    return response.data;
  },

  getLeaveReport: async (params: { start_date: string; end_date: string; category_id?: number }): Promise<ApiResponse<any>> => {
    const response = await api.get('/reports/leave', { params });
    return response.data;
  },

  getPayrollReport: async (params: { period: string }): Promise<ApiResponse<any>> => {
    const response = await api.get('/reports/payroll', { params });
    return response.data;
  },

  getEmployeeReport: async (params?: { division_id?: number; location_id?: number }): Promise<ApiResponse<any>> => {
    const response = await api.get('/reports/employees', { params });
    return response.data;
  },

  exportData: async (type: string, params?: any): Promise<Blob> => {
    const response = await api.get(`/exports/${type}`, { params, responseType: 'blob' });
    return response.data;
  },

  importData: async (type: string, formData: FormData): Promise<ApiResponse<any>> => {
    const response = await api.post(`/imports/${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const settingsService = {
  getConfigurations: async (): Promise<ApiResponse<SystemConfiguration[]>> => {
    const response = await api.get('/system-configurations');
    return response.data;
  },

  getConfiguration: async (key: string): Promise<ApiResponse<SystemConfiguration>> => {
    const response = await api.get(`/system-configurations/${key}`);
    return response.data;
  },

  updateConfiguration: async (key: string, value: string): Promise<ApiResponse<SystemConfiguration>> => {
    const response = await api.put(`/system-configurations/${key}`, { value });
    return response.data;
  },

  getAllowedIps: async (): Promise<ApiResponse<AllowedIpAddress[]>> => {
    const response = await api.get('/allowed-ip-addresses');
    return response.data;
  },

  createAllowedIp: async (data: Partial<AllowedIpAddress>): Promise<ApiResponse<AllowedIpAddress>> => {
    const response = await api.post('/allowed-ip-addresses', data);
    return response.data;
  },

  updateAllowedIp: async (id: number, data: Partial<AllowedIpAddress>): Promise<ApiResponse<AllowedIpAddress>> => {
    const response = await api.put(`/allowed-ip-addresses/${id}`, data);
    return response.data;
  },

  deleteAllowedIp: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/allowed-ip-addresses/${id}`);
    return response.data;
  },
};

export const travelService = {
  getBusinessTrips: async (params?: { staff_member_id?: number; status?: string }): Promise<ApiResponse<BusinessTrip[]>> => {
    const response = await api.get('/business-trips', { params });
    return response.data;
  },

  getBusinessTrip: async (id: number): Promise<ApiResponse<BusinessTrip>> => {
    const response = await api.get(`/business-trips/${id}`);
    return response.data;
  },

  createBusinessTrip: async (data: Partial<BusinessTrip>): Promise<ApiResponse<BusinessTrip>> => {
    const response = await api.post('/business-trips', data);
    return response.data;
  },

  updateBusinessTrip: async (id: number, data: Partial<BusinessTrip>): Promise<ApiResponse<BusinessTrip>> => {
    const response = await api.put(`/business-trips/${id}`, data);
    return response.data;
  },

  deleteBusinessTrip: async (id: number): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/business-trips/${id}`);
    return response.data;
  },

  approveBusinessTrip: async (id: number): Promise<ApiResponse<BusinessTrip>> => {
    const response = await api.post(`/business-trips/${id}/approve`);
    return response.data;
  },

  rejectBusinessTrip: async (id: number, reason: string): Promise<ApiResponse<BusinessTrip>> => {
    const response = await api.post(`/business-trips/${id}/reject`, { reason });
    return response.data;
  },

  completeBusinessTrip: async (id: number, actualCost: number): Promise<ApiResponse<BusinessTrip>> => {
    const response = await api.post(`/business-trips/${id}/complete`, { actual_cost: actualCost });
    return response.data;
  },

  getMyTrips: async (): Promise<ApiResponse<BusinessTrip[]>> => {
    const response = await api.get('/my-business-trips');
    return response.data;
  },
};
