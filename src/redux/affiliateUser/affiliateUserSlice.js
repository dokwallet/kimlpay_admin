import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  createAffiliateUserAPI,
  downloadFile,
  getAffiliateUsersAPI,
  exportAffiliateUserAPI,
  updateAffiliateUserAPI,
  updateAffiliateUserStatusAPI,
  updateAffiliateUserTopupCommissionAPI,
  updateAffiliateUserIdAPI,
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
  getAffiliateUserFilter,
  isAffiliateUserFetchedAlready,
} from '@/redux/affiliateUser/affiliateUserSelector';
import { setPreviousRouteParams } from '@/redux/extraData/extraDataSlice';
import {
  resetCreateAffiliateUserForm,
  setCreateAffiliateUserForm,
} from '../form/formDataSlice';

export const initialAffiliateUserFilterState = {
  startDate: null,
  endDate: null,
  page: 1,
  limit: 10,
  status: '',
  search: null,
};

const initialState = {
  isCreateAffiliateUserLoading: false,
  isExporting: false,
  isAffiliateUserFetchedAlready: {},
  affiliateUserFilter: initialAffiliateUserFilterState,
  affiliateUserData: {},
  isExpandAffiliateUserFilter: false,
  isMultiAffiliateUserSelectEnable: false,
  selectedAffiliateUserIds: {},
  affiliateOptions: null,
};

export const createAffiliateUserKey = ({
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
  const lastRouteUrl = `/dashboard/admin/affiliate-users${searchStr ? `?${searchStr}` : ''}`;
  replaceRoute(lastRouteUrl, true);
  dispatch(setPreviousRouteParams({ ['Affiliate Users']: lastRouteUrl }));
};

export const createAffiliateUser = createAsyncThunk(
  'affiliateUser/createAffiliateUser',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let progressToastId;

    try {
      progressToastId = showToast({
        type: 'progressToast',
        title: 'Submitting create affiliate user form',
      });
      dispatch(setIsCreateAffiliateUserLoading(true));

      const finalPayload = {
        ...payload,
        country: payload?.country?.countryCode || '',
      };
      const resp = await createAffiliateUserAPI(finalPayload);
      if (resp?.status === 200) {
        dispatch(
          setCreateAffiliateUserForm({ showCreateAffiliateUserModal: false }),
        );
        showToast({
          type: 'successToast',
          title: 'Add affiliate user form submitted successfully',
          toastId: progressToastId,
        });
        dispatch(setIsCreateAffiliateUserLoading(false));
        dispatch(resetCreateAffiliateUserForm());
        dispatch(getAllAffiliateUser({ isForceRefresh: true }));
      } else {
        throw new Error('Something went wrong in createAffiliateUser');
      }
    } catch (e) {
      console.error('Error in createAffiliateUser', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId: progressToastId,
      });
      dispatch(setIsCreateAffiliateUserLoading(false));
    }
  },
);

export const getAllAffiliateUser = createAsyncThunk(
  'affiliateUser/getAllAffiliateUser',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getAffiliateUserFilter(currentState);
      const status = payload?.status || filterData.status;
      const search = payload?.search || filterData.search;
      const startDate = payload?.startDate || filterData.startDate;
      const endDate = payload?.endDate || filterData.endDate;

      const apiPayload = {
        page: payload?.page || filterData?.page,
        limit: payload?.limit || filterData?.limit,
      };

      if (payload?.search) {
        apiPayload.search = payload.search;
      }

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
      key = createAffiliateUserKey(apiPayload);
      const isFetchedAlready = isAffiliateUserFetchedAlready(currentState);
      if (isFetchedAlready[key] && !payload?.isForceRefresh) {
        if (!payload?.isNotUpdateRoute) {
          updateRouteParams(apiPayload, dispatch);
        }
        return;
      }
      dispatch(setAffiliateUserLoading({ key, value: true }));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await getAffiliateUsersAPI(apiPayload);
      const affiliateUsersData = resp.data?.items;
      const affiliateUsersMetaData = resp.data?.meta;
      if (affiliateUsersData && Array.isArray(affiliateUsersData)) {
        if (!payload?.isNotUpdateRoute) {
          updateRouteParams(apiPayload, dispatch);
        }
        dispatch(
          setAffiliateUserData({
            key,
            value: {
              affiliateUsers: affiliateUsersData,
              affiliateUserPagination: affiliateUsersMetaData,
            },
          }),
        );
        dispatch(
          setIsAffiliateUserFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong in get affiliate users');
      }
    } catch (e) {
      console.error('Error in getAffiliateUsers', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setAffiliateUserLoading({ key, value: false }));
      dispatch(
        setIsAffiliateUserFetchedAlready({
          key,
          value: false,
        }),
      );
    }
  },
);

