import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  checkCredential,
  createTwoFa,
  downloadFile,
  exportUserAPI,
  forgetPasswordAPI,
  generateTwoFaForExistingUser,
  getUserAPI,
  getUsersAPI,
  registerUser,
  resendEmailOtp,
  updateUserAPI,
  updateUserPlateformFeeAPI,
  updateUserStatusAPI,
  verifyEmailOtp,
  verifyForgetPasswordAPI,
  verifyTwoFAAPI,
} from '@/apis/apis';
import {
  resetForgetPasswordFormValues,
  resetLoginFormValues,
  resetRegisterFormValues,
} from '@/redux/form/formDataSlice';
import {
  getPreAuthUser,
  getSelectedUsersTab,
  getUsersFilter,
  isUsersFetchedAlready,
} from '@/redux/user/userSelector';
import { showToast } from '@/utils/toast';
import {
  setPreviousRouteParams,
  setRouteStateData,
} from '@/redux/extraData/extraDataSlice';
import {
  createQueryString,
  formatEndDate,
  formatStartDate,
  isValidObject,
  USER_TABS,
} from '@/utils/helper';
import { replaceRoute } from '@/utils/routing';
import {
  startPasskeyAuthentication,
  startPasskeyRegistration,
} from '@/utils/passkey';
import { login } from '@/redux/auth/authSlice';

export const initialUsersFilterState = {
  startDate: null,
  endDate: null,
  page: 1,
  limit: 10,
  status: '',
  search: null,
};

const initialState = {
  preAuthUser: null,
  user: null,
  isRegisterSubmitting: false,
  isUserLoading: false,
  isEmailOTPSubmitting: false,
  isResendEmailSubmitting: false,
  isLoadingTwoFA: false,
  isCredentialSubmitting: false,
  isForgetPasswordSubmitting: false,
  isVerifyForgetPasswordSubmitting: false,
  twoFaQrCodeString: '',
  passkeyOptions: null,
  isVerifyingTwoFa: false,
  selectedUsersTab: 0,
  isExporting: false,
  isUsersFetchedAlready: {},
  usersFilter: {
    'ADMIN-USER': initialUsersFilterState,
    USER: initialUsersFilterState,
  },
  usersData: {},
  isExpandUsersFilter: false,
  isMultiUserSelectEnable: {
    'ADMIN-USER': false,
    USER: false,
  },
  selectedUserIds: {
    'ADMIN-USER': {},
    USER: {},
  },
  secret: '',
  otpAuthUrl: '',
};

export const createUsersKey = ({
  selectedUsersTab,
  page,
  limit,
  status,
  startDate,
  endDate,
  search,
}) => {
  const tab = USER_TABS[selectedUsersTab] || USER_TABS[0];
  let key = `${tab}_${page}_${limit}`;
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
    tab: apiPayload?.type,
    startDate: formatStartDate(apiPayload?.startDate, true),
    endDate: formatEndDate(apiPayload?.endDate, true),
    search: apiPayload?.search,
  });
  const lastRouteUrl = `/dashboard/admin/users${searchStr ? `?${searchStr}` : ''}`;
  replaceRoute(lastRouteUrl, true);
  dispatch(setPreviousRouteParams({ Users: lastRouteUrl }));
};

export const register = createAsyncThunk(
  'user/Register',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsRegisterSubmitting(true));
      const router = payload.router;
      delete payload.router;
      const finalPayload = {
        ...payload,
        countryCode: payload?.countryCode?.countryCode,
      };
      const resp = await registerUser(finalPayload);
      if (resp?.status === 201) {
        showToast({
          type: 'successToast',
          title:
            'Registration completed successfully! Your application is pending approval. We will notify you once your account is activated.',
        });
        dispatch(setIsRegisterSubmitting(false));
        router.replace('/login');
        dispatch(resetRegisterFormValues());
      } else {
        throw Error('User registration failed');
      }
    } catch (e) {
      console.error('Error in register', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsRegisterSubmitting(false));
      throw e;
    }
  },
);

