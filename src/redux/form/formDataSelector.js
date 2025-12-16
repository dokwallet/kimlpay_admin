export const getRegisterFormData = state => state.formData.registerForm;
export const getLoginFormData = state => state.formData.loginForm;
export const getForgetPasswordFormData = state =>
  state.formData.forgetPasswordForm;
export const getCreateBulkShippingFormData = state =>
  state.formData.createBulkShippingForm;

export const getUpdatePersonalInfoForm = state =>
  state.formData.updatePersonalInfoForm;

export const getUpdatePasswordForm = state => state.formData.updatePasswordForm;
export const getUpdateEmailForm = state => state.formData.updateEmailForm;
export const getVerifyEmailForm = state => state.formData.verifyEmailForm;
export const getUpdateTwoFaForm = state => state.formData.updateTwoFaForm;
export const getVerifyTwoFaForm = state => state.formData.verifyTwoFaForm;
export const getCreateAffiliateUserFormData = state =>
  state.formData.createAffiliateUserForm;

export const showCreateAffiliateUserModal = state =>
  state.formData.createAffiliateUserForm.showCreateAffiliateUserModal;
