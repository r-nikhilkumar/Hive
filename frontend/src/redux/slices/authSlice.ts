import { createSlice } from "@reduxjs/toolkit";
import { getUserIdFromCookies } from "@/utils/auth";

// const initialState = {
//   isAuthenticated: !!getUserIdFromCookies(),
//   userId: getUserIdFromCookies(),
// };

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    userId: getUserIdFromCookies(),
  },
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.userId = action.payload.userId;
    },
  },
});

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;
