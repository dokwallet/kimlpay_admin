import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { createQueryString } from '@/utils/helper';
import { replaceRoute } from '@/utils/routing';
import {
  deletePasskeyAPI,
  generateTwoFaForExistingUser,
  updateEmailAPI,
  updatePasskeyAPI,
  updatePasswordAPI,
  updatePersonalInfoAPI,
  updateTwoFAAPI,
  verifyTwoFAAPI,
  verifyUpdateEmailAPI,
  verifyUpdateTwoFAAPI,
} from '@/apis/apis';
import { showToast } from '@/utils/toast';
import { setUserDetails } from '@/redux/user/userSlice';
import {
  resetUpdatePersonalInfoForm,
  resetUpdateTwoFaForm,
  resetVerifyTwoFaForm,
} from '@/redux/form/formDataSlice';
import { logout } from '@/utils/logout';
import { setPreviousRouteParams } from '@/redux/extraData/extraDataSlice';

const initialState = {
  selectedSettingsTab: 'profile_settings',
  isUpdatingPersonalInfo: false,
  isUpdatingPassword: false,
  isDeletePasskey: false,
  isUpdatingPasskey: false,
  isEmailOTPSubmitting: false,
  isEmailOTPSubmittingSuccessfully: false,
  isVerifyingEmailOTP: false,
  isUpdatingTwoFa: '',
  isVerifyingTwoFa: '',
  twoFaQRCode: '',
  selected_two_fa_tab: 0,
  secret: '',
  otpAuthUrl: '',
};

export const updateSettingsRouteParams = (
  payload,
  dispatch,
  isNoRouting = false,
) => {
  const searchStr = createQueryString('', {
    tab: payload?.tab,
  });
  const lastRouteUrl = `/dashboard/settings${searchStr ? `?${searchStr}` : ''}`;
  if (!isNoRouting) {
    replaceRoute(lastRouteUrl, true);
  }
  dispatch(setPreviousRouteParams({ Settings: lastRouteUrl }));
};

export const updatePersonalInfo = createAsyncThunk(
  'settings/updatePersonalInfo',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsUpdatingPersonalInfo(true));
      const resp = await updatePersonalInfoAPI(payload);
      const userData = resp.data;
      if (userData) {
        showToast({
          type: 'successToast',
          title: 'Update Personal Info successfully',
        });
        dispatch(setIsUpdatingPersonalInfo(false));
        dispatch(setUserDetails(userData));
        dispatch(resetUpdatePersonalInfoForm());
      } else {
        throw new Error('Something went wrong in Update personal Info');
      }
    } catch (e) {
      console.error('Error in updatePersonalInfo', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsUpdatingPersonalInfo(false));
    }
  },
);

export const changePassword = createAsyncThunk(
  'settings/changePassword',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsUpdatingPassword(true));
      const resp = await updatePasswordAPI(payload);
      const userData = resp.data;
      if (userData) {
        showToast({
          type: 'successToast',
          title: 'Password Updated Successfully\nLogin again with new password',
        });
        dispatch(setIsUpdatingPassword(false));
        logout(dispatch);
      } else {
        throw new Error('Something went wrong in Change password');
      }
    } catch (e) {
      console.error('Error in changePassword', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsUpdatingPassword(false));
    }
  },
);

export const deletePasskey = createAsyncThunk(
  'settings/deletePasskey',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let progressToastId;
    try {
      progressToastId = showToast({
        type: 'progressToast',
        title: 'Deleting passkey',
      });
      dispatch(setIsDeletingPasskey(true));
      const resp = await deletePasskeyAPI(payload);
      const userData = resp.data;
      if (userData) {
        showToast({
          type: 'successToast',
          title: 'Passkey deleted successfully',
          toastId: progressToastId,
        });
        dispatch(setUserDetails(userData));
        dispatch(setIsDeletingPasskey(false));
      } else {
        throw new Error('Something went wrong in deleting passkey');
      }
    } catch (e) {
      console.error('Error in deletePasskey', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId: progressToastId,
      });
      dispatch(setIsDeletingPasskey(false));
    }
  },
);

