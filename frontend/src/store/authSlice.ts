import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/api";

interface AuthState {
  status: boolean;
  userData: User | null;
  /** False once the initial /auth/me check has resolved. */
  initializing: boolean;
}

const initialState: AuthState = {
  status: false,
  userData: null,
  initializing: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ userData: User }>) => {
      state.status = true;
      state.userData = action.payload.userData;
      state.initializing = false;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.initializing = false;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