export const checkUserCredential = createAsyncThunk(
  'user/checkUserCredential',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsCredentialSubmitting(true));
      const router = payload.router;
      delete payload.router;
      const resp = await checkCredential(payload);
      const userStatus = resp?.data?.user?.status;
      dispatch(
        setPreAuthUserDetails({
          email: resp?.data?.user?.email,
          password: payload.password,
          email_verified: resp?.data?.user?.email_verified,
          userId: resp?.data?.user?._id,
          two_fa_enable: resp?.data?.user?.two_fa_enable,
          two_fa_methods: resp?.data?.user?.two_fa_methods,
          status: userStatus,
        }),
      );
      dispatch(resetLoginFormValues());

      if (!resp?.data?.user?.email_verified) {
        router.replace('/verify-email');
      } else if (userStatus === 1) {
        router.replace('/verify-twofa');
      } else if (userStatus === 2) {
        showToast({
          type: 'errorToast',
          error: {
            message: 'Your account is blocked.',
          },
        });
      } else if (userStatus === 3) {
        showToast({
          type: 'errorToast',
          error: {
            message: 'Your account is not approved yet.',
          },
        });
      } else {
        showToast({
          type: 'errorToast',
          error: {
            message: 'User check credential failed',
          },
        });
      }
    } catch (e) {
      console.error('Error in checkUserCredentials', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsCredentialSubmitting(false));
    }
  },
);

export const getUser = createAsyncThunk('user/getUser', async (_, thunkAPI) => {
  const dispatch = thunkAPI.dispatch;
  try {
    dispatch(setUserLoading(true));
    const resp = await getUserAPI();
    const userData = resp.data;
    if (userData) {
      dispatch(setUserDetails(userData));
    } else {
      throw new Error('Something went wrong in get user');
    }
  } catch (e) {
    console.error('Error in getUser', e);
    showToast({
      type: 'errorToast',
      error: e,
    });
    dispatch(setUserLoading(false));
  }
});

export const verifyEmail = createAsyncThunk(
  'user/verifyEmail',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsEmailOTPSubmitting(true));
      const router = payload.router;
      const otp = payload.otp;
      const currentState = thunkAPI.getState();
      const user = getPreAuthUser(currentState);

      if (!user?.email) {
        throw new Error('Email not found. Please try registering again.');
      }

      const resp = await verifyEmailOtp({
        email: user.email,
        otp,
      });

      if (resp?.status === 200) {
        dispatch(
          setPreAuthUserDetails({
            ...user,
            email_verified: true,
          }),
        );

        showToast({
          type: 'successToast',
          title: 'Email verified successfully!',
        });
        router.replace('/verify-twofa');

        return { success: true };
      } else {
        throw new Error(
          resp?.data?.message || 'Failed to verify email. Please try again.',
        );
      }
    } catch (e) {
      console.error('Error in verifyEmailOTP', e);
      showToast({
        type: 'errorToast',
        error: e,
        title: 'Verification Failed',
        message: e.message || 'Failed to verify email. Please try again.',
      });
      throw e;
    } finally {
      dispatch(setIsEmailOTPSubmitting(false));
    }
  },
);

export const generateTwoFa = createAsyncThunk(
  'user/generateTwoFa',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsLoadingTwoFA(true));
      const currentState = thunkAPI.getState();
      const user = getPreAuthUser(currentState);
      const finalPayload = {
        userId: user?.userId,
      };
      if (payload.type) {
        finalPayload.type = payload.type;
      }
      const resp = await createTwoFa(finalPayload);
      const qrCodeUrl = resp?.data?.qrCodeURL;
      const passkeyData = resp?.data?.passkeyData;
      const secret = resp?.data?.secret;
      const otpAuthUrl = resp?.data?.otpAuthUrl;
      if (resp?.status === 200 && qrCodeUrl) {
        dispatch(setTwoFAQrCode(qrCodeUrl));
        dispatch(setTwoFASecret(secret));
        dispatch(setTwoFAOtpUrl(otpAuthUrl));
      } else if (resp?.status === 200 && passkeyData) {
        dispatch(setPassKeyOptions(passkeyData));
        dispatch(
          login({
            type: 'PASSKEY',
            passkeyOptions: passkeyData,
            router: payload.router,
          }),
        );
      } else {
        throw Error('Invalid otp');
      }
    } catch (e) {
      console.error('Error in generateTwoFa', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsLoadingTwoFA(false));
    }
  },
);

