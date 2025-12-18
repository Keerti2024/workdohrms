import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../api/api_client.dart';
import '../api/services.dart';
import '../models/user.dart';

class AuthState {
  final User? user;
  final String? token;
  final bool isLoading;
  final bool isAuthenticated;

  AuthState({
    this.user,
    this.token,
    this.isLoading = true,
    this.isAuthenticated = false,
  });

  AuthState copyWith({
    User? user,
    String? token,
    bool? isLoading,
    bool? isAuthenticated,
  }) {
    return AuthState(
      user: user ?? this.user,
      token: token ?? this.token,
      isLoading: isLoading ?? this.isLoading,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState()) {
    _loadStoredAuth();
  }

  Future<void> _loadStoredAuth() async {
    try {
      final token = await apiClient.storage.read(key: 'auth_token');
      final userJson = await apiClient.storage.read(key: 'user');

      if (token != null && userJson != null) {
        final user = User.fromJson(jsonDecode(userJson));
        state = AuthState(
          user: user,
          token: token,
          isLoading: false,
          isAuthenticated: true,
        );
      } else {
        state = AuthState(isLoading: false);
      }
    } catch (e) {
      state = AuthState(isLoading: false);
    }
  }

  Future<void> login(String email, String password) async {
    final response = await authService.login(email, password);

    if (response['success'] == true) {
      final data = response['data'];
      final user = User.fromJson(data['user']);
      final token = data['token'] as String;

      await apiClient.storage.write(key: 'auth_token', value: token);
      await apiClient.storage.write(key: 'user', value: jsonEncode(data['user']));

      state = AuthState(
        user: user,
        token: token,
        isLoading: false,
        isAuthenticated: true,
      );
    } else {
      throw Exception(response['message'] ?? 'Login failed');
    }
  }

  Future<void> logout() async {
    try {
      await authService.logout();
    } catch (e) {
      // Ignore logout API errors
    } finally {
      await apiClient.storage.delete(key: 'auth_token');
      await apiClient.storage.delete(key: 'user');
      state = AuthState(isLoading: false);
    }
  }

  Future<void> refreshProfile() async {
    try {
      final response = await authService.getProfile();
      if (response['success'] == true) {
        final user = User.fromJson(response['data']['user']);
        await apiClient.storage.write(key: 'user', value: jsonEncode(response['data']['user']));
        state = state.copyWith(user: user);
      }
    } catch (e) {
      // Ignore refresh errors
    }
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