export const fetchAffiliateOptions = createAsyncThunk(
  'affiliateUser/fetchAffiliateOptions',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();

      const isFetchedAlready = currentState?.affiliateUser?.affiliateOptions;
      if (isFetchedAlready && !payload?.isForceRefresh) {
        return;
      }
      const resp = await getAffiliateUsersAPI({ limit: 20, page: 1 });
      const affiliateUsersData = resp.data?.items;
      if (Array.isArray(affiliateUsersData)) {
        dispatch(setAffiliateOptions(affiliateUsersData));
      } else {
        throw new Error('Something went wrong in get affiliate users');
      }
    } catch (e) {
      console.error('Error in getAffiliateOptions', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(fetchAffiliateOptions(null));
    }
  },
);

export const exportAffiliateUser = createAsyncThunk(
  'affiliateUser/exportAffiliateUser',
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      toastId = showToast({
        type: 'progressToast',
        title: 'Exporting',
      });
      const currentState = thunkAPI.getState();
      const filterData = getAffiliateUserFilter(currentState);
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
      dispatch(setIsAffiliateUserExporting(true));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await exportAffiliateUserAPI(apiPayload);
      const url = resp.data?.url;
      if (url) {
        downloadFile(url);
        dispatch(setIsAffiliateUserExporting(false));
        showToast({
          type: 'successToast',
          title: 'Successfully exported',
          toastId,
        });
      } else {
        throw new Error('Something went wrong in export affiliate user');
      }
    } catch (e) {
      console.error('Error in exportAffiliateUser', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
      dispatch(setIsAffiliateUserExporting(false));
    }
  },
);

export const updateAffiliateUserTopupCommission = createAsyncThunk(
  'affiliateUser/updateAffiliateUserTopupCommission',
  async (payload, thunkAPI) => {
    let toastId;
    try {
      toastId = showToast({
        type: 'progressToast',
        title: 'Updating affiliate user',
      });
      await updateAffiliateUserTopupCommissionAPI(payload);
      showToast({
        type: 'successToast',
        title: 'Affiliate user deposit commission updated successfully',
        toastId,
      });
    } catch (e) {
      console.error('Error in updateAffiliateUserTopupCommission', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
    }
  },
);

export const updateAffiliateUser = createAsyncThunk(
  'affiliateUser/updateAffiliateUser',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getAffiliateUserFilter(currentState);
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
      const key = createAffiliateUserKey(keyPayload);
      toastId = showToast({
        type: 'progressToast',
        title: 'Updating affiliate user',
      });
      dispatch(setIsCreateAffiliateUserLoading(true));
      let resp;
      const isUpdateStatus = Array.isArray(payload) && payload.length;
      if (isUpdateStatus) {
        const finalPayload = {
          affiliateUserObj: payload,
        };
        resp = await updateAffiliateUserStatusAPI(finalPayload);
      } else {
        resp = await updateAffiliateUserAPI(payload);
      }
      const data = resp?.data;
      if (data || isUpdateStatus) {
        dispatch(
          setCreateAffiliateUserForm({ showCreateAffiliateUserModal: false }),
        );
        showToast({
          type: 'successToast',
          title: 'Affiliate user updated successfully',
          toastId,
        });
        dispatch(resetSelectedAffiliateUser());
        dispatch(setIsCreateAffiliateUserLoading(false));
        dispatch(resetCreateAffiliateUserForm());
        if (status || payload?.length > 1) {
          dispatch(resetIsAffiliateUserFetchedAlready());
          dispatch(getAllAffiliateUser({ isForceRefresh: true }));
        } else {
          dispatch(updateAffiliateUserData({ key, value: data }));
        }
      } else {
        throw new Error('Something went wrong in update affiliate user');
      }
    } catch (e) {
      console.error('Error in updateAffiliateUser', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
      dispatch(setIsCreateAffiliateUserLoading(false));
    }
  },
);

export const updateAffiliateUserId = createAsyncThunk(
  'affiliateUser/updateAffiliateUserId',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getAffiliateUserFilter(currentState);
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
      const key = createAffiliateUserKey(keyPayload);
      toastId = showToast({
        type: 'progressToast',
        title: 'Updating affiliate user id',
      });
      dispatch(setIsCreateAffiliateUserLoading(true));

      const resp = await updateAffiliateUserIdAPI(payload);

      const data = resp?.data;
      if (data) {
        showToast({
          type: 'successToast',
          title: 'Affiliate user id updated successfully',
          toastId,
        });
        dispatch(updateAffiliateUserData({ key, value: data }));
      } else {
        throw new Error('Something went wrong in update affiliate user');
      }
    } catch (e) {
      console.error('Error in updateAffiliateUser', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
      dispatch(setIsCreateAffiliateUserLoading(false));
    }
  },
);

