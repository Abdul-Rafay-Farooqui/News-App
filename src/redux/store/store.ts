import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '../slices/categorySlice';
import settingsReducer from '../slices/settingsSlice'; // ✅ default import
import adminReducer from '../slices/adminSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    category: categoryReducer,
    admin: adminReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;