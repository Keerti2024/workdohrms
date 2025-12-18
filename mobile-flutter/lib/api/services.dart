import 'package:dio/dio.dart';
import 'api_client.dart';

class AuthService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _dio.post('/auth/sign-in', data: {
      'email': email,
      'password': password,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> logout() async {
    final response = await _dio.post('/auth/sign-out');
    return response.data;
  }

  Future<Map<String, dynamic>> getProfile() async {
    final response = await _dio.get('/auth/profile');
    return response.data;
  }

  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> data) async {
    final response = await _dio.put('/auth/profile', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> changePassword({
    required String currentPassword,
    required String newPassword,
    required String confirmPassword,
  }) async {
    final response = await _dio.post('/auth/change-password', data: {
      'current_password': currentPassword,
      'new_password': newPassword,
      'new_password_confirmation': confirmPassword,
    });
    return response.data;
  }
}

class DashboardService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getStats() async {
    final response = await _dio.get('/dashboard');
    return response.data;
  }

  Future<Map<String, dynamic>> getEmployeeStats() async {
    final response = await _dio.get('/dashboard/employee');
    return response.data;
  }
}

class AttendanceService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> clockIn() async {
    final response = await _dio.post('/clock-in');
    return response.data;
  }

  Future<Map<String, dynamic>> clockOut() async {
    final response = await _dio.post('/clock-out');
    return response.data;
  }

  Future<Map<String, dynamic>> getWorkLogs({String? startDate, String? endDate}) async {
    final response = await _dio.get('/work-logs', queryParameters: {
      if (startDate != null) 'start_date': startDate,
      if (endDate != null) 'end_date': endDate,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getShifts() async {
    final response = await _dio.get('/shifts');
    return response.data;
  }

  Future<Map<String, dynamic>> getMyShift() async {
    final response = await _dio.get('/my-shift');
    return response.data;
  }

  Future<Map<String, dynamic>> getTimesheets({String? month, String? year}) async {
    final response = await _dio.get('/timesheets', queryParameters: {
      if (month != null) 'month': month,
      if (year != null) 'year': year,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getExtraHours() async {
    final response = await _dio.get('/extra-hours');
    return response.data;
  }

  Future<Map<String, dynamic>> requestRegularization({
    required int workLogId,
    required String clockIn,
    required String clockOut,
    required String reason,
  }) async {
    final response = await _dio.post('/attendance-regularizations', data: {
      'work_log_id': workLogId,
      'clock_in': clockIn,
      'clock_out': clockOut,
      'reason': reason,
    });
    return response.data;
  }
}

class LeaveService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getCategories() async {
    final response = await _dio.get('/time-off-categories');
    return response.data;
  }

  Future<Map<String, dynamic>> getRequests({String? status}) async {
    final response = await _dio.get('/time-off-requests', queryParameters: {
      if (status != null) 'status': status,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getRequest(int id) async {
    final response = await _dio.get('/time-off-requests/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> createRequest({
    required int timeOffCategoryId,
    required String startDate,
    required String endDate,
    required String reason,
  }) async {
    final response = await _dio.post('/time-off-requests', data: {
      'time_off_category_id': timeOffCategoryId,
      'start_date': startDate,
      'end_date': endDate,
      'reason': reason,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> cancelRequest(int id) async {
    final response = await _dio.post('/time-off-requests/$id/cancel');
    return response.data;
  }

  Future<Map<String, dynamic>> approveRequest(int id) async {
    final response = await _dio.post('/time-off-requests/$id/approve');
    return response.data;
  }

  Future<Map<String, dynamic>> rejectRequest(int id, {String? reason}) async {
    final response = await _dio.post('/time-off-requests/$id/reject', data: {
      if (reason != null) 'rejection_reason': reason,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getBalance() async {
    final response = await _dio.get('/time-off-balance');
    return response.data;
  }
}

class PayrollService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getSalarySlips({String? period, String? status}) async {
    final response = await _dio.get('/salary-slips', queryParameters: {
      if (period != null) 'period': period,
      if (status != null) 'status': status,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getSalarySlip(int id) async {
    final response = await _dio.get('/salary-slips/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> getMySalarySlips() async {
    final response = await _dio.get('/my-salary-slips');
    return response.data;
  }

  Future<Map<String, dynamic>> getSalaryAdvances({String? status}) async {
    final response = await _dio.get('/salary-advances', queryParameters: {
      if (status != null) 'status': status,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> requestSalaryAdvance({
    required double amount,
    required String reason,
    int? repaymentMonths,
  }) async {
    final response = await _dio.post('/salary-advances', data: {
      'amount': amount,
      'reason': reason,
      if (repaymentMonths != null) 'repayment_months': repaymentMonths,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getBenefits() async {
    final response = await _dio.get('/employee-benefits');
    return response.data;
  }

  Future<Map<String, dynamic>> getBonuses() async {
    final response = await _dio.get('/bonuses');
    return response.data;
  }

  Future<Map<String, dynamic>> getDeductions() async {
    final response = await _dio.get('/deductions');
    return response.data;
  }

  Future<Map<String, dynamic>> getTaxes() async {
    final response = await _dio.get('/taxes');
    return response.data;
  }
}

class RecruitmentService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getJobs({String? status}) async {
    final response = await _dio.get('/jobs', queryParameters: {
      if (status != null) 'status': status,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getJob(int id) async {
    final response = await _dio.get('/jobs/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> createJob(Map<String, dynamic> data) async {
    final response = await _dio.post('/jobs', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> updateJob(int id, Map<String, dynamic> data) async {
    final response = await _dio.put('/jobs/$id', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> getCandidates({int? jobId}) async {
    final response = await _dio.get('/candidates', queryParameters: {
      if (jobId != null) 'job_id': jobId,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getCandidate(int id) async {
    final response = await _dio.get('/candidates/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> getApplications({int? jobId, String? status}) async {
    final response = await _dio.get('/job-applications', queryParameters: {
      if (jobId != null) 'job_id': jobId,
      if (status != null) 'status': status,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getApplication(int id) async {
    final response = await _dio.get('/job-applications/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> updateApplicationStatus(int id, String status) async {
    final response = await _dio.put('/job-applications/$id/status', data: {
      'status': status,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getInterviews({int? applicationId}) async {
    final response = await _dio.get('/interviews', queryParameters: {
      if (applicationId != null) 'application_id': applicationId,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> scheduleInterview(Map<String, dynamic> data) async {
    final response = await _dio.post('/interviews', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> getOffers({String? status}) async {
    final response = await _dio.get('/job-offers', queryParameters: {
      if (status != null) 'status': status,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> createOffer(Map<String, dynamic> data) async {
    final response = await _dio.post('/job-offers', data: data);
    return response.data;
  }
}

class PerformanceService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getObjectives({String? status}) async {
    final response = await _dio.get('/performance-objectives', queryParameters: {
      if (status != null) 'status': status,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getObjective(int id) async {
    final response = await _dio.get('/performance-objectives/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> createObjective(Map<String, dynamic> data) async {
    final response = await _dio.post('/performance-objectives', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> updateObjective(int id, Map<String, dynamic> data) async {
    final response = await _dio.put('/performance-objectives/$id', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> updateObjectiveProgress(int id, int progress) async {
    final response = await _dio.put('/performance-objectives/$id/progress', data: {
      'progress': progress,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getAppraisals() async {
    final response = await _dio.get('/performance-appraisals');
    return response.data;
  }

  Future<Map<String, dynamic>> getAppraisal(int id) async {
    final response = await _dio.get('/performance-appraisals/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> getRecognitions() async {
    final response = await _dio.get('/recognition-records');
    return response.data;
  }

  Future<Map<String, dynamic>> getMyRecognitions() async {
    final response = await _dio.get('/my-recognitions');
    return response.data;
  }

  Future<Map<String, dynamic>> createRecognition(Map<String, dynamic> data) async {
    final response = await _dio.post('/recognition-records', data: data);
    return response.data;
  }
}

class StaffService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getStaffMembers({String? status, int? divisionId}) async {
    final response = await _dio.get('/staff-members', queryParameters: {
      if (status != null) 'status': status,
      if (divisionId != null) 'division_id': divisionId,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getStaffMember(int id) async {
    final response = await _dio.get('/staff-members/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> createStaffMember(Map<String, dynamic> data) async {
    final response = await _dio.post('/staff-members', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> updateStaffMember(int id, Map<String, dynamic> data) async {
    final response = await _dio.put('/staff-members/$id', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> getContracts({int? staffMemberId}) async {
    final response = await _dio.get('/employment-contracts', queryParameters: {
      if (staffMemberId != null) 'staff_member_id': staffMemberId,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getOnboardingTasks({int? staffMemberId}) async {
    final response = await _dio.get('/onboarding-tasks', queryParameters: {
      if (staffMemberId != null) 'staff_member_id': staffMemberId,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getGrievances({String? status}) async {
    final response = await _dio.get('/grievances', queryParameters: {
      if (status != null) 'status': status,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> createGrievance(Map<String, dynamic> data) async {
    final response = await _dio.post('/grievances', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> getDisciplinaryActions({int? staffMemberId}) async {
    final response = await _dio.get('/disciplinary-actions', queryParameters: {
      if (staffMemberId != null) 'staff_member_id': staffMemberId,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getOffboardingTasks({int? staffMemberId}) async {
    final response = await _dio.get('/offboarding-tasks', queryParameters: {
      if (staffMemberId != null) 'staff_member_id': staffMemberId,
    });
    return response.data;
  }
}

class OrganizationService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getLocations() async {
    final response = await _dio.get('/office-locations');
    return response.data;
  }

  Future<Map<String, dynamic>> getLocation(int id) async {
    final response = await _dio.get('/office-locations/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> getDivisions({int? locationId}) async {
    final response = await _dio.get('/divisions', queryParameters: {
      if (locationId != null) 'location_id': locationId,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getDivision(int id) async {
    final response = await _dio.get('/divisions/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> getJobTitles() async {
    final response = await _dio.get('/job-titles');
    return response.data;
  }

  Future<Map<String, dynamic>> getPolicies() async {
    final response = await _dio.get('/organization-policies');
    return response.data;
  }

  Future<Map<String, dynamic>> getPolicy(int id) async {
    final response = await _dio.get('/organization-policies/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> acknowledgePolicy(int id) async {
    final response = await _dio.post('/organization-policies/$id/acknowledge');
    return response.data;
  }

  Future<Map<String, dynamic>> getDocuments() async {
    final response = await _dio.get('/organization-documents');
    return response.data;
  }
}

class AssetService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getAssetTypes() async {
    final response = await _dio.get('/asset-types');
    return response.data;
  }

  Future<Map<String, dynamic>> getAssets({int? typeId, String? status}) async {
    final response = await _dio.get('/assets', queryParameters: {
      if (typeId != null) 'type_id': typeId,
      if (status != null) 'status': status,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getAsset(int id) async {
    final response = await _dio.get('/assets/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> getMyAssets() async {
    final response = await _dio.get('/my-assets');
    return response.data;
  }

  Future<Map<String, dynamic>> createAsset(Map<String, dynamic> data) async {
    final response = await _dio.post('/assets', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> updateAsset(int id, Map<String, dynamic> data) async {
    final response = await _dio.put('/assets/$id', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> assignAsset(int id, int staffMemberId) async {
    final response = await _dio.post('/assets/$id/assign', data: {
      'staff_member_id': staffMemberId,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> unassignAsset(int id) async {
    final response = await _dio.post('/assets/$id/unassign');
    return response.data;
  }
}

class CompanyService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getEvents({String? type}) async {
    final response = await _dio.get('/events', queryParameters: {
      if (type != null) 'type': type,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getEvent(int id) async {
    final response = await _dio.get('/events/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> getHolidays({String? year}) async {
    final response = await _dio.get('/holidays', queryParameters: {
      if (year != null) 'year': year,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getNotices() async {
    final response = await _dio.get('/notices');
    return response.data;
  }

  Future<Map<String, dynamic>> getNotice(int id) async {
    final response = await _dio.get('/notices/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> markNoticeRead(int id) async {
    final response = await _dio.post('/notices/$id/read');
    return response.data;
  }

  Future<Map<String, dynamic>> getMeetings({String? status}) async {
    final response = await _dio.get('/meetings', queryParameters: {
      if (status != null) 'status': status,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getMeeting(int id) async {
    final response = await _dio.get('/meetings/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> createMeeting(Map<String, dynamic> data) async {
    final response = await _dio.post('/meetings', data: data);
    return response.data;
  }
}

class TrainingService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getTrainingTypes() async {
    final response = await _dio.get('/training-types');
    return response.data;
  }

  Future<Map<String, dynamic>> getPrograms({int? typeId}) async {
    final response = await _dio.get('/training-programs', queryParameters: {
      if (typeId != null) 'type_id': typeId,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getProgram(int id) async {
    final response = await _dio.get('/training-programs/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> getSessions({int? programId, String? status}) async {
    final response = await _dio.get('/training-sessions', queryParameters: {
      if (programId != null) 'program_id': programId,
      if (status != null) 'status': status,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getSession(int id) async {
    final response = await _dio.get('/training-sessions/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> getMyTrainings() async {
    final response = await _dio.get('/my-trainings');
    return response.data;
  }

  Future<Map<String, dynamic>> enrollInSession(int sessionId) async {
    final response = await _dio.post('/training-sessions/$sessionId/enroll');
    return response.data;
  }

  Future<Map<String, dynamic>> unenrollFromSession(int sessionId) async {
    final response = await _dio.post('/training-sessions/$sessionId/unenroll');
    return response.data;
  }
}

class DocumentService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getCategories() async {
    final response = await _dio.get('/document-categories');
    return response.data;
  }

  Future<Map<String, dynamic>> getDocuments({int? categoryId}) async {
    final response = await _dio.get('/hr-documents', queryParameters: {
      if (categoryId != null) 'category_id': categoryId,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getDocument(int id) async {
    final response = await _dio.get('/hr-documents/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> acknowledgeDocument(int id) async {
    final response = await _dio.post('/hr-documents/$id/acknowledge');
    return response.data;
  }

  Future<Map<String, dynamic>> getLetters() async {
    final response = await _dio.get('/hr-letters');
    return response.data;
  }

  Future<Map<String, dynamic>> getMyLetters() async {
    final response = await _dio.get('/my-letters');
    return response.data;
  }

  Future<Map<String, dynamic>> getMediaFiles() async {
    final response = await _dio.get('/media-files');
    return response.data;
  }
}

class ReportService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getAttendanceReport({String? startDate, String? endDate}) async {
    final response = await _dio.get('/reports/attendance', queryParameters: {
      if (startDate != null) 'start_date': startDate,
      if (endDate != null) 'end_date': endDate,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getLeaveReport({String? startDate, String? endDate}) async {
    final response = await _dio.get('/reports/leave', queryParameters: {
      if (startDate != null) 'start_date': startDate,
      if (endDate != null) 'end_date': endDate,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getPayrollReport({String? period}) async {
    final response = await _dio.get('/reports/payroll', queryParameters: {
      if (period != null) 'period': period,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getEmployeeReport() async {
    final response = await _dio.get('/reports/employees');
    return response.data;
  }

  Future<Map<String, dynamic>> exportReport(String type, {String? format}) async {
    final response = await _dio.get('/reports/$type/export', queryParameters: {
      if (format != null) 'format': format,
    });
    return response.data;
  }
}

class SettingsService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getConfigurations() async {
    final response = await _dio.get('/system-configurations');
    return response.data;
  }

  Future<Map<String, dynamic>> updateConfiguration(int id, String value) async {
    final response = await _dio.put('/system-configurations/$id', data: {
      'value': value,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getIpAddresses() async {
    final response = await _dio.get('/ip-addresses');
    return response.data;
  }

  Future<Map<String, dynamic>> addIpAddress(Map<String, dynamic> data) async {
    final response = await _dio.post('/ip-addresses', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> deleteIpAddress(int id) async {
    final response = await _dio.delete('/ip-addresses/$id');
    return response.data;
  }
}

class TravelService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getTrips({String? status}) async {
    final response = await _dio.get('/business-trips', queryParameters: {
      if (status != null) 'status': status,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> getTrip(int id) async {
    final response = await _dio.get('/business-trips/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> getMyTrips() async {
    final response = await _dio.get('/my-business-trips');
    return response.data;
  }

  Future<Map<String, dynamic>> createTrip(Map<String, dynamic> data) async {
    final response = await _dio.post('/business-trips', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> updateTrip(int id, Map<String, dynamic> data) async {
    final response = await _dio.put('/business-trips/$id', data: data);
    return response.data;
  }

  Future<Map<String, dynamic>> cancelTrip(int id) async {
    final response = await _dio.post('/business-trips/$id/cancel');
    return response.data;
  }

  Future<Map<String, dynamic>> approveTrip(int id) async {
    final response = await _dio.post('/business-trips/$id/approve');
    return response.data;
  }

  Future<Map<String, dynamic>> rejectTrip(int id, {String? reason}) async {
    final response = await _dio.post('/business-trips/$id/reject', data: {
      if (reason != null) 'rejection_reason': reason,
    });
    return response.data;
  }
}

final authService = AuthService();
final dashboardService = DashboardService();
final attendanceService = AttendanceService();
final leaveService = LeaveService();
final payrollService = PayrollService();
final recruitmentService = RecruitmentService();
final performanceService = PerformanceService();
final staffService = StaffService();
final organizationService = OrganizationService();
final assetService = AssetService();
final companyService = CompanyService();
final trainingService = TrainingService();
final documentService = DocumentService();
final reportService = ReportService();
final settingsService = SettingsService();
final travelService = TravelService();