export const updatePasskey = createAsyncThunk(
  'settings/updatePasskey',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    let progressToastId;
    try {
      progressToastId = showToast({
        type: 'progressToast',
        title: 'Updating passkey',
      });
      dispatch(setIsUpdatingPasskey(true));
      const resp = await updatePasskeyAPI(payload);
      const userData = resp.data;
      if (userData) {
        showToast({
          type: 'successToast',
          title: 'Passkey updated successfully',
          toastId: progressToastId,
        });
        dispatch(setUserDetails(userData));
        dispatch(setIsUpdatingPasskey(false));
      } else {
        throw new Error('Something went wrong in updating passkey');
      }
    } catch (e) {
      console.error('Error in updatePasskey', e);
      showToast({
        type: 'errorToast',
        error: e,
        toastId: progressToastId,
      });
      dispatch(setIsUpdatingPasskey(false));
    }
  },
);

export const sendChangeEmailOTP = createAsyncThunk(
  'settings/sendChangeEmailOTP',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsEmailOTPSubmitting(true));
      const resp = await updateEmailAPI(payload);
      const data = resp.data;
      if (data) {
        showToast({
          type: 'successToast',
          title: 'OTP sent successfully',
        });
        dispatch(setIsEmailOTPSubmitting(false));
        dispatch(setIsEmailOTPSubmittingSuccessfully(true));
      } else {
        throw new Error('Something went wrong in send OTP');
      }
    } catch (e) {
      console.error('Error in sendChangeEmailOTP', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsEmailOTPSubmitting(false));
    }
  },
);

export const verifyEmailOTP = createAsyncThunk(
  'settings/verifyEmailOTP',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsVerifyingEmailOTP(true));
      const resp = await verifyUpdateEmailAPI(payload);
      const userData = resp.data;
      if (userData) {
        showToast({
          type: 'successToast',
          title: 'Email Updated Successfully\nLogin again with new email',
        });
        dispatch(setIsVerifyingEmailOTP(false));
        await logout(dispatch);
      } else {
        throw new Error('Something went wrong in Verify email OTP');
      }
    } catch (e) {
      console.error('Error in verifyEmailOTP', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsVerifyingEmailOTP(false));
    }
  },
);

export const updateTwoFa = createAsyncThunk(
  'settings/updateTwoFa',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsUpdatingTwoFa(true));
      const resp = await updateTwoFAAPI(payload);
      const qrCode = resp.data?.qrCodeURL;
      const secret = resp.data?.secret;
      const otpAuthUrl = resp.data?.otpAuthUrl;
      if (qrCode) {
        dispatch(setTwoFaQRCode(qrCode));
        dispatch(setTwoFASecret(secret));
        dispatch(setTwoFAOtpUrl(otpAuthUrl));
      } else {
        throw new Error('Something went wrong in update two fa');
      }
    } catch (e) {
      console.error('Error in updateTwoFa', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setTwoFaQRCode(''));
      dispatch(setTwoFASecret(''));
      dispatch(setTwoFAOtpUrl(''));
      dispatch(setIsUpdatingTwoFa(false));
    }
  },
);

export const generateNewAuthenticator = createAsyncThunk(
  'settings/updateTwoFa',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsUpdatingTwoFa(true));
      const resp = await generateTwoFaForExistingUser({
        type: 'AUTHENTICATOR',
      });
      const qrCode = resp.data?.qrCodeURL;
      const otpAuthUrl = resp.data?.otpAuthUrl;
      const secret = resp.data?.secret;
      if (qrCode) {
        dispatch(setTwoFaQRCode(qrCode));
        dispatch(setTwoFASecret(secret));
        dispatch(setTwoFAOtpUrl(otpAuthUrl));
      } else {
        throw new Error('Something went wrong in generate new authenticator');
      }
    } catch (e) {
      console.error('Error in generateNewAuthenticator', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setTwoFaQRCode(''));
      dispatch(setIsUpdatingTwoFa(false));
    }
  },
);

