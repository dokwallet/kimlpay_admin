import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  downloadFile,
  getTelegramUsersAPI,
  exportTelegramUsersAPI,
  updateTelegramUserStatusAPI,
} from '@/apis/apis';
import {
  getAdminTelegramUserFilter,
  isAdminTelegramUsersFetchedAlready,
} from '@/redux/adminTelegramUser/adminTelegramUserSelectors';
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
  type: 'telegram',
};

const initialState = {
  isExporting: false,
  isAdminTelegramUsersFetchedAlready: {},
  adminTelegramUserFilters: initialFilterState,
  adminTelegramUsersData: {},
  isExpandAdminTelegramUserFilter: false,
};

export const createAdminTelegramUserKey = ({
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

  // Add type for telegram users
  apiPayload.type = 'telegram';

  return apiPayload;
};

const updateTelegramUserRouteParams = (apiPayload, dispatch) => {
  const searchStr = createQueryString('', {
    page: apiPayload?.page,
    limit: apiPayload?.limit,
    status: apiPayload?.status,
    startDate: formatStartDate(apiPayload?.startDate, true),
    endDate: formatEndDate(apiPayload?.endDate, true),
    search: apiPayload?.search,
  });

  const lastRouteUrl = `/dashboard/admin/telegram-users${searchStr ? `?${searchStr}` : ''}`;
  replaceRoute(lastRouteUrl, true);
  dispatch(setPreviousRouteParams({ TelegramUsers: lastRouteUrl }));
};

export const getAdminTelegramUsers = createAsyncThunk(
  'adminTelegramUser/getAdminTelegramUsers',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const telegramUserFilter = getAdminTelegramUserFilter(currentState);
      const filterData = telegramUserFilter || {};

      const apiPayload = buildApiPayload(filterData, payload);
      key = createAdminTelegramUserKey(apiPayload);

      const isFetched = isAdminTelegramUsersFetchedAlready(currentState);
      if (isFetched[key] && !payload?.isForceRefresh) {
        updateTelegramUserRouteParams(apiPayload, dispatch);
        return;
      }

      dispatch(setAdminTelegramUserLoading({ key, value: true }));

      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }

      const resp = await getTelegramUsersAPI(apiPayload);
      const telegramUserData = resp.data?.items;
      const telegramUserMetaData = resp.data?.meta;

      if (telegramUserData && Array.isArray(telegramUserData)) {
        updateTelegramUserRouteParams(apiPayload, dispatch);
        dispatch(
          setAdminTelegramUsers({
            key,
            value: {
              adminTelegramUsers: telegramUserData,
              adminTelegramUserPagination: telegramUserMetaData,
            },
          }),
        );
        dispatch(
          setIsAdminTelegramUsersFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong while fetching Telegram users');
      }
    } catch (e) {
      console.error('Error in getAdminTelegramUsers', e);
      dispatch(setAdminTelegramUserLoading({ key, value: false }));
      showToast({
        type: 'errorToast',
        error: e,
        title: 'Error in get admin Telegram users',
      });
    }
  },
);

export const updateTelegramUserStatus = createAsyncThunk(
  'user/updateUserStatus',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      const { telegramId, status } = payload;

      const currentState = thunkAPI.getState();
      const usersFilter = getAdminTelegramUserFilter(currentState);
      const filterData = usersFilter || {};
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
      const key = createAdminTelegramUserKey({
        ...keyPayload,
      });
      toastId = showToast({
        type: 'progressToast',
        title: 'Updating Status for User',
      });

      if (!telegramId || !status) {
        throw new Error('Missing userId or status');
      }

      console.log('Updating status with:', { telegramId, status });

      const resp = await updateTelegramUserStatusAPI(telegramId, status);
      const data = resp?.data;
      showToast({
        type: 'successToast',
        title: 'Telegram user status updated successfully',
        toastId,
      });
      dispatch(setAdminTelegramUsers({ key, value: data }));
      if (status || payload?.length > 1) {
        dispatch(setIsAdminTelegramUsersFetchedAlready({ key, value: false }));
        dispatch(getAdminTelegramUsers({ isForceRefresh: true }));
      } else if (data) {
        dispatch(setAdminTelegramUsers({ key, value: data }));
      }
    } catch (e) {
      console.error('Error in updateUserStatus', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
    }
  },
);

export const exportAdminTelegramUsers = createAsyncThunk(
  'adminTelegramUser/exportAdminTelegramUsers',
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      toastId = showToast({
        type: 'progressToast',
        title: 'Exporting',
      });
      const currentState = thunkAPI.getState();
      const filterData = getAdminTelegramUserFilter(currentState);
      const apiPayload = buildApiPayload(filterData);

      dispatch(setIsAdminTelegramUsersExporting(true));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await exportTelegramUsersAPI(apiPayload);
      const url = resp.data?.url;
      if (url) {
        downloadFile(url);
        dispatch(setIsAdminTelegramUsersExporting(false));
        showToast({
          type: 'successToast',
          title: 'Successfully exported',
          toastId,
        });
      } else {
        throw new Error('Something went wrong while exporting Telegram users');
      }
    } catch (e) {
      console.error('Error in exportAdminTelegramUsers', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
      dispatch(setIsAdminTelegramUsersExporting(false));
    }
  },
);

const adminTelegramUserSlice = createSlice({
  name: 'adminTelegramUser',
  initialState,
  reducers: {
    setAdminTelegramUserLoading(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousTelegramUserData = state?.adminTelegramUsersData[key] || {};
      state.adminTelegramUsersData[key] = {
        ...previousTelegramUserData,
        isLoading: value,
      };
    },
    setAdminTelegramUsers(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousTelegramUserData = state?.adminTelegramUsersData[key] || {};
      state.adminTelegramUsersData[key] = {
        ...previousTelegramUserData,
        ...value,
        isLoading: false,
      };
    },
    setIsAdminTelegramUsersFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      state.isAdminTelegramUsersFetchedAlready = {
        ...state.isAdminTelegramUsersFetchedAlready,
        [key]: value,
      };
    },
    setIsExpandAdminTelegramUserFilter(state, { payload }) {
      state.isExpandAdminTelegramUserFilter = payload;
    },
    setAdminTelegramUserFilters(state, { payload }) {
      state.adminTelegramUserFilters = {
        ...state.adminTelegramUserFilters,
        ...payload,
      };
    },
    setIsAdminTelegramUsersExporting(state, { payload }) {
      state.isExporting = payload;
    },
  },
});

export const {
  setAdminTelegramUserLoading,
  setAdminTelegramUsers,
  setIsAdminTelegramUsersFetchedAlready,
  setIsExpandAdminTelegramUserFilter,
  setAdminTelegramUserFilters,
  setIsAdminTelegramUsersExporting,
} = adminTelegramUserSlice.actions;

export default adminTelegramUserSlice;
