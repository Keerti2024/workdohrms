class User {
  final int id;
  final String name;
  final String email;
  final String role;
  final String roleDisplay;
  final List<String> permissions;
  final int? staffMemberId;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.roleDisplay,
    required this.permissions,
    this.staffMemberId,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      name: json['name'] as String,
      email: json['email'] as String,
      role: json['role'] as String,
      roleDisplay: json['role_display'] as String,
      permissions: List<String>.from(json['permissions'] ?? []),
      staffMemberId: json['staff_member_id'] as int?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'role': role,
      'role_display': roleDisplay,
      'permissions': permissions,
      'staff_member_id': staffMemberId,
    };
  }
}

class AuthResponse {
  final User user;
  final String token;
  final String accessToken;
  final String tokenType;

  AuthResponse({
    required this.user,
    required this.token,
    required this.accessToken,
    required this.tokenType,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      user: User.fromJson(json['user']),
      token: json['token'] as String,
      accessToken: json['access_token'] as String,
      tokenType: json['token_type'] as String,
    );
  }
}

class DashboardStats {
  final int? totalEmployees;
  final int? presentToday;
  final int? onLeave;
  final int? pendingApprovals;

  DashboardStats({
    this.totalEmployees,
    this.presentToday,
    this.onLeave,
    this.pendingApprovals,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    return DashboardStats(
      totalEmployees: json['total_employees'] as int?,
      presentToday: json['present_today'] as int?,
      onLeave: json['on_leave'] as int?,
      pendingApprovals: json['pending_approvals'] as int?,
    );
  }
}

class WorkLog {
  final int id;
  final int staffMemberId;
  final String logDate;
  final String? clockIn;
  final String? clockOut;
  final String status;
  final String? notes;

  WorkLog({
    required this.id,
    required this.staffMemberId,
    required this.logDate,
    this.clockIn,
    this.clockOut,
    required this.status,
    this.notes,
  });

  factory WorkLog.fromJson(Map<String, dynamic> json) {
    return WorkLog(
      id: json['id'] as int,
      staffMemberId: json['staff_member_id'] as int,
      logDate: json['log_date'] as String,
      clockIn: json['clock_in'] as String?,
      clockOut: json['clock_out'] as String?,
      status: json['status'] as String,
      notes: json['notes'] as String?,
    );
  }
}

class Shift {
  final int id;
  final String name;
  final String startTime;
  final String endTime;
  final int? breakDuration;
  final String? description;

  Shift({
    required this.id,
    required this.name,
    required this.startTime,
    required this.endTime,
    this.breakDuration,
    this.description,
  });

  factory Shift.fromJson(Map<String, dynamic> json) {
    return Shift(
      id: json['id'] as int,
      name: json['name'] as String,
      startTime: json['start_time'] as String,
      endTime: json['end_time'] as String,
      breakDuration: json['break_duration'] as int?,
      description: json['description'] as String?,
    );
  }
}

class TimeOffRequest {
  final int id;
  final int staffMemberId;
  final int timeOffCategoryId;
  final String startDate;
  final String endDate;
  final int daysRequested;
  final String reason;
  final String status;
  final String createdAt;
  final TimeOffCategory? category;

  TimeOffRequest({
    required this.id,
    required this.staffMemberId,
    required this.timeOffCategoryId,
    required this.startDate,
    required this.endDate,
    required this.daysRequested,
    required this.reason,
    required this.status,
    required this.createdAt,
    this.category,
  });

  factory TimeOffRequest.fromJson(Map<String, dynamic> json) {
    return TimeOffRequest(
      id: json['id'] as int,
      staffMemberId: json['staff_member_id'] as int,
      timeOffCategoryId: json['time_off_category_id'] as int,
      startDate: json['start_date'] as String,
      endDate: json['end_date'] as String,
      daysRequested: json['days_requested'] as int,
      reason: json['reason'] as String,
      status: json['status'] as String,
      createdAt: json['created_at'] as String,
      category: json['category'] != null ? TimeOffCategory.fromJson(json['category']) : null,
    );
  }
}

class TimeOffCategory {
  final int id;
  final String name;
  final int annualAllowance;
  final bool isPaid;

