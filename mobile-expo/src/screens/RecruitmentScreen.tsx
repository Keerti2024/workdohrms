import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { recruitmentService } from '../api/services';
import { Job, JobApplication } from '../types';

export const RecruitmentScreen: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        recruitmentService.getJobs(),
        recruitmentService.getApplications(),
      ]);

      if (jobsRes.success) {
        setJobs(jobsRes.data || []);
      }
      if (appsRes.success) {
        setApplications(appsRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching recruitment data:', error);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
      case 'hired':
        return '#22c55e';
      case 'closed':
      case 'rejected':
        return '#ef4444';
      case 'shortlisted':
        return '#3b82f6';
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

  if (selectedJob) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedJob(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={{ width: 50 }} />
        </View>
        <ScrollView style={styles.detailContent}>
          <View style={styles.jobHeader}>
            <Text style={styles.jobTitle}>{selectedJob.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedJob.status) }]}>
              <Text style={styles.statusText}>{selectedJob.status}</Text>
            </View>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Positions</Text>
            <Text style={styles.detailValue}>{selectedJob.positions}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Applications</Text>
            <Text style={styles.detailValue}>{selectedJob.applications_count || 0}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Start Date</Text>
            <Text style={styles.detailValue}>{selectedJob.start_date}</Text>
          </View>
          {selectedJob.end_date && (
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>End Date</Text>
              <Text style={styles.detailValue}>{selectedJob.end_date}</Text>
            </View>
          )}
          {selectedJob.salary_from && selectedJob.salary_to && (
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Salary Range</Text>
              <Text style={styles.detailValue}>
                ${selectedJob.salary_from.toLocaleString()} - ${selectedJob.salary_to.toLocaleString()}
              </Text>
            </View>
          )}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{selectedJob.description}</Text>
          </View>
          {selectedJob.requirements && (
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              <Text style={styles.descriptionText}>{selectedJob.requirements}</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recruitment</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'jobs' && styles.activeTab]}
          onPress={() => setActiveTab('jobs')}
        >
          <Text style={[styles.tabText, activeTab === 'jobs' && styles.activeTabText]}>Jobs ({jobs.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'applications' && styles.activeTab]}
          onPress={() => setActiveTab('applications')}
        >
          <Text style={[styles.tabText, activeTab === 'applications' && styles.activeTabText]}>
            Applications ({applications.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'jobs' ? (
          jobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No jobs found</Text>
            </View>
          ) : (
            jobs.map((job) => (
              <TouchableOpacity key={job.id} style={styles.card} onPress={() => setSelectedJob(job)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{job.title}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) }]}>
                    <Text style={styles.statusText}>{job.status}</Text>
                  </View>
                </View>
                <Text style={styles.cardSubtitle}>{job.category?.name || 'Uncategorized'}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardDetail}>{job.positions} position(s)</Text>
                  <Text style={styles.cardDetail}>{job.applications_count || 0} applications</Text>
                </View>
              </TouchableOpacity>
            ))
          )
        ) : applications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No applications found</Text>
          </View>
        ) : (
          applications.map((app) => (
            <View key={app.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{app.candidate?.name || 'Unknown'}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(app.status) }]}>
                  <Text style={styles.statusText}>{app.status}</Text>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>{app.job?.title || 'Unknown Job'}</Text>
              <Text style={styles.cardDetail}>Applied: {app.applied_at}</Text>
              {app.stage && <Text style={styles.cardDetail}>Stage: {app.stage.name}</Text>}
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
  cardSubtitle: { fontSize: 14, color: '#666', marginBottom: 8 },
  cardDetail: { fontSize: 12, color: '#999' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  detailContent: { flex: 1, padding: 16 },
  jobHeader: { alignItems: 'center', marginBottom: 24 },
  jobTitle: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center', marginBottom: 8 },
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
  descriptionSection: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginBottom: 8 },
  descriptionText: { fontSize: 14, color: '#666', lineHeight: 22 },
});
