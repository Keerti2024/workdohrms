import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import {
  LoginScreen,
  DashboardScreen,
  LeaveScreen,
  ProfileScreen,
  PayrollScreen,
  StaffScreen,
  RecruitmentScreen,
  PerformanceScreen,
  AssetsScreen,
  CompanyScreen,
  TrainingScreen,
  DocumentsScreen,
  OrganizationScreen,
  SettingsScreen,
  TravelScreen,
  AttendanceScreen,
} from '../screens';

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Payroll: undefined;
  Staff: undefined;
  Recruitment: undefined;
  Performance: undefined;
  Assets: undefined;
  Company: undefined;
  Training: undefined;
  Documents: undefined;
  Organization: undefined;
  Settings: undefined;
  Travel: undefined;
  Attendance: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const TabIcon: React.FC<{ name: string; focused: boolean }> = ({ name, focused }) => (
  <View style={styles.tabIcon}>
    <Text style={[styles.tabIconText, focused && styles.tabIconTextFocused]}>{name}</Text>
  </View>
);

const MoreScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'administrator' || user?.role === 'hr_officer';

  const modules = [
    { name: 'Attendance', icon: '⏰', screen: 'Attendance', roles: ['all'] },
    { name: 'Payroll', icon: '💰', screen: 'Payroll', roles: ['all'] },
    { name: 'Staff Directory', icon: '👥', screen: 'Staff', roles: ['all'] },
    { name: 'Performance', icon: '📊', screen: 'Performance', roles: ['all'] },
    { name: 'Training', icon: '📚', screen: 'Training', roles: ['all'] },
    { name: 'Assets', icon: '💼', screen: 'Assets', roles: ['all'] },
    { name: 'Documents', icon: '📄', screen: 'Documents', roles: ['all'] },
    { name: 'Company', icon: '🏢', screen: 'Company', roles: ['all'] },
    { name: 'Travel', icon: '✈️', screen: 'Travel', roles: ['all'] },
    { name: 'Organization', icon: '🏛️', screen: 'Organization', roles: ['all'] },
    { name: 'Recruitment', icon: '🎯', screen: 'Recruitment', roles: ['admin'] },
    { name: 'Settings', icon: '⚙️', screen: 'Settings', roles: ['all'] },
  ];

  const visibleModules = modules.filter(
    (m) => m.roles.includes('all') || (isAdmin && m.roles.includes('admin'))
  );

  return (
    <View style={styles.moreContainer}>
      <View style={styles.moreHeader}>
        <Text style={styles.moreHeaderTitle}>All Modules</Text>
      </View>
      <ScrollView style={styles.moreList}>
        <View style={styles.moduleGrid}>
          {visibleModules.map((module) => (
            <TouchableOpacity
              key={module.screen}
              style={styles.moduleCard}
              onPress={() => navigation.navigate(module.screen)}
            >
              <Text style={styles.moduleIcon}>{module.icon}</Text>
              <Text style={styles.moduleName}>{module.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="🏠" focused={focused} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Leave"
        component={LeaveScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="🏖️" focused={focused} />,
          tabBarLabel: 'Leave',
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="📱" focused={focused} />,
          tabBarLabel: 'More',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon name="👤" focused={focused} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Payroll" component={PayrollScreen} />
            <Stack.Screen name="Staff" component={StaffScreen} />
            <Stack.Screen name="Recruitment" component={RecruitmentScreen} />
            <Stack.Screen name="Performance" component={PerformanceScreen} />
            <Stack.Screen name="Assets" component={AssetsScreen} />
            <Stack.Screen name="Company" component={CompanyScreen} />
            <Stack.Screen name="Training" component={TrainingScreen} />
            <Stack.Screen name="Documents" component={DocumentsScreen} />
            <Stack.Screen name="Organization" component={OrganizationScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Travel" component={TravelScreen} />
            <Stack.Screen name="Attendance" component={AttendanceScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    paddingBottom: 8,
    height: 60,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconText: {
    fontSize: 20,
    color: '#6b7280',
  },
  tabIconTextFocused: {
    color: '#2563eb',
  },
  moreContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  moreHeader: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#2563eb',
  },
  moreHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  moreList: {
    flex: 1,
    padding: 16,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moduleCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  moduleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  moduleName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});
