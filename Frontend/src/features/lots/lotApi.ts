import apiClient from '../../services/api/apiClient';
import type {
  LotFilterParams,
  LotListResponse,
  LotItem,
  LotTraceResponse,
  TransitionLotStatusPayload
} from './lot.types';

export const lotApi = {
  getLots: async (params?: LotFilterParams): Promise<LotListResponse> => {
    const response = await apiClient.get('/lots', { params });
    return response.data.data;
  },

  getLotById: async (id: string): Promise<LotItem> => {
    const response = await apiClient.get(`/lots/${id}`);
    return response.data.data;
  },

  getLotTrace: async (id: string): Promise<LotTraceResponse> => {
    const response = await apiClient.get(`/lots/${id}/trace`);
    return response.data.data;
  },

  transitionStatus: async (id: string, payload: TransitionLotStatusPayload): Promise<LotItem> => {
    const response = await apiClient.patch(`/lots/${id}/status`, payload);
    return response.data.data;
  }
};
