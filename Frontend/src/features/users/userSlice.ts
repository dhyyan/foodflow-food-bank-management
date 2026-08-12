import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { User, RegisterUserDto } from '../../types/user';
import { userApi } from './userApi';

interface UserState {
  users: User[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  actionSuccess: boolean;
}

const initialState: UserState = {
  users: [],
  loading: false,
  actionLoading: false,
  error: null,
  actionSuccess: false
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await userApi.getUsers();
      const rawData = res.data as any;
      if (Array.isArray(rawData)) {
        return rawData as User[];
      } else if (rawData?.users && Array.isArray(rawData.users)) {
        return rawData.users as User[];
      }
      return [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to load system users');
    }
  }
);

export const registerUser = createAsyncThunk(
  'users/registerUser',
  async (userData: RegisterUserDto, { rejectWithValue }) => {
    try {
      const res = await userApi.registerUser(userData);
      if (res.success || res.data) {
        const rawData = res.data as any;
        const userObj = rawData?.user || rawData;
        if (userObj && (userObj.id || userObj._id)) {
          return {
            id: userObj.id || userObj._id,
            name: userObj.name,
            email: userObj.email,
            role: userObj.role,
            isActive: userObj.isActive ?? true,
            createdAt: userObj.createdAt || new Date().toISOString()
          } as User;
        }
      }
      return rejectWithValue(res.message || 'Registration failed');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to register user');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async ({ userId, isActive }: { userId: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      const res = await userApi.toggleUserStatus(userId, isActive);
      if (res.success && res.data) {
        const rawData = res.data as any;
        return {
          id: rawData.id || rawData._id || userId,
          isActive: rawData.isActive ?? isActive
        };
      }
      return rejectWithValue(res.message || 'Status update failed');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update user status');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUserActionState: (state) => {
      state.actionLoading = false;
      state.actionSuccess = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || 'Error fetching users';
    });

    // Register user
    builder.addCase(registerUser.pending, (state) => {
      state.actionLoading = true;
      state.actionSuccess = false;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.actionLoading = false;
      state.actionSuccess = true;
      state.error = null;
      if (!state.users.some((u) => u.id === action.payload.id || u.email === action.payload.email)) {
        state.users.unshift(action.payload);
      }
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.actionLoading = false;
      state.actionSuccess = false;
      state.error = (action.payload as string) || 'Error registering user';
    });

    // Toggle user status
    builder.addCase(toggleUserStatus.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(toggleUserStatus.fulfilled, (state, action) => {
      state.actionLoading = false;
      state.error = null;
      const targetUser = state.users.find((u) => u.id === action.payload.id);
      if (targetUser) {
        targetUser.isActive = action.payload.isActive;
      }
    });
    builder.addCase(toggleUserStatus.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = (action.payload as string) || 'Error updating user status';
    });
  }
});

export const { resetUserActionState } = userSlice.actions;
export default userSlice.reducer;