  TimeOffCategory({
    required this.id,
    required this.name,
    required this.annualAllowance,
    required this.isPaid,
  });

  factory TimeOffCategory.fromJson(Map<String, dynamic> json) {
    return TimeOffCategory(
      id: json['id'] as int,
      name: json['name'] as String,
      annualAllowance: json['annual_allowance'] as int,
      isPaid: json['is_paid'] as bool,
    );
  }
}

class SalarySlip {
  final int id;
  final int staffMemberId;
  final String salaryPeriod;
  final String slipReference;
  final double baseSalary;
  final double totalEarnings;
  final double totalDeductions;
  final double netPayable;
  final String status;
  final String? paidAt;

  SalarySlip({
    required this.id,
    required this.staffMemberId,
    required this.salaryPeriod,
    required this.slipReference,
    required this.baseSalary,
    required this.totalEarnings,
    required this.totalDeductions,
    required this.netPayable,
    required this.status,
    this.paidAt,
  });

  factory SalarySlip.fromJson(Map<String, dynamic> json) {
    return SalarySlip(
      id: json['id'] as int,
      staffMemberId: json['staff_member_id'] as int,
      salaryPeriod: json['salary_period'] as String,
      slipReference: json['slip_reference'] as String,
      baseSalary: (json['base_salary'] as num).toDouble(),
      totalEarnings: (json['total_earnings'] as num).toDouble(),
      totalDeductions: (json['total_deductions'] as num).toDouble(),
      netPayable: (json['net_payable'] as num).toDouble(),
      status: json['status'] as String,
      paidAt: json['paid_at'] as String?,
    );
  }
}

class SalaryAdvance {
  final int id;
  final int staffMemberId;
  final double amount;
  final String reason;
  final String status;
  final int? repaymentMonths;

  SalaryAdvance({
    required this.id,
    required this.staffMemberId,
    required this.amount,
    required this.reason,
    required this.status,
    this.repaymentMonths,
  });

  factory SalaryAdvance.fromJson(Map<String, dynamic> json) {
    return SalaryAdvance(
      id: json['id'] as int,
      staffMemberId: json['staff_member_id'] as int,
      amount: (json['amount'] as num).toDouble(),
      reason: json['reason'] as String,
      status: json['status'] as String,
      repaymentMonths: json['repayment_months'] as int?,
    );
  }
}

class StaffMember {
  final int id;
  final String firstName;
  final String lastName;
  final String? staffCode;
  final String? workEmail;
  final String? phoneNumber;
  final String hireDate;
  final String employmentStatus;
  final Division? division;
  final JobTitle? jobTitle;
  final OfficeLocation? officeLocation;

  StaffMember({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.staffCode,
    this.workEmail,
    this.phoneNumber,
    required this.hireDate,
    required this.employmentStatus,
    this.division,
    this.jobTitle,
    this.officeLocation,
  });

  factory StaffMember.fromJson(Map<String, dynamic> json) {
    return StaffMember(
      id: json['id'] as int,
      firstName: json['first_name'] as String,
      lastName: json['last_name'] as String,
      staffCode: json['staff_code'] as String?,
      workEmail: json['work_email'] as String?,
      phoneNumber: json['phone_number'] as String?,
      hireDate: json['hire_date'] as String,
      employmentStatus: json['employment_status'] as String,
      division: json['division'] != null ? Division.fromJson(json['division']) : null,
      jobTitle: json['job_title'] != null ? JobTitle.fromJson(json['job_title']) : null,
      officeLocation: json['office_location'] != null ? OfficeLocation.fromJson(json['office_location']) : null,
    );
  }
}

class Division {
  final int id;
  final String name;
  final String? description;
  final int? officeLocationId;

