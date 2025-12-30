import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  video_url: string;
  category: 'latest' | 'global' | 'sports' | 'tech';
  author: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

interface CategoryState {
  selectedCategory: 'latest' | 'global' | 'sports' | 'tech';
  categories: Array<{
    id: string;
    name: string;
    displayName: string;
  }>;
}

const initialState: CategoryState = {
  selectedCategory: 'latest',
  categories: [
    { id: 'latest', name: 'latest', displayName: 'Latest' },
    { id: 'global', name: 'global', displayName: 'Global' },
    { id: 'sports', name: 'sports', displayName: 'Sports' },
    { id: 'tech', name: 'tech', displayName: 'Technology' },
  ],
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<'latest' | 'global' | 'sports' | 'tech'>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setSelectedCategory } = categorySlice.actions;
export default categorySlice.reducer;