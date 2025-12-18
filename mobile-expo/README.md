# WorkDo HRMS Mobile App (Expo)

A React Native mobile app built with Expo for the WorkDo HRMS system. This app provides employee self-service features including authentication, dashboard, attendance tracking, and leave management.

## Features

- **Authentication**: Login with email/password, demo account quick login
- **Dashboard**: View company stats, clock in/out for attendance
- **Leave Management**: View leave requests, submit new leave requests
- **Profile**: View user profile and permissions

## Prerequisites

- Node.js 18+ 
- Expo Go app on your mobile device (iOS/Android)
- Backend server running at http://localhost:8000

## Installation

```bash
cd mobile-expo
npm install
```

## Running the App

### Development with Expo Go

```bash
npx expo start
```

This will start the Expo development server. You can then:
- Scan the QR code with Expo Go (Android) or Camera app (iOS)
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator (macOS only)
- Press `w` to open in web browser

### Connecting to Backend

By default, the app connects to `http://localhost:8000/api`. When testing on a physical device:

1. **Option 1: Use ngrok** (recommended)
   ```bash
   ngrok http 8000
   ```
   Then update the API base URL in `src/api/client.ts`

2. **Option 2: Use LAN IP**
   Find your computer's local IP and update `src/api/client.ts`:
   ```typescript
   const API_BASE_URL = 'http://192.168.x.x:8000/api';
   ```

## Demo Accounts

The app includes quick login buttons for demo accounts:
- **Administrator**: admin@hrms.local / password
- **HR Officer**: hr@hrms.local / password
- **Manager**: manager@hrms.local / password
- **Staff Member**: staff@hrms.local / password

## Project Structure

```
mobile-expo/
├── App.tsx                 # Main app entry point
├── src/
│   ├── api/
│   │   ├── client.ts       # Axios HTTP client with auth interceptors
│   │   └── services.ts     # API service functions
│   ├── auth/
│   │   └── AuthContext.tsx # Authentication context provider
│   ├── navigation/
│   │   └── AppNavigator.tsx # Navigation configuration
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── LeaveScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── types/
│       └── index.ts        # TypeScript type definitions
```

## Technologies Used

- **Expo SDK 54**: React Native framework
- **React Navigation**: Navigation library
- **Axios**: HTTP client
- **Expo SecureStore**: Secure token storage
- **TypeScript**: Type safety

## Building for Production

```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Or use EAS Build (recommended)
npx eas build --platform android
npx eas build --platform ios
```

## Troubleshooting

### Network Request Failed
- Ensure the backend server is running
- Check if you're using the correct API URL for your device
- For physical devices, use ngrok or your LAN IP instead of localhost

### Token Storage Issues
- Clear app data and try logging in again
- Check Expo SecureStore compatibility with your device

## License

This project is part of the WorkDo HRMS system.
