import { createSlice } from '@reduxjs/toolkit';

const registerForm = {
  email: '',
  password: '',
  confirmPassword: '',
};

const loginForm = {
  email: '',
  password: '',
};

const forgetPasswordForm = {
  email: '',
  password: '',
};

const createShippingForm = {
  formStep: 0,
  shippingId: 'add_new_shipping',
  shippingAddressLine1: '',
  shippingAddressLine2: '',
  shippingCountry: null,
  shippingPostalCode: '',
  shippingCity: '',
  recipientFirstName: '',
  recipientLastName: '',
  recipientPhoneNumber: '',
  recipientDialCode: null,
  recipientEmail: '',
  amount: '120',
  coin_name: null,
  tx_hash: '',
};

const createBulkShippingForm = {
  formStep: 0,

  shippingId: 'add_new_shipping',
  shippingAddressLine1: '',
  shippingAddressLine2: '',
  shippingCountry: null,
  shippingPostalCode: '',
  shippingCity: '',
  recipientFirstName: '',
  recipientLastName: '',
  recipientPhoneNumber: '',
  recipientDialCode: null,
  recipientEmail: '',
};

const updatePersonalInfoForm = {
  first_name: '',
  last_name: '',
  country_code: null,
};

const updatePasswordForm = {
  current_password: '',
  new_password: '',
  confirm_new_password: '',
};

const updateEmailForm = {
  new_email: '',
};

const verifyEmailForm = {
  current_email_otp: '',
  new_email_otp: '',
};

const updateTwoFaForm = {
  current_otp: '',
};

const verifyTwoFaForm = {
  new_otp: '',
};

const createAffiliateUserForm = {
  name: '',
  email: '',
  country: null,
  addressLine1: '',
  addressLine2: '',
  city: '',
  zipcode: '',
  state: '',
  businessName: '',
  website: '',
  description: '',
  notes: '',
  showCreateAffiliateUserModal: false,
};

const initialState = {
  registerForm: registerForm,
  loginForm: loginForm,
  forgetPasswordForm: forgetPasswordForm,
  createBulkShippingForm,
  updatePersonalInfoForm,
  updatePasswordForm,
  verifyEmailForm,
  updateTwoFaForm,
  verifyTwoFaForm,
  createAffiliateUserForm,
};

export const formDataSlice = createSlice({
  name: 'formData',
  initialState,
  reducers: {
    setRegisterFormValues: (state, action) => {
      state.registerForm = {
        ...state.registerForm,
        ...action.payload,
      };
    },
    resetRegisterFormValues: state => {
      state.registerForm = registerForm;
    },
    setLoginFormValues: (state, action) => {
      state.loginForm = {
        ...state.loginForm,
        ...action.payload,
      };
    },
    resetLoginFormValues: state => {
      state.loginForm = loginForm;
    },
    setForgetPasswordFormValues: (state, action) => {
      state.forgetPasswordForm = {
        ...state.forgetPasswordForm,
        ...action.payload,
      };
    },
    resetForgetPasswordFormValues: state => {
      state.forgetPasswordForm = forgetPasswordForm;
    },

    setCreateBulkShippingForm: (state, action) => {
      state.createBulkShippingForm = {
        ...state.createBulkShippingForm,
        ...action.payload,
      };
    },
    resetCreateBulkShippingForm: state => {
      state.createBulkShippingForm = createBulkShippingForm;
    },
    setUpdatePersonalInfoForm: (state, action) => {
      state.updatePersonalInfoForm = {
        ...state.updatePersonalInfoForm,
        ...action.payload,
      };
    },
    resetUpdatePersonalInfoForm: state => {
      state.updatePersonalInfoForm = updatePersonalInfoForm;
    },
    setUpdatePasswordForm: (state, action) => {
      state.updatePasswordForm = {
        ...state.updatePasswordForm,
        ...action.payload,
      };
    },
    setUpdateEmailForm: (state, action) => {
      state.updateEmailForm = {
        ...state.updateEmailForm,
        ...action.payload,
      };
    },
    setVerifyEmailForm: (state, action) => {
      state.verifyEmailForm = {
        ...state.verifyEmailForm,
        ...action.payload,
      };
    },
    setUpdateTwoFaForm: (state, action) => {
      state.updateTwoFaForm = {
        ...state.updateTwoFaForm,
        ...action.payload,
      };
    },
    resetUpdateTwoFaForm: state => {
      state.updateTwoFaForm = updateTwoFaForm;
    },
    setVerifyTwoFaForm: (state, action) => {
      state.verifyTwoFaForm = {
        ...state.verifyTwoFaForm,
        ...action.payload,
      };
    },
    resetVerifyTwoFaForm: state => {
      state.verifyTwoFaForm = verifyTwoFaForm;
    },
    setCreateAffiliateUserForm: (state, action) => {
      state.createAffiliateUserForm = {
        ...state.createAffiliateUserForm,
        ...action.payload,
      };
    },
    resetCreateAffiliateUserForm: state => {
      state.createAffiliateUserForm = createAffiliateUserForm;
    },

    resetForm: () => {
      return initialState;
    },
  },
});

export const {
  resetRegisterFormValues,
  setRegisterFormValues,
  resetLoginFormValues,
  setLoginFormValues,
  resetForgetPasswordFormValues,
  setForgetPasswordFormValues,
  setCreateBulkShippingForm,
  resetCreateBulkShippingForm,
  resetUpdatePersonalInfoForm,
  setUpdatePersonalInfoForm,
  resetUpdateTwoFaForm,
  resetVerifyTwoFaForm,
  setUpdateEmailForm,
  setUpdatePasswordForm,
  setUpdateTwoFaForm,
  setVerifyEmailForm,
  setVerifyTwoFaForm,
  setCreateAffiliateUserForm,
  resetCreateAffiliateUserForm,
  resetForm,
} = formDataSlice.actions;
