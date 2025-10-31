import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  downloadFile,
  exportPayoutAPI,
  getPayoutAPI,
  updatePayoutAPI,
} from '@/apis/apis';
import { showToast } from '@/utils/toast';
import {
  createQueryString,
  formatEndDate,
  formatStartDate,
  isValidObject,
} from '@/utils/helper';
import { replaceRoute } from '@/utils/routing';
import {
  getPayoutFilter,
  isPayoutFetchedAlready,
} from '@/redux/payout/payoutSelectors';
import { setPreviousRouteParams } from '@/redux/extraData/extraDataSlice';

export const initialPayoutFilterState = {
  startDate: null,
  endDate: null,
  page: 1,
  limit: 10,
  status: '',
};

const initialState = {
  isExporting: false,
  isPayoutFetchedAlready: {},
  payoutFilter: initialPayoutFilterState,
  payoutData: {},
  isExpandPayoutFilter: false,
  isMultiPayoutSelectEnable: false,
  selectedPayoutIds: {},
  showEditPayoutModal: false,
  isUpdatingPayout: false,
};

export const createPayoutKey = ({
  page,
  limit,
  status,
  startDate,
  endDate,
  search,
}) => {
  let key = `${page}_${limit}`;
  if (status) {
    key += `_${status}`;
  }
  if (status) {
    key += `_${status}`;
  }
  if (startDate && endDate) {
    key += `_${startDate}_${endDate}`;
  }
  if (search) {
    key += `_${search}`;
  }
  return key;
};

const updateRouteParams = (apiPayload, dispatch) => {
  const searchStr = createQueryString('', {
    page: apiPayload?.page,
    limit: apiPayload?.limit,
    status: apiPayload?.status,
    startDate: formatStartDate(apiPayload?.startDate, true),
    endDate: formatEndDate(apiPayload?.endDate, true),
    search: apiPayload?.search,
  });
  const lastRouteUrl = `/dashboard/admin/payout${searchStr ? `?${searchStr}` : ''}`;
  replaceRoute(lastRouteUrl, true);
  dispatch(setPreviousRouteParams({ 'Payout Request': lastRouteUrl }));
};

export const getPayout = createAsyncThunk(
  'payout/getPayout',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getPayoutFilter(currentState);
      const status = payload?.status || filterData.status;
      const search = payload?.search || filterData.search;
      const startDate = payload?.startDate || filterData.startDate;
      const endDate = payload?.endDate || filterData.endDate;

      const apiPayload = {
        page: payload?.page || filterData?.page,
        limit: payload?.limit || filterData?.limit,
      };
      if (status) {
        apiPayload.status = status;
      }
      if (startDate && endDate) {
        apiPayload.startDate = startDate;
        apiPayload.endDate = endDate;
      }
      if (search) {
        apiPayload.search = search;
      }

      key = createPayoutKey(apiPayload);
      const isFetchedAlready = isPayoutFetchedAlready(currentState);
      if (isFetchedAlready[key] && !payload?.isForceRefresh) {
        updateRouteParams(apiPayload, dispatch);
        return;
      }
      dispatch(setPayoutLoading({ key, value: true }));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await getPayoutAPI(apiPayload);
      const payoutData = resp.data?.items;
      const payoutMetaData = resp.data?.meta;
      if (payoutData && Array.isArray(payoutData)) {
        updateRouteParams(apiPayload, dispatch);
        dispatch(
          setPayoutData({
            key,
            value: {
              payout: payoutData,
              payoutPagination: payoutMetaData,
            },
          }),
        );
        dispatch(
          setIsPayoutFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong in get top');
      }
    } catch (e) {
      console.error('Error in getPayout', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setPayoutLoading({ key, value: false }));
      dispatch(
        setIsPayoutFetchedAlready({
          key,
          value: false,
        }),
      );
    }
  },
);

export const updatePayout = createAsyncThunk(
  'payout/updatePayout',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getPayoutFilter(currentState);
      const status = filterData.status;
      const search = filterData.search;
      const startDate = filterData.startDate;
      const endDate = filterData.endDate;

      const keyPayload = {
        page: filterData?.page,
        limit: filterData?.limit,
      };
      if (status) {
        keyPayload.status = status;
      }
      if (startDate && endDate) {
        keyPayload.startDate = startDate;
        keyPayload.endDate = endDate;
      }
      if (search) {
        keyPayload.search = search;
      }
      const key = createPayoutKey(keyPayload);
      dispatch(setIsUpdatingPayout(true));
      toastId = showToast({
        type: 'progressToast',
        title: 'Updating Payout',
      });
      const resp = await updatePayoutAPI(payload);
      const data = resp?.data;
      showToast({
        type: 'successToast',
        title: 'Payout updated successfully',
        toastId,
      });
      dispatch(resetSelectedPayout());
      dispatch(updatePayoutData({ key, value: data }));
      dispatch(setIsUpdatingPayout(false));
      dispatch(setShowEditPayoutModal(false));
    } catch (e) {
      console.error('Error in updatePayout', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
      dispatch(setIsUpdatingPayout(false));
    }
  },
);

