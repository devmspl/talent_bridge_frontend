import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import { userApi } from './api/userApi';
import socketReducer from './slices/socketSlice';
import { chatApi } from './api/chatApi';

const concatMiddleware = [userApi.middleware, chatApi.middleware,];

export const store = configureStore({
  reducer: {
    user: userReducer,
    socket: socketReducer,
    [userApi.reducerPath]: userApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['socket/setSocket'],
        ignoredPaths: ['socket.socket'],
      },
    }).concat(...concatMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 


