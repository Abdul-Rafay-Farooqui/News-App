import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

interface Category {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  image: string;
}

const categories: Category[] = [
  {
    id: 'latest',
    name: 'latest',
    displayName: 'Latest News',
    description: 'Breaking news and latest updates',
    icon: 'time-outline',
    color: '#ff3b30',
    image: 'https://picsum.photos/seed/latest/400/200.jpg',
  },
  {
    id: 'global',
    name: 'global',
    displayName: 'Global',
    description: 'News from around the world',
    icon: 'globe-outline',
    color: '#007AFF',
    image: 'https://picsum.photos/seed/global/400/200.jpg',
  },
  {
    id: 'sports',
    name: 'sports',
    displayName: 'Sports',
    description: 'Latest sports news and updates',
    icon: 'football-outline',
    color: '#34c759',
    image: 'https://picsum.photos/seed/sports/400/200.jpg',
  },
  {
    id: 'tech',
    name: 'tech',
    displayName: 'Technology',
    description: 'Tech news and innovations',
    icon: 'laptop-outline',
    color: '#5856d6',
    image: 'https://picsum.photos/seed/tech/400/200.jpg',
  },
];

const CategoriesScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('Category', { category: category.id });
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
      <View style={styles.categoryOverlay}>
        <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
          <Ionicons name={item.icon} size={30} color="#fff" />
        </View>
        <Text style={styles.categoryName}>{item.displayName}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <Text style={styles.headerSubtitle}>Browse news by category</Text>
      </View>
      
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.categoriesList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  categoriesList: {
    padding: 20,
  },
  categoryCard: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  categoryOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  arrowContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CategoriesScreen;
