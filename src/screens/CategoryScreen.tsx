import React, { useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNewsByCategory } from '../hooks/useNews';
import NewsCard from '../components/news/NewsCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { NewsItem } from '../redux/slices/categorySlice';
import { Ionicons } from '@expo/vector-icons';

const CategoryScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { category } = route.params;

  const flatListRef = useRef<FlatList>(null);

  React.useLayoutEffect(() => {
    const categoryDisplayNames: { [key: string]: string } = {
      latest: 'Latest News',
      global: 'Global News',
      sports: 'Sports News',
      tech: 'Technology News',
    };

    navigation.setOptions({
      title: categoryDisplayNames[category] || 'Category',
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, category]);

  const { 
    data: news, 
    isLoading, 
    error, 
    refetch 
  } = useNewsByCategory(category);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleNewsPress = (newsItem: NewsItem) => {
    navigation.navigate('NewsDetail', { newsId: newsItem.id });
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <View style={styles.newsItemContainer}>
      <NewsCard news={item} onPress={handleNewsPress} />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="newspaper-outline" size={80} color="#ccc" />
      <Text style={styles.emptyStateTitle}>No News Found</Text>
      <Text style={styles.emptyStateText}>
        There are no news articles in this category at the moment.
      </Text>
    </View>
  );

  const ListHeaderComponent = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerDescription}>
         {category} News 
      </Text>
    </View>
  );

  if (isLoading && !news) {
    return <LoadingSpinner message="Loading news..." />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message="Failed to load news. Please check your internet connection and try again." 
        onRetry={onRefresh}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={news || []}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          (!news || news.length === 0) && styles.listContentEmpty,
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={ListHeaderComponent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerLeft: {
    padding: 10,
    marginLeft: 5,
  },
  listContent: {
    padding: 15,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#212121',
    borderRadius: 12,
    marginHorizontal: 5,
  },
  headerDescription: {
    fontSize: 24,
    color: '#ffff',
    textAlign: 'center',
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  newsItemContainer: {
    marginVertical: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
  },
});

export default CategoryScreen;