  Division({
    required this.id,
    required this.name,
    this.description,
    this.officeLocationId,
  });

  factory Division.fromJson(Map<String, dynamic> json) {
    return Division(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String?,
      officeLocationId: json['office_location_id'] as int?,
    );
  }
}

class JobTitle {
  final int id;
  final String name;
  final String? description;

  JobTitle({
    required this.id,
    required this.name,
    this.description,
  });

  factory JobTitle.fromJson(Map<String, dynamic> json) {
    return JobTitle(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String?,
    );
  }
}

class OfficeLocation {
  final int id;
  final String title;
  final String? address;
  final String? city;
  final String? country;
  final String? phone;

  OfficeLocation({
    required this.id,
    required this.title,
    this.address,
    this.city,
    this.country,
    this.phone,
  });

  factory OfficeLocation.fromJson(Map<String, dynamic> json) {
    return OfficeLocation(
      id: json['id'] as int,
      title: json['title'] as String,
      address: json['address'] as String?,
      city: json['city'] as String?,
      country: json['country'] as String?,
      phone: json['phone'] as String?,
    );
  }
}

class Job {
  final int id;
  final String title;
  final String? description;
  final String? requirements;
  final int positions;
  final String status;
  final String startDate;
  final String? endDate;
  final double? salaryFrom;
  final double? salaryTo;
  final int? applicationsCount;
  final JobCategory? category;

  Job({
    required this.id,
    required this.title,
    this.description,
    this.requirements,
    required this.positions,
    required this.status,
    required this.startDate,
    this.endDate,
    this.salaryFrom,
    this.salaryTo,
    this.applicationsCount,
    this.category,
  });

  factory Job.fromJson(Map<String, dynamic> json) {
    return Job(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String?,
      requirements: json['requirements'] as String?,
      positions: json['positions'] as int,
      status: json['status'] as String,
      startDate: json['start_date'] as String,
      endDate: json['end_date'] as String?,
      salaryFrom: json['salary_from'] != null ? (json['salary_from'] as num).toDouble() : null,
      salaryTo: json['salary_to'] != null ? (json['salary_to'] as num).toDouble() : null,
      applicationsCount: json['applications_count'] as int?,
      category: json['category'] != null ? JobCategory.fromJson(json['category']) : null,
    );
  }
}

class JobCategory {
  final int id;
  final String name;

  JobCategory({required this.id, required this.name});

  factory JobCategory.fromJson(Map<String, dynamic> json) {
    return JobCategory(
      id: json['id'] as int,
      name: json['name'] as String,
    );
  }
}

class JobApplication {
  final int id;
  final int jobId;
  final int candidateId;
  final String status;
  final String appliedAt;
  final Job? job;
  final Candidate? candidate;
  final JobStage? stage;

  JobApplication({
    required this.id,
    required this.jobId,
    required this.candidateId,
    required this.status,
    required this.appliedAt,
    this.job,
    this.candidate,
    this.stage,
  });

  factory JobApplication.fromJson(Map<String, dynamic> json) {
    return JobApplication(
      id: json['id'] as int,
      jobId: json['job_id'] as int,
      candidateId: json['candidate_id'] as int,
      status: json['status'] as String,
      appliedAt: json['applied_at'] as String,
      job: json['job'] != null ? Job.fromJson(json['job']) : null,
      candidate: json['candidate'] != null ? Candidate.fromJson(json['candidate']) : null,
      stage: json['stage'] != null ? JobStage.fromJson(json['stage']) : null,
    );
  }
}

class Candidate {
  final int id;
  final String name;
  final String email;
  final String? phone;

  Candidate({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
  });

  factory Candidate.fromJson(Map<String, dynamic> json) {
    return Candidate(
      id: json['id'] as int,
      name: json['name'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String?,
    );
  }
}

class JobStage {
  final int id;
  final String name;
  final int order;

