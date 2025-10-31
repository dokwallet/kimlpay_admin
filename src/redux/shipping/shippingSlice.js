import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  downloadFile,
  exportShippingAPI,
  getShippingsAPI,
  updateShippingStatusAPI,
  createBulkShippingAPI,
  getShippingAPI,
} from '@/apis/apis';
import { showToast } from '@/utils/toast';
import { resetCreateBulkShippingForm } from '@/redux/form/formDataSlice';
import {
  createQueryString,
  formatEndDate,
  formatStartDate,
  isValidObject,
} from '@/utils/helper';
import { replaceRoute } from '@/utils/routing';
import { setPreviousRouteParams } from '../extraData/extraDataSlice';
import {
  getShippingFilter,
  isShippingFetchedAlready,
} from './shippingSelector';

export const initialShippingFilterState = {
  startDate: null,
  endDate: null,
  page: 1,
  limit: 10,
  status: '',
  search: null,
};

const initialState = {
  isShippingLoading: false,
  isShippingSubmitting: false,
  showShippingCardModal: false,
  shippings: [],
  //Admin side
  isExporting: false,
  isShippingFetchedAlready: {},
  shippingFilter: initialShippingFilterState,
  shippingData: {},
  isExpandShippingFilter: false,
  isMultiShippingSelectEnable: false,
  selectedShippingIds: {},
};

export const createShippingKey = ({
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
  const lastRouteUrl = `/dashboard/admin/shipping${searchStr ? `?${searchStr}` : ''}`;
  replaceRoute(lastRouteUrl, true);
  dispatch(setPreviousRouteParams({ Shipping: lastRouteUrl }));
};

export const getShippings = createAsyncThunk(
  'shipping/getShippings',
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setShippingLoading(true));
      const resp = await getShippingAPI();
      const kycData = resp.data;
      if (kycData && Array.isArray(kycData)) {
        dispatch(setShipping(kycData));
      } else {
        throw new Error('Something went wrong in get kycs');
      }
    } catch (e) {
      console.error('Error in getKycs', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setShippingLoading(false));
    }
  },
);

export const createBulkShipping = createAsyncThunk(
  'shipping/createBulkShipping',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let progressToastId;
    try {
      dispatch(setShippingSubmitting(true));
      progressToastId = showToast({
        type: 'progressToast',
        title: 'Creating Shipping Info',
      });
      const finalPayload = {
        cardIds: payload?.cardIds,
      };
      if (payload?.shippingId === 'add_new_shipping') {
        finalPayload.shipping = {
          shippingAddress: {
            line1: payload.shippingAddressLine1,
            line2: payload.shippingAddressLine2,
            country: payload.shippingCountry?.code,
            city: payload.shippingCity,
            postalCode: payload.shippingPostalCode,
          },
          recipientFirstName: payload?.recipientFirstName,
          recipientLastName: payload?.recipientLastName,
          recipientPhoneNumber: payload?.recipientPhoneNumber,
          recipientDialCode: payload?.recipientDialCode,
          recipientEmail: payload?.recipientEmail,
        };
      } else {
        finalPayload.shippingId = payload?.shippingId;
      }
      console.log('payload', payload);
      console.log('finalPayload', finalPayload);
      const resp = await createBulkShippingAPI(finalPayload);
      if (resp?.status === 201) {
        dispatch(setShippingCardModal(false));
        showToast({
          type: 'successToast',
          title: 'Shipping details filled successfully',
          toastId: progressToastId,
        });
        dispatch(setShippingSubmitting(false));
        dispatch(resetCreateBulkShippingForm());
      } else {
        throw new Error('Something went wrong in create shipping');
      }
    } catch (e) {
      console.error('Error in createShipping', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId: progressToastId,
      });
      dispatch(setShippingSubmitting(false));
    }
  },
);

export const getAllShipping = createAsyncThunk(
  'shipping/getAllShipping',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getShippingFilter(currentState);
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
      key = createShippingKey(apiPayload);
      const isFetchedAlready = isShippingFetchedAlready(currentState);
      if (isFetchedAlready[key] && !payload?.isForceRefresh) {
        updateRouteParams(apiPayload, dispatch);
        return;
      }
      dispatch(setShipLoading({ key, value: true }));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await getShippingsAPI(apiPayload);
      const shippingData = resp.data?.items;
      const shippingMetaData = resp.data?.meta;
      if (shippingData && Array.isArray(shippingData)) {
        updateRouteParams(apiPayload, dispatch);
        dispatch(
          setShippingData({
            key,
            value: {
              shippings: shippingData,
              shippingPagination: shippingMetaData,
            },
          }),
        );
        dispatch(
          setIsShippingFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong in get shippings');
      }
    } catch (e) {
      console.error('Error in getAllShipping', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setShipLoading({ key, value: false }));
      dispatch(
        setIsShippingFetchedAlready({
          key,
          value: false,
        }),
      );
    }
  },
);