export const resendVerifyEmail = createAsyncThunk(
  'user/resendVerifyEmail',
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsResendEmailSubmitting(true));
      const currentState = thunkAPI.getState();
      const user = getPreAuthUser(currentState);
      const payload = {
        userId: user?.userId,
      };
      await resendEmailOtp(payload);
      dispatch(setIsResendEmailSubmitting(false));
    } catch (e) {
      console.error('Error in verifyEmailOTP', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsResendEmailSubmitting(false));
    }
  },
);

export const forgetPassword = createAsyncThunk(
  'user/forgetPassword',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsForgetPasswordSubmitting(true));
      const router = payload.router;
      delete payload.router;
      const resp = await forgetPasswordAPI(payload);
      if (resp?.status === 200) {
        dispatch(
          setRouteStateData({
            'verify-forget-password': { email: payload.email },
          }),
        );
        dispatch(resetForgetPasswordFormValues());
        router.push('/verify-forget-password');
      }
      dispatch(setIsForgetPasswordSubmitting(false));
    } catch (e) {
      console.error('Error in forgetPassword', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsForgetPasswordSubmitting(false));
    }
  },
);

export const verifyForgetPassword = createAsyncThunk(
  'user/verifyForgetPassword',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsVerifyForgetPasswordSubmitting(true));
      const router = payload.router;
      delete payload.router;
      const resp = await verifyForgetPasswordAPI(payload);
      if (resp?.status === 200) {
        router.replace('/login');
      }
      showToast({ type: 'successToast', title: 'Password Reset successfully' });
      dispatch(setIsVerifyForgetPasswordSubmitting(false));
    } catch (e) {
      console.error('Error in verifyForgetPassword', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsVerifyForgetPasswordSubmitting(false));
    }
  },
);

export const verifyTwoFA = createAsyncThunk(
  'user/verifyTwoFA',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsVerifyingTwoFa(true));
      const finalPayload = {
        type: payload?.type,
        isNewPasskey: !!payload?.isNewPasskey,
      };
      if (payload.otp) {
        finalPayload.otp = payload.otp;
      }
      const isPassKey = finalPayload.type === 'PASSKEY';
      if (isPassKey) {
        const resp = await generateTwoFaForExistingUser(payload);
        const passkeyData = resp?.data?.passkeyData;
        finalPayload.passkeyData = finalPayload?.isNewPasskey
          ? await startPasskeyRegistration(passkeyData)
          : await startPasskeyAuthentication(passkeyData);
      }
      const resp = await verifyTwoFAAPI(finalPayload);
      if (resp?.status === 200) {
        dispatch(setIsVerifyingTwoFa(false));
        const userData = resp?.data;
        if (userData && finalPayload?.isNewPasskey && isPassKey) {
          dispatch(setUserDetails(userData));
          showToast({
            type: 'successToast',
            title: `Passkey is added successfully`,
          });
        }
      } else {
        throw new Error('Something went wrong in verify two fa');
      }
    } catch (e) {
      console.error('Error in verifyTwoFA', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsVerifyingTwoFa(false));
      throw e;
    }
  },
);

