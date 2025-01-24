import { getUserIdFromLocalStorage, getTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from "@/utils/auth";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: !!getUserIdFromLocalStorage() && !!getTokenFromLocalStorage(),
  userId: getUserIdFromLocalStorage(),
  token: getTokenFromLocalStorage(),
  refreshToken: getRefreshTokenFromLocalStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
  },
});

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;
