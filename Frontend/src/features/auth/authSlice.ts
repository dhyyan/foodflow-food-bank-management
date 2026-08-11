import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User, LoginDto } from '../../types/user';
import { authApi } from './authApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialToken = localStorage.getItem('foodflow_token');
const initialUserRaw = localStorage.getItem('foodflow_user');
let initialUser: User | null = null;
if (initialUserRaw) {
  try {
    initialUser = JSON.parse(initialUserRaw);
  } catch (e) {
    initialUser = null;
  }
}

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken && initialUser),
  loading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginDto, { rejectWithValue }) => {
    try {
      const res = await authApi.login(credentials);
      if (res.success && res.data) {
        const token = res.data.token;
        const user = res.data.user;
        if (token && user) {
          localStorage.setItem('foodflow_token', token);
          localStorage.setItem('foodflow_user', JSON.stringify(user));
          return { token, user };
        }
      }
      return rejectWithValue(res.message || 'Login failed');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Login request failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getCurrentUser();
      const user = res.data?.user || res.data;
      if (user) {
        localStorage.setItem('foodflow_user', JSON.stringify(user));
        return user as User;
      }
      return rejectWithValue(res.message || 'Failed to fetch user profile');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Authentication session invalid');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('foodflow_token');
      localStorage.removeItem('foodflow_user');
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Login failed';
    });

    // Fetch me
    builder.addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('foodflow_token');
      localStorage.removeItem('foodflow_user');
    });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
