import apiClient from '../../services/api/apiClient';
import type { ParseManifestResponse } from './ai.types';

export const parseManifestApi = async (manifestText: string): Promise<ParseManifestResponse> => {
  const response = await apiClient.post<ParseManifestResponse>('/ai/parse-manifest', {
    manifestText
  });
  return response.data;
};
