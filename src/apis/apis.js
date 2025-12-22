import axios from 'axios';
import { replaceRoute } from '@/utils/routing';
import { getFilenameFromUrl } from '@/utils/helper';
import { getSessionStorage } from '@/utils/sessionStorageData';

export let IS_SANDBOX = true;

const productionHost = [
  'main.d2yrv1ijeczgny.amplifyapp.com',
  'www.main.d2yrv1ijeczgny.amplifyapp.com',
  'admin-pay.kimlwallet.com',
  'www.admin-pay.kimlwallet.com',
  'admin-pay.dokwallet.com',
  'www.admin-pay.dokwallet.com',
];

const KimlPayAdmin = axios.create({
  baseURL: 'https://m8y4xi3hdc.execute-api.eu-north-1.amazonaws.com/dev',
  // baseURL: 'http://localhost:3001/dev',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'api-version': 'v2',
  },
  params: {
    sandbox: IS_SANDBOX,
    is_admin: true,
  },
});

export const setIsSandbox = host => {
  IS_SANDBOX = !productionHost.includes(host);
  KimlPayAdmin.defaults.params.sandbox = IS_SANDBOX;
};

export const setAuthToken = token => {
  KimlPayAdmin.defaults.headers.Authorization = token;
};

// Add a response interceptor
KimlPayAdmin.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (
      error?.response?.status === 401 &&
      error?.response?.data?.message === 'Unauthorized'
    ) {
      replaceRoute('/login');
    } else if (
      error?.response?.status === 401 &&
      error?.response?.data?.message === 'Token expired'
    ) {
      const { store } = require('@/redux/store');
      const {
        checkAndSetAuthUser,
        signout,
      } = require('@/redux/auth/authSlice');

      const userData = await store.dispatch(checkAndSetAuthUser()).unwrap();
      if (userData) {
        const { accessToken } = getSessionStorage();
        originalRequest.headers['Authorization'] = accessToken;
        return axios(originalRequest);
      } else {
        store.dispatch(signout());
      }
    }
    return Promise.reject(error);
  },
);

export const fetchWhiteLabelInfo = async () => {
  try {
    const resp = await KimlPayAdmin.get('/whitelabel/get-whitelabel-info');
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in fetching white label info', e?.message);
    throw e;
  }
};

export const registerUser = async payload => {
  try {
    const resp = await KimlPayAdmin.post('/auth/register', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in register api', e?.message);
    throw e;
  }
};

export const resendEmailOtp = async payload => {
  try {
    const resp = await KimlPayAdmin.post('/auth/resend-verify-email', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in resend email otp', e);
    throw e;
  }
};

export const verifyEmailOtp = async payload => {
  try {
    const resp = await KimlPayAdmin.post('/auth/verify-email', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in verify email otp', e?.message);
    throw e;
  }
};

export const createTwoFa = async payload => {
  try {
    const resp = await KimlPayAdmin.post('/auth/generate-two-fa', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in generate two FA', e?.message);
    throw e;
  }
};

export const generateTwoFaForExistingUser = async payload => {
  try {
    const resp = await KimlPayAdmin.post(
      '/user/generate-two-fa-existing-user',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in generate two FA for existing user', e?.message);
    throw e;
  }
};
export const checkCredential = async payload => {
  try {
    const resp = await KimlPayAdmin.post('/auth/check-credentials', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in checkCredential', e?.message);
    throw e;
  }
};

export const forgetPasswordAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.post('/auth/forget-password', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in forgetPasswordAPI', e?.message);
    throw e;
  }
};

export const verifyForgetPasswordAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.post(
      '/auth/verify-forget-password',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in verifyForgetPasswordAPI', e?.message);
    throw e;
  }
};

export const getUserAPI = async () => {
  try {
    const resp = await KimlPayAdmin.get('/user/get-user');
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getUserAPI', e?.message);
    throw e;
  }
};

export const exportLinksAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.get('/admin/export-links', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in exportLinksAPI', e?.message);
    throw e;
  }
};

export const getLinksAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.get('/admin/get-all-admin-payment-links', {
      params: {
        ...payload,
      },
    });

    return { status: resp?.status, data: resp?.data?.data };
  } catch (error) {
    return {
      status: error?.response?.status,
      message: error?.response?.data?.message || 'Something went wrong',
    };
  }
};
export const getTelegramUsersAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.get('/admin/telegram-users', {
      params: {
        ...payload,
      },
    });

    return { status: resp?.status, data: resp?.data?.data };
  } catch (error) {
    return {
      status: error?.response?.status,
      message: error?.response?.data?.message || 'Something went wrong',
    };
  }
};

