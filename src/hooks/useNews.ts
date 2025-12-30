import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsService } from '../api/newsService';
import { NewsItem } from '../redux/slices/categorySlice';

export const useAllNews = () => {
  return useQuery({
    queryKey: ['news', 'all'],
    queryFn: () => newsService.getAllNews(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNewsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['news', 'category', category],
    queryFn: () => newsService.getNewsByCategory(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!category,
  });
};

export const useLatestNews = (limit: number = 4) => {
  return useQuery({
    queryKey: ['news', 'latest', limit],
    queryFn: () => newsService.getLatestNews(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGlobalNews = (limit: number = 4) => {
  return useQuery({
    queryKey: ['news', 'global', limit],
    queryFn: () => newsService.getGlobalNews(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSportsNews = (limit: number = 4) => {
  return useQuery({
    queryKey: ['news', 'sports', limit],
    queryFn: () => newsService.getSportsNews(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useTechNews = (limit: number = 4) => {
  return useQuery({
    queryKey: ['news', 'tech', limit],
    queryFn: () => newsService.getTechNews(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useNewsById = (id: string) => {
  return useQuery({
    queryKey: ['news', 'id', id],
    queryFn: () => newsService.getNewsById(id),
    enabled: !!id,
  });
};

// Mutations for CRUD operations
export const useCreateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (news: Omit<NewsItem, 'id' | 'created_at' | 'updated_at' | 'published_at'>) => 
      newsService.createNews(news),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<NewsItem> }) => 
      newsService.updateNews(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => newsService.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
  });
};