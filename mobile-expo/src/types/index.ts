export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  role_display: string;
  permissions: string[];
  staff_member_id?: number;
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
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  total_pages?: number;
  last_page?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    current_page: number;
    data: T[];
    last_page: number;
    per_page: number;
    total: number;
  };
  message: string;
}

export interface DashboardStats {
  total_employees: number;
  present_today: number;
  on_leave: number;
  pending_approvals: number;
  employees?: { total: number; active: number; new_this_month: number };
  attendance_today?: { present: number; absent: number; not_marked: number };
  leave_requests?: { pending: number; approved_this_month: number };
  payroll?: { period: string; generated: number; paid: number };
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
  remarks?: string;
  created_at: string;
  category?: TimeOffCategory;
  staff_member?: StaffMember;
}

export interface TimeOffCategory {
  id: number;
  name: string;
  title?: string;
  annual_allowance: number;
  is_paid: boolean;
  is_carry_forward_allowed?: boolean;
  max_carry_forward_days?: number;
}

export interface LeaveBalance {
  category_id: number;
  category_name: string;
  annual_allowance: number;
  used: number;
  remaining: number;
}

export interface WorkLog {
  id: number;
  staff_member_id: number;
  log_date: string;
  clock_in: string | null;
  clock_out: string | null;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'leave';
  notes?: string;
  staff_member?: StaffMember;
}

export interface Shift {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
  break_duration_minutes: number;
  is_night_shift: boolean;
  overtime_after_hours?: number;
}

export interface Timesheet {
  id: number;
  staff_member_id: number;
  timesheet_project_id: number;
  date: string;
  hours: number;
  task_description: string;
  is_billable: boolean;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  project?: TimesheetProject;
  staff_member?: StaffMember;
}

export interface TimesheetProject {
  id: number;
  name: string;
  description?: string;
  client_name?: string;
  is_active: boolean;
}

