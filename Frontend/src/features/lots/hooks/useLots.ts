import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchLots,
  fetchLotById,
  fetchLotTrace,
  transitionLotStatus,
  setFilters,
  resetFilters,
  setPage,
  setSelectedLot,
  clearTrace,
  clearMessages
} from '../lotSlice';
import type { LotFilterParams, LotItem, TransitionLotStatusPayload } from '../lot.types';

const defaultFilters: LotFilterParams = {
  search: '',
  category: 'all',
  status: 'all',
  expiryStatus: 'all',
  sortBy: 'receivedDate',
  sortOrder: 'desc',
  page: 1,
  limit: 10
};

const defaultState = {
  lots: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  filters: defaultFilters,
  selectedLot: null,
  selectedTrace: null,
  loading: false,
  traceLoading: false,
  transitionLoading: false,
  error: null,
  successMessage: null
};

export const useLots = () => {
  const dispatch = useAppDispatch();
  const rawState = useAppSelector((s) => s.lots);
  const state = rawState || defaultState;
  const currentFilters = state.filters || defaultFilters;

  const loadLots = useCallback(
    (params?: LotFilterParams) => {
      dispatch(fetchLots(params ?? currentFilters));
    },
    [dispatch, currentFilters]
  );

  const loadLotById = useCallback(
    (id: string) => {
      return dispatch(fetchLotById(id)).unwrap();
    },
    [dispatch]
  );

  const loadLotTrace = useCallback(
    (id: string) => {
      return dispatch(fetchLotTrace(id)).unwrap();
    },
    [dispatch]
  );

  const performTransition = useCallback(
    (id: string, payload: TransitionLotStatusPayload) => {
      return dispatch(transitionLotStatus({ id, payload })).unwrap();
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<LotFilterParams>) => {
      dispatch(setFilters(newFilters));
      dispatch(fetchLots({ ...currentFilters, ...newFilters, page: newFilters.page ?? 1 }));
    },
    [dispatch, currentFilters]
  );

  const changePage = useCallback(
    (page: number) => {
      dispatch(setPage(page));
      dispatch(fetchLots({ ...currentFilters, page }));
    },
    [dispatch, currentFilters]
  );

  const resetFilterState = useCallback(() => {
    dispatch(resetFilters());
    dispatch(fetchLots({ page: 1, limit: 10, sortBy: 'receivedDate', sortOrder: 'desc' }));
  }, [dispatch]);

  const selectLot = useCallback(
    (lot: LotItem | null) => {
      dispatch(setSelectedLot(lot));
    },
    [dispatch]
  );

  const resetTrace = useCallback(() => {
    dispatch(clearTrace());
  }, [dispatch]);

  const resetAlerts = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  return {
    ...state,
    filters: currentFilters,
    loadLots,
    loadLotById,
    loadLotTrace,
    performTransition,
    updateFilters,
    changePage,
    resetFilterState,
    selectLot,
    resetTrace,
    resetAlerts
  };
};
