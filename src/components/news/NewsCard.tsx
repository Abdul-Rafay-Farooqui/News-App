import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { NewsItem } from '../../redux/slices/categorySlice';

interface NewsCardProps {
  news: NewsItem;
  onPress: (news: NewsItem) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.9;

const NewsCard: React.FC<NewsCardProps> = ({ news, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(news)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: news.image_url || 'https://picsum.photos/seed/default/400/300.jpg' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.category} numberOfLines={1}>
          {news.category.toUpperCase()}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {news.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {news.description}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.author}>By {news.author}</Text>
          <Text style={styles.date}>{formatDate(news.published_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#ffff',
    borderRadius: 16,
    marginHorizontal: 5,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {
    padding: 18,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    fontSize: 11,
    color: '#888',
    fontStyle: 'italic',
  },
  date: {
    fontSize: 11,
    color: '#888',
  },
});

export default NewsCard;