import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getTransactionFilesAPI } from '@/apis/apis';
import { showToast } from '@/utils/toast';
import {
  createQueryString,
  formatEndDate,
  formatStartDate,
} from '@/utils/helper';
import { replaceRoute } from '@/utils/routing';
import { setPreviousRouteParams } from '@/redux/extraData/extraDataSlice';
import {
  getTransactionFileFilter,
  isTransactionFileFetchedAlready,
} from '@/redux/transactionFile/transactionFileSelectors';

export const initialTransactionFileFilterState = {
  startDate: null,
  endDate: null,
  page: 1,
  limit: 10,
  type: '',
};

const initialState = {
  isTransactionFileFetchedAlready: {},
  transactionFileFilter: initialTransactionFileFilterState,
  transactionFileData: {},
  isExpandTransactionFilter: false,
};

export const createTransactionFileKey = ({
  page,
  limit,
  type,
  startDate,
  endDate,
}) => {
  let key = `${page}_${limit}`;
  if (type) {
    key += `_${type}`;
  }
  if (startDate && endDate) {
    key += `_${startDate}_${endDate}`;
  }
  return key;
};

const updateRouteParams = (apiPayload, dispatch) => {
  const searchStr = createQueryString('', {
    page: apiPayload?.page,
    limit: apiPayload?.limit,
    type: apiPayload?.type,
  });
  const lastRouteUrl = `/dashboard/admin/transaction-files${searchStr ? `?${searchStr}` : ''}`;
  replaceRoute(lastRouteUrl, true);
  dispatch(setPreviousRouteParams({ 'Transaction Files': lastRouteUrl }));
};

export const getTransactionFile = createAsyncThunk(
  'transactionFile/getTransactionFile',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getTransactionFileFilter(currentState);
      const type = payload?.type || filterData.type;
      const startDate = payload?.startDate || filterData.startDate;
      const endDate = payload?.endDate || filterData.endDate;

      const apiPayload = {
        page: payload?.page || filterData?.page,
        limit: payload?.limit || filterData?.limit,
      };
      if (type) {
        apiPayload.type = type;
      }
      if (startDate && endDate) {
        apiPayload.startDate = startDate;
        apiPayload.endDate = endDate;
      }

      key = createTransactionFileKey(apiPayload);
      const isFetchedAlready = isTransactionFileFetchedAlready(currentState);
      if (isFetchedAlready[key] && !payload?.isForceRefresh) {
        updateRouteParams(apiPayload, dispatch);
        return;
      }
      dispatch(setTransactionFileLoading({ key, value: true }));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await getTransactionFilesAPI(apiPayload);
      const transactionFileData = resp.data?.items;
      const transactionFileMeta = resp.data?.meta;
      if (transactionFileData && Array.isArray(transactionFileData)) {
        updateRouteParams(apiPayload, dispatch);
        dispatch(
          setTransactionFileData({
            key,
            value: {
              transactionFile: transactionFileData,
              transactionFilePagination: transactionFileMeta,
            },
          }),
        );
        dispatch(
          setIsTransactionFileFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong in get transaction file');
      }
    } catch (e) {
      console.error('Error in getTransactionFile', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setTransactionFileLoading({ key, value: false }));
      dispatch(
        setIsTransactionFileFetchedAlready({
          key,
          value: false,
        }),
      );
    }
  },
);

export const transactionFileSlice = createSlice({
  name: 'transactionFile',
  initialState,
  reducers: {
    setTransactionFileLoading(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousTransactionFileData = state?.transactionFileData[key] || {};
      state.transactionFileData[key] = {
        ...previousTransactionFileData,
        isLoading: value,
      };
    },

    setTransactionFileData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousTransactionFileData = state?.transactionFileData[key] || {};
      state.transactionFileData[key] = {
        ...previousTransactionFileData,
        isLoading: false,
        transactionFile: value?.transactionFile,
        transactionFilePagination: value?.transactionFilePagination,
      };
    },

    setIsTransactionFileFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousIsAlreadyFetch =
        state?.isTransactionFileFetchedAlready || {};
      state.isTransactionFileFetchedAlready = {
        ...previousIsAlreadyFetch,
        [key]: value,
      };
    },
    setIsExpandTransactionFileFilter(state, { payload }) {
      state.isExpandTransactionFilter = payload;
    },
    setTransactionFileFilters(state, { payload }) {
      const previousFilters =
        state?.transactionFileFilter || initialTransactionFileFilterState;
      state.transactionFileFilter = {
        ...previousFilters,
        ...payload,
      };
    },
  },
});

export const {
  setIsExpandTransactionFileFilter,
  setIsTransactionFileFetchedAlready,
  setTransactionFileData,
  setTransactionFileFilters,
  setTransactionFileLoading,
} = transactionFileSlice.actions;
