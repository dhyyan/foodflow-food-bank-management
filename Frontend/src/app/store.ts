import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import donationReducer from '../features/donations/donationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    donations: donationReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