export const verifyUpdateTwoFa = createAsyncThunk(
  'settings/verifyUpdateTwoFa',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsVerifyingTwoFa(true));
      const finalPayload = {};
      const isAlreadySetup = payload?.isTwoFaAlreadySetup;
      if (!payload?.isTwoFaAlreadySetup) {
        finalPayload.otp = payload.new_otp;
        finalPayload.type = 'AUTHENTICATOR';
        finalPayload.isNewAuthenticator = true;
      } else {
        finalPayload.new_otp = payload.new_otp;
      }
      const resp = isAlreadySetup
        ? await verifyUpdateTwoFAAPI(finalPayload)
        : await verifyTwoFAAPI(finalPayload);
      const data = resp.data;
      if (data) {
        dispatch(setIsVerifyingTwoFa(false));
        dispatch(setTwoFaQRCode(''));
        dispatch(setTwoFASecret(''));
        dispatch(setTwoFAOtpUrl(''));
        dispatch(resetVerifyTwoFaForm());
        dispatch(resetUpdateTwoFaForm());
        showToast({
          type: 'successToast',
          title: `Two FA ${isAlreadySetup ? 'update' : 'new created'} successfully`,
        });
        if (!isAlreadySetup) {
          dispatch(setUserDetails(data));
        }
      } else {
        throw new Error('Something went wrong in verify update two fa');
      }
    } catch (e) {
      console.error('Error in verifyUpdateTwoFa', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsVerifyingTwoFa(false));
    }
  },
);

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSelectedSettingsTab(state, { payload }) {
      state.selectedSettingsTab = payload;
    },
    setIsUpdatingPersonalInfo(state, { payload }) {
      state.isUpdatingPersonalInfo = payload;
    },
    setIsUpdatingPassword(state, { payload }) {
      state.isUpdatingPassword = payload;
    },
    setIsDeletingPasskey(state, { payload }) {
      state.isDeletePasskey = payload;
    },
    setIsUpdatingPasskey(state, { payload }) {
      state.isUpdatingPasskey = payload;
    },
    setIsEmailOTPSubmitting(state, { payload }) {
      state.isEmailOTPSubmitting = payload;
    },
    setIsEmailOTPSubmittingSuccessfully(state, { payload }) {
      state.isEmailOTPSubmittingSuccessfully = payload;
    },
    setIsVerifyingEmailOTP(state, { payload }) {
      state.isVerifyingEmailOTP = payload;
    },
    setIsUpdatingTwoFa(state, { payload }) {
      state.isUpdatingTwoFa = payload;
    },
    setIsVerifyingTwoFa(state, { payload }) {
      state.isVerifyingTwoFa = payload;
    },
    setTwoFaQRCode(state, { payload }) {
      state.twoFaQRCode = payload;
      state.isUpdatingTwoFa = false;
    },
    setSelectedTwoFaTab(state, { payload }) {
      state.selected_two_fa_tab = payload;
    },
    setTwoFASecret(state, { payload }) {
      state.secret = payload;
      state.isUpdatingTwoFa = false;
    },
    setTwoFAOtpUrl(state, { payload }) {
      state.otpAuthUrl = payload;
    },
    resetSettings() {
      return initialState;
    },
  },
});

export const {
  setSelectedSettingsTab,
  setIsUpdatingPersonalInfo,
  setIsUpdatingPassword,
  setIsEmailOTPSubmitting,
  setIsEmailOTPSubmittingSuccessfully,
  setIsVerifyingEmailOTP,
  setIsUpdatingTwoFa,
  setIsVerifyingTwoFa,
  setTwoFaQRCode,
  resetSettings,
  setSelectedTwoFaTab,
  setIsDeletingPasskey,
  setIsUpdatingPasskey,
  setTwoFASecret,
  setTwoFAOtpUrl,
} = settingsSlice.actions;
