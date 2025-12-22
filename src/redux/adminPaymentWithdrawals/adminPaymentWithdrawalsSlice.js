import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  downloadFile,
  getAdminPaymentWithdrawalsAPI,
  exportAdminPaymentWithdrawalsAPI,
  updateWithdrawalsAPI,
} from '@/apis/apis';
import {
  getAdminPaymentWithdrawalsFilter,
  isAdminPaymentWithdrawalsFetchedAlready,
} from './adminPaymentWithdrawalsSelectors';
import { showToast } from '@/utils/toast';
import {
  createQueryString,
  formatEndDate,
  formatStartDate,
} from '@/utils/helper';
import { replaceRoute } from '@/utils/routing';
import { setPreviousRouteParams } from '@/redux/extraData/extraDataSlice';

export const initialFilterState = {
  startDate: null,
  endDate: null,
  page: 1,
  limit: 10,
  status: null,
  search: null,
};

const initialState = {
  isExporting: false,
  isAdminPaymentWithdrawalsFetchedAlready: false,
  selectedWithdrawalIds: {},
  adminPaymentWithdrawalsFilters: initialFilterState,
  adminPaymentWithdrawalsData: {},
  showWithdrawalEditModal: false,
  isExpandAdminPaymentWithdrawalsFilter: false,
  isUpdatingWithdrawal: false,
  isUpdatingPayout: false,
};

export const createAdminPaymentWithdrawalsKey = ({
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
  if (startDate && endDate) {
    key += `_${startDate}_${endDate}`;
  }
  if (search) {
    key += `_${search}`;
  }
  return key;
};

const buildApiPayload = (filterData, payload = {}) => {
  const apiPayload = {
    page: payload.page || filterData.page,
    limit: payload.limit || filterData.limit,
  };

  const startDate = payload.startDate || filterData.startDate;
  const endDate = payload.endDate || filterData.endDate;
  if (startDate && endDate) {
    apiPayload.startDate = startDate;
    apiPayload.endDate = endDate;
  }

  const status = payload.status || filterData.status;
  if (status) {
    apiPayload.status = status;
  }
  const search = payload.search || filterData.search;
  if (search) {
    apiPayload.search = search;
  }

  return apiPayload;
};

const updatePaymentWithdrawalsRouteParams = (apiPayload, dispatch) => {
  const searchStr = createQueryString('', {
    page: apiPayload?.page,
    limit: apiPayload?.limit,
    startDate: formatStartDate(apiPayload?.startDate, true),
    endDate: formatEndDate(apiPayload?.endDate, true),
    status: apiPayload?.status,
    search: apiPayload?.search,
  });
  const lastRouteUrl = `/dashboard/admin/withdrawals${searchStr ? `?${searchStr}` : ''}`;
  replaceRoute(lastRouteUrl, true);
  dispatch(setPreviousRouteParams({ PaymentWithdrawals: lastRouteUrl }));
};

export const getAdminPaymentWithdrawals = createAsyncThunk(
  'paymentWithdrawals/getAdminPaymentWithdrawals',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const paymentWithdrawalsFilter =
        getAdminPaymentWithdrawalsFilter(currentState);
      const filterData = paymentWithdrawalsFilter || {};

      const apiPayload = buildApiPayload(filterData, payload);

      key = createAdminPaymentWithdrawalsKey(apiPayload);

      const isFetchedAlready =
        isAdminPaymentWithdrawalsFetchedAlready(currentState);
      if (isFetchedAlready[key] && !payload?.isForceRefresh) {
        updatePaymentWithdrawalsRouteParams(apiPayload, dispatch);
        return;
      }

      dispatch(setPaymentWithdrawalsLoading({ key, value: true }));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }

      const resp = await getAdminPaymentWithdrawalsAPI(apiPayload);

      const paymentWithdrawalsData = resp.data?.items;
      const paymentWithdrawalsMetaData = resp.data?.meta;

      if (paymentWithdrawalsData && Array.isArray(paymentWithdrawalsData)) {
        updatePaymentWithdrawalsRouteParams(apiPayload, dispatch);
        dispatch(
          setAdminPaymentWithdrawals({
            key,
            value: {
              adminPaymentWithdrawals: paymentWithdrawalsData,
              adminPaymentWithdrawalsPagination: paymentWithdrawalsMetaData,
            },
          }),
        );
        dispatch(
          setIsAdminPaymentWithdrawalsFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error(
          'Something went wrong in get admin payment withdrawals',
        );
      }
    } catch (e) {
      console.error('Error in getAdminPaymentWithdrawals', e);
      dispatch(setPaymentWithdrawalsLoading({ key, value: false }));
      showToast({
        type: 'errorToast',
        error: e,
        title: 'Error in get admin payment withdrawals',
      });
    }
  },
);