export const exportPayout = createAsyncThunk(
  'payout/exportPayout',
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      toastId = showToast({
        type: 'progressToast',
        title: 'Exporting',
      });
      const currentState = thunkAPI.getState();
      const filterData = getPayoutFilter(currentState);
      const status = filterData?.status;
      const search = filterData?.search;
      const startDate = filterData.startDate;
      const endDate = filterData.endDate;

      const apiPayload = {};
      if (status) {
        apiPayload.status = status;
      }
      if (startDate && endDate) {
        apiPayload.startDate = startDate;
        apiPayload.endDate = endDate;
      }
      if (search) {
        apiPayload.search = search;
      }
      dispatch(setIsPayoutExporting(true));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await exportPayoutAPI(apiPayload);
      const url = resp.data?.url;
      if (url) {
        downloadFile(url);
        dispatch(setIsPayoutExporting(false));
        showToast({
          type: 'successToast',
          title: 'Successfully exported',
          toastId,
        });
      } else {
        throw new Error('Something went wrong in export payout');
      }
    } catch (e) {
      console.error('Error in exportPayout', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
      dispatch(setIsPayoutExporting(false));
    }
  },
);

export const payoutSlice = createSlice({
  name: 'payout',
  initialState,
  reducers: {
    setPayoutLoading(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousPayoutData = state?.payoutData[key] || {};
      state.payoutData[key] = {
        ...previousPayoutData,
        isLoading: value,
      };
    },

    setPayoutData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousPayoutData = state?.payoutData[key] || {};
      state.payoutData[key] = {
        ...previousPayoutData,
        isLoading: false,
        payout: value?.payout,
        payoutPagination: value?.payoutPagination,
      };
    },

    updatePayoutData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousPayoutData = state?.payoutData?.[key]?.payout || [];
      const foundIndex = previousPayoutData?.findIndex(
        item => item?._id === value?._id,
      );
      if (foundIndex !== -1) {
        previousPayoutData[foundIndex] = value;
        state.payoutData[key].payout = [...previousPayoutData];
      }
    },

    setIsPayoutFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousIsAlreadyFetch = state?.isPayoutFetchedAlready || {};
      state.isPayoutFetchedAlready = {
        ...previousIsAlreadyFetch,
        [key]: value,
      };
    },
    resetIsPayoutFetchedAlready(state) {
      state.isPayoutFetchedAlready = {};
    },
    setPayoutFilters(state, { payload }) {
      const previousFilters = state?.payoutFilter || initialPayoutFilterState;
      state.payoutFilter = {
        ...previousFilters,
        ...payload,
      };
      state.selectedPayoutIds = {};
      state.isMultiPayoutSelectEnable = false;
    },
    setIsExpandPayoutFilter(state, { payload }) {
      state.isExpandPayoutFilter = payload;
    },
    setIsPayoutExporting(state, { payload }) {
      state.isExporting = payload;
    },
    toggleSelectMultiplePayout(state) {
      if (state.isMultiPayoutSelectEnable) {
        state.selectedPayoutIds = {};
      }
      state.isMultiPayoutSelectEnable = !state.isMultiPayoutSelectEnable;
    },
    toggleSelectedPayoutIds(state, { payload }) {
      const tempSelectedPayoutIds = { ...state.selectedPayoutIds };
      if (tempSelectedPayoutIds[payload]) {
        delete tempSelectedPayoutIds[payload];
      } else {
        tempSelectedPayoutIds[payload] = true;
      }
      state.selectedPayoutIds = tempSelectedPayoutIds;
    },
    resetSelectedPayout(state) {
      state.selectedPayoutIds = {};
      state.isMultiPayoutSelectEnable = false;
    },
    setSelectedPayoutIds(state, { payload }) {
      if (isValidObject(payload)) {
        state.selectedPayoutIds = payload;
      } else {
        console.warn('payload is not object');
      }
    },
    setShowEditPayoutModal(state, { payload }) {
      state.showEditPayoutModal = payload;
    },
    setIsUpdatingPayout(state, { payload }) {
      state.isUpdatingPayout = payload;
    },
    resetPayout() {
      return initialState;
    },
  },
});

export const {
  resetPayout,
  resetIsPayoutFetchedAlready,
  setIsExpandPayoutFilter,
  setIsPayoutExporting,
  setIsPayoutFetchedAlready,
  setPayoutData,
  setPayoutFilters,
  setPayoutLoading,
  updatePayoutData,
  toggleSelectMultiplePayout,
  toggleSelectedPayoutIds,
  setSelectedPayoutIds,
  resetSelectedPayout,
  setShowEditPayoutModal,
  setIsUpdatingPayout,
} = payoutSlice.actions;
