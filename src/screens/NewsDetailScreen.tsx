import React from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNewsById } from '../hooks/useNews';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import VideoPlayer from '../components/common/VideoPlayer';
import { Ionicons } from '@expo/vector-icons';
import { NewsItem } from '../redux/slices/categorySlice';

const { width, height } = Dimensions.get('window');

const NewsDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { newsId } = route.params;

  const { data: news, isLoading, error, refetch } = useNewsById(newsId);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  if (isLoading) {
    return <LoadingSpinner message="Loading news details..." />;
  }

  if (error || !news) {
    return (
      <ErrorMessage 
        message="Failed to load news details. Please try again later." 
        onRetry={refetch}
      />
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVideoUrl = (videoUrl: string) => {
    // If it's a local asset path, return it as is
    if (videoUrl.startsWith('assets/')) {
      return videoUrl;
    }
    // If it's a full URL, return it
    if (videoUrl.startsWith('http')) {
      return videoUrl;
    }
    // Fallback to a default video
    return 'assets/videos/sample1.mp4';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* News Image */}
        <Image
          source={{ uri: news.image_url || 'https://picsum.photos/seed/news/400/300.jpg' }}
          style={styles.newsImage}
          resizeMode="cover"
        />

        {/* News Content */}
        <View style={styles.content}>
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{news.category.toUpperCase()}</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{news.title}</Text>

          {/* Author and Date */}
          <View style={styles.authorDateRow}>
            <Text style={styles.author}>By {news.author}</Text>
            <Text style={styles.date}>{formatDate(news.published_at)}</Text>
          </View>

          {/* Video Player */}
          <VideoPlayer 
            videoUri={getVideoUrl(news.video_url)}
            shouldAutoPlay={true}
          />

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Article</Text>
            <Text style={styles.description}>{news.description}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    padding: 10,
    marginLeft: 5,
  },
  newsImage: {
    width: width,
    height: height * 0.35,
  },
  content: {
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 15,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 32,
    marginBottom: 15,
  },
  authorDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  author: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
  descriptionContainer: {
    marginTop: 20,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default NewsDetailScreen;
