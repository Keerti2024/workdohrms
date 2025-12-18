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
import { companyService } from '../api/services';
import { CompanyEvent, CompanyHoliday, CompanyNotice, Meeting } from '../types';

type TabType = 'events' | 'holidays' | 'notices' | 'meetings';

export const CompanyScreen: React.FC = () => {
  const [events, setEvents] = useState<CompanyEvent[]>([]);
  const [holidays, setHolidays] = useState<CompanyHoliday[]>([]);
  const [notices, setNotices] = useState<CompanyNotice[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('events');

  const fetchData = useCallback(async () => {
    try {
      const [eventsRes, holidaysRes, noticesRes, meetingsRes] = await Promise.all([
        companyService.getEvents(),
        companyService.getHolidays(),
        companyService.getNotices(),
        companyService.getMeetings(),
      ]);

      if (eventsRes.success) setEvents(eventsRes.data || []);
      if (holidaysRes.success) setHolidays(holidaysRes.data || []);
      if (noticesRes.success) setNotices(noticesRes.data || []);
      if (meetingsRes.success) setMeetings(meetingsRes.data || []);
    } catch (error) {
      console.error('Error fetching company data:', error);
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
      case 'scheduled':
        return '#3b82f6';
      case 'in_progress':
        return '#f59e0b';
      case 'completed':
        return '#22c55e';
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

  const renderContent = () => {
    switch (activeTab) {
      case 'events':
        return events.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No events found</Text>
          </View>
        ) : (
          events.map((event) => (
            <View key={event.id} style={styles.card}>
              <Text style={styles.cardTitle}>{event.title}</Text>
              <Text style={styles.cardSubtitle}>{event.event_type}</Text>
              <Text style={styles.cardDetail}>
                {event.start_date} {event.start_time && `at ${event.start_time}`}
              </Text>
              {event.location && <Text style={styles.cardDetail}>Location: {event.location}</Text>}
              {event.description && <Text style={styles.cardDescription}>{event.description}</Text>}
            </View>
          ))
        );

      case 'holidays':
        return holidays.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No holidays found</Text>
          </View>
        ) : (
          holidays.map((holiday) => (
            <View key={holiday.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{holiday.name}</Text>
                {holiday.is_recurring && (
                  <View style={styles.recurringBadge}>
                    <Text style={styles.recurringText}>Recurring</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardDate}>{holiday.date}</Text>
              {holiday.description && <Text style={styles.cardDescription}>{holiday.description}</Text>}
            </View>
          ))
        );

      case 'notices':
        return notices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No notices found</Text>
          </View>
        ) : (
          notices.map((notice) => (
            <View key={notice.id} style={[styles.card, notice.is_read === false && styles.unreadCard]}>
              <Text style={styles.cardTitle}>{notice.title}</Text>
              <Text style={styles.cardDescription}>{notice.description}</Text>
              <Text style={styles.cardDetail}>Posted: {notice.created_at}</Text>
            </View>
          ))
        );

      case 'meetings':
        return meetings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No meetings found</Text>
          </View>
        ) : (
          meetings.map((meeting) => (
            <View key={meeting.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{meeting.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(meeting.status) }]}>
                  <Text style={styles.statusText}>{meeting.status.replace('_', ' ')}</Text>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>{meeting.meeting_type?.name || 'Meeting'}</Text>
              <Text style={styles.cardDetail}>
                {meeting.scheduled_date} at {meeting.start_time} - {meeting.end_time}
              </Text>
              {meeting.meeting_room && (
                <Text style={styles.cardDetail}>Room: {meeting.meeting_room.name}</Text>
              )}
              {meeting.meeting_link && (
                <Text style={styles.cardLink}>Online Meeting Available</Text>
              )}
            </View>
          ))
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Company</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        <View style={styles.tabs}>
          {(['events', 'holidays', 'notices', 'meetings'] as TabType[]).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {renderContent()}
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
  tabsContainer: { backgroundColor: '#fff', maxHeight: 50 },
  tabs: { flexDirection: 'row', paddingHorizontal: 8 },
  tab: { paddingVertical: 16, paddingHorizontal: 16 },
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
  unreadCard: { borderLeftWidth: 4, borderLeftColor: '#2563eb' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a', flex: 1 },
  cardSubtitle: { fontSize: 14, color: '#666', marginBottom: 4 },
  cardDate: { fontSize: 16, color: '#2563eb', fontWeight: '500', marginBottom: 4 },
  cardDescription: { fontSize: 14, color: '#666', marginTop: 8, lineHeight: 20 },
  cardDetail: { fontSize: 12, color: '#999', marginTop: 4 },
  cardLink: { fontSize: 12, color: '#2563eb', marginTop: 4 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  recurringBadge: { backgroundColor: '#e0e7ff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  recurringText: { color: '#4f46e5', fontSize: 10, fontWeight: '600' },
});
