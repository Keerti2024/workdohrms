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
}

class DashboardService {
  final Dio _dio = apiClient.dio;

  Future<Map<String, dynamic>> getStats() async {
    final response = await _dio.get('/dashboard');
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

  Future<Map<String, dynamic>> getBalance() async {
    final response = await _dio.get('/time-off-balance');
    return response.data;
  }
}

final authService = AuthService();
final dashboardService = DashboardService();
final attendanceService = AttendanceService();
final leaveService = LeaveService();