export const updateShippingStatus = createAsyncThunk(
  'shipping/updateShippingStatus',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      const currentState = thunkAPI.getState();
      const filterData = getShippingFilter(currentState);
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
      const key = createShippingKey(keyPayload);
      toastId = showToast({
        type: 'progressToast',
        title: 'Updating Status for Shipping',
      });
      const finalPayload = {
        shippingObj: payload,
      };
      const resp = await updateShippingStatusAPI(finalPayload);
      const data = resp?.data;
      dispatch(resetSelectedShipping());
      showToast({
        type: 'successToast',
        title: 'Shipping status updated successfully',
        toastId,
      });
      if (status || payload?.length > 1) {
        dispatch(resetIsShippingFetchedAlready());
        dispatch(getAllShipping({ isForceRefresh: true }));
      } else if (data) {
        dispatch(updateShippingData({ key, value: data }));
      }
    } catch (e) {
      console.error('Error in updateShippingStatus', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
    }
  },
);

export const exportShipping = createAsyncThunk(
  'shipping/exportShipping',
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      toastId = showToast({
        type: 'progressToast',
        title: 'Exporting',
      });
      const currentState = thunkAPI.getState();
      const filterData = getShippingFilter(currentState);
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

      dispatch(setIsShippingExporting(true));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await exportShippingAPI(apiPayload);
      const url = resp.data?.url;
      if (url) {
        downloadFile(url);
        dispatch(setIsShippingExporting(false));
        showToast({
          type: 'successToast',
          title: 'Successfully exported',
          toastId,
        });
      } else {
        throw new Error('Something went wrong in export shipping');
      }
    } catch (e) {
      console.error('Error in exportShipping', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
      dispatch(setIsShippingExporting(false));
    }
  },
);

export const shippingSlice = createSlice({
  name: 'shipping',
  initialState,
  reducers: {
    setShippingLoading(state, { payload }) {
      state.isShippingLoading = payload;
    },
    setShippingSubmitting(state, { payload }) {
      state.isShippingSubmitting = payload;
    },
    setShippingCardModal(state, { payload }) {
      state.showShippingCardModal = payload;
    },
    setShipping(state, { payload }) {
      state.shippings = payload;
      state.isShippingLoading = false;
    },
    // Admin side
    setShipLoading(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousShippingData = state?.shippingData[key] || {};
      state.shippingData[key] = {
        ...previousShippingData,
        isLoading: value,
      };
    },

    setShippingData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousShippingData = state?.shippingData[key] || {};
      state.shippingData[key] = {
        ...previousShippingData,
        isLoading: false,
        shippings: value?.shippings,
        shippingPagination: value?.shippingPagination,
      };
    },

    updateShippingData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousShippingData = state?.shippingData?.[key]?.shippings || [];
      const foundIndex = previousShippingData?.findIndex(
        item => item?._id === value?._id,
      );
      if (foundIndex !== -1) {
        previousShippingData[foundIndex] = value;
        state.shippingData[key].shippings = [...previousShippingData];
      }
    },

    setIsShippingFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousIsAlreadyFetch = state?.isShippingFetchedAlready || {};
      state.isShippingFetchedAlready = {
        ...previousIsAlreadyFetch,
        [key]: value,
      };
    },
    resetIsShippingFetchedAlready(state) {
      state.isShippingFetchedAlready = {};
    },
    setShippingFilters(state, { payload }) {
      const previousFilters =
        state?.shippingFilter || initialShippingFilterState;
      state.shippingFilter = {
        ...previousFilters,
        ...payload,
      };
      state.selectedShippingIds = {};
      state.isMultiShippingSelectEnable = false;
    },
    setIsExpandShippingFilter(state, { payload }) {
      state.isExpandShippingFilter = payload;
    },
    setIsShippingExporting(state, { payload }) {
      state.isExporting = payload;
    },
    toggleSelectMultipleShipping(state) {
      if (state.isMultiShippingSelectEnable) {
        state.selectedShippingIds = {};
      }
      state.isMultiShippingSelectEnable = !state.isMultiShippingSelectEnable;
    },
    toggleSelectedShippingIds(state, { payload }) {
      const tempSelectedShippingIds = { ...state.selectedShippingIds };
      if (tempSelectedShippingIds[payload]) {
        delete tempSelectedShippingIds[payload];
      } else {
        tempSelectedShippingIds[payload] = true;
      }
      state.selectedShippingIds = tempSelectedShippingIds;
    },
    resetSelectedShipping(state) {
      state.selectedShippingIds = {};
      state.isMultiShippingSelectEnable = false;
    },
    setSelectedShippingIds(state, { payload }) {
      if (isValidObject(payload)) {
        state.selectedShippingIds = payload;
      } else {
        console.warn('payload is not object');
      }
    },

    resetShipping() {
      return initialState;
    },
  },
});

export const {
  resetShipping,
  setShipping,
  setShippingSubmitting,
  setShippingLoading,
  setShippingCardModal,
  setIsExpandShippingFilter,
  setIsShippingExporting,
  setIsShippingFetchedAlready,
  setShippingData,
  setShippingFilters,
  setShipLoading,
  updateShippingData,
  resetIsShippingFetchedAlready,
  resetSelectedShipping,
  setSelectedShippingIds,
  toggleSelectedShippingIds,
  toggleSelectMultipleShipping,
} = shippingSlice.actions;
