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
import { organizationService } from '../api/services';
import { OfficeLocation, Division, OrganizationPolicy } from '../types';

type TabType = 'locations' | 'divisions' | 'policies';

export const OrganizationScreen: React.FC = () => {
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [policies, setPolicies] = useState<OrganizationPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('locations');
  const [selectedLocation, setSelectedLocation] = useState<OfficeLocation | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [locRes, divRes, polRes] = await Promise.all([
        organizationService.getOfficeLocations(),
        organizationService.getDivisions(),
        organizationService.getPolicies(),
      ]);

      if (locRes.success) setLocations(locRes.data || []);
      if (divRes.success) setDivisions(divRes.data || []);
      if (polRes.success) setPolicies(polRes.data || []);
    } catch (error) {
      console.error('Error fetching organization data:', error);
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

  const handleAcknowledgePolicy = async (policyId: number) => {
    try {
      const response = await organizationService.acknowledgePolicy(policyId);
      if (response.success) {
        Alert.alert('Success', 'Policy acknowledged');
        fetchData();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to acknowledge');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (selectedLocation) {
    const locationDivisions = divisions.filter((d) => d.office_location_id === selectedLocation.id);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedLocation(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Location Details</Text>
          <View style={{ width: 50 }} />
        </View>
        <ScrollView style={styles.detailContent}>
          <Text style={styles.locationTitle}>{selectedLocation.title}</Text>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValue}>{selectedLocation.address || 'N/A'}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>City</Text>
            <Text style={styles.detailValue}>{selectedLocation.city || 'N/A'}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Country</Text>
            <Text style={styles.detailValue}>{selectedLocation.country || 'N/A'}</Text>
          </View>
          {selectedLocation.phone && (
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{selectedLocation.phone}</Text>
            </View>
          )}
          <Text style={styles.sectionTitle}>Divisions ({locationDivisions.length})</Text>
          {locationDivisions.map((div) => (
            <View key={div.id} style={styles.divisionCard}>
              <Text style={styles.divisionName}>{div.name}</Text>
              {div.description && <Text style={styles.divisionDesc}>{div.description}</Text>}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'locations':
        return locations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No office locations found</Text>
          </View>
        ) : (
          locations.map((loc) => (
            <TouchableOpacity key={loc.id} style={styles.card} onPress={() => setSelectedLocation(loc)}>
              <Text style={styles.cardTitle}>{loc.title}</Text>
              <Text style={styles.cardSubtitle}>{loc.city}, {loc.country}</Text>
              {loc.address && <Text style={styles.cardDetail}>{loc.address}</Text>}
              <Text style={styles.cardDetail}>
                {divisions.filter((d) => d.office_location_id === loc.id).length} division(s)
              </Text>
            </TouchableOpacity>
          ))
        );

      case 'divisions':
        return divisions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No divisions found</Text>
          </View>
        ) : (
          divisions.map((div) => (
            <View key={div.id} style={styles.card}>
              <Text style={styles.cardTitle}>{div.name}</Text>
              <Text style={styles.cardSubtitle}>
                {locations.find((l) => l.id === div.office_location_id)?.title || 'Unknown Location'}
              </Text>
              {div.description && <Text style={styles.cardDescription}>{div.description}</Text>}
            </View>
          ))
        );

      case 'policies':
        return policies.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No policies found</Text>
          </View>
        ) : (
          policies.map((policy) => (
            <View key={policy.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{policy.title}</Text>
                {policy.is_mandatory && (
                  <View style={styles.mandatoryBadge}>
                    <Text style={styles.mandatoryText}>Mandatory</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardDescription}>{policy.description}</Text>
              <Text style={styles.cardDetail}>Effective: {policy.effective_date}</Text>
              {!policy.is_acknowledged && (
                <TouchableOpacity
                  style={styles.acknowledgeButton}
                  onPress={() => handleAcknowledgePolicy(policy.id)}
                >
                  <Text style={styles.acknowledgeButtonText}>Acknowledge</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Organization</Text>
      </View>

      <View style={styles.tabs}>
        {(['locations', 'divisions', 'policies'] as TabType[]).map((tab) => (
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
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  cardDescription: { fontSize: 14, color: '#666', marginTop: 8, lineHeight: 20 },
  cardDetail: { fontSize: 12, color: '#999', marginTop: 4 },
  mandatoryBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  mandatoryText: { color: '#b45309', fontSize: 10, fontWeight: '600' },
  acknowledgeButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  acknowledgeButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  detailContent: { flex: 1, padding: 16 },
  locationTitle: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 16 },
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
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a1a', marginTop: 16, marginBottom: 12 },
  divisionCard: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8 },
  divisionName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
  divisionDesc: { fontSize: 12, color: '#666', marginTop: 4 },
});