export const affiliateUserSlice = createSlice({
  name: 'affiliateUser',
  initialState,
  reducers: {
    setIsCreateAffiliateUserLoading(state, { payload }) {
      state.isCreateAffiliateUserLoading = payload;
    },
    setAffiliateUserLoading(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousAffiliateUserData = state?.affiliateUserData[key] || {};
      state.affiliateUserData[key] = {
        ...previousAffiliateUserData,
        isLoading: value,
      };
    },

    setAffiliateUserData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousAffiliateUserData = state?.affiliateUserData[key] || {};
      state.affiliateUserData[key] = {
        ...previousAffiliateUserData,
        isLoading: false,
        affiliateUsers: value?.affiliateUsers,
        affiliateUserPagination: value?.affiliateUserPagination,
      };
    },

    updateAffiliateUserData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousAffiliateUserData =
        state?.affiliateUserData?.[key]?.affiliateUsers || [];
      const foundIndex = previousAffiliateUserData?.findIndex(
        item => item?._id === value?._id,
      );
      if (foundIndex !== -1) {
        previousAffiliateUserData[foundIndex] = value;
        state.affiliateUserData[key].affiliateUsers = [
          ...previousAffiliateUserData,
        ];
      }
    },

    setIsAffiliateUserFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousIsAlreadyFetch = state?.isAffiliateUserFetchedAlready || {};
      state.isAffiliateUserFetchedAlready = {
        ...previousIsAlreadyFetch,
        [key]: value,
      };
    },
    resetIsAffiliateUserFetchedAlready(state) {
      state.isAffiliateUserFetchedAlready = {};
    },
    setAffiliateUserFilters(state, { payload }) {
      const previousFilters =
        state?.affiliateUserFilter || initialAffiliateUserFilterState;
      state.affiliateUserFilter = {
        ...previousFilters,
        ...payload,
      };
      state.selectedAffiliateUserIds = {};
      state.isMultiAffiliateUserSelectEnable = false;
    },
    setIsExpandAffiliateUserFilter(state, { payload }) {
      state.isExpandAffiliateUserFilter = payload;
    },
    setIsAffiliateUserExporting(state, { payload }) {
      state.isExporting = payload;
    },
    toggleSelectMultipleAffiliateUser(state) {
      if (state.isMultiAffiliateUserSelectEnable) {
        state.selectedAffiliateUserIds = {};
      }
      state.isMultiAffiliateUserSelectEnable =
        !state.isMultiAffiliateUserSelectEnable;
    },
    toggleSelectedAffiliateUserIds(state, { payload }) {
      const tempSelectedAffiliateUserIds = {
        ...state.selectedAffiliateUserIds,
      };
      if (tempSelectedAffiliateUserIds[payload]) {
        delete tempSelectedAffiliateUserIds[payload];
      } else {
        tempSelectedAffiliateUserIds[payload] = true;
      }
      state.selectedAffiliateUserIds = tempSelectedAffiliateUserIds;
    },
    resetSelectedAffiliateUser(state) {
      state.selectedAffiliateUserIds = {};
      state.isMultiAffiliateUserSelectEnable = false;
    },
    setSelectedAffiliateUserIds(state, { payload }) {
      if (isValidObject(payload)) {
        state.selectedAffiliateUserIds = payload;
      } else {
        console.warn('payload is not object');
      }
    },
    setAffiliateOptions(state, { payload }) {
      if (Array.isArray(payload)) {
        state.affiliateOptions = payload;
      } else {
        console.warn('payload is not object');
      }
    },
  },
});

export const {
  resetIsAffiliateUserFetchedAlready,
  setIsExpandAffiliateUserFilter,
  setIsAffiliateUserExporting,
  setIsAffiliateUserFetchedAlready,
  setAffiliateUserData,
  setAffiliateUserFilters,
  setAffiliateUserLoading,
  updateAffiliateUserData,
  setIsCreateAffiliateUserLoading,
  resetSelectedAffiliateUser,
  setSelectedAffiliateUserIds,
  toggleSelectedAffiliateUserIds,
  toggleSelectMultipleAffiliateUser,
  setAffiliateOptions,
} = affiliateUserSlice.actions;
