import { supabase } from './supabaseClient';
import { NewsItem } from '../redux/slices/categorySlice';

export const newsService = {
  // Get all news
  getAllNews: async (): Promise<NewsItem[]> => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get news by category
  getNewsByCategory: async (category: string): Promise<NewsItem[]> => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('category', category)
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get latest news (limited)
  getLatestNews: async (limit: number = 4): Promise<NewsItem[]> => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('category', 'latest')
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Get global news (limited)
  getGlobalNews: async (limit: number = 4): Promise<NewsItem[]> => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('category', 'global')
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Get sports news (limited)
  getSportsNews: async (limit: number = 4): Promise<NewsItem[]> => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('category', 'sports')
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Get tech news (limited)
  getTechNews: async (limit: number = 4): Promise<NewsItem[]> => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('category', 'tech')
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Get single news item by ID
  getNewsById: async (id: string): Promise<NewsItem | null> => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create news item
  createNews: async (news: Omit<NewsItem, 'id' | 'created_at' | 'updated_at' | 'published_at'>): Promise<NewsItem> => {
    const { data, error } = await supabase
      .from('news')
      .insert([{ ...news, published_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update news item
  updateNews: async (id: string, updates: Partial<NewsItem>): Promise<NewsItem> => {
    const { data, error } = await supabase
      .from('news')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete news item
  deleteNews: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};