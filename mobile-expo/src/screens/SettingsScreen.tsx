import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { settingsService } from '../api/services';
import { SystemConfiguration } from '../types';
import { useAuth } from '../auth/AuthContext';

export const SettingsScreen: React.FC = () => {
  const { user } = useAuth();
  const [configurations, setConfigurations] = useState<SystemConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isAdmin = user?.role === 'administrator' || user?.role === 'hr_officer';

  const fetchData = useCallback(async () => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await settingsService.getConfigurations();
      if (response.success) {
        setConfigurations(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const getConfigIcon = (key: string) => {
    if (key.includes('email')) return '📧';
    if (key.includes('notification')) return '🔔';
    if (key.includes('attendance')) return '⏰';
    if (key.includes('leave')) return '🏖️';
    if (key.includes('payroll')) return '💰';
    if (key.includes('company')) return '🏢';
    return '⚙️';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingIcon}>👤</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Profile</Text>
                <Text style={styles.settingValue}>{user?.name}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingIcon}>📧</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Email</Text>
                <Text style={styles.settingValue}>{user?.email}</Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingIcon}>🔐</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Role</Text>
                <Text style={styles.settingValue}>{user?.role_display}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingIcon}>🔔</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive push notifications</Text>
              </View>
              <Switch value={true} disabled />
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingIcon}>🌙</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Coming soon</Text>
              </View>
              <Switch value={false} disabled />
            </View>
          </View>
        </View>

        {isAdmin && configurations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Configuration</Text>
            {configurations.map((config) => (
              <View key={config.id} style={styles.card}>
                <View style={styles.settingRow}>
                  <Text style={styles.settingIcon}>{getConfigIcon(config.key)}</Text>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>{config.key.replace(/_/g, ' ')}</Text>
                    <Text style={styles.settingValue}>{config.value}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingIcon}>📱</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>App Version</Text>
                <Text style={styles.settingValue}>1.0.0</Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingIcon}>📄</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Terms of Service</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <Text style={styles.settingIcon}>🔒</Text>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#2563eb',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#6b7280', marginBottom: 8, textTransform: 'uppercase' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: { fontSize: 24, marginRight: 12 },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: '500', color: '#1a1a1a' },
  settingValue: { fontSize: 14, color: '#666', marginTop: 2 },
  settingDescription: { fontSize: 12, color: '#999', marginTop: 2 },
  chevron: { fontSize: 24, color: '#ccc' },
});
