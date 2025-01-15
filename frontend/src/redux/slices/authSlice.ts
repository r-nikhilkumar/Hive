import { createSlice } from "@reduxjs/toolkit";
import { getUserIdFromCookies } from "../../utils/auth";

const initialState = {
  isAuthenticated: !!getUserIdFromCookies(),
  userId: getUserIdFromCookies(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.userId = action.payload.userId;
    },
    clearAuthState: (state) => {
      state.isAuthenticated = false;
      state.userId = "";
    },
  },
});

export const { setAuthState, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
