import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginError: string | null;
}

const initialState: AdminState = {
  isAuthenticated: false,
  isAdmin: false,
  loginError: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loginError = null;
    },
    loginSuccess: (state) => {
      state.isAuthenticated = true;
      state.isAdmin = true;
      state.loginError = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.loginError = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isAdmin = false;
      state.loginError = null;
    },
    clearError: (state) => {
      state.loginError = null;
    },
  },
});

export const { loginRequest, loginSuccess, loginFailure, logout, clearError } = adminSlice.actions;
export default adminSlice.reducer;