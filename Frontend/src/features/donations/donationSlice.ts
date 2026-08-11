import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { donationApi } from './donationApi';
import type {
  DonationRecord,
  LotRecord,
  CreateDonationPayload,
  DonationFilterParams,
  DonationDetailsResponse
} from './donation.types';

interface DonationState {
  donations: DonationRecord[];
  total: number;
  page: number;
  limit: number;
  currentDonation: DonationRecord | null;
  currentLots: LotRecord[];
  loading: boolean;
  creating: boolean;
  detailLoading: boolean;
  error: string | null;
  createSuccess: boolean;
}

const initialState: DonationState = {
  donations: [],
  total: 0,
  page: 1,
  limit: 20,
  currentDonation: null,
  currentLots: [],
  loading: false,
  creating: false,
  detailLoading: false,
  error: null,
  createSuccess: false
};

export const fetchDonations = createAsyncThunk(
  'donations/fetchDonations',
  async (params: DonationFilterParams | undefined, { rejectWithValue }) => {
    try {
      const data = await donationApi.getDonations(params);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch donations');
    }
  }
);

export const fetchDonationById = createAsyncThunk(
  'donations/fetchDonationById',
  async (id: string, { rejectWithValue }) => {
    try {
      const data: DonationDetailsResponse = await donationApi.getDonationById(id);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch donation details');
    }
  }
);

export const createDonation = createAsyncThunk(
  'donations/createDonation',
  async (payload: CreateDonationPayload, { rejectWithValue }) => {
    try {
      const result = await donationApi.createDonation(payload);
      return result;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create donation');
    }
  }
);

const donationSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    clearCurrentDonation: (state) => {
      state.currentDonation = null;
      state.currentLots = [];
    },
    resetCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Donations List
    builder.addCase(fetchDonations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDonations.fulfilled, (state, action) => {
      state.loading = false;
      state.donations = action.payload.donations;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
    });
    builder.addCase(fetchDonations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Donation Details
    builder.addCase(fetchDonationById.pending, (state) => {
      state.detailLoading = true;
      state.error = null;
    });
    builder.addCase(fetchDonationById.fulfilled, (state, action: PayloadAction<DonationDetailsResponse>) => {
      state.detailLoading = false;
      state.currentDonation = action.payload.donation;
      state.currentLots = action.payload.lots;
    });
    builder.addCase(fetchDonationById.rejected, (state, action) => {
      state.detailLoading = false;
      state.error = action.payload as string;
    });

    // Create Donation Intake
    builder.addCase(createDonation.pending, (state) => {
      state.creating = true;
      state.error = null;
      state.createSuccess = false;
    });
    builder.addCase(createDonation.fulfilled, (state, action) => {
      state.creating = false;
      state.createSuccess = true;
      if (action.payload.donation) {
        state.donations.unshift(action.payload.donation);
        state.total += 1;
      }
    });
    builder.addCase(createDonation.rejected, (state, action) => {
      state.creating = false;
      state.error = action.payload as string;
    });
  }
});

export const { clearCurrentDonation, resetCreateSuccess, clearError } = donationSlice.actions;
export default donationSlice.reducer;
