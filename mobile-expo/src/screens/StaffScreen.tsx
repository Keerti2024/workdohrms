import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { staffService } from '../api/services';
import { StaffMember } from '../types';

export const StaffScreen: React.FC = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await staffService.getStaffMembers();
      if (response.success) {
        setStaffMembers(response.data || []);
        setFilteredStaff(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = staffMembers.filter(
        (member) =>
          member.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.work_email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStaff(filtered);
    } else {
      setFilteredStaff(staffMembers);
    }
  }, [searchQuery, staffMembers]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#22c55e';
      case 'inactive':
        return '#f59e0b';
      case 'terminated':
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

  if (selectedMember) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedMember(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Staff Details</Text>
          <View style={{ width: 50 }} />
        </View>
        <ScrollView style={styles.detailContent}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {selectedMember.first_name[0]}{selectedMember.last_name[0]}
              </Text>
            </View>
            <Text style={styles.profileName}>
              {selectedMember.first_name} {selectedMember.last_name}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedMember.employment_status) }]}>
              <Text style={styles.statusText}>{selectedMember.employment_status}</Text>
            </View>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Staff Code</Text>
            <Text style={styles.detailValue}>{selectedMember.staff_code || 'N/A'}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Work Email</Text>
            <Text style={styles.detailValue}>{selectedMember.work_email || 'N/A'}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{selectedMember.phone_number || 'N/A'}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Hire Date</Text>
            <Text style={styles.detailValue}>{selectedMember.hire_date}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Division</Text>
            <Text style={styles.detailValue}>{selectedMember.division?.name || 'N/A'}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Job Title</Text>
            <Text style={styles.detailValue}>{selectedMember.job_title?.name || 'N/A'}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Office Location</Text>
            <Text style={styles.detailValue}>{selectedMember.office_location?.title || 'N/A'}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Staff Directory</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search staff..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {filteredStaff.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No staff members found</Text>
          </View>
        ) : (
          filteredStaff.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={styles.card}
              onPress={() => setSelectedMember(member)}
            >
              <View style={styles.cardContent}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {member.first_name[0]}{member.last_name[0]}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>
                    {member.first_name} {member.last_name}
                  </Text>
                  <Text style={styles.cardSubtitle}>{member.job_title?.name || 'No title'}</Text>
                  <Text style={styles.cardDetail}>{member.division?.name || 'No division'}</Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(member.employment_status) }]} />
              </View>
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
  searchContainer: { padding: 16, backgroundColor: '#fff' },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
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
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  cardDetail: { fontSize: 12, color: '#999', marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  detailContent: { flex: 1, padding: 16 },
  profileSection: { alignItems: 'center', marginBottom: 24 },
  profileName: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginTop: 12 },
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
});
