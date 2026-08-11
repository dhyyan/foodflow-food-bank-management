import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { lotApi } from './lotApi';
import type {
  LotItem,
  LotFilterParams,
  LotListResponse,
  LotTraceResponse,
  TransitionLotStatusPayload
} from './lot.types';

interface LotState {
  lots: LotItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: LotFilterParams;
  selectedLot: LotItem | null;
  selectedTrace: LotTraceResponse | null;
  loading: boolean;
  traceLoading: boolean;
  transitionLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialFilters: LotFilterParams = {
  search: '',
  category: 'all',
  status: 'all',
  expiryStatus: 'all',
  sortBy: 'receivedDate',
  sortOrder: 'desc',
  page: 1,
  limit: 10
};

const initialState: LotState = {
  lots: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  filters: initialFilters,
  selectedLot: null,
  selectedTrace: null,
  loading: false,
  traceLoading: false,
  transitionLoading: false,
  error: null,
  successMessage: null
};

export const fetchLots = createAsyncThunk(
  'lots/fetchLots',
  async (params: LotFilterParams | undefined, { rejectWithValue }) => {
    try {
      return await lotApi.getLots(params);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch lots');
    }
  }
);

export const fetchLotById = createAsyncThunk(
  'lots/fetchLotById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await lotApi.getLotById(id);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch lot details');
    }
  }
);

export const fetchLotTrace = createAsyncThunk(
  'lots/fetchLotTrace',
  async (id: string, { rejectWithValue }) => {
    try {
      return await lotApi.getLotTrace(id);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch lot trace history');
    }
  }
);

export const transitionLotStatus = createAsyncThunk(
  'lots/transitionStatus',
  async (
    { id, payload }: { id: string; payload: TransitionLotStatusPayload },
    { dispatch, getState, rejectWithValue }
  ) => {
    try {
      const updatedLot = await lotApi.transitionStatus(id, payload);
      const state = getState() as { lots: LotState };
      dispatch(fetchLots(state.lots.filters));
      return updatedLot;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to transition lot status');
    }
  }
);

export const lotSlice = createSlice({
  name: 'lots',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<LotFilterParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setSelectedLot: (state, action: PayloadAction<LotItem | null>) => {
      state.selectedLot = action.payload;
    },
    clearTrace: (state) => {
      state.selectedTrace = null;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLots.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchLots.fulfilled, (state, action: PayloadAction<LotListResponse>) => {
      state.loading = false;
      state.lots = action.payload.lots;
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(fetchLots.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchLotById.fulfilled, (state, action: PayloadAction<LotItem>) => {
      state.selectedLot = action.payload;
    });

    builder.addCase(fetchLotTrace.pending, (state) => {
      state.traceLoading = true;
      state.error = null;
    });
    builder.addCase(fetchLotTrace.fulfilled, (state, action: PayloadAction<LotTraceResponse>) => {
      state.traceLoading = false;
      state.selectedTrace = action.payload;
    });
    builder.addCase(fetchLotTrace.rejected, (state, action) => {
      state.traceLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(transitionLotStatus.pending, (state) => {
      state.transitionLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(transitionLotStatus.fulfilled, (state, action: PayloadAction<LotItem>) => {
      state.transitionLoading = false;
      state.selectedLot = action.payload;
      state.successMessage = `Lot status transitioned to '${action.payload.status}' successfully!`;
    });
    builder.addCase(transitionLotStatus.rejected, (state, action) => {
      state.transitionLoading = false;
      state.error = action.payload as string;
    });
  }
});

export const {
  setFilters,
  resetFilters,
  setPage,
  setSelectedLot,
  clearTrace,
  clearMessages
} = lotSlice.actions;

export default lotSlice.reducer;
