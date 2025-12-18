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
import { documentService } from '../api/services';
import { HrDocument, DocumentCategory } from '../types';

export const DocumentsScreen: React.FC = () => {
  const [documents, setDocuments] = useState<HrDocument[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [pendingAcks, setPendingAcks] = useState<HrDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [docsRes, catsRes, pendingRes] = await Promise.all([
        documentService.getHrDocuments({ category_id: selectedCategory || undefined }),
        documentService.getDocumentCategories(),
        documentService.getPendingAcknowledgments(),
      ]);

      if (docsRes.success) setDocuments(docsRes.data || []);
      if (catsRes.success) setCategories(catsRes.data || []);
      if (pendingRes.success) setPendingAcks(pendingRes.data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const handleAcknowledge = async (docId: number) => {
    try {
      const response = await documentService.acknowledgeHrDocument(docId);
      if (response.success) {
        Alert.alert('Success', 'Document acknowledged');
        fetchData();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to acknowledge');
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('word') || fileType.includes('doc')) return '📝';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    return '📁';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const displayDocs = activeTab === 'pending' ? pendingAcks : documents;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
        {pendingAcks.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingAcks.length}</Text>
          </View>
        )}
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All Documents</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending ({pendingAcks.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'all' && categories.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
          <TouchableOpacity
            style={[styles.categoryChip, selectedCategory === null && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.categoryChipText, selectedCategory === null && styles.categoryChipTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={[styles.categoryChipText, selectedCategory === cat.id && styles.categoryChipTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {displayDocs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {activeTab === 'pending' ? 'No pending acknowledgments' : 'No documents found'}
            </Text>
          </View>
        ) : (
          displayDocs.map((doc) => (
            <View key={doc.id} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.fileIcon}>{getFileIcon(doc.file_type || '')}</Text>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{doc.title}</Text>
                  <Text style={styles.cardSubtitle}>{doc.category?.name || 'Uncategorized'}</Text>
                  {doc.description && (
                    <Text style={styles.cardDescription} numberOfLines={2}>
                      {doc.description}
                    </Text>
                  )}
                  <Text style={styles.cardDetail}>Uploaded: {doc.created_at}</Text>
                </View>
              </View>
              {activeTab === 'pending' && (
                <TouchableOpacity
                  style={styles.acknowledgeButton}
                  onPress={() => handleAcknowledge(doc.id)}
                >
                  <Text style={styles.acknowledgeButtonText}>Acknowledge</Text>
                </TouchableOpacity>
              )}
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
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#2563eb' },
  tabText: { fontSize: 16, color: '#6b7280' },
  activeTabText: { color: '#2563eb', fontWeight: '600' },
  categoryFilter: { backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 8, maxHeight: 60 },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 4,
  },
  categoryChipActive: { backgroundColor: '#2563eb' },
  categoryChipText: { fontSize: 14, color: '#6b7280' },
  categoryChipTextActive: { color: '#fff' },
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
  cardContent: { flexDirection: 'row' },
  fileIcon: { fontSize: 32, marginRight: 12 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
  cardSubtitle: { fontSize: 14, color: '#666', marginTop: 2 },
  cardDescription: { fontSize: 14, color: '#666', marginTop: 4, lineHeight: 20 },
  cardDetail: { fontSize: 12, color: '#999', marginTop: 4 },
  acknowledgeButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  acknowledgeButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
