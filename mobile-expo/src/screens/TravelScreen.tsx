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
import { travelService } from '../api/services';
import { BusinessTrip } from '../types';

export const TravelScreen: React.FC = () => {
  const [trips, setTrips] = useState<BusinessTrip[]>([]);
  const [myTrips, setMyTrips] = useState<BusinessTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<BusinessTrip | null>(null);

  const [newTrip, setNewTrip] = useState({
    destination: '',
    purpose: '',
    start_date: '',
    end_date: '',
    estimated_cost: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        travelService.getBusinessTrips(),
        travelService.getMyTrips(),
      ]);

      if (allRes.success) setTrips(allRes.data || []);
      if (myRes.success) setMyTrips(myRes.data || []);
    } catch (error) {
      console.error('Error fetching travel data:', error);
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

  const handleCreateTrip = async () => {
    if (!newTrip.destination || !newTrip.purpose || !newTrip.start_date || !newTrip.end_date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await travelService.createBusinessTrip({
        destination: newTrip.destination,
        purpose: newTrip.purpose,
        start_date: newTrip.start_date,
        end_date: newTrip.end_date,
        estimated_cost: newTrip.estimated_cost ? parseFloat(newTrip.estimated_cost) : undefined,
      });
      if (response.success) {
        Alert.alert('Success', 'Business trip request submitted');
        setModalVisible(false);
        setNewTrip({ destination: '', purpose: '', start_date: '', end_date: '', estimated_cost: '' });
        fetchData();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#22c55e';
      case 'rejected':
        return '#ef4444';
      case 'completed':
        return '#3b82f6';
      case 'cancelled':
        return '#6b7280';
      default:
        return '#f59e0b';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (selectedTrip) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedTrip(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Details</Text>
          <View style={{ width: 50 }} />
        </View>
        <ScrollView style={styles.detailContent}>
          <View style={styles.tripHeader}>
            <Text style={styles.tripDestination}>{selectedTrip.destination}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedTrip.status) }]}>
              <Text style={styles.statusText}>{selectedTrip.status}</Text>
            </View>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Purpose</Text>
            <Text style={styles.detailValue}>{selectedTrip.purpose}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Start Date</Text>
            <Text style={styles.detailValue}>{selectedTrip.start_date}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>End Date</Text>
            <Text style={styles.detailValue}>{selectedTrip.end_date}</Text>
          </View>
          {selectedTrip.estimated_cost && (
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Estimated Cost</Text>
              <Text style={styles.detailValue}>{formatCurrency(selectedTrip.estimated_cost)}</Text>
            </View>
          )}
          {selectedTrip.actual_cost && (
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Actual Cost</Text>
              <Text style={styles.detailValue}>{formatCurrency(selectedTrip.actual_cost)}</Text>
            </View>
          )}
          {selectedTrip.staff_member && (
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Employee</Text>
              <Text style={styles.detailValue}>
                {selectedTrip.staff_member.first_name} {selectedTrip.staff_member.last_name}
              </Text>
            </View>
          )}
          {selectedTrip.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <Text style={styles.notesText}>{selectedTrip.notes}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  const displayTrips = activeTab === 'my' ? myTrips : trips;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Travel</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+ New Trip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>My Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All Trips</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {displayTrips.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No business trips found</Text>
          </View>
        ) : (
          displayTrips.map((trip) => (
            <TouchableOpacity key={trip.id} style={styles.card} onPress={() => setSelectedTrip(trip)}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{trip.destination}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
                  <Text style={styles.statusText}>{trip.status}</Text>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>{trip.purpose}</Text>
              <Text style={styles.cardDetail}>
                {trip.start_date} - {trip.end_date}
              </Text>
              {trip.estimated_cost && (
                <Text style={styles.cardDetail}>Est. Cost: {formatCurrency(trip.estimated_cost)}</Text>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Business Trip</Text>

            <Text style={styles.inputLabel}>Destination</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter destination"
              value={newTrip.destination}
              onChangeText={(text) => setNewTrip({ ...newTrip, destination: text })}
            />

            <Text style={styles.inputLabel}>Purpose</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter purpose of trip"
              value={newTrip.purpose}
              onChangeText={(text) => setNewTrip({ ...newTrip, purpose: text })}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2024-01-15"
              value={newTrip.start_date}
              onChangeText={(text) => setNewTrip({ ...newTrip, start_date: text })}
            />

            <Text style={styles.inputLabel}>End Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2024-01-20"
              value={newTrip.end_date}
              onChangeText={(text) => setNewTrip({ ...newTrip, end_date: text })}
            />

            <Text style={styles.inputLabel}>Estimated Cost (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter estimated cost"
              keyboardType="numeric"
              value={newTrip.estimated_cost}
              onChangeText={(text) => setNewTrip({ ...newTrip, estimated_cost: text })}
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
                onPress={handleCreateTrip}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit</Text>
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
  backButton: { color: '#fff', fontSize: 16 },
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
  cardSubtitle: { fontSize: 14, color: '#666', marginBottom: 4 },
  cardDetail: { fontSize: 12, color: '#999', marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  detailContent: { flex: 1, padding: 16 },
  tripHeader: { alignItems: 'center', marginBottom: 24 },
  tripDestination: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center', marginBottom: 8 },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: { fontSize: 14, color: '#666' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', flex: 1, textAlign: 'right' },
  notesSection: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
  notesText: { fontSize: 14, color: '#666', lineHeight: 22 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '90%' },
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