  JobStage({required this.id, required this.name, required this.order});

  factory JobStage.fromJson(Map<String, dynamic> json) {
    return JobStage(
      id: json['id'] as int,
      name: json['name'] as String,
      order: json['order'] as int,
    );
  }
}

class PerformanceObjective {
  final int id;
  final int staffMemberId;
  final String title;
  final String description;
  final String targetDate;
  final int progress;
  final String status;

  PerformanceObjective({
    required this.id,
    required this.staffMemberId,
    required this.title,
    required this.description,
    required this.targetDate,
    required this.progress,
    required this.status,
  });

  factory PerformanceObjective.fromJson(Map<String, dynamic> json) {
    return PerformanceObjective(
      id: json['id'] as int,
      staffMemberId: json['staff_member_id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      targetDate: json['target_date'] as String,
      progress: json['progress'] as int,
      status: json['status'] as String,
    );
  }
}

class RecognitionRecord {
  final int id;
  final int staffMemberId;
  final String title;
  final String description;
  final String awardedDate;
  final RecognitionCategory? category;

  RecognitionRecord({
    required this.id,
    required this.staffMemberId,
    required this.title,
    required this.description,
    required this.awardedDate,
    this.category,
  });

  factory RecognitionRecord.fromJson(Map<String, dynamic> json) {
    return RecognitionRecord(
      id: json['id'] as int,
      staffMemberId: json['staff_member_id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      awardedDate: json['awarded_date'] as String,
      category: json['category'] != null ? RecognitionCategory.fromJson(json['category']) : null,
    );
  }
}

class RecognitionCategory {
  final int id;
  final String name;

  RecognitionCategory({required this.id, required this.name});

  factory RecognitionCategory.fromJson(Map<String, dynamic> json) {
    return RecognitionCategory(
      id: json['id'] as int,
      name: json['name'] as String,
    );
  }
}

class Asset {
  final int id;
  final String name;
  final String? serialNumber;
  final String status;
  final String condition;
  final String? purchaseDate;
  final double? purchaseCost;
  final String? location;
  final AssetType? assetType;
  final StaffMember? assignedStaff;

  Asset({
    required this.id,
    required this.name,
    this.serialNumber,
    required this.status,
    required this.condition,
    this.purchaseDate,
    this.purchaseCost,
    this.location,
    this.assetType,
    this.assignedStaff,
  });

  factory Asset.fromJson(Map<String, dynamic> json) {
    return Asset(
      id: json['id'] as int,
      name: json['name'] as String,
      serialNumber: json['serial_number'] as String?,
      status: json['status'] as String,
      condition: json['condition'] as String,
      purchaseDate: json['purchase_date'] as String?,
      purchaseCost: json['purchase_cost'] != null ? (json['purchase_cost'] as num).toDouble() : null,
      location: json['location'] as String?,
      assetType: json['asset_type'] != null ? AssetType.fromJson(json['asset_type']) : null,
      assignedStaff: json['assigned_staff'] != null ? StaffMember.fromJson(json['assigned_staff']) : null,
    );
  }
}

class AssetType {
  final int id;
  final String title;
  final String? description;

  AssetType({required this.id, required this.title, this.description});

  factory AssetType.fromJson(Map<String, dynamic> json) {
    return AssetType(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String?,
    );
  }
}

class CompanyEvent {
  final int id;
  final String title;
  final String? description;
  final String eventType;
  final String startDate;
  final String? startTime;
  final String? location;

  CompanyEvent({
    required this.id,
    required this.title,
    this.description,
    required this.eventType,
    required this.startDate,
    this.startTime,
    this.location,
  });

  factory CompanyEvent.fromJson(Map<String, dynamic> json) {
    return CompanyEvent(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String?,
      eventType: json['event_type'] as String,
      startDate: json['start_date'] as String,
      startTime: json['start_time'] as String?,
      location: json['location'] as String?,
    );
  }
}

class CompanyHoliday {
  final int id;
  final String name;
  final String date;
  final String? description;
  final bool isRecurring;

