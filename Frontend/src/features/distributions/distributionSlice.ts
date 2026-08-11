import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { distributionApi } from './distributionApi';
import type {
  Recipient,
  RecipientType,
  DistributionRecord,
  CreateDistributionPayload,
  FEFOPreviewResponse,
  DistributionFilterParams
} from './distribution.types';

interface DistributionState {
  distributions: DistributionRecord[];
  recipients: Recipient[];
  total: number;
  selectedDistribution: DistributionRecord | null;
  activePreview: FEFOPreviewResponse | null;
  loading: boolean;
  recipientsLoading: boolean;
  previewLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: DistributionState = {
  distributions: [],
  recipients: [],
  total: 0,
  selectedDistribution: null,
  activePreview: null,
  loading: false,
  recipientsLoading: false,
  previewLoading: false,
  actionLoading: false,
  error: null,
  successMessage: null
};

export const fetchRecipients = createAsyncThunk(
  'distributions/fetchRecipients',
  async (type: RecipientType | undefined, { rejectWithValue }) => {
    try {
      return await distributionApi.getRecipients(type);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch recipients');
    }
  }
);

export const fetchDistributions = createAsyncThunk(
  'distributions/fetchDistributions',
  async (params: DistributionFilterParams | undefined, { rejectWithValue }) => {
    try {
      return await distributionApi.getDistributions(params);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch distributions');
    }
  }
);

export const fetchDistributionById = createAsyncThunk(
  'distributions/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await distributionApi.getDistributionById(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to fetch distribution details');
    }
  }
);

export const createDistribution = createAsyncThunk(
  'distributions/create',
  async (payload: CreateDistributionPayload, { dispatch, rejectWithValue }) => {
    try {
      const created = await distributionApi.createDistribution(payload);
      dispatch(fetchDistributions());
      return created;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to create distribution request';
      return rejectWithValue(msg);
    }
  }
);

export const fetchFEFOPreview = createAsyncThunk(
  'distributions/previewFEFO',
  async (id: string, { rejectWithValue }) => {
    try {
      return await distributionApi.previewFEFO(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to generate FEFO preview');
    }
  }
);

export const confirmReservation = createAsyncThunk(
  'distributions/confirmReservation',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const reserved = await distributionApi.reserveStock(id);
      dispatch(fetchDistributions());
      return reserved;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to confirm stock reservation');
    }
  }
);

export const completeDistribution = createAsyncThunk(
  'distributions/complete',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      const completed = await distributionApi.completeDistribution(id);
      dispatch(fetchDistributions());
      return completed;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to complete distribution');
    }
  }
);

export const distributionSlice = createSlice({
  name: 'distributions',
  initialState,
  reducers: {
    setSelectedDistribution: (state, action: PayloadAction<DistributionRecord | null>) => {
      state.selectedDistribution = action.payload;
    },
    clearActivePreview: (state) => {
      state.activePreview = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    // Recipients
    builder.addCase(fetchRecipients.pending, (state) => {
      state.recipientsLoading = true;
    });
    builder.addCase(fetchRecipients.fulfilled, (state, action: PayloadAction<Recipient[]>) => {
      state.recipientsLoading = false;
      state.recipients = action.payload;
    });
    builder.addCase(fetchRecipients.rejected, (state) => {
      state.recipientsLoading = false;
    });

    // Distributions list
    builder.addCase(fetchDistributions.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDistributions.fulfilled, (state, action) => {
      state.loading = false;
      state.distributions = action.payload.distributions;
      state.total = action.payload.total;
    });
    builder.addCase(fetchDistributions.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Details by ID
    builder.addCase(fetchDistributionById.fulfilled, (state, action: PayloadAction<DistributionRecord>) => {
      state.selectedDistribution = action.payload;
    });

    // Create distribution
    builder.addCase(createDistribution.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(createDistribution.fulfilled, (state, action: PayloadAction<DistributionRecord>) => {
      state.actionLoading = false;
      state.successMessage = `Distribution Request #${action.payload.distributionNumber} created successfully!`;
    });
    builder.addCase(createDistribution.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // Preview FEFO
    builder.addCase(fetchFEFOPreview.pending, (state) => {
      state.previewLoading = true;
      state.error = null;
    });
    builder.addCase(fetchFEFOPreview.fulfilled, (state, action: PayloadAction<FEFOPreviewResponse>) => {
      state.previewLoading = false;
      state.activePreview = action.payload;
    });
    builder.addCase(fetchFEFOPreview.rejected, (state, action) => {
      state.previewLoading = false;
      state.error = action.payload as string;
    });

    // Confirm reservation
    builder.addCase(confirmReservation.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(confirmReservation.fulfilled, (state, action: PayloadAction<DistributionRecord>) => {
      state.actionLoading = false;
      state.activePreview = null;
      state.selectedDistribution = action.payload;
      state.successMessage = `Inventory successfully reserved for Distribution #${action.payload.distributionNumber}!`;
    });
    builder.addCase(confirmReservation.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // Complete distribution
    builder.addCase(completeDistribution.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(completeDistribution.fulfilled, (state, action: PayloadAction<DistributionRecord>) => {
      state.actionLoading = false;
      state.selectedDistribution = action.payload;
      state.successMessage = `Distribution #${action.payload.distributionNumber} completed and items handed out!`;
    });
    builder.addCase(completeDistribution.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });
  }
});

export const { setSelectedDistribution, clearActivePreview, clearMessages } = distributionSlice.actions;
export default distributionSlice.reducer;
