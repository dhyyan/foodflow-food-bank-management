import apiClient from '../../services/api/apiClient';
import type { ApiResponse } from '../../types/api';
import type { LoginDto, AuthResponseData, User } from '../../types/user';

export const authApi = {
  login: async (credentials: LoginDto): Promise<ApiResponse<AuthResponseData>> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', credentials);
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data;
  }
};