export const getUsers = createAsyncThunk(
  'user/getUsers',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let key;
    try {
      const currentState = thunkAPI.getState();
      const usersFilter = getUsersFilter(currentState);
      const selectedUsersTab =
        payload?.selectedUsersTab ?? getSelectedUsersTab(currentState);
      const filterKey = USER_TABS[selectedUsersTab];
      const filterData = usersFilter[filterKey] || {};
      const status = payload?.status || filterData.status;
      const search = payload?.search || filterData.search;
      const startDate = payload?.startDate || filterData.startDate;
      const endDate = payload?.endDate || filterData.endDate;
      const type = USER_TABS[selectedUsersTab];
      const apiPayload = {
        page: payload?.page || filterData?.page,
        limit: payload?.limit || filterData?.limit,
        type,
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
      key = createUsersKey({
        ...apiPayload,
        selectedUsersTab: selectedUsersTab,
      });
      const isFetchedAlready = isUsersFetchedAlready(currentState);
      if (isFetchedAlready[key] && !payload?.isForceRefresh) {
        updateRouteParams(apiPayload, dispatch);
        return;
      }
      dispatch(setUsersLoading({ key, value: true }));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await getUsersAPI(apiPayload);
      const usersData = resp.data?.items;
      const usersMetaData = resp.data?.meta;
      if (usersData && Array.isArray(usersData)) {
        updateRouteParams(apiPayload, dispatch);
        dispatch(
          setUsersData({
            key,
            value: {
              users: usersData,
              usersPagination: usersMetaData,
            },
          }),
        );
        dispatch(
          setIsUsersFetchedAlready({
            key,
            value: true,
          }),
        );
      } else {
        throw new Error('Something went wrong in get users');
      }
    } catch (e) {
      console.error('Error in getUsers', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setUsersLoading({ key, value: false }));
      dispatch(
        setIsUsersFetchedAlready({
          key,
          value: false,
        }),
      );
    }
  },
);

