import { createSlice } from '@reduxjs/toolkit';

const previousRouteParams = {
  Cards: '',
  Transactions: '',
  Settings: '',
  Topup: '',
  Deposit: '',
  Kyc: '',
};

const initialState = {
  isReduxStoreLoaded: false,
  routeStateData: false,
  isSidebarCollapsed: false,
  previousRouteParams,
  showScheduleMaintenance: true,
};

export const extraDataSlice = createSlice({
  name: 'extraData',
  initialState,
  reducers: {
    setReduxStoreLoaded(state, { payload }) {
      state.isReduxStoreLoaded = payload;
    },
    setRouteStateData(state, { payload }) {
      state.routeStateData = { ...state.routeStateData, ...payload };
    },
    setSidebarCollapsed(state, { payload }) {
      state.isSidebarCollapsed = payload;
    },
    setPreviousRouteParams(state, { payload }) {
      state.previousRouteParams = { ...state.previousRouteParams, ...payload };
    },
    setShowScheduleMaintenance(state, { payload }) {
      state.showScheduleMaintenance = payload;
    },
    resetPreviousRouteParams(state) {
      state.previousRouteParams = previousRouteParams;
    },
  },
});

export const {
  setReduxStoreLoaded,
  setRouteStateData,
  setSidebarCollapsed,
  resetPreviousRouteParams,
  setPreviousRouteParams,
  setShowScheduleMaintenance,
} = extraDataSlice.actions;
