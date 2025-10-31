import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  downloadFile,
  exportTopupAPI,
  getTopupAPI,
  updateDepositCommissionAPI,
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
  getDepositFilter,
  isDepositFetchedAlready,
} from '@/redux/deposit/depositSelectors';
import { setPreviousRouteParams } from '@/redux/extraData/extraDataSlice';
export const initialDepositFilterState = {
  startDate: null,
  endDate: null,
  page: 1,
  limit: 10,
};

const initialState = {
  isExporting: false,
  isDepositFetchedAlready: {},
  depositFilter: initialDepositFilterState,
  depositData: {},
  isExpandDepositFilter: false,
  isMultiDepositSelectEnable: false,
  selectedDepositIds: {},
};

export const createDepositKey = ({
  page,
  limit,
  startDate,
  endDate,
  search,
}) => {
  let key = `${page}_${limit}`;
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
    startDate: formatStartDate(apiPayload?.startDate, true),
    endDate: formatEndDate(apiPayload?.endDate, true),
    search: apiPayload?.search,
  });
  const lastRouteUrl = `/dashboard/admin/deposit${searchStr ? `?${searchStr}` : ''}`;
  replaceRoute(lastRouteUrl, true);
  dispatch(setPreviousRouteParams({ Deposits: lastRouteUrl }));
};

export const getDeposit = createAsyncThunk(
  'deposit/getDeposit',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getDepositFilter(currentState);
      const search = payload?.search || filterData.search;
      const startDate = payload?.startDate || filterData.startDate;
      const endDate = payload?.endDate || filterData.endDate;

      const apiPayload = {
        page: payload?.page || filterData?.page,
        limit: payload?.limit || filterData?.limit,
      };

      if (startDate && endDate) {
        apiPayload.startDate = startDate;
        apiPayload.endDate = endDate;
      }
      if (search) {
        apiPayload.search = search;
      }

      key = createDepositKey(apiPayload);
      const isFetchedAlready = isDepositFetchedAlready(currentState);
      if (isFetchedAlready[key] && !payload?.isForceRefresh) {
        updateRouteParams(apiPayload, dispatch);
        return;
      }
      dispatch(setDepositLoading({ key, value: true }));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await getTopupAPI({ ...apiPayload, fetch_deposit: true });
      const depositData = resp.data?.items;
      const depositMetaData = resp.data?.meta;
      if (depositData && Array.isArray(depositData)) {
        updateRouteParams(apiPayload, dispatch);
        dispatch(
          setDepositData({
            key,
            value: {
              deposit: depositData,
              depositPagination: depositMetaData,
            },
          }),
        );
        dispatch(
          setIsDepositFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong in get top');
      }
    } catch (e) {
      console.error('Error in getDeposit', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setDepositLoading({ key, value: false }));
      dispatch(
        setIsDepositFetchedAlready({
          key,
          value: false,
        }),
      );
    }
  },
);

export const exportDeposit = createAsyncThunk(
  'deposit/exportDeposit',
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      toastId = showToast({
        type: 'progressToast',
        title: 'Exporting',
      });
      const currentState = thunkAPI.getState();
      const filterData = getDepositFilter(currentState);
      const search = filterData?.search;
      const startDate = filterData.startDate;
      const endDate = filterData.endDate;

      const apiPayload = {};
      if (startDate && endDate) {
        apiPayload.startDate = startDate;
        apiPayload.endDate = endDate;
      }
      if (search) {
        apiPayload.search = search;
      }
      dispatch(setIsDepositExporting(true));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await exportTopupAPI({
        ...apiPayload,
        fetch_deposit: true,
      });
      const url = resp.data?.url;
      if (url) {
        downloadFile(url);
        dispatch(setIsDepositExporting(false));
        showToast({
          type: 'successToast',
          title: 'Successfully exported',
          toastId,
        });
      } else {
        throw new Error('Something went wrong in export deposit');
      }
    } catch (e) {
      console.error('Error in exportDeposit', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
      dispatch(setIsDepositExporting(false));
    }
  },
);

