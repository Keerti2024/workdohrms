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
import { assetService } from '../api/services';
import { Asset } from '../types';

export const AssetsScreen: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [myAssets, setMyAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('my');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [allRes, myRes] = await Promise.all([
        assetService.getAssets(),
        assetService.getMyAssets(),
      ]);

      if (allRes.success) {
        setAssets(allRes.data || []);
      }
      if (myRes.success) {
        setMyAssets(myRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
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
      case 'available':
        return '#22c55e';
      case 'assigned':
        return '#3b82f6';
      case 'maintenance':
        return '#f59e0b';
      case 'retired':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return '#22c55e';
      case 'good':
        return '#3b82f6';
      case 'fair':
        return '#f59e0b';
      case 'poor':
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

  if (selectedAsset) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedAsset(null)}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Asset Details</Text>
          <View style={{ width: 50 }} />
        </View>
        <ScrollView style={styles.detailContent}>
          <View style={styles.assetHeader}>
            <Text style={styles.assetName}>{selectedAsset.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedAsset.status) }]}>
              <Text style={styles.statusText}>{selectedAsset.status}</Text>
            </View>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{selectedAsset.asset_type?.title || 'N/A'}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Serial Number</Text>
            <Text style={styles.detailValue}>{selectedAsset.serial_number || 'N/A'}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Condition</Text>
            <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(selectedAsset.condition) }]}>
              <Text style={styles.conditionText}>{selectedAsset.condition}</Text>
            </View>
          </View>
          {selectedAsset.purchase_date && (
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Purchase Date</Text>
              <Text style={styles.detailValue}>{selectedAsset.purchase_date}</Text>
            </View>
          )}
          {selectedAsset.purchase_cost && (
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Purchase Cost</Text>
              <Text style={styles.detailValue}>${selectedAsset.purchase_cost.toLocaleString()}</Text>
            </View>
          )}
          {selectedAsset.location && (
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{selectedAsset.location}</Text>
            </View>
          )}
          {selectedAsset.assigned_staff && (
            <View style={styles.detailCard}>
              <Text style={styles.detailLabel}>Assigned To</Text>
              <Text style={styles.detailValue}>
                {selectedAsset.assigned_staff.first_name} {selectedAsset.assigned_staff.last_name}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  const displayAssets = activeTab === 'my' ? myAssets : assets;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assets</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>My Assets</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All Assets</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {displayAssets.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No assets found</Text>
          </View>
        ) : (
          displayAssets.map((asset) => (
            <TouchableOpacity key={asset.id} style={styles.card} onPress={() => setSelectedAsset(asset)}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{asset.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(asset.status) }]}>
                  <Text style={styles.statusText}>{asset.status}</Text>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>{asset.asset_type?.title || 'Unknown Type'}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardDetail}>SN: {asset.serial_number || 'N/A'}</Text>
                <View style={[styles.conditionBadge, { backgroundColor: getConditionColor(asset.condition) }]}>
                  <Text style={styles.conditionText}>{asset.condition}</Text>
                </View>
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
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  conditionBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  conditionText: { color: '#fff', fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  detailContent: { flex: 1, padding: 16 },
  assetHeader: { alignItems: 'center', marginBottom: 24 },
  assetName: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center', marginBottom: 8 },
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: { fontSize: 14, color: '#666' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1a1a1a' },
});
