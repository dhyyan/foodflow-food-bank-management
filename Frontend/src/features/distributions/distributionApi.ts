import apiClient from '../../services/api/apiClient';
import type {
  Recipient,
  RecipientType,
  RecipientQuotaInfo,
  CreateRecipientInput,
  DistributionRecord,
  CreateDistributionPayload,
  FEFOPreviewResponse,
  DistributionFilterParams
} from './distribution.types';

export const distributionApi = {
  getRecipients: async (type?: RecipientType): Promise<Recipient[]> => {
    const response = await apiClient.get('/recipients', { params: { type } });
    return response.data.data;
  },

  checkRecipientQuota: async (email: string): Promise<RecipientQuotaInfo> => {
    const response = await apiClient.get('/recipients/check-quota', { params: { email } });
    return response.data.data;
  },

  createRecipient: async (data: CreateRecipientInput): Promise<Recipient> => {
    const response = await apiClient.post('/recipients', data);
    return response.data.data;
  },

  createDistribution: async (payload: CreateDistributionPayload): Promise<DistributionRecord> => {
    const response = await apiClient.post('/distributions', payload);
    return response.data.data;
  },

  getDistributions: async (
    params?: DistributionFilterParams
  ): Promise<{ distributions: DistributionRecord[]; total: number }> => {
    const response = await apiClient.get('/distributions', { params });
    return {
      distributions: response.data.data,
      total: response.data.meta?.total || response.data.data.length
    };
  },

  getDistributionById: async (id: string): Promise<DistributionRecord> => {
    const response = await apiClient.get(`/distributions/${id}`);
    return response.data.data;
  },

  previewFEFO: async (id: string): Promise<FEFOPreviewResponse> => {
    const response = await apiClient.post(`/distributions/${id}/preview`);
    return response.data.data;
  },

  reserveStock: async (id: string): Promise<DistributionRecord> => {
    const response = await apiClient.post(`/distributions/${id}/reserve`);
    return response.data.data;
  },

  completeDistribution: async (id: string): Promise<DistributionRecord> => {
    const response = await apiClient.post(`/distributions/${id}/complete`);
    return response.data.data;
  }
};
