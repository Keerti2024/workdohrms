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
import { trainingService } from '../api/services';
import { TrainingProgram, TrainingSession } from '../types';

export const TrainingScreen: React.FC = () => {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [myTrainings, setMyTrainings] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'programs' | 'sessions' | 'my'>('my');
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [programsRes, sessionsRes, myRes] = await Promise.all([
        trainingService.getPrograms(),
        trainingService.getSessions(),
        trainingService.getMyTrainings(),
      ]);

      if (programsRes.success) setPrograms(programsRes.data || []);
      if (sessionsRes.success) setSessions(sessionsRes.data || []);
      if (myRes.success) setMyTrainings(myRes.data || []);
    } catch (error) {
      console.error('Error fetching training data:', error);
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

  const handleEnroll = async (sessionId: number) => {
    try {
      const response = await trainingService.enrollInSession(sessionId);
      if (response.success) {
        Alert.alert('Success', 'Successfully enrolled in training session');
        fetchData();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to enroll');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'in_progress':
        return '#3b82f6';
      case 'scheduled':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (selectedProgram) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedProgram(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Program Details</Text>
          <View style={{ width: 50 }} />
        </View>
        <ScrollView style={styles.detailContent}>
          <Text style={styles.programTitle}>{selectedProgram.name}</Text>
          <Text style={styles.programDescription}>{selectedProgram.description}</Text>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{selectedProgram.training_type?.name || 'N/A'}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{selectedProgram.duration_hours} hours</Text>
          </View>
          {selectedProgram.objectives && (
            <View style={styles.objectivesSection}>
              <Text style={styles.sectionTitle}>Objectives</Text>
              <Text style={styles.objectivesText}>{selectedProgram.objectives}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Training</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>My Training</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sessions' && styles.activeTab]}
          onPress={() => setActiveTab('sessions')}
        >
          <Text style={[styles.tabText, activeTab === 'sessions' && styles.activeTabText]}>Sessions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'programs' && styles.activeTab]}
          onPress={() => setActiveTab('programs')}
        >
          <Text style={[styles.tabText, activeTab === 'programs' && styles.activeTabText]}>Programs</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'my' ? (
          myTrainings.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No enrolled trainings</Text>
            </View>
          ) : (
            myTrainings.map((session) => (
              <View key={session.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{session.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
                    <Text style={styles.statusText}>{session.status.replace('_', ' ')}</Text>
                  </View>
                </View>
                <Text style={styles.cardSubtitle}>{session.program?.name || 'N/A'}</Text>
                <Text style={styles.cardDetail}>
                  {session.start_date} - {session.end_date}
                </Text>
                {session.trainer && <Text style={styles.cardDetail}>Trainer: {session.trainer}</Text>}
              </View>
            ))
          )
        ) : activeTab === 'sessions' ? (
          sessions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No sessions available</Text>
            </View>
          ) : (
            sessions.map((session) => (
              <View key={session.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{session.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
                    <Text style={styles.statusText}>{session.status.replace('_', ' ')}</Text>
                  </View>
                </View>
                <Text style={styles.cardSubtitle}>{session.program?.name || 'N/A'}</Text>
                <Text style={styles.cardDetail}>
                  {session.start_date} - {session.end_date}
                </Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardDetail}>
                    {session.enrolled_count || 0}/{session.max_participants || '∞'} enrolled
                  </Text>
                  {session.status === 'scheduled' && (
                    <TouchableOpacity
                      style={styles.enrollButton}
                      onPress={() => handleEnroll(session.id)}
                    >
                      <Text style={styles.enrollButtonText}>Enroll</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))
          )
        ) : programs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No programs available</Text>
          </View>
        ) : (
          programs.map((program) => (
            <TouchableOpacity
              key={program.id}
              style={styles.card}
              onPress={() => setSelectedProgram(program)}
            >
              <Text style={styles.cardTitle}>{program.name}</Text>
              <Text style={styles.cardSubtitle}>{program.training_type?.name || 'General'}</Text>
              <Text style={styles.cardDescription} numberOfLines={2}>
                {program.description}
              </Text>
              <Text style={styles.cardDetail}>Duration: {program.duration_hours} hours</Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#2563eb',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  backButton: { color: '#fff', fontSize: 16 },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#2563eb' },
  tabText: { fontSize: 14, color: '#6b7280' },
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', flex: 1 },
  cardSubtitle: { fontSize: 14, color: '#666', marginBottom: 4 },
  cardDescription: { fontSize: 14, color: '#666', marginBottom: 8, lineHeight: 20 },
  cardDetail: { fontSize: 12, color: '#999', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  enrollButton: { backgroundColor: '#2563eb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  enrollButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  detailContent: { flex: 1, padding: 16 },
  programTitle: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 8 },
  programDescription: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 16 },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: { fontSize: 14, color: '#666' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  objectivesSection: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
  objectivesText: { fontSize: 14, color: '#666', lineHeight: 22 },
});