export const updateUserStatus = createAsyncThunk(
  'user/updateUserStatus',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      const currentState = thunkAPI.getState();
      const usersFilter = getUsersFilter(currentState);
      const selectedUsersTab =
        payload?.selectedUsersTab ?? getSelectedUsersTab(currentState);
      const filterKey = USER_TABS[selectedUsersTab];
      const filterData = usersFilter[filterKey] || {};
      const status = filterData.status;
      const search = filterData.search;
      const startDate = filterData.startDate;
      const endDate = filterData.endDate;
      const type = USER_TABS[selectedUsersTab];

      const keyPayload = {
        page: filterData?.page,
        limit: filterData?.limit,
        type,
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
      const key = createUsersKey({
        ...keyPayload,
        selectedUsersTab: selectedUsersTab,
      });
      toastId = showToast({
        type: 'progressToast',
        title: 'Updating Status for User',
      });
      const finalPayload = {
        userObj: payload,
        type,
      };
      const resp = await updateUserStatusAPI(finalPayload);
      const data = resp?.data;
      showToast({
        type: 'successToast',
        title: 'User status updated successfully',
        toastId,
      });
      dispatch(resetSelectedUser());
      if (status || payload?.length > 1) {
        dispatch(resetIsUsersFetchedAlready());
        dispatch(getUsers({ isForceRefresh: true }));
      } else if (data) {
        dispatch(updateUserData({ key, value: data }));
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

export const updateUserPlateformFeeCommission = createAsyncThunk(
  'user/updateUserPlateformFeeCommission',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      const currentState = thunkAPI.getState();
      const usersFilter = getUsersFilter(currentState);
      const selectedUsersTab =
        payload?.selectedUsersTab ?? getSelectedUsersTab(currentState);
      const filterKey = USER_TABS[selectedUsersTab];
      const filterData = usersFilter[filterKey] || {};
      const status = filterData.status;
      const search = filterData.search;
      const startDate = filterData.startDate;
      const endDate = filterData.endDate;
      const type = USER_TABS[selectedUsersTab];

      const keyPayload = {
        page: filterData?.page,
        limit: filterData?.limit,
        type,
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
      const key = createUsersKey({
        ...keyPayload,
        selectedUsersTab: selectedUsersTab,
      });
      toastId = showToast({
        type: 'progressToast',
        title: 'Updating commission of User',
      });
      const resp = await updateUserPlateformFeeAPI({ ...payload });
      const data = resp?.data;
      if (data) {
        showToast({
          type: 'successToast',
          title: 'User Plateform Fee commission updated successfully',
          toastId,
        });
        dispatch(updateUserData({ key, value: data }));
      } else {
        throw new Error('Something went wrong in updating topup commission');
      }
    } catch (e) {
      console.error('Error in updateUserTopupCommission', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
    }
  },
);

export const exportUser = createAsyncThunk(
  'user/exportUser',
  async (_, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      toastId = showToast({
        type: 'progressToast',
        title: 'Exporting',
      });
      const currentState = thunkAPI.getState();
      const usersFilter = getUsersFilter(currentState);
      const selectedUsersTab = getSelectedUsersTab(currentState);
      const filterKey = USER_TABS[selectedUsersTab];
      const filterData = usersFilter[filterKey] || {};
      const status = filterData.status;
      const search = filterData.search;
      const startDate = filterData.startDate;
      const endDate = filterData.endDate;
      const type = USER_TABS[selectedUsersTab];

      const apiPayload = {
        type,
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
      dispatch(setIsUsersExporting(true));
      if (apiPayload.startDate && apiPayload?.endDate) {
        apiPayload.startDate = formatStartDate(apiPayload.startDate);
        apiPayload.endDate = formatEndDate(apiPayload.endDate);
      }
      const resp = await exportUserAPI(apiPayload);
      const url = resp.data?.url;
      if (url) {
        downloadFile(url);
        dispatch(setIsUsersExporting(false));
        showToast({
          type: 'successToast',
          title: 'Successfully exported',
          toastId,
        });
      } else {
        throw new Error('Something went wrong in export user');
      }
    } catch (e) {
      console.error('Error in exportUser', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
      dispatch(setIsUsersExporting(false));
    }
  },
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let toastId;
    try {
      const currentState = thunkAPI.getState();
      const usersFilter = getUsersFilter(currentState);
      const selectedUsersTab = getSelectedUsersTab(currentState);
      const filterKey = USER_TABS[selectedUsersTab];
      const filterData = usersFilter[filterKey] || {};
      const status = filterData.status;
      const search = filterData.search;
      const startDate = filterData.startDate;
      const endDate = filterData.endDate;
      const type = USER_TABS[selectedUsersTab];

      const keyPayload = {
        page: filterData?.page,
        limit: filterData?.limit,
        type,
        selectedUsersTab: selectedUsersTab,
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
      const key = createUsersKey(keyPayload);
      toastId = showToast({
        type: 'progressToast',
        title: 'Updating User',
      });

      const resp = await updateUserAPI(payload);
      const data = resp?.data;
      if (data) {
        showToast({
          type: 'successToast',
          title: 'Affiliate user updated successfully',
          toastId,
        });

        if (status) {
          dispatch(resetIsUsersFetchedAlready());
          dispatch(getUsers({ isForceRefresh: true }));
        } else {
          dispatch(updateUserData({ key, value: data }));
        }
      } else {
        throw new Error('Something went wrong in update user');
      }
    } catch (e) {
      console.error('Error in updateUser', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId,
      });
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLoading(state, { payload }) {
      state.isUserLoading = payload;
    },
    setUserDetails(state, { payload }) {
      state.user = payload;
      state.isUserLoading = false;
    },
    setPreAuthUserDetails(state, { payload }) {
      state.preAuthUser = payload;
      state.isRegisterSubmitting = false;
      state.isCredentialSubmitting = false;
    },
    setIsRegisterSubmitting(state, { payload }) {
      state.isRegisterSubmitting = payload;
    },
    setIsEmailOTPSubmitting(state, { payload }) {
      state.isEmailOTPSubmitting = payload;
    },
    setIsResendEmailSubmitting(state, { payload }) {
      state.isResendEmailSubmitting = payload;
    },
    setIsLoadingTwoFA(state, { payload }) {
      state.isLoadingTwoFA = payload;
    },
    setIsCredentialSubmitting(state, { payload }) {
      state.isCredentialSubmitting = payload;
    },

    setIsForgetPasswordSubmitting(state, { payload }) {
      state.isForgetPasswordSubmitting = payload;
    },
    setIsVerifyForgetPasswordSubmitting(state, { payload }) {
      state.isVerifyForgetPasswordSubmitting = payload;
    },
    setIsVerifyingTwoFa(state, { payload }) {
      state.isVerifyingTwoFa = payload;
    },
    setTwoFAQrCode(state, { payload }) {
      state.twoFaQrCodeString = payload;
      state.isLoadingTwoFA = false;
    },
    setPassKeyOptions(state, { payload }) {
      state.passkeyOptions = payload;
      state.isLoadingTwoFA = false;
    },
    setSelectedUsersTab(state, { payload }) {
      state.selectedUsersTab = payload;
    },
    setUsersLoading(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousUsersData = state?.usersData[key] || {};
      state.usersData[key] = {
        ...previousUsersData,
        isLoading: value,
      };
    },

    setUsersData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousUserData = state?.usersData[key] || {};
      state.usersData[key] = {
        ...previousUserData,
        isLoading: false,
        users: value?.users,
        usersPagination: value?.usersPagination,
      };
    },

    updateUserData(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousUserData = state?.usersData?.[key]?.users || [];
      const foundIndex = previousUserData?.findIndex(
        item => item?._id === value?._id,
      );
      if (foundIndex !== -1) {
        previousUserData[foundIndex] = value;
        state.usersData[key].users = [...previousUserData];
      }
    },

    setIsUsersFetchedAlready(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousIsAlreadyFetch = state?.isUsersFetchedAlready || {};
      state.isUsersFetchedAlready = {
        ...previousIsAlreadyFetch,
        [key]: value,
      };
    },
    resetIsUsersFetchedAlready(state) {
      state.isUsersFetchedAlready = {};
    },
    setUsersFilters(state, { payload }) {
      const key = payload?.key;
      const value = payload?.value;
      const previousFilters =
        state?.usersFilter[key] || initialUsersFilterState;
      state.usersFilter[key] = {
        ...previousFilters,
        ...value,
      };
      const tabName = USER_TABS[state.selectedUsersTab];
      state.selectedUserIds[tabName] = {};
      state.isMultiUserSelectEnable[tabName] = false;
    },
    setIsExpandUsersFilter(state, { payload }) {
      state.isExpandUsersFilter = payload;
    },
    setIsUsersExporting(state, { payload }) {
      state.isExporting = payload;
    },
    toggleSelectMultipleUser(state) {
      const tabName = USER_TABS[state.selectedUsersTab];
      if (state.isMultiUserSelectEnable[tabName]) {
        state.selectedUserIds = {
          ...state.selectedUserIds,
          [tabName]: {},
        };
      }
      state.isMultiUserSelectEnable[tabName] =
        !state.isMultiUserSelectEnable[tabName];
    },
    toggleSelectedUserIds(state, { payload }) {
      const tabName = USER_TABS[state.selectedUsersTab];
      const tempSelectedUserIds = { ...state.selectedUserIds[tabName] };
      if (tempSelectedUserIds[payload]) {
        delete tempSelectedUserIds[payload];
      } else {
        tempSelectedUserIds[payload] = true;
      }
      state.selectedUserIds[tabName] = tempSelectedUserIds;
    },
    resetSelectedUser(state) {
      state.isMultiUserSelectEnable = {
        'ADMIN-USER': false,
        USER: false,
      };
      state.selectedUserIds = {
        'ADMIN-USER': {},
        USER: {},
      };
    },
    setSelectedUserIds(state, { payload }) {
      const tabName = USER_TABS[state.selectedUsersTab];
      if (isValidObject(payload)) {
        state.selectedUserIds[tabName] = payload;
      } else {
        console.warn('payload is not object');
      }
    },
    setTwoFASecret(state, { payload }) {
      state.secret = payload;
    },
    setTwoFAOtpUrl(state, { payload }) {
      state.otpAuthUrl = payload;
    },
    resetUser() {
      return initialState;
    },
  },
});

export const {
  setPreAuthUserDetails,
  setIsRegisterSubmitting,
  setIsEmailOTPSubmitting,
  setIsResendEmailSubmitting,
  setIsLoadingTwoFA,
  setTwoFAQrCode,
  setIsCredentialSubmitting,
  setIsForgetPasswordSubmitting,
  setIsVerifyForgetPasswordSubmitting,
  setUserDetails,
  setUserLoading,
  resetUser,
  setIsVerifyingTwoFa,
  setSelectedUsersTab,
  setUsersLoading,
  setUsersData,
  setIsUsersFetchedAlready,
  resetIsUsersFetchedAlready,
  setUsersFilters,
  setIsExpandUsersFilter,
  setIsUsersExporting,
  updateUserData,
  resetSelectedUser,
  setSelectedUserIds,
  toggleSelectedUserIds,
  toggleSelectMultipleUser,
  setPassKeyOptions,
  setTwoFASecret,
  setTwoFAOtpUrl,
} = userSlice.actions;
