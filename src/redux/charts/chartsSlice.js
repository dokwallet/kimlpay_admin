import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { showToast } from '@/utils/toast';
import { setPreviousRouteParams } from '@/redux/extraData/extraDataSlice';
import {
  createQueryString,
  formatEndDate,
  formatStartDate,
} from '@/utils/helper';
import { replaceRoute } from '@/utils/routing';
import {
  getUsersChartAPI,
  getEarningsChartAPI,
  getDepositChartAPI,
  getDepositsChartAPI,
  getReapInvoiceChartAPI,
} from '@/apis/apis';
import {
  getChartFilter,
  isUsersChartFetchedAlready,
  isEarningsChartFetchedAlready,
  isDepositChartFetchedAlready,
  isReapInvoiceChartFetchedAlready,
} from './chartsSelectors';

export const initialChartFilterState = {
  startDate: null,
  endDate: null,
  type: 'monthly',
};

const initialState = {
  chartFilter: initialChartFilterState,
  kycChartData: {},
  earningsChartData: {},
  depositChartData: {},
  isUsersChartFetchedAlready: {},
  isEarningsChartFetchedAlready: {},
  isDepositChartFetchedAlready: {},
  reapInvoiceChartData: {},
  isReapInvoiceChartFetchedAlready: false,
};

export const createChartKey = ({ type, startDate, endDate }) => {
  let key = '';
  if (type) {
    key += `_${type}`;
  }
  if (startDate && endDate) {
    key += `_${startDate}_${endDate}`;
  }

  return key;
};

const updateRouteParams = (apiPayload, dispatch) => {
  if (apiPayload.startDate || apiPayload.endDate || apiPayload.type) {
    const queryString = createQueryString('', {
      startDate: formatStartDate(apiPayload?.startDate, true),
      endDate: formatEndDate(apiPayload?.endDate, true),
      type: apiPayload?.type,
    });
    if (queryString) {
      dispatch(
        setPreviousRouteParams({
          route: 'Charts',
          params: queryString,
        }),
      );
      replaceRoute(`/dashboard/admin/charts?${queryString}`);
    }
  }
};

export const getUsersChart = createAsyncThunk(
  'user/getUsersChart',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getChartFilter(currentState);
      const startDate = payload?.startDate || filterData.startDate;
      const endDate = payload?.endDate || filterData.endDate;
      const type = payload?.type || filterData.type;
      const apiPayload = {};
      if (startDate && endDate) {
        apiPayload.startDate = startDate;
        apiPayload.endDate = endDate;
      }
      if (type) {
        apiPayload.type = type;
      }
      key = createChartKey(apiPayload);
      const isFetchedAlready = isUsersChartFetchedAlready(currentState);
      if (isFetchedAlready[key] && !payload?.isForceRefresh) {
        updateRouteParams(apiPayload, dispatch);
        return;
      }

      if (apiPayload?.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }

      dispatch(setUsersChartLoading({ key, value: true }));
      const resp = await getUsersChartAPI(apiPayload);
      const chartData = resp.data;

      if (chartData) {
        updateRouteParams(apiPayload, dispatch);
        dispatch(
          setUsersChartData({
            key,
            value: {
              pieChart: chartData?.all_users,
              barChart: chartData?.users_by,
            },
          }),
        );
        dispatch(
          setIsUsersChartFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong in get users chart');
      }
    } catch (e) {
      console.error('Error in getUsers chart', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setUsersChartLoading({ key, value: false }));
      dispatch(
        setIsUsersChartFetchedAlready({
          key,
          value: false,
        }),
      );
    }
  },
);

export const getEarningsChart = createAsyncThunk(
  'user/getEarningsChart',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getChartFilter(currentState);
      const startDate = payload?.startDate || filterData.startDate;
      const endDate = payload?.endDate || filterData.endDate;
      const type = payload?.type || filterData.type;
      const apiPayload = {};
      if (startDate && endDate) {
        apiPayload.startDate = startDate;
        apiPayload.endDate = endDate;
      }
      if (type) {
        apiPayload.type = type;
      }
      key = createChartKey({ ...apiPayload });
      const isFetchedAlready = isEarningsChartFetchedAlready(currentState);
      if (isFetchedAlready[key] && !payload?.isForceRefresh) {
        return;
      }

      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      dispatch(setEarningsChartLoading({ key, value: true }));
      const resp = await getEarningsChartAPI(apiPayload);
      const chartData = resp.data;

      if (chartData) {
        dispatch(
          setEarningsChartData({
            key,
            value: {
              pieChart: chartData?.pie_chart,
              barChart: chartData?.bar_chart,
            },
          }),
        );
        dispatch(
          setIsEarningsChartFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong in get earnings chart');
      }
    } catch (e) {
      console.error('Error in getEarnings chart', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setEarningsChartLoading({ key, value: false }));
      dispatch(
        setIsEarningsChartFetchedAlready({
          key,
          value: false,
        }),
      );
    }
  },
);

