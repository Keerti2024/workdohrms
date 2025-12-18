import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { attendanceService } from '../api/services';
import { WorkLog, Shift } from '../types';

export const AttendanceScreen: React.FC = () => {
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'logs' | 'shifts'>('logs');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockLoading, setClockLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [logsRes, shiftsRes] = await Promise.all([
        attendanceService.getWorkLogs(),
        attendanceService.getShifts(),
      ]);

      if (logsRes.success) {
        const logs = logsRes.data || [];
        setWorkLogs(logs);
        const todayLog = logs.find((log) => log.log_date === new Date().toISOString().split('T')[0]);
        if (todayLog && todayLog.clock_in && !todayLog.clock_out) {
          setIsClockedIn(true);
        }
      }
      if (shiftsRes.success) {
        setShifts(shiftsRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const handleClockIn = async () => {
    setClockLoading(true);
    try {
      const response = await attendanceService.clockIn();
      if (response.success) {
        setIsClockedIn(true);
        Alert.alert('Success', 'Clocked in successfully');
        fetchData();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to clock in');
    } finally {
      setClockLoading(false);
    }
  };

  const handleClockOut = async () => {
    setClockLoading(true);
    try {
      const response = await attendanceService.clockOut();
      if (response.success) {
        setIsClockedIn(false);
        Alert.alert('Success', 'Clocked out successfully');
        fetchData();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to clock out');
    } finally {
      setClockLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#22c55e';
      case 'absent':
        return '#ef4444';
      case 'late':
        return '#f59e0b';
      case 'half_day':
        return '#3b82f6';
      case 'leave':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return '--:--';
    return time.substring(0, 5);
  };

  const calculateHours = (clockIn: string | null, clockOut: string | null) => {
    if (!clockIn || !clockOut) return '--';
    const start = new Date(`2000-01-01T${clockIn}`);
    const end = new Date(`2000-01-01T${clockOut}`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return diff.toFixed(1);
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
        <Text style={styles.headerTitle}>Attendance</Text>
      </View>

      <View style={styles.clockSection}>
        <Text style={styles.clockTitle}>Today's Attendance</Text>
        <View style={styles.clockButtons}>
          <TouchableOpacity
            style={[styles.clockButton, styles.clockInButton, isClockedIn && styles.clockButtonDisabled]}
            onPress={handleClockIn}
            disabled={isClockedIn || clockLoading}
          >
            {clockLoading && !isClockedIn ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.clockButtonIcon}>🕐</Text>
                <Text style={styles.clockButtonText}>Clock In</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.clockButton, styles.clockOutButton, !isClockedIn && styles.clockButtonDisabled]}
            onPress={handleClockOut}
            disabled={!isClockedIn || clockLoading}
          >
            {clockLoading && isClockedIn ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.clockButtonIcon}>🕕</Text>
                <Text style={styles.clockButtonText}>Clock Out</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'logs' && styles.activeTab]}
          onPress={() => setActiveTab('logs')}
        >
          <Text style={[styles.tabText, activeTab === 'logs' && styles.activeTabText]}>Work Logs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'shifts' && styles.activeTab]}
          onPress={() => setActiveTab('shifts')}
        >
          <Text style={[styles.tabText, activeTab === 'shifts' && styles.activeTabText]}>Shifts</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'logs' ? (
          workLogs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No work logs found</Text>
            </View>
          ) : (
            workLogs.map((log) => (
              <View key={log.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardDate}>{log.log_date}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(log.status) }]}>
                    <Text style={styles.statusText}>{log.status.replace('_', ' ')}</Text>
                  </View>
                </View>
                <View style={styles.timeRow}>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Clock In</Text>
                    <Text style={styles.timeValue}>{formatTime(log.clock_in)}</Text>
                  </View>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Clock Out</Text>
                    <Text style={styles.timeValue}>{formatTime(log.clock_out)}</Text>
                  </View>
                  <View style={styles.timeBlock}>
                    <Text style={styles.timeLabel}>Hours</Text>
                    <Text style={styles.timeValue}>{calculateHours(log.clock_in, log.clock_out)}h</Text>
                  </View>
                </View>
                {log.notes && <Text style={styles.cardNotes}>{log.notes}</Text>}
              </View>
            ))
          )
        ) : shifts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No shifts found</Text>
          </View>
        ) : (
          shifts.map((shift) => (
            <View key={shift.id} style={styles.card}>
              <Text style={styles.cardTitle}>{shift.name}</Text>
              <View style={styles.shiftTimes}>
                <View style={styles.shiftTimeBlock}>
                  <Text style={styles.shiftTimeLabel}>Start</Text>
                  <Text style={styles.shiftTimeValue}>{formatTime(shift.start_time)}</Text>
                </View>
                <Text style={styles.shiftArrow}>→</Text>
                <View style={styles.shiftTimeBlock}>
                  <Text style={styles.shiftTimeLabel}>End</Text>
                  <Text style={styles.shiftTimeValue}>{formatTime(shift.end_time)}</Text>
                </View>
              </View>
              {shift.break_duration && (
                <Text style={styles.cardDetail}>Break: {shift.break_duration} minutes</Text>
              )}
              {shift.description && <Text style={styles.cardDescription}>{shift.description}</Text>}
            </View>
          ))
        )}
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
  clockSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  clockTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 16 },
  clockButtons: { flexDirection: 'row', gap: 12 },
  clockButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  clockInButton: { backgroundColor: '#22c55e' },
  clockOutButton: { backgroundColor: '#ef4444' },
  clockButtonDisabled: { opacity: 0.5 },
  clockButtonIcon: { fontSize: 20 },
  clockButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#2563eb' },
  tabText: { fontSize: 16, color: '#6b7280' },
  activeTabText: { color: '#2563eb', fontWeight: '600' },
  list: { flex: 1, padding: 16 },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#666', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardDate: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 12 },
  cardDescription: { fontSize: 14, color: '#666', marginTop: 8 },
  cardDetail: { fontSize: 12, color: '#999', marginTop: 4 },
  cardNotes: { fontSize: 14, color: '#666', marginTop: 8, fontStyle: 'italic' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeBlock: { alignItems: 'center' },
  timeLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  timeValue: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  shiftTimes: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  shiftTimeBlock: { alignItems: 'center' },
  shiftTimeLabel: { fontSize: 12, color: '#666', marginBottom: 4 },
  shiftTimeValue: { fontSize: 20, fontWeight: '600', color: '#2563eb' },
  shiftArrow: { fontSize: 20, color: '#ccc' },
});
