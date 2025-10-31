import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  downloadFile,
  exportTopupAPI,
  getTopupAPI,
  updateTopupStatusAPI,
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
  getTopupFilter,
  isTopupFetchedAlready,
} from '@/redux/topup/topupSelectors';
import { setPreviousRouteParams } from '@/redux/extraData/extraDataSlice';

export const initialTopupFilterState = {
  startDate: null,
  endDate: null,
  page: 1,
  limit: 10,
  status: '',
};

const initialState = {
  isExporting: false,
  isTopupFetchedAlready: {},
  topupFilter: initialTopupFilterState,
  topupData: {},
  isExpandTopupFilter: false,
  isMultiTopupSelectEnable: false,
  selectedTopupIds: {},
};

export const createTopupKey = ({
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
  const lastRouteUrl = `/dashboard/admin/topup${searchStr ? `?${searchStr}` : ''}`;
  replaceRoute(lastRouteUrl, true);
  dispatch(setPreviousRouteParams({ 'Topup Request': lastRouteUrl }));
};

export const getTopup = createAsyncThunk(
  'topup/getTopup',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getTopupFilter(currentState);
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

      key = createTopupKey(apiPayload);
      const isFetchedAlready = isTopupFetchedAlready(currentState);
      if (isFetchedAlready[key] && !payload?.isForceRefresh) {
        updateRouteParams(apiPayload, dispatch);
        return;
      }
      dispatch(setTopupLoading({ key, value: true }));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await getTopupAPI(apiPayload);
      const topupData = resp.data?.items;
      const topupMetaData = resp.data?.meta;
      if (topupData && Array.isArray(topupData)) {
        updateRouteParams(apiPayload, dispatch);
        dispatch(
          setTopupData({
            key,
            value: {
              topup: topupData,
              topupPagination: topupMetaData,
            },
          }),
        );
        dispatch(
          setIsTopupFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong in get top');
      }
    } catch (e) {
      console.error('Error in getTopup', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setTopupLoading({ key, value: false }));
      dispatch(
        setIsTopupFetchedAlready({
          key,
          value: false,
        }),
      );
    }
  },
);

export const updateTopupStatus = createAsyncThunk(
  'topup/updateTopupStatus',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getTopupFilter(currentState);
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
      const key = createTopupKey(keyPayload);
      toastId = showToast({
        type: 'progressToast',
        title: 'Updating Status for Deposit',
      });
      const finalPayload = {
        topupObj: payload,
      };
      const resp = await updateTopupStatusAPI(finalPayload);
      const data = resp?.data;
      showToast({
        type: 'successToast',
        title: 'Deposit status updated successfully',
        toastId,
      });
      dispatch(resetSelectedTopup());
      if (status || payload?.length > 1) {
        dispatch(resetIsTopupFetchedAlready());
        dispatch(getTopup({ isForceRefresh: true }));
      } else if (data) {
        dispatch(updateTopupData({ key, value: data }));
      }
    } catch (e) {
      console.error('Error in updateTopupStatus', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
    }
  },
);

export const exportTopup = createAsyncThunk(
  'topup/exportTopup',
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      toastId = showToast({
        type: 'progressToast',
        title: 'Exporting',
      });
      const currentState = thunkAPI.getState();
      const filterData = getTopupFilter(currentState);
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
      dispatch(setIsTopupExporting(true));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await exportTopupAPI(apiPayload);
      const url = resp.data?.url;
      if (url) {
        downloadFile(url);
        dispatch(setIsTopupExporting(false));
        showToast({
          type: 'successToast',
          title: 'Successfully exported',
          toastId,
        });
      } else {
        throw new Error('Something went wrong in export topup');
      }
    } catch (e) {
      console.error('Error in exportTopup', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
      dispatch(setIsTopupExporting(false));
    }
  },
);

export const topupSlice = createSlice({
  name: 'topup',
  initialState,
  reducers: {
    setTopupLoading(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousTopupData = state?.topupData[key] || {};
      state.topupData[key] = {
        ...previousTopupData,
        isLoading: value,
      };
    },

    setTopupData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousTopupData = state?.topupData[key] || {};
      state.topupData[key] = {
        ...previousTopupData,
        isLoading: false,
        topup: value?.topup,
        topupPagination: value?.topupPagination,
      };
    },

    updateTopupData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousTopupData = state?.topupData?.[key]?.topup || [];
      const foundIndex = previousTopupData?.findIndex(
        item => item?._id === value?._id,
      );
      if (foundIndex !== -1) {
        previousTopupData[foundIndex] = value;
        state.topupData[key].topup = [...previousTopupData];
      }
    },

    setIsTopupFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousIsAlreadyFetch = state?.isTopupFetchedAlready || {};
      state.isTopupFetchedAlready = {
        ...previousIsAlreadyFetch,
        [key]: value,
      };
    },
    resetIsTopupFetchedAlready(state) {
      state.isTopupFetchedAlready = {};
    },
    setTopupFilters(state, { payload }) {
      const previousFilters = state?.topupFilter || initialTopupFilterState;
      state.topupFilter = {
        ...previousFilters,
        ...payload,
      };
      state.selectedTopupIds = {};
      state.isMultiTopupSelectEnable = false;
    },
    setIsExpandTopupFilter(state, { payload }) {
      state.isExpandTopupFilter = payload;
    },
    setIsTopupExporting(state, { payload }) {
      state.isExporting = payload;
    },
    toggleSelectMultipleTopup(state) {
      if (state.isMultiTopupSelectEnable) {
        state.selectedTopupIds = {};
      }
      state.isMultiTopupSelectEnable = !state.isMultiTopupSelectEnable;
    },
    toggleSelectedTopupIds(state, { payload }) {
      const tempSelectedTopupIds = { ...state.selectedTopupIds };
      if (tempSelectedTopupIds[payload]) {
        delete tempSelectedTopupIds[payload];
      } else {
        tempSelectedTopupIds[payload] = true;
      }
      state.selectedTopupIds = tempSelectedTopupIds;
    },
    resetSelectedTopup(state) {
      state.selectedTopupIds = {};
      state.isMultiTopupSelectEnable = false;
    },
    setSelectedTopupIds(state, { payload }) {
      if (isValidObject(payload)) {
        state.selectedTopupIds = payload;
      } else {
        console.warn('payload is not object');
      }
    },
    resetTopup() {
      return initialState;
    },
  },
});

export const {
  resetTopup,
  resetIsTopupFetchedAlready,
  setIsExpandTopupFilter,
  setIsTopupExporting,
  setIsTopupFetchedAlready,
  setTopupData,
  setTopupFilters,
  setTopupLoading,
  updateTopupData,
  toggleSelectMultipleTopup,
  toggleSelectedTopupIds,
  setSelectedTopupIds,
  resetSelectedTopup,
} = topupSlice.actions;
