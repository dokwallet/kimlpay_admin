import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  downloadFile,
  getAdminTransactionsAPI,
  exportAdminTransactionsAPI,
} from '@/apis/apis';
import {
  getAdminTransactionFilter,
  isAdminTransactionsFetchedAlready,
} from '@/redux/adminTransaction/adminTransactionSelectors';
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
  isAdminTransactionsFetchedAlready: false,
  adminTransactionFilters: initialFilterState,
  adminTransactionsData: {},
  isExpandAdminTransactionFilter: false,
};

export const createAdminTransactionKey = ({
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

const updateTransactionRouteParams = (apiPayload, dispatch) => {
  const searchStr = createQueryString('', {
    page: apiPayload?.page,
    limit: apiPayload?.limit,
    startDate: formatStartDate(apiPayload?.startDate, true),
    endDate: formatEndDate(apiPayload?.endDate, true),
    status: apiPayload?.status,
    search: apiPayload?.search,
  });
  const lastRouteUrl = `/dashboard/admin/transactions${searchStr ? `?${searchStr}` : ''}`;
  replaceRoute(lastRouteUrl, true);
  dispatch(setPreviousRouteParams({ Transactions: lastRouteUrl }));
};

export const getAdminTransactions = createAsyncThunk(
  'transaction/getAdminTransactions',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const transactionFilter = getAdminTransactionFilter(currentState);
      const filterData = transactionFilter || {};

      const apiPayload = buildApiPayload(filterData, payload);

      key = createAdminTransactionKey(apiPayload);

      const isFetchedAlready = isAdminTransactionsFetchedAlready(currentState);
      if (isFetchedAlready[key] && !payload?.isForceRefresh) {
        updateTransactionRouteParams(apiPayload, dispatch);
        return;
      }

      dispatch(setTransactionsLoading({ key, value: true }));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }

      const resp = await getAdminTransactionsAPI(apiPayload);

      const transactionData = resp.data?.items;
      const transactionMetaData = resp.data?.meta;

      if (transactionData && Array.isArray(transactionData)) {
        updateTransactionRouteParams(apiPayload, dispatch);
        dispatch(
          setAdminTransactions({
            key,
            value: {
              adminTransactions: transactionData,
              adminTransactionPagination: transactionMetaData,
            },
          }),
        );
        dispatch(
          setIsAdminTransactionsFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong in get admin transactions');
      }
    } catch (e) {
      console.error('Error in exportAdminTransactions', e);
      dispatch(setTransactionsLoading({ key, value: false }));
      showToast({
        type: 'errorToast',
        error: e,
        title: 'Error in get admin transactions',
      });
    }
  },
);

export const exportAdminTransactions = createAsyncThunk(
  'adminTransaction/exportAdminTransactions',
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      toastId = showToast({
        type: 'progressToast',
        title: 'Exporting',
      });
      const currentState = thunkAPI.getState();
      const filterData = getAdminTransactionFilter(currentState);
      const apiPayload = buildApiPayload(filterData);

      dispatch(setIsAdminTransactionsExporting(true));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await exportAdminTransactionsAPI(apiPayload);
      const url = resp.data?.url;
      if (url) {
        downloadFile(url);
        dispatch(setIsAdminTransactionsExporting(false));
        showToast({
          type: 'successToast',
          title: 'Successfully exported',
          toastId,
        });
      } else {
        throw new Error('Something went wrong in export shipping');
      }
    } catch (e) {
      console.error('Error in exportAdminTransactions', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
      dispatch(setIsAdminTransactionsExporting(false));
    }
  },
);

export const adminTransactionSlice = createSlice({
  name: 'adminTransaction',
  initialState,
  reducers: {
    setTransactionsLoading(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousTransactionData = state?.adminTransactionsData[key] || {};
      state.adminTransactionsData[key] = {
        ...previousTransactionData,
        isLoading: value,
      };
    },
    setAdminTransactions(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousTransactionData = state?.adminTransactionsData[key] || {};
      state.adminTransactionsData[key] = {
        ...previousTransactionData,
        isLoading: false,
        adminTransactions: value?.adminTransactions,
        adminTransactionPagination: value?.adminTransactionPagination,
      };
    },
    setIsAdminTransactionsFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousIsAlreadyFetch =
        state?.isAdminTransactionsFetchedAlready || {};
      state.isAdminTransactionsFetchedAlready = {
        ...previousIsAlreadyFetch,
        [key]: value,
      };
    },
    setIsExpandAdminTransactionFilter(state, { payload }) {
      state.isExpandAdminTransactionFilter = payload;
    },
    setAdminTransactionFilters(state, { payload }) {
      const previousFilters =
        state?.adminTransactionFilters || initialFilterState;
      state.adminTransactionFilters = {
        ...previousFilters,
        ...payload,
      };
    },
    setIsAdminTransactionsExporting(state, { payload }) {
      state.isExporting = payload;
    },
  },
});

export const {
  setAdminTransactions,
  setIsAdminTransactionsFetchedAlready,
  setTransactionsLoading,
  setIsExpandAdminTransactionFilter,
  setAdminTransactionFilters,
  setIsAdminTransactionsExporting,
} = adminTransactionSlice.actions;
