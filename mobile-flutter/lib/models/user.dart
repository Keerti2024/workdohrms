class User {
  final int id;
  final String name;
  final String email;
  final String role;
  final String roleDisplay;
  final List<String> permissions;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.roleDisplay,
    required this.permissions,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      name: json['name'] as String,
      email: json['email'] as String,
      role: json['role'] as String,
      roleDisplay: json['role_display'] as String,
      permissions: List<String>.from(json['permissions'] ?? []),
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

class ApiResponse<T> {
  final bool success;
  final T? data;
  final String message;

  ApiResponse({
    required this.success,
    this.data,
    required this.message,
  });
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