export const getDepositsChart = createAsyncThunk(
  'user/getDepositsChart',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getChartFilter(currentState);
      const startDate = payload?.startDate || filterData.startDate;
      const endDate = payload?.endDate || filterData.endDate;
      const type = payload?.type || filterData.type;
      const apiPayload = {};
      if (startDate && endDate) {
        apiPayload.startDate = startDate;
        apiPayload.endDate = endDate;
      }
      if (type) {
        apiPayload.type = type;
      }
      key = createChartKey({ ...apiPayload });
      const isFetchedAlready = isDepositChartFetchedAlready(currentState);
      if (isFetchedAlready[key] && !payload?.isForceRefresh) {
        return;
      }

      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      dispatch(setDepositChartLoading({ key, value: true }));
      const resp = await getDepositsChartAPI(apiPayload);
      const chartData = resp.data;

      if (chartData) {
        dispatch(
          setDepositChartData({
            key,
            value: {
              pieChart: chartData?.pie_chart,
              barChart: chartData?.bar_chart,
            },
          }),
        );
        dispatch(
          setIsDepositChartFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong in get earnings chart');
      }
    } catch (e) {
      console.error('Error in getEarnings chart', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setDepositChartLoading({ key, value: false }));
      dispatch(
        setIsDepositChartFetchedAlready({
          key,
          value: false,
        }),
      );
    }
  },
);

export const getReapInvoicesChart = createAsyncThunk(
  'user/getReapInvoicesChart',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      const currentState = thunkAPI.getState();
      const isFetchedAlready = isReapInvoiceChartFetchedAlready(currentState);
      if (isFetchedAlready && !payload?.isForceRefresh) {
        return;
      }
      dispatch(setReapInvoiceChartLoading({ value: true }));
      const resp = await getReapInvoiceChartAPI();
      const chartData = resp.data;
      if (chartData) {
        dispatch(
          setReapInvoiceChartData({
            value: {
              pieChart: chartData?.pie_chart,
              barChart: chartData?.bar_chart,
            },
          }),
        );
        dispatch(
          setIsReapInvoiceChartFetchedAlready({
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong in get reap invoice chart api');
      }
    } catch (e) {
      console.error('Error in getReapInvoice chart api', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setReapInvoiceChartLoading({ value: false }));
      dispatch(
        setIsReapInvoiceChartFetchedAlready({
          value: false,
        }),
      );
    }
  },
);

export const chartsSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    setUsersChartData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousChartData = state?.kycChartData[key] || {};
      state.kycChartData[key] = {
        ...previousChartData,
        isLoading: false,
        pieChart: value?.pieChart,
        barChart: value?.barChart,
      };
    },
    setIsUsersChartFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousIsAlreadyFetch = state?.isUsersChartFetchedAlready || {};
      state.isUsersChartFetchedAlready = {
        ...previousIsAlreadyFetch,
        [key]: value,
      };
    },
    setUsersChartFilter(state, { payload }) {
      const previousFilters = state?.chartFilter || initialChartFilterState;
      state.chartFilter = {
        ...previousFilters,
        ...payload,
      };
    },
    setUsersChartLoading(state, { payload }) {
      const { key, value } = payload;
      const prev = state.kycChartData[key] || {};
      state.kycChartData[key] = { ...prev, isLoading: value };
    },
    setEarningsChartData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousChartData = state?.earningsChartData[key] || {};
      state.earningsChartData[key] = {
        ...previousChartData,
        isLoading: false,
        data: value,
      };
    },
    setIsEarningsChartFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousIsAlreadyFetch = state?.isEarningsChartFetchedAlready || {};
      state.isEarningsChartFetchedAlready = {
        ...previousIsAlreadyFetch,
        [key]: value,
      };
    },
    setEarningsChartLoading(state, { payload }) {
      const { key, value } = payload;
      const prev = state.earningsChartData[key] || {};
      state.earningsChartData[key] = { ...prev, isLoading: value };
    },
    setDepositChartData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousChartData = state?.depositChartData[key] || {};
      state.depositChartData[key] = {
        ...previousChartData,
        isLoading: false,
        data: value,
      };
    },
    setIsDepositChartFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousIsAlreadyFetch = state?.isDepositChartFetchedAlready || {};
      state.isDepositChartFetchedAlready = {
        ...previousIsAlreadyFetch,
        [key]: value,
      };
    },
    setDepositChartLoading(state, { payload }) {
      const { key, value } = payload;
      const prev = state.depositChartData[key] || {};
      state.depositChartData[key] = { ...prev, isLoading: value };
    },
    setReapInvoiceChartLoading(state, { payload }) {
      const { value } = payload;
      const prev = state.reapInvoiceChartData || {};
      state.reapInvoiceChartData = { ...prev, isLoading: value };
    },
    setReapInvoiceChartData(state, { payload }) {
      const value = payload?.value;
      const previousChartData = state?.reapInvoiceChartData || {};
      state.reapInvoiceChartData = {
        ...previousChartData,
        isLoading: false,
        data: value,
      };
    },
    setIsReapInvoiceChartFetchedAlready(state, { payload }) {
      const value = payload?.value;
      state.isReapInvoiceChartFetchedAlready = value;
    },
    resetCharts() {
      return initialState;
    },
  },
});

export const {
  setUsersChartData,
  setIsUsersChartFetchedAlready,
  setUsersChartFilter,
  setUsersChartLoading,
  setEarningsChartData,
  setIsEarningsChartFetchedAlready,
  setEarningsChartLoading,
  setDepositChartData,
  setIsDepositChartFetchedAlready,
  setDepositChartLoading,
  setReapInvoiceChartLoading,
  setReapInvoiceChartData,
  setIsReapInvoiceChartFetchedAlready,
  resetCharts,
} = chartsSlice.actions;

export default chartsSlice.reducer;