  CompanyHoliday({
    required this.id,
    required this.name,
    required this.date,
    this.description,
    required this.isRecurring,
  });

  factory CompanyHoliday.fromJson(Map<String, dynamic> json) {
    return CompanyHoliday(
      id: json['id'] as int,
      name: json['name'] as String,
      date: json['date'] as String,
      description: json['description'] as String?,
      isRecurring: json['is_recurring'] as bool,
    );
  }
}

class CompanyNotice {
  final int id;
  final String title;
  final String description;
  final String createdAt;
  final bool? isRead;

  CompanyNotice({
    required this.id,
    required this.title,
    required this.description,
    required this.createdAt,
    this.isRead,
  });

  factory CompanyNotice.fromJson(Map<String, dynamic> json) {
    return CompanyNotice(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      createdAt: json['created_at'] as String,
      isRead: json['is_read'] as bool?,
    );
  }
}

class Meeting {
  final int id;
  final String title;
  final String scheduledDate;
  final String startTime;
  final String endTime;
  final String status;
  final String? meetingLink;
  final MeetingType? meetingType;
  final MeetingRoom? meetingRoom;

  Meeting({
    required this.id,
    required this.title,
    required this.scheduledDate,
    required this.startTime,
    required this.endTime,
    required this.status,
    this.meetingLink,
    this.meetingType,
    this.meetingRoom,
  });

  factory Meeting.fromJson(Map<String, dynamic> json) {
    return Meeting(
      id: json['id'] as int,
      title: json['title'] as String,
      scheduledDate: json['scheduled_date'] as String,
      startTime: json['start_time'] as String,
      endTime: json['end_time'] as String,
      status: json['status'] as String,
      meetingLink: json['meeting_link'] as String?,
      meetingType: json['meeting_type'] != null ? MeetingType.fromJson(json['meeting_type']) : null,
      meetingRoom: json['meeting_room'] != null ? MeetingRoom.fromJson(json['meeting_room']) : null,
    );
  }
}

class MeetingType {
  final int id;
  final String name;

  MeetingType({required this.id, required this.name});

  factory MeetingType.fromJson(Map<String, dynamic> json) {
    return MeetingType(
      id: json['id'] as int,
      name: json['name'] as String,
    );
  }
}

class MeetingRoom {
  final int id;
  final String name;
  final int? capacity;

  MeetingRoom({required this.id, required this.name, this.capacity});

  factory MeetingRoom.fromJson(Map<String, dynamic> json) {
    return MeetingRoom(
      id: json['id'] as int,
      name: json['name'] as String,
      capacity: json['capacity'] as int?,
    );
  }
}

class TrainingProgram {
  final int id;
  final String name;
  final String description;
  final int durationHours;
  final String? objectives;
  final TrainingType? trainingType;

  TrainingProgram({
    required this.id,
    required this.name,
    required this.description,
    required this.durationHours,
    this.objectives,
    this.trainingType,
  });

  factory TrainingProgram.fromJson(Map<String, dynamic> json) {
    return TrainingProgram(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String,
      durationHours: json['duration_hours'] as int,
      objectives: json['objectives'] as String?,
      trainingType: json['training_type'] != null ? TrainingType.fromJson(json['training_type']) : null,
    );
  }
}

class TrainingType {
  final int id;
  final String name;

  TrainingType({required this.id, required this.name});

  factory TrainingType.fromJson(Map<String, dynamic> json) {
    return TrainingType(
      id: json['id'] as int,
      name: json['name'] as String,
    );
  }
}

class TrainingSession {
  final int id;
  final String title;
  final String startDate;
  final String endDate;
  final String status;
  final String? trainer;
  final int? maxParticipants;
  final int? enrolledCount;
  final TrainingProgram? program;

