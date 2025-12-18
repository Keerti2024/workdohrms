import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { performanceService } from '../api/services';
import { PerformanceObjective, RecognitionRecord } from '../types';

export const PerformanceScreen: React.FC = () => {
  const [objectives, setObjectives] = useState<PerformanceObjective[]>([]);
  const [recognitions, setRecognitions] = useState<RecognitionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'objectives' | 'recognitions'>('objectives');
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newObjective, setNewObjective] = useState({
    title: '',
    description: '',
    target_date: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [objectivesRes, recognitionsRes] = await Promise.all([
        performanceService.getObjectives(),
        performanceService.getRecognitions(),
      ]);

      if (objectivesRes.success) {
        setObjectives(objectivesRes.data || []);
      }
      if (recognitionsRes.success) {
        setRecognitions(recognitionsRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
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

  const handleCreateObjective = async () => {
    if (!newObjective.title || !newObjective.description || !newObjective.target_date) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await performanceService.createObjective(newObjective);
      if (response.success) {
        Alert.alert('Success', 'Objective created successfully');
        setModalVisible(false);
        setNewObjective({ title: '', description: '', target_date: '' });
        fetchData();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to create objective');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#22c55e';
      case 'in_progress':
        return '#3b82f6';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#f59e0b';
    }
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
        <Text style={styles.headerTitle}>Performance</Text>
        {activeTab === 'objectives' && (
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+ New Objective</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'objectives' && styles.activeTab]}
          onPress={() => setActiveTab('objectives')}
        >
          <Text style={[styles.tabText, activeTab === 'objectives' && styles.activeTabText]}>Objectives</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recognitions' && styles.activeTab]}
          onPress={() => setActiveTab('recognitions')}
        >
          <Text style={[styles.tabText, activeTab === 'recognitions' && styles.activeTabText]}>Recognitions</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'objectives' ? (
          objectives.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No objectives found</Text>
            </View>
          ) : (
            objectives.map((obj) => (
              <View key={obj.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{obj.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(obj.status) }]}>
                    <Text style={styles.statusText}>{obj.status.replace('_', ' ')}</Text>
                  </View>
                </View>
                <Text style={styles.cardDescription}>{obj.description}</Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${obj.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{obj.progress}%</Text>
                </View>
                <Text style={styles.cardDetail}>Target: {obj.target_date}</Text>
              </View>
            ))
          )
        ) : recognitions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No recognitions found</Text>
          </View>
        ) : (
          recognitions.map((rec) => (
            <View key={rec.id} style={styles.card}>
              <Text style={styles.cardTitle}>{rec.title}</Text>
              <Text style={styles.cardDescription}>{rec.description}</Text>
              <Text style={styles.cardDetail}>Category: {rec.category?.name || 'N/A'}</Text>
              <Text style={styles.cardDetail}>Awarded: {rec.awarded_date}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Objective</Text>

            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter objective title"
              value={newObjective.title}
              onChangeText={(text) => setNewObjective({ ...newObjective, title: text })}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              value={newObjective.description}
              onChangeText={(text) => setNewObjective({ ...newObjective, description: text })}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.inputLabel}>Target Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2024-12-31"
              value={newObjective.target_date}
              onChangeText={(text) => setNewObjective({ ...newObjective, target_date: text })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleCreateObjective}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', flex: 1 },
  cardDescription: { fontSize: 14, color: '#666', marginBottom: 12 },
  cardDetail: { fontSize: 12, color: '#999', marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  progressBar: { flex: 1, height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, marginRight: 8 },
  progressFill: { height: '100%', backgroundColor: '#22c55e', borderRadius: 4 },
  progressText: { fontSize: 12, fontWeight: '600', color: '#666', width: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 20, textAlign: 'center' },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#f9f9f9', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalButton: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center' },
  cancelButton: { backgroundColor: '#e5e7eb' },
  cancelButtonText: { color: '#374151', fontSize: 16, fontWeight: '600' },
  submitButton: { backgroundColor: '#2563eb' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
