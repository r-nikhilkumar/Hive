import { createSlice } from "@reduxjs/toolkit";
import { getTokenFromCookies } from "../../utils/auth";

const initialState = {
  isAuthenticated: !!getTokenFromCookies(),
  token: getTokenFromCookies(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.token = action.payload.token;
    },
    clearAuthState: (state) => {
      state.isAuthenticated = false;
      state.token = "";
    },
  },
});

export const { setAuthState, clearAuthState } = authSlice.actions;
export default authSlice.reducer;
