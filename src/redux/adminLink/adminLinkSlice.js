import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAdminLinkFilter } from './adminLinkSelectors';
import { getLinksAPI, exportLinksAPI, downloadFile } from '@/apis/apis';
import { showToast } from '@/utils/toast';
import { replaceRoute } from '@/utils/routing';
import { setPreviousRouteParams } from '@/redux/extraData/extraDataSlice';
import {
  createQueryString,
  formatEndDate,
  formatStartDate,
} from '@/utils/helper';

export const initialFilterState = {
  startDate: null,
  endDate: null,
  page: 1,
  limit: 10,
  status: null,
  search: null,
  type: 'link',
};

export const createAdminLinkKey = ({
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

  // Add type for links
  apiPayload.type = 'link';

  return apiPayload;
};

const updateLinkRouteParams = (apiPayload, dispatch) => {
  const searchStr = createQueryString('', {
    page: apiPayload?.page,
    limit: apiPayload?.limit,
    status: apiPayload?.status,
    startDate: formatStartDate(apiPayload?.startDate, true),
    endDate: formatEndDate(apiPayload?.endDate, true),
    search: apiPayload?.search,
  });

  const lastRouteUrl = `/dashboard/admin/link${searchStr ? `?${searchStr}` : ''}`;
  replaceRoute(lastRouteUrl, true);
  dispatch(setPreviousRouteParams({ Links: lastRouteUrl }));
};

export const exportAdminLinks = createAsyncThunk(
  'adminLink/exportAdminLinks',
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      toastId = showToast({
        type: 'progressToast',
        title: 'Exporting',
      });
      const currentState = thunkAPI.getState();
      const filterData = getAdminLinkFilter(currentState);
      const apiPayload = buildApiPayload(filterData);

      dispatch(setIsAdminLinksExporting(true));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await exportLinksAPI(apiPayload);
      const url = resp.data?.url;
      if (url) {
        downloadFile(url);
        dispatch(setIsAdminLinksExporting(false));
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
      dispatch(setIsAdminLinksExporting(false));
    }
  },
);

export const getAdminLinks = createAsyncThunk(
  'adminLink/getAdminLinks',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const transactionFilter = getAdminLinkFilter(currentState);
      const filterData = transactionFilter || {};

      const apiPayload = buildApiPayload(filterData, payload);

      key = createAdminLinkKey(apiPayload);

      const isFetchedAlready = setIsAdminLinksFetchedAlready(currentState);
      if (isFetchedAlready[key] && !payload?.isForceRefresh) {
        updateLinkRouteParams(apiPayload, dispatch);
        return;
      }

      dispatch(setLinksLoading({ key, value: true }));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }

      const resp = await getLinksAPI(apiPayload);

      const transactionData = resp.data?.items;
      const transactionMetaData = resp.data?.meta;

      if (transactionData && Array.isArray(transactionData)) {
        updateLinkRouteParams(apiPayload, dispatch);
        dispatch(
          setAdminLinks({
            key,
            value: {
              adminLinks: transactionData,
              adminLinkPagination: transactionMetaData,
            },
          }),
        );
        dispatch(
          setIsAdminLinksFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong in get admin links');
      }
    } catch (e) {
      console.error('Error in getAdminLinks', e);
      dispatch(setLinksLoading({ key, value: false }));
      showToast({
        type: 'errorToast',
        error: e,
        title: 'Error in get admin links',
      });
    }
  },
);

const initialState = {
  adminLinksData: {},
  adminLinkFilter: initialFilterState,
  isExpandAdminLinkFilter: false,
  isLoading: false,
  error: null,
  isExporting: false,
  exportError: null,
};

const adminLinkSlice = createSlice({
  name: 'adminLink',
  initialState,
  reducers: {
    setLinksLoading(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousLinkData = state?.adminLinksData[key] || {};
      state.adminLinksData[key] = {
        ...previousLinkData,
        isLoading: value,
      };
    },
    setAdminLinks(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousLinkData = state?.adminLinksData[key] || {};
      state.adminLinksData[key] = {
        ...previousLinkData,
        ...value,
        isLoading: false,
      };
    },
    setIsAdminLinksFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      state.isAdminLinksFetchedAlready = {
        ...state.isAdminLinksFetchedAlready,
        [key]: value,
      };
    },
    setIsExpandAdminLinkFilter(state, { payload }) {
      state.isExpandAdminLinkFilter = payload;
    },
    setAdminLinkFilters(state, { payload }) {
      state.adminLinkFilter = {
        ...state.adminLinkFilter,
        ...payload,
      };
    },
    setIsAdminLinksExporting(state, { payload }) {
      state.isExporting = payload;
    },
  },
});

export const {
  setLinksLoading,
  setAdminLinks,
  setAdminLinkFilters,
  setIsExpandAdminLinkFilter,
  resetAdminLinkState,
  setIsAdminLinksFetchedAlready,
  setIsAdminLinksExporting,
} = adminLinkSlice.actions;

export default adminLinkSlice.reducer;