export const updateDepositCommission = createAsyncThunk(
  'deposit/updateDepositCommission',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getDepositFilter(currentState);
      const search = filterData.search;
      const startDate = filterData.startDate;
      const endDate = filterData.endDate;

      const keyPayload = {
        page: filterData?.page,
        limit: filterData?.limit,
      };
      if (startDate && endDate) {
        keyPayload.startDate = startDate;
        keyPayload.endDate = endDate;
      }
      if (search) {
        keyPayload.search = search;
      }
      const key = createDepositKey(keyPayload);
      toastId = showToast({
        type: 'progressToast',
        title: 'Updating commission for Deposit',
      });
      const resp = await updateDepositCommissionAPI(payload);
      const data = resp?.data;
      showToast({
        type: 'successToast',
        title: 'Deposit commission updated successfully',
        toastId,
      });
      dispatch(resetSelectedDeposit());
      if (payload?.length > 1) {
        dispatch(resetIsDepositFetchedAlready());
        dispatch(getDeposit({ isForceRefresh: true }));
      } else if (data) {
        dispatch(updateDepositData({ key, value: data }));
      }
    } catch (e) {
      console.error('Error in updateDepositStatus', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
    }
  },
);

export const depositSlice = createSlice({
  name: 'deposit',
  initialState,
  reducers: {
    setDepositLoading(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousDepositData = state?.depositData[key] || {};
      state.depositData[key] = {
        ...previousDepositData,
        isLoading: value,
      };
    },

    setDepositData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousDepositData = state?.depositData[key] || {};
      state.depositData[key] = {
        ...previousDepositData,
        isLoading: false,
        deposit: value?.deposit,
        depositPagination: value?.depositPagination,
      };
    },

    updateDepositData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousDepositData = state?.depositData?.[key]?.deposit || [];
      const foundIndex = previousDepositData?.findIndex(
        item => item?._id === value?._id,
      );
      if (foundIndex !== -1) {
        previousDepositData[foundIndex] = value;
        state.depositData[key].deposit = [...previousDepositData];
      }
    },

    setIsDepositFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousIsAlreadyFetch = state?.isDepositFetchedAlready || {};
      state.isDepositFetchedAlready = {
        ...previousIsAlreadyFetch,
        [key]: value,
      };
    },
    resetIsDepositFetchedAlready(state) {
      state.isDepositFetchedAlready = {};
    },
    setDepositFilters(state, { payload }) {
      const previousFilters = state?.depositFilter || initialDepositFilterState;
      state.depositFilter = {
        ...previousFilters,
        ...payload,
      };
      state.selectedDepositIds = {};
      state.isMultiDepositSelectEnable = false;
    },
    setIsExpandDepositFilter(state, { payload }) {
      state.isExpandDepositFilter = payload;
    },
    setIsDepositExporting(state, { payload }) {
      state.isExporting = payload;
    },
    toggleSelectMultipleDeposit(state) {
      if (state.isMultiDepositSelectEnable) {
        state.selectedDepositIds = {};
      }
      state.isMultiDepositSelectEnable = !state.isMultiDepositSelectEnable;
    },
    toggleSelectedDepositIds(state, { payload }) {
      const tempSelectedDepositIds = { ...state.selectedDepositIds };
      if (tempSelectedDepositIds[payload]) {
        delete tempSelectedDepositIds[payload];
      } else {
        tempSelectedDepositIds[payload] = true;
      }
      state.selectedDepositIds = tempSelectedDepositIds;
    },
    resetSelectedDeposit(state) {
      state.selectedDepositIds = {};
      state.isMultiDepositSelectEnable = false;
    },
    setSelectedDepositIds(state, { payload }) {
      if (isValidObject(payload)) {
        state.selectedDepositIds = payload;
      } else {
        console.warn('payload is not object');
      }
    },
    resetDeposit() {
      return initialState;
    },
  },
});

export const {
  resetDeposit,
  resetIsDepositFetchedAlready,
  setIsExpandDepositFilter,
  setIsDepositExporting,
  setIsDepositFetchedAlready,
  setDepositData,
  setDepositFilters,
  setDepositLoading,
  updateDepositData,
  toggleSelectMultipleDeposit,
  toggleSelectedDepositIds,
  setSelectedDepositIds,
  resetSelectedDeposit,
} = depositSlice.actions;
