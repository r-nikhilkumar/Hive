import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { authApi } from "./api/authApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { chatApi } from "./api/chatApi";
import { commonApi } from "./api/commonApi";
import { userApi } from "./api/userApi";
import { postApi } from "./api/postApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [commonApi.reducerPath]: commonApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(chatApi.middleware)
      .concat(commonApi.middleware)
      .concat(userApi.middleware)
      .concat(postApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

setupListeners(store.dispatch);
