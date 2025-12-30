import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { newsService } from '../api/newsService';
import { NewsItem } from '../redux/slices/categorySlice';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface Props {
  route: {
    params: {
      mode: 'add' | 'edit';
      newsItem?: NewsItem;
    };
  };
  navigation: any;
}

const AddEditNewsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mode, newsItem } = route.params;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: newsItem?.title || '',
    description: newsItem?.description || '',
    image_url: newsItem?.image_url || '',
    video_url: newsItem?.video_url || '',
    category: newsItem?.category || 'latest',
    author: newsItem?.author || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: (data: Omit<NewsItem, 'id' | 'created_at' | 'updated_at' | 'published_at'>) =>
      newsService.createNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'allNews'] });
      Alert.alert('Success', 'Article created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Error', 'Failed to create article. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewsItem> }) =>
      newsService.updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'allNews'] });
      Alert.alert('Success', 'Article updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    },
    onError: (error: any) => {
      Alert.alert('Error', 'Failed to update article. Please try again.');
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.video_url.trim()) {
      newErrors.video_url = 'Video URL is required';
    } else if (!isValidUrl(formData.video_url)) {
      newErrors.video_url = 'Please enter a valid URL';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }
    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (mode === 'add') {
      createMutation.mutate(formData);
    } else if (newsItem) {
      updateMutation.mutate({ id: newsItem.id, data: formData });
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isSubmitting) {
    return <LoadingSpinner message={mode === 'add' ? 'Creating article...' : 'Updating article...'} />;
  }

  const categories = [
    { id: 'latest', name: 'Latest' },
    { id: 'global', name: 'Global' },
    { id: 'sports', name: 'Sports' },
    { id: 'tech', name: 'Technology' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {mode === 'add' ? 'Add New Article' : 'Edit Article'}
          </Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              placeholder="Enter article title"
              placeholderTextColor="#999"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* Description Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.textArea, errors.description && styles.inputError]}
              placeholder="Enter article description"
              placeholderTextColor="#999"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          {/* Category Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    formData.category === cat.id && styles.categoryButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, category: cat.id as any })}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      formData.category === cat.id && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Author Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Author *</Text>
            <TextInput
              style={[styles.input, errors.author && styles.inputError]}
              placeholder="Enter author name"
              placeholderTextColor="#999"
              value={formData.author}
              onChangeText={(text) => setFormData({ ...formData, author: text })}
            />
            {errors.author && <Text style={styles.errorText}>{errors.author}</Text>}
          </View>

          {/* Image URL Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image URL (Optional)</Text>
            <TextInput
              style={[styles.input, errors.image_url && styles.inputError]}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor="#999"
              value={formData.image_url}
              onChangeText={(text) => setFormData({ ...formData, image_url: text })}
              autoCapitalize="none"
              keyboardType="url"
            />
            {errors.image_url && <Text style={styles.errorText}>{errors.image_url}</Text>}
          </View>

          {/* Video URL Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Video URL *</Text>
            <TextInput
              style={[styles.input, errors.video_url && styles.inputError]}
              placeholder="https://example.com/video.mp4"
              placeholderTextColor="#999"
              value={formData.video_url}
              onChangeText={(text) => setFormData({ ...formData, video_url: text })}
              autoCapitalize="none"
              keyboardType="url"
            />
            {errors.video_url && <Text style={styles.errorText}>{errors.video_url}</Text>}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>
              {mode === 'add' ? 'Create Article' : 'Update Article'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.requiredNote}>* Required fields</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf6e9',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 120,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  categoryButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#c7b198',
    borderColor: '#c7b198',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#c7b198',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#c7b198',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  requiredNote: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 15,
  },
});

export default AddEditNewsScreen;