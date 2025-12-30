import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  notifications: boolean;
  autoPlay: boolean;
}

const initialState: SettingsState = {
  notifications: true,
  autoPlay: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings(state, action: PayloadAction<Partial<SettingsState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