export interface ExtraHoursRecord {
  id: number;
  staff_member_id: number;
  date: string;
  hours: number;
  rate_multiplier: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AttendanceRegularization {
  id: number;
  staff_member_id: number;
  log_date: string;
  requested_clock_in: string;
  requested_clock_out: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SalarySlip {
  id: number;
  staff_member_id: number;
  slip_reference: string;
  salary_period: string;
  basic_salary: number;
  total_earnings: number;
  total_deductions: number;
  net_payable: number;
  status: 'generated' | 'paid';
  benefits_breakdown?: any[];
  deductions_breakdown?: any[];
  tax_breakdown?: any;
  staff_member?: StaffMember;
  created_at: string;
}

export interface SalaryAdvance {
  id: number;
  staff_member_id: number;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  requested_date: string;
  approved_date?: string;
  repayment_months?: number;
  monthly_deduction?: number;
  remaining_balance?: number;
}

export interface StaffBenefit {
  id: number;
  staff_member_id: number;
  benefit_type_id: number;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'one_time';
  is_taxable: boolean;
  start_date: string;
  end_date?: string;
  benefit_type?: BenefitType;
}

export interface BenefitType {
  id: number;
  name: string;
  description?: string;
  is_taxable: boolean;
}

export interface BonusPayment {
  id: number;
  staff_member_id: number;
  amount: number;
  bonus_type: string;
  reason: string;
  payment_date: string;
  is_taxable: boolean;
}

export interface RecurringDeduction {
  id: number;
  staff_member_id: number;
  name: string;
  amount: number;
  deduction_type: 'fixed' | 'percentage';
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

export interface TaxSlab {
  id: number;
  income_from: number;
  income_to: number;
  fixed_amount: number;
  percentage: number;
}

export interface Job {
  id: number;
  title: string;
  job_category_id: number;
  office_location_id: number;
  division_id?: number;
  positions: number;
  description: string;
  requirements?: string;
  skills?: string;
  experience_required?: string;
  salary_from?: number;
  salary_to?: number;
  start_date: string;
  end_date?: string;
  status: 'draft' | 'published' | 'closed';
  applications_count?: number;
  category?: JobCategory;
  location?: OfficeLocation;
}

export interface JobCategory {
  id: number;
  name: string;
  description?: string;
}

export interface JobStage {
  id: number;
  name: string;
  order: number;
  color?: string;
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  linkedin_url?: string;
  source?: string;
  resume_url?: string;
  status: 'active' | 'archived';
  created_at: string;
}

export interface JobApplication {
  id: number;
  job_id: number;
  candidate_id: number;
  job_stage_id?: number;
  status: 'applied' | 'shortlisted' | 'rejected' | 'hired';
  rating?: number;
  notes?: string;
  applied_at: string;
  job?: Job;
  candidate?: Candidate;
  stage?: JobStage;
}

export interface InterviewSchedule {
  id: number;
  job_application_id: number;
  interviewer_id: number;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  location?: string;
  meeting_link?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: string;
  rating?: number;
  recommendation?: 'proceed' | 'hold' | 'reject';
  application?: JobApplication;
  interviewer?: StaffMember;
}

export interface Offer {
  id: number;
  job_application_id: number;
  salary: number;
  start_date: string;
  expiry_date: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';
  terms?: string;
  application?: JobApplication;
}

export interface PerformanceObjective {
  id: number;
  staff_member_id: number;
  title: string;
  description: string;
  target_date: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  rating?: number;
  staff_member?: StaffMember;
}

export interface AppraisalCycle {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'closed';
  description?: string;
}

export interface AppraisalRecord {
  id: number;
  appraisal_cycle_id: number;
  staff_member_id: number;
  self_rating?: number;
  self_comments?: string;
  manager_rating?: number;
  manager_comments?: string;
  final_rating?: number;
  status: 'pending' | 'self_review' | 'manager_review' | 'completed';
  cycle?: AppraisalCycle;
  staff_member?: StaffMember;
}

export interface RecognitionRecord {
  id: number;
  staff_member_id: number;
  recognition_category_id: number;
  title: string;
  description: string;
  awarded_by: number;
  awarded_date: string;
  category?: RecognitionCategory;
  staff_member?: StaffMember;
}

export interface RecognitionCategory {
  id: number;
  name: string;
  description?: string;
}

export interface StaffMember {
  id: number;
  user_id?: number;
  staff_code?: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  personal_email?: string;
  work_email?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  hire_date: string;
  base_salary?: number;
  employment_status: 'active' | 'inactive' | 'terminated';
  office_location_id?: number;
  division_id?: number;
  job_title_id?: number;
  office_location?: OfficeLocation;
  division?: Division;
  job_title?: JobTitle;
  user?: User;
}

export interface Contract {
  id: number;
  staff_member_id: number;
  contract_type_id: number;
  start_date: string;
  end_date?: string;
  salary: number;
  status: 'active' | 'expired' | 'terminated' | 'renewed';
  terms?: string;
  contract_type?: ContractType;
  staff_member?: StaffMember;
}

export interface ContractType {
  id: number;
  name: string;
  description?: string;
}

export interface OnboardingTemplate {
  id: number;
  name: string;
  description?: string;
  tasks: OnboardingTask[];
}

export interface OnboardingTask {
  id: number;
  title: string;
  description?: string;
  order: number;
  is_required: boolean;
}

export interface EmployeeOnboarding {
  id: number;
  staff_member_id: number;
  onboarding_template_id: number;
  status: 'pending' | 'in_progress' | 'completed';
  started_at?: string;
  completed_at?: string;
  tasks: EmployeeOnboardingTask[];
  staff_member?: StaffMember;
  template?: OnboardingTemplate;
}

export interface EmployeeOnboardingTask {
  id: number;
  task_id: number;
  is_completed: boolean;
  completed_at?: string;
  task?: OnboardingTask;
}

export interface Grievance {
  id: number;
  staff_member_id: number;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  resolution?: string;
  created_at: string;
  staff_member?: StaffMember;
}

export interface DisciplineNote {
  id: number;
  staff_member_id: number;
  type: 'warning' | 'written_warning' | 'suspension' | 'termination';
  reason: string;
  description: string;
  issued_date: string;
  issued_by: number;
  staff_member?: StaffMember;
}

export interface Offboarding {
  id: number;
  staff_member_id: number;
  exit_category_id: number;
  last_working_day: string;
  reason: string;
  status: 'pending' | 'in_progress' | 'completed';
  exit_interview_notes?: string;
  staff_member?: StaffMember;
  exit_category?: ExitCategory;
}

export interface ExitCategory {
  id: number;
  name: string;
  description?: string;
}

export interface OfficeLocation {
  id: number;
  title: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  is_headquarters: boolean;
}

export interface Division {
  id: number;
  name: string;
  office_location_id: number;
  description?: string;
  office_location?: OfficeLocation;
}

export interface JobTitle {
  id: number;
  name: string;
  division_id: number;
  description?: string;
  division?: Division;
}

export interface OrganizationPolicy {
  id: number;
  title: string;
  description: string;
  category: string;
  effective_date: string;
  is_active: boolean;
  requires_acknowledgment: boolean;
  acknowledged?: boolean;
}

export interface OrganizationDocument {
  id: number;
  title: string;
  description?: string;
  file_path: string;
  file_type: string;
  category: string;
  uploaded_at: string;
}

export interface AssetType {
  id: number;
  title: string;
  description?: string;
  depreciation_rate?: number;
}

export interface Asset {
  id: number;
  name: string;
  asset_type_id: number;
  serial_number?: string;
  purchase_date?: string;
  purchase_cost?: number;
  condition: 'new' | 'good' | 'fair' | 'poor';
  status: 'available' | 'assigned' | 'maintenance' | 'retired';
  location?: string;
  assigned_to?: number;
  asset_type?: AssetType;
  assigned_staff?: StaffMember;
}

export interface CompanyEvent {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  is_all_day: boolean;
  event_type: string;
  rsvp_status?: 'attending' | 'not_attending' | 'maybe';
}

export interface CompanyHoliday {
  id: number;
  name: string;
  date: string;
  description?: string;
  is_recurring: boolean;
}

export interface CompanyNotice {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  target_type: 'all' | 'department' | 'individual';
  is_read?: boolean;
  created_at: string;
}

export interface Meeting {
  id: number;
  title: string;
  description?: string;
  meeting_type_id: number;
  meeting_room_id?: number;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meeting_link?: string;
  attendees?: StaffMember[];
  meeting_type?: MeetingType;
  meeting_room?: MeetingRoom;
  minutes?: string;
  action_items?: MeetingActionItem[];
}

export interface MeetingType {
  id: number;
  name: string;
  description?: string;
}

export interface MeetingRoom {
  id: number;
  name: string;
  capacity: number;
  location?: string;
  amenities?: string[];
}

export interface MeetingActionItem {
  id: number;
  meeting_id: number;
  title: string;
  assigned_to: number;
  due_date: string;
  is_completed: boolean;
  assignee?: StaffMember;
}

export interface TrainingType {
  id: number;
  name: string;
  description?: string;
}

export interface TrainingProgram {
  id: number;
  title: string;
  training_type_id: number;
  description?: string;
  duration?: string;
  cost?: number;
  trainer_name?: string;
  trainer_type: 'internal' | 'external';
  training_type?: TrainingType;
}

export interface TrainingSession {
  id: number;
  training_program_id: number;
  start_date: string;
  end_date: string;
  location?: string;
  max_participants?: number;
  enrolled_count?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  program?: TrainingProgram;
  is_enrolled?: boolean;
}

export interface HrDocument {
  id: number;
  title: string;
  description?: string;
  document_category_id: number;
  file_path: string;
  file_type: string;
  requires_acknowledgment: boolean;
  acknowledged?: boolean;
  category?: DocumentCategory;
  created_at: string;
}

export interface DocumentCategory {
  id: number;
  name: string;
  description?: string;
}

export interface LetterTemplate {
  id: number;
  name: string;
  type: string;
  content: string;
  placeholders: string[];
}

export interface GeneratedLetter {
  id: number;
  staff_member_id: number;
  letter_template_id: number;
  content: string;
  generated_at: string;
  staff_member?: StaffMember;
  template?: LetterTemplate;
}

export interface MediaFile {
  id: number;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  directory_id?: number;
  uploaded_by: number;
  created_at: string;
}

export interface MediaDirectory {
  id: number;
  name: string;
  parent_id?: number;
  created_at: string;
}

export interface Report {
  type: 'attendance' | 'leave' | 'payroll' | 'employees';
  data: any;
  period?: string;
  generated_at: string;
}

export interface SystemConfiguration {
  id: number;
  key: string;
  value: string;
  category: string;
  description?: string;
}

export interface AllowedIpAddress {
  id: number;
  ip_address: string;
  description?: string;
  is_active: boolean;
}

export interface BusinessTrip {
  id: number;
  staff_member_id: number;
  destination: string;
  purpose: string;
  start_date: string;
  end_date: string;
  estimated_cost?: number;
  actual_cost?: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  staff_member?: StaffMember;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  color: string;
  type: 'event' | 'holiday' | 'leave' | 'meeting';
}
