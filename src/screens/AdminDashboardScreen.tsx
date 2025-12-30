import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import { logout } from '../redux/slices/adminSlice';
import { useQuery } from '@tanstack/react-query';
import { newsService } from '../api/newsService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const AdminDashboardScreen: React.FC = ({ navigation }: any) => {
  const dispatch = useDispatch();
  
  const { data: allNews, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'allNews'],
    queryFn: () => newsService.getAllNews(),
  });

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace('AdminLogin');
  };

  const handleAddNews = () => {
    navigation.navigate('AddEditNews', { mode: 'add' });
  };

  const handleEditNews = (newsItem: any) => {
    navigation.navigate('AddEditNews', { mode: 'edit', newsItem });
  };

  const handleDeleteNews = (id: string) => {
    Alert.alert(
      'Delete Article',
      'Are you sure you want to delete this article? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await newsService.deleteNews(id);
              refetch();
            } catch (error) {
              console.error('Error deleting news:', error);
            }
          },
        },
      ]
    );
  };

  // Calculate statistics
  const stats = {
    total: allNews?.length || 0,
    latest: allNews?.filter(n => n.category === 'latest').length || 0,
    global: allNews?.filter(n => n.category === 'global').length || 0,
    sports: allNews?.filter(n => n.category === 'sports').length || 0,
    tech: allNews?.filter(n => n.category === 'tech').length || 0,
  };

  if (isLoading && !allNews) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load dashboard" onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.totalStatsCard}>
            <View style={styles.statsIconContainer}>
              <Ionicons name="newspaper" size={32} color="#fff" />
            </View>
            <View style={styles.statsInfo}>
              <Text style={styles.statsNumber}>{stats.total}</Text>
              <Text style={styles.statsLabel}>Total Articles</Text>
            </View>
          </View>
        </View>

        {/* Category Stats */}
        <View style={styles.categoryStatsGrid}>
          <View style={[styles.categoryCard, { borderLeftColor: '#007AFF' }]}>
            <Text style={styles.categoryNumber}>{stats.latest}</Text>
            <Text style={styles.categoryLabel}>Latest</Text>
          </View>
          <View style={[styles.categoryCard, { borderLeftColor: '#34C759' }]}>
            <Text style={styles.categoryNumber}>{stats.global}</Text>
            <Text style={styles.categoryLabel}>Global</Text>
          </View>
          <View style={[styles.categoryCard, { borderLeftColor: '#FF9500' }]}>
            <Text style={styles.categoryNumber}>{stats.sports}</Text>
            <Text style={styles.categoryLabel}>Sports</Text>
          </View>
          <View style={[styles.categoryCard, { borderLeftColor: '#AF52DE' }]}>
            <Text style={styles.categoryNumber}>{stats.tech}</Text>
            <Text style={styles.categoryLabel}>Technology</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAddNews}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Add New Article</Text>
          </TouchableOpacity>
        </View>

        {/* News List */}
        <View style={styles.newsListSection}>
          <View style={styles.newsListHeader}>
            <Text style={styles.newsListTitle}>All Articles</Text>
            <Text style={styles.newsListCount}>{stats.total} articles</Text>
          </View>

          {allNews && allNews.length > 0 ? (
            allNews.map((item) => (
              <View key={item.id} style={styles.newsItem}>
                <View style={styles.newsItemLeft}>
                  {item.image_url && (
                    <View style={styles.newsImageContainer}>
                      <Text style={styles.newsImagePlaceholder}>IMG</Text>
                    </View>
                  )}
                  <View style={styles.newsInfo}>
                    <Text style={styles.newsTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <View style={styles.newsMeta}>
                      <Text style={[styles.newsCategory, styles[`category_${item.category}`]]}>
                        {item.category.toUpperCase()}
                      </Text>
                      <Text style={styles.newsAuthor}>
                        {item.author}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.newsActions}>
                  <TouchableOpacity
                    style={styles.actionIconButton}
                    onPress={() => handleEditNews(item)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="create-outline" size={22} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionIconButton}
                    onPress={() => handleDeleteNews(item.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={22} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="newspaper-outline" size={64} color="#ccc" />
              <Text style={styles.emptyStateText}>No articles yet</Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={handleAddNews}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyStateButtonText}>Add Your First Article</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf6e9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  statsContainer: {
    marginBottom: 20,
  },
  totalStatsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#c7b198',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsInfo: {
    marginLeft: 15,
    flex: 1,
  },
  statsNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },
  statsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  categoryStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    marginHorizontal: -5,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: '1%',
    marginBottom: 10,
  },
  categoryNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  categoryLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  actionsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 10,
  },
  newsListSection: {
    marginBottom: 20,
  },
  newsListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  newsListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  newsListCount: {
    fontSize: 14,
    color: '#666',
  },
  newsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  newsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  newsImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  newsImagePlaceholder: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },
  newsInfo: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  newsMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#f0f8ff',
  },
  category_latest: {
    color: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  category_global: {
    color: '#34C759',
    backgroundColor: '#f0fff4',
  },
  category_sports: {
    color: '#FF9500',
    backgroundColor: '#fff7ed',
  },
  category_tech: {
    color: '#AF52DE',
    backgroundColor: '#faf5ff',
  },
  newsAuthor: {
    fontSize: 11,
    color: '#999',
  },
  newsActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 15,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#c7b198',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AdminDashboardScreen;