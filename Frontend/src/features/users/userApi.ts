import apiClient from '../../services/api/apiClient';
import type { ApiResponse } from '../../types/api';
import type { User, RegisterUserDto } from '../../types/user';

export const userApi = {
  getUsers: async (): Promise<ApiResponse<{ users: User[] }>> => {
    const response = await apiClient.get<ApiResponse<{ users: User[] }>>('/auth/users');
    return response.data;
  },

  registerUser: async (userData: RegisterUserDto): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.post<ApiResponse<{ user: User }>>('/auth/register', userData);
    return response.data;
  }
};