export const exportTelegramUsersAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.get('/admin/export-admin-telegram', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in exportTelegramUsersAPI', e?.message);
    throw e;
  }
};

export const updateTelegramUserStatusAPI = async (telegramId, status) => {
  try {
    const resp = await KimlPayAdmin.put(
      '/admin/users/update-telegram-user-status',
      {
        telegramId,
        status,
      },
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateUserStatusAPI', e?.message);
    throw e;
  }
};

export const getAdminTransactionsAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.get('/admin/get-admin-transactions', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getCardTransactionAPI', e?.message);
    throw e;
  }
};
export const getAdminPaymentWithdrawalsAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.get('/admin/get-admin-withdrawals', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getAdminPaymentWithdrawalsAPI', e?.message);
    throw e;
  }
};

export const updateWithdrawalsAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.put(
      '/admin/update-admin-withdrawal',
      null,
      {
        params: payload,
      },
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateWithdrawalsAPI', e?.message);
    throw e;
  }
};

export const exportAdminPaymentWithdrawalsAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.get('/admin/export-admin-withdrawals', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in exportAdminPaymentWithdrawalsAPI', e?.message);
    throw e;
  }
};

export const getUsersAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.get('/admin/get-all-users', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getUsersAPI', e?.message);
    throw e;
  }
};

export const exportAdminTransactionsAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.get('/admin/export-admin-transactions', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in exportAdminTransactionsAPI', e?.message);
    throw e;
  }
};

export const updatePersonalInfoAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.put('/user/update-personal-info', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updatePersonalInfoAPI', e?.message);
    throw e;
  }
};

export const updatePasswordAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.put('/user/update-password', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updatePasswordAPI', e?.message);
    throw e;
  }
};

export const deletePasskeyAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.put('/user/delete-passkey', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in deletePasskeyAPI', e?.message);
    throw e;
  }
};

export const updatePasskeyAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.put('/user/update-passkey', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updatePasskeyAPI', e?.message);
    throw e;
  }
};

export const updateEmailAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.put('/user/update-email', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateEmailAPI', e?.message);
    throw e;
  }
};

export const verifyUpdateEmailAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.put('/user/verify-update-email', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in verifyUpdateEmailAPI', e?.message);
    throw e;
  }
};

export const updateTwoFAAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.put('/user/update-twofa', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateTwoFAAPI', e?.message);
    throw e;
  }
};

export const verifyUpdateTwoFAAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.put('/user/verify-update-twofa', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in verifyUpdateTwoFAAPI', e?.message);
    throw e;
  }
};

export const verifyTwoFAAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.put('/user/verify-twofa', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in verifyTwoFAAPI', e?.message);
    throw e;
  }
};

export const downloadFile = url => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', getFilenameFromUrl(url));
  document.body.appendChild(link);
  link.click();
};

export const updateUserStatusAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.put('/admin/update-user-status', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateUserStatusAPI', e?.message);
    throw e;
  }
};

export const exportUserAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.get('/admin/export-all-users', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in exportUserAPI', e?.message);
    throw e;
  }
};

export const updateUserAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.put('/admin/users/update-user', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateUserAPI', e?.message);
    throw e;
  }
};

export const loginAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.post('/auth/login', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in loginAPI', e?.message);
    throw e;
  }
};

export const refreshTokenAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.post('/auth/refresh-token', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in refreshTokenAPI', e?.message);
    throw e;
  }
};

export const updateUserPlateformFeeAPI = async payload => {
  try {
    const resp = await KimlPayAdmin.put(
      '/admin/update-user-plateform-fee-commission',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateUserPlateformFeeAPI', e?.message);
    throw e;
  }
};