export const updatePaymentWithdrawals = createAsyncThunk(
  'withdrawals/updatePaymentWithdrawals',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getAdminPaymentWithdrawalsFilter(currentState);
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
      const key = createAdminPaymentWithdrawalsKey(keyPayload);
      dispatch(setIsUpdatingWithdrawal(true));
      toastId = showToast({
        type: 'progressToast',
        title: 'Updating Withdrawal',
      });
      const resp = await updateWithdrawalsAPI(payload);
      const data = resp?.data;
      showToast({
        type: 'successToast',
        title: 'Withdrawals updated successfully',
        toastId,
      });
      // dispatch(resetSelectedWithdrawals());
      dispatch(updateWithdrawalData({ key, value: data }));
      dispatch(setIsUpdatingWithdrawal(false));
      dispatch(setShowEditWithdrawalModal(false));
    } catch (e) {
      console.error('Error in updateWithdrawals', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
      dispatch(setIsUpdatingWithdrawal(false));
    }
  },
);

export const exportAdminPaymentWithdrawals = createAsyncThunk(
  'adminPaymentWithdrawals/exportAdminPaymentWithdrawals',
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      toastId = showToast({
        type: 'progressToast',
        title: 'Exporting',
      });
      const currentState = thunkAPI.getState();
      const filterData = getAdminPaymentWithdrawalsFilter(currentState);
      const apiPayload = buildApiPayload(filterData);

      dispatch(setIsAdminPaymentWithdrawalsExporting(true));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await exportAdminPaymentWithdrawalsAPI(apiPayload);
      const url = resp.data?.url;
      if (url) {
        downloadFile(url);
        dispatch(setIsAdminPaymentWithdrawalsExporting(false));
        showToast({
          type: 'successToast',
          title: 'Successfully exported',
          toastId,
        });
      } else {
        throw new Error('Something went wrong in export payment withdrawals');
      }
    } catch (e) {
      console.error('Error in exportAdminPaymentWithdrawals', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
      dispatch(setIsAdminPaymentWithdrawalsExporting(false));
    }
  },
);

export const adminPaymentWithdrawalsSlice = createSlice({
  name: 'adminPaymentWithdrawals',
  initialState,
  reducers: {
    setPaymentWithdrawalsLoading(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousPaymentWithdrawalsData =
        state?.adminPaymentWithdrawalsData[key] || {};
      state.adminPaymentWithdrawalsData[key] = {
        ...previousPaymentWithdrawalsData,
        isLoading: value,
      };
    },
    setAdminPaymentWithdrawals(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousPaymentWithdrawalsData =
        state?.adminPaymentWithdrawalsData[key] || {};
      state.adminPaymentWithdrawalsData[key] = {
        ...previousPaymentWithdrawalsData,
        isLoading: false,
        adminPaymentWithdrawals: value?.adminPaymentWithdrawals,
        adminPaymentWithdrawalsPagination:
          value?.adminPaymentWithdrawalsPagination,
      };
    },
    setIsAdminPaymentWithdrawalsFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousIsAlreadyFetch =
        state?.isAdminPaymentWithdrawalsFetchedAlready || {};
      state.isAdminPaymentWithdrawalsFetchedAlready = {
        ...previousIsAlreadyFetch,
        [key]: value,
      };
    },
    setIsExpandAdminPaymentWithdrawalsFilter(state, { payload }) {
      state.isExpandAdminPaymentWithdrawalsFilter = payload;
    },
    setAdminPaymentWithdrawalsFilters(state, { payload }) {
      const previousFilters =
        state?.adminPaymentWithdrawalsFilters || initialFilterState;
      state.adminPaymentWithdrawalsFilters = {
        ...previousFilters,
        ...payload,
      };
    },
    setIsAdminPaymentWithdrawalsExporting(state, { payload }) {
      state.isExporting = payload;
    },
    setShowEditWithdrawalModal(state, { payload }) {
      state.showWithdrawalEditModal = payload;
    },
    resetSelectedWithdrawals(state) {
      state.selectedWithdrawalIds = {};
      state.isMultiWithdrawalSelectEnable = false;
    },
    updateWithdrawalData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousWithdrawalData =
        state?.adminPaymentWithdrawalsData?.[key]?.adminPaymentWithdrawals ||
        [];
      const foundIndex = previousWithdrawalData?.findIndex(
        item => item?._id === value?._id,
      );
      if (foundIndex !== -1) {
        previousWithdrawalData[foundIndex] = value;
        state.adminPaymentWithdrawalsData[key].adminPaymentWithdrawals = [
          ...previousWithdrawalData,
        ];
      }
    },
    setIsUpdatingWithdrawal(state, { payload }) {
      state.isUpdatingWithdrawal = payload;
    },
  },
});

export const {
  setAdminPaymentWithdrawals,
  setIsAdminPaymentWithdrawalsFetchedAlready,
  setPaymentWithdrawalsLoading,
  setIsExpandAdminPaymentWithdrawalsFilter,
  setAdminPaymentWithdrawalsFilters,
  setIsAdminPaymentWithdrawalsExporting,
  setShowEditWithdrawalModal,
  resetSelectedWithdrawals,
  setIsUpdatingWithdrawal,
  updateWithdrawalData,
} = adminPaymentWithdrawalsSlice.actions;

export default adminPaymentWithdrawalsSlice.reducer;
