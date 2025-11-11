import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import { userApi } from './api/userApi';
import { chatApi } from './api/chatApi';
import { showcaseApi } from './api/showcaseApi';

const concatMiddleware = [userApi.middleware, chatApi.middleware, showcaseApi.middleware];

export const store = configureStore({
  reducer: {
    user: userReducer,
    [userApi.reducerPath]: userApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [showcaseApi.reducerPath]: showcaseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...concatMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