  TrainingSession({
    required this.id,
    required this.title,
    required this.startDate,
    required this.endDate,
    required this.status,
    this.trainer,
    this.maxParticipants,
    this.enrolledCount,
    this.program,
  });

  factory TrainingSession.fromJson(Map<String, dynamic> json) {
    return TrainingSession(
      id: json['id'] as int,
      title: json['title'] as String,
      startDate: json['start_date'] as String,
      endDate: json['end_date'] as String,
      status: json['status'] as String,
      trainer: json['trainer'] as String?,
      maxParticipants: json['max_participants'] as int?,
      enrolledCount: json['enrolled_count'] as int?,
      program: json['program'] != null ? TrainingProgram.fromJson(json['program']) : null,
    );
  }
}

class HrDocument {
  final int id;
  final String title;
  final String? description;
  final String? fileType;
  final String createdAt;
  final DocumentCategory? category;

  HrDocument({
    required this.id,
    required this.title,
    this.description,
    this.fileType,
    required this.createdAt,
    this.category,
  });

  factory HrDocument.fromJson(Map<String, dynamic> json) {
    return HrDocument(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String?,
      fileType: json['file_type'] as String?,
      createdAt: json['created_at'] as String,
      category: json['category'] != null ? DocumentCategory.fromJson(json['category']) : null,
    );
  }
}

class DocumentCategory {
  final int id;
  final String name;

  DocumentCategory({required this.id, required this.name});

  factory DocumentCategory.fromJson(Map<String, dynamic> json) {
    return DocumentCategory(
      id: json['id'] as int,
      name: json['name'] as String,
    );
  }
}

class OrganizationPolicy {
  final int id;
  final String title;
  final String description;
  final String effectiveDate;
  final bool isMandatory;
  final bool? isAcknowledged;

  OrganizationPolicy({
    required this.id,
    required this.title,
    required this.description,
    required this.effectiveDate,
    required this.isMandatory,
    this.isAcknowledged,
  });

  factory OrganizationPolicy.fromJson(Map<String, dynamic> json) {
    return OrganizationPolicy(
      id: json['id'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      effectiveDate: json['effective_date'] as String,
      isMandatory: json['is_mandatory'] as bool,
      isAcknowledged: json['is_acknowledged'] as bool?,
    );
  }
}

class BusinessTrip {
  final int id;
  final int staffMemberId;
  final String destination;
  final String purpose;
  final String startDate;
  final String endDate;
  final double? estimatedCost;
  final double? actualCost;
  final String status;
  final String? notes;
  final StaffMember? staffMember;

  BusinessTrip({
    required this.id,
    required this.staffMemberId,
    required this.destination,
    required this.purpose,
    required this.startDate,
    required this.endDate,
    this.estimatedCost,
    this.actualCost,
    required this.status,
    this.notes,
    this.staffMember,
  });

  factory BusinessTrip.fromJson(Map<String, dynamic> json) {
    return BusinessTrip(
      id: json['id'] as int,
      staffMemberId: json['staff_member_id'] as int,
      destination: json['destination'] as String,
      purpose: json['purpose'] as String,
      startDate: json['start_date'] as String,
      endDate: json['end_date'] as String,
      estimatedCost: json['estimated_cost'] != null ? (json['estimated_cost'] as num).toDouble() : null,
      actualCost: json['actual_cost'] != null ? (json['actual_cost'] as num).toDouble() : null,
      status: json['status'] as String,
      notes: json['notes'] as String?,
      staffMember: json['staff_member'] != null ? StaffMember.fromJson(json['staff_member']) : null,
    );
  }
}

class SystemConfiguration {
  final int id;
  final String key;
  final String value;

  SystemConfiguration({
    required this.id,
    required this.key,
    required this.value,
  });

  factory SystemConfiguration.fromJson(Map<String, dynamic> json) {
    return SystemConfiguration(
      id: json['id'] as int,
      key: json['key'] as String,
      value: json['value'] as String,
    );
  }
}
