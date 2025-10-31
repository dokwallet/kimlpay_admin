import { USER_TABS } from '@/utils/helper';

export const isRegisterSubmitting = state => state.user.isRegisterSubmitting;

export const getPreAuthUser = state => state.user.preAuthUser;
export const isEmailOTPSubmitting = state => state.user.isEmailOTPSubmitting;
export const isResendEmailSubmitting = state =>
  state.user.isResendEmailSubmitting;

export const getTwoFaQrCodeString = state => state.user.twoFaQrCodeString;
export const getPasskeyOptions = state => state.user.passkeyOptions;
export const isLoadingTwoFA = state => state.user.isLoadingTwoFA;
export const isCredentialSubmitting = state =>
  state.user.isCredentialSubmitting;
export const isForgetPasswordSubmitting = state =>
  state.user.isForgetPasswordSubmitting;
export const isVerifyForgetPasswordSubmitting = state =>
  state.user.isVerifyForgetPasswordSubmitting;

export const getUserData = state => state.user.user;
export const isUserLoading = state => state.user.isUserLoading;
export const isVerifyingTwoFa = state => state.user.isVerifyingTwoFa;

export const getSelectedUsersTab = state => state.user.selectedUsersTab;
export const isUsersFetchedAlready = state => state.user.isUsersFetchedAlready;

export const getUsersData = state => state.user.usersData;
export const getUsersFilter = state => state.user.usersFilter;

export const isExpandUsersFilter = state => state.user.isExpandUsersFilter;

export const getIsUsersExporting = state => state.user.isExporting;

export const isMultiUserSelectEnable = state => {
  const tabName = USER_TABS[state.user.selectedUsersTab];
  return state.user.isMultiUserSelectEnable[tabName] || false;
};

export const getSelectedUserIds = state => {
  const tabName = USER_TABS[state.user.selectedUsersTab];
  return state.user.selectedUserIds[tabName] || {};
};

export const getPermissions = state =>
  state.user?.user?.role?.permissions ?? [];

export const getTwoFaOTPAuthUrl = state => state.user.otpAuthUrl;
export const getTwoFaSecret = state => state.user.secret;
