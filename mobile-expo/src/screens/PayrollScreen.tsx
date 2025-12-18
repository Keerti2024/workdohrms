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
import { payrollService } from '../api/services';
import { SalarySlip, SalaryAdvance } from '../types';
import { useAuth } from '../auth/AuthContext';

export const PayrollScreen: React.FC = () => {
  const { user } = useAuth();
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>([]);
  const [advances, setAdvances] = useState<SalaryAdvance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'slips' | 'advances'>('slips');
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newAdvance, setNewAdvance] = useState({
    amount: '',
    reason: '',
    repayment_months: '',
  });

  const fetchData = useCallback(async () => {
    try {
      const [slipsRes, advancesRes] = await Promise.all([
        payrollService.getSalarySlips(),
        payrollService.getAdvances(),
      ]);

      if (slipsRes.success) {
        setSalarySlips(slipsRes.data || []);
      }
      if (advancesRes.success) {
        setAdvances(advancesRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching payroll data:', error);
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

  const handleRequestAdvance = async () => {
    if (!newAdvance.amount || !newAdvance.reason) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await payrollService.createAdvance({
        amount: parseFloat(newAdvance.amount),
        reason: newAdvance.reason,
        repayment_months: newAdvance.repayment_months ? parseInt(newAdvance.repayment_months) : undefined,
      });
      if (response.success) {
        Alert.alert('Success', 'Salary advance request submitted');
        setModalVisible(false);
        setNewAdvance({ amount: '', reason: '', repayment_months: '' });
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
      case 'paid':
      case 'approved':
        return '#22c55e';
      case 'rejected':
        return '#ef4444';
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payroll</Text>
        {activeTab === 'advances' && (
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+ Request Advance</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'slips' && styles.activeTab]}
          onPress={() => setActiveTab('slips')}
        >
          <Text style={[styles.tabText, activeTab === 'slips' && styles.activeTabText]}>Salary Slips</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'advances' && styles.activeTab]}
          onPress={() => setActiveTab('advances')}
        >
          <Text style={[styles.tabText, activeTab === 'advances' && styles.activeTabText]}>Advances</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'slips' ? (
          salarySlips.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No salary slips found</Text>
            </View>
          ) : (
            salarySlips.map((slip) => (
              <View key={slip.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{slip.salary_period}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(slip.status) }]}>
                    <Text style={styles.statusText}>{slip.status}</Text>
                  </View>
                </View>
                <Text style={styles.cardSubtitle}>Ref: {slip.slip_reference}</Text>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Net Payable:</Text>
                  <Text style={styles.amountValue}>{formatCurrency(slip.net_payable)}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownText}>Earnings: {formatCurrency(slip.total_earnings)}</Text>
                  <Text style={styles.breakdownText}>Deductions: {formatCurrency(slip.total_deductions)}</Text>
                </View>
              </View>
            ))
          )
        ) : advances.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No salary advances found</Text>
          </View>
        ) : (
          advances.map((advance) => (
            <View key={advance.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{formatCurrency(advance.amount)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(advance.status) }]}>
                  <Text style={styles.statusText}>{advance.status}</Text>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>{advance.reason}</Text>
              {advance.repayment_months && (
                <Text style={styles.cardDetail}>Repayment: {advance.repayment_months} months</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Salary Advance</Text>

            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={newAdvance.amount}
              onChangeText={(text) => setNewAdvance({ ...newAdvance, amount: text })}
            />

            <Text style={styles.inputLabel}>Reason</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter reason for advance"
              value={newAdvance.reason}
              onChangeText={(text) => setNewAdvance({ ...newAdvance, reason: text })}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.inputLabel}>Repayment Months (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Number of months"
              keyboardType="numeric"
              value={newAdvance.repayment_months}
              onChangeText={(text) => setNewAdvance({ ...newAdvance, repayment_months: text })}
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
                onPress={handleRequestAdvance}
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
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  cardSubtitle: { fontSize: 14, color: '#666', marginBottom: 8 },
  cardDetail: { fontSize: 14, color: '#666' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  amountLabel: { fontSize: 14, color: '#666' },
  amountValue: { fontSize: 20, fontWeight: 'bold', color: '#22c55e' },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  breakdownText: { fontSize: 12, color: '#666' },
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
