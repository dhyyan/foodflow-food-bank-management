import apiClient from '../../services/api/apiClient';
import type {
  CreateDonationPayload,
  DonationRecord,
  DonationDetailsResponse,
  DonationFilterParams
} from './donation.types';

export const donationApi = {
  createDonation: async (
    payload: CreateDonationPayload
  ): Promise<{ donation: DonationRecord; lots: any[] }> => {
    const response = await apiClient.post('/donations', payload);
    return response.data.data;
  },

  getDonations: async (
    params?: DonationFilterParams
  ): Promise<{ donations: DonationRecord[]; total: number; page: number; limit: number }> => {
    const response = await apiClient.get('/donations', { params });
    return response.data.data;
  },

  getDonationById: async (id: string): Promise<DonationDetailsResponse> => {
    const response = await apiClient.get(`/donations/${id}`);
    return response.data.data;
  }
};
