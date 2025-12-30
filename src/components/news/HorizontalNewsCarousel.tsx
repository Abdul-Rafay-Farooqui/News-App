import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { NewsItem } from '../../redux/slices/categorySlice';
import NewsCard from './NewsCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface HorizontalNewsCarouselProps {
  title: string;
  news: NewsItem[];
  category?: string;
}

const { width } = Dimensions.get('window');

const HorizontalNewsCarousel: React.FC<HorizontalNewsCarouselProps> = ({ 
  title, 
  news, 
  category 
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleNewsPress = (newsItem: NewsItem) => {
    navigation.navigate('NewsDetail', { newsId: newsItem.id });
  };

  const handleSeeMore = () => {
    if (category) {
      navigation.navigate('Category', { category });
    }
  };

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <NewsCard news={item} onPress={handleNewsPress} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <View style={styles.accentBar} />
            <Text style={styles.title}>{title}</Text>
          </View>
          {category && (
            <TouchableOpacity 
              onPress={handleSeeMore} 
              style={styles.seeMoreButton}
              activeOpacity={0.8}
            >
              <Text style={styles.seeMoreText}>SEE MORE</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {news.length > 0 ? (
        <FlatList
          data={news}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
          pagingEnabled={false}
          snapToInterval={width * 0.9 + 10}
          decelerationRate="fast"
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Text style={styles.emptyIcon}>📰</Text>
          </View>
          <Text style={styles.emptyText}>No news available</Text>
          <Text style={styles.emptySubtext}>Check back later for updates</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  headerCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#f7f7f7',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accentBar: {
    width: 4,
    height: 28,
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#212121',
    letterSpacing: -0.5,
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  seeMoreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginRight: 2,
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  carouselContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderStyle: 'dashed',
    minHeight: 220,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#2D3436',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#636E72',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HorizontalNewsCarousel;