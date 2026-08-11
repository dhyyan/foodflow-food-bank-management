import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import userReducer from '../features/users/userSlice';
import donationReducer from '../features/donations/donationSlice';
import lotReducer from '../features/lots/lotSlice';
import distributionReducer from '../features/distributions/distributionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    donations: donationReducer,
    lots: lotReducer,
    distribution: distributionReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
