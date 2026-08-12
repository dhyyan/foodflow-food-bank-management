import apiClient from '../../services/api/apiClient';
import type { ApiResponse } from '../../types/api';
import type { User, RegisterUserDto, UserFilterParams, UserPaginatedResponse } from '../../types/user';

export const userApi = {
  getUsers: async (params?: UserFilterParams): Promise<ApiResponse<UserPaginatedResponse>> => {
    const response = await apiClient.get<ApiResponse<UserPaginatedResponse>>('/auth/users', { params });
    return response.data;
  },


  registerUser: async (userData: RegisterUserDto): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.post<ApiResponse<{ user: User }>>('/auth/register', userData);
    return response.data;
  },

  toggleUserStatus: async (userId: string, isActive: boolean): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch<ApiResponse<User>>(`/auth/users/${userId}/status`, { isActive });
    return response.data;
  }
};
