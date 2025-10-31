export const getSelectedSettingsTab = state =>
  state.settings.selectedSettingsTab;

export const isUpdatingPersonalInfo = state =>
  state.settings.isUpdatingPersonalInfo;

export const isUpdatingPassword = state => state.settings.isUpdatingPassword;
export const isEmailOTPSubmitting = state =>
  state.settings.isEmailOTPSubmitting;
export const isEmailOTPSubmittingSuccessfully = state =>
  state.settings.isEmailOTPSubmittingSuccessfully;

export const isVerifyingEmailOTP = state => state.settings.isVerifyingEmailOTP;
export const isUpdatingTwoFa = state => state.settings.isUpdatingTwoFa;
export const isVerifyingTwoFa = state => state.settings.isVerifyingTwoFa;
export const getTwoFaQRCode = state => state.settings.twoFaQRCode;
export const getSelectedTwoFaTab = state => state.settings.selected_two_fa_tab;
export const isDeletePasskey = state => state.settings.isDeletePasskey;
export const isUpdatingPasskey = state => state.settings.isUpdatingPasskey;

export const getTwoFaOTPAuthUrl = state => state.settings.otpAuthUrl;
export const getTwoFaSecret = state => state.settings.secret;
