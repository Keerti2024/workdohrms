# WorkDo HRMS Mobile App (Flutter)

A Flutter mobile app for the WorkDo HRMS system. This app provides employee self-service features including authentication, dashboard, attendance tracking, and leave management.

## Features

- **Authentication**: Login with email/password, demo account quick login
- **Dashboard**: View company stats, clock in/out for attendance
- **Leave Management**: View leave requests, submit new leave requests
- **Profile**: View user profile and permissions

## Prerequisites

- Flutter SDK 3.24+
- Dart SDK 3.5+
- Backend server running at http://localhost:8000

## Installation

```bash
cd mobile-flutter
flutter pub get
```

## Running the App

```bash
flutter run
```

### Connecting to Backend

By default, the app connects to `http://localhost:8000/api`. When testing on a physical device, use ngrok or your LAN IP and update `lib/api/api_client.dart`.

## Demo Accounts

- **Administrator**: admin@hrms.local / password
- **HR Officer**: hr@hrms.local / password
- **Manager**: manager@hrms.local / password
- **Staff Member**: staff@hrms.local / password

## Project Structure

```
lib/
├── main.dart              # App entry point
├── api/                   # HTTP client and services
├── auth/                  # Riverpod auth state management
├── models/                # Data models
├── router/                # GoRouter navigation
└── screens/               # UI screens
```

## Technologies Used

- Flutter 3.24, Riverpod, GoRouter, Dio, Flutter Secure Storage

## Building for Production

```bash
flutter build apk --release      # Android APK
flutter build appbundle --release # Play Store
flutter build ios --release       # iOS (macOS only)
```
