import axios from 'axios';
import { replaceRoute } from '@/utils/routing';
import { getFilenameFromUrl } from '@/utils/helper';
import { getSessionStorage } from '@/utils/sessionStorageData';

export let IS_SANDBOX = true;

const productionHost = [
  'admin.kimlcards.com',
  'www.admin.kimlcards.com',
  'admins.kimlcards.com',
  'www.admins.kimlcards.com',
];

const DokCreditCardAPI = axios.create({
  baseURL: 'https://api.kimlcards.com',
  // baseURL: 'http://localhost:3001/dev',
  timeout: 60000,
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
  DokCreditCardAPI.defaults.params.sandbox = IS_SANDBOX;
};

export const setAuthToken = token => {
  DokCreditCardAPI.defaults.headers.Authorization = token;
};

// Add a response interceptor
DokCreditCardAPI.interceptors.response.use(
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
    const resp = await DokCreditCardAPI.get('/whitelabel/get-whitelabel-info');
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in fetching white label info', e?.message);
    throw e;
  }
};

export const registerUser = async payload => {
  try {
    const resp = await DokCreditCardAPI.post('/auth/register', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in register api', e?.message);
    throw e;
  }
};

export const resendEmailOtp = async payload => {
  try {
    const resp = await DokCreditCardAPI.post(
      '/auth/resend-verify-email',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in resend email otp', e);
    throw e;
  }
};

export const verifyEmailOtp = async payload => {
  try {
    const resp = await DokCreditCardAPI.post('/auth/verify-email', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in verify email otp', e?.message);
    throw e;
  }
};

export const createTwoFa = async payload => {
  try {
    const resp = await DokCreditCardAPI.post('/auth/generate-two-fa', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in generate two FA', e?.message);
    throw e;
  }
};

export const generateTwoFaForExistingUser = async payload => {
  try {
    const resp = await DokCreditCardAPI.post(
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
    const resp = await DokCreditCardAPI.post(
      '/auth/check-credentials',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in checkCredential', e?.message);
    throw e;
  }
};

export const forgetPasswordAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.post('/auth/forget-password', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in forgetPasswordAPI', e?.message);
    throw e;
  }
};

export const verifyForgetPasswordAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.post(
      '/auth/verify-forget-password',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in verifyForgetPasswordAPI', e?.message);
    throw e;
  }
};

export const createBulkShippingAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.post(
      '/shipping/create-bulk-shipping',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in createBulkShippingAPI', e?.message);
    throw e;
  }
};

export const getUserAPI = async () => {
  // /user/get-all-users
  try {
    const resp = await DokCreditCardAPI.get('/user/get-user');
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getUserAPI', e?.message);
    throw e;
  }
};

export const getShippingAPI = async () => {
  try {
    const resp = await DokCreditCardAPI.get('/shipping/get-shipping');
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getShippingAPI', e?.message);
    throw e;
  }
};

export const exportLinksAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get('/payment/export-links', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in exportShippingAPI', e?.message);
    throw e;
  }
};

export const getLinksAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get('/payment/links', {
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
    const resp = await DokCreditCardAPI.get('/telegram/users', {
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
    const resp = await DokCreditCardAPI.get('/telegram/users/export', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in exportShippingAPI', e?.message);
    throw e;
  }
};

export const updateTelegramUserStatusAPI = async (telegramId, status) => {
  try {
    const resp = await DokCreditCardAPI.put(
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
    const resp = await DokCreditCardAPI.get(
      '/transactions/get-card-transactions',
      {
        params: payload,
      },
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getCardTransactionAPI', e?.message);
    throw e;
  }
};

export const getUsersAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get('/user/get-all-users', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getUsersAPI', e?.message);
    throw e;
  }
};

export const getAllFaq = async queryParams => {
  try {
    const resp = await DokCreditCardAPI.get('/public/get-faq', {
      params: queryParams,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    throw e;
  }
};

export const exportAdminTransactionsAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get(
      '/transactions/export-transactions',
      {
        params: payload,
      },
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in exportShippingAPI', e?.message);
    throw e;
  }
};

export const getTopupAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get('/admin/topup/get-all-topup', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getTopupAPI', e?.message);
    throw e;
  }
};

export const updateTopupStatusAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/admin/topup/update-topup-status',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateTopupStatusAPI', e?.message);
    throw e;
  }
};

export const updateDepositCommissionAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/admin/deposit/update-deposit-commission',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateDepositCommissionAPI', e?.message);
    throw e;
  }
};

export const exportTopupAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get('/admin/topup/export-all-topup', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in exportTopupAPI', e?.message);
    throw e;
  }
};

export const updatePersonalInfoAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/user/update-personal-info',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updatePersonalInfoAPI', e?.message);
    throw e;
  }
};

export const updatePasswordAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put('/user/update-password', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updatePasswordAPI', e?.message);
    throw e;
  }
};

export const deletePasskeyAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put('/user/delete-passkey', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in deletePasskeyAPI', e?.message);
    throw e;
  }
};

export const updatePasskeyAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put('/user/update-passkey', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updatePasskeyAPI', e?.message);
    throw e;
  }
};

export const updateEmailAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put('/user/update-email', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateEmailAPI', e?.message);
    throw e;
  }
};

export const verifyUpdateEmailAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/user/verify-update-email',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in verifyUpdateEmailAPI', e?.message);
    throw e;
  }
};

export const updateTwoFAAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put('/user/update-twofa', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateTwoFAAPI', e?.message);
    throw e;
  }
};

export const verifyUpdateTwoFAAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/user/verify-update-twofa',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in verifyUpdateTwoFAAPI', e?.message);
    throw e;
  }
};

export const verifyTwoFAAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put('/user/verify-twofa', payload);
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
    const resp = await DokCreditCardAPI.put(
      '/user/update-user-status',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateUserStatusAPI', e?.message);
    throw e;
  }
};

export const exportUserAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get('/user/export-all-users', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in exportTopupAPI', e?.message);
    throw e;
  }
};

export const updateUserAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/admin/users/update-user',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateUserAPI', e?.message);
    throw e;
  }
};

export const getShippingsAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get(
      '/admin/shipping/get-all-shippings',
      {
        params: payload,
      },
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getShippingsAPI', e?.message);
    throw e;
  }
};

export const updateShippingStatusAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/admin/shipping/update-shipping-status',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateShippingStatusAPI', e?.message);
    throw e;
  }
};

export const exportShippingAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get(
      '/admin/shipping/export-all-shipping',
      {
        params: payload,
      },
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in exportShippingAPI', e?.message);
    throw e;
  }
};

export const createAffiliateUserAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.post(
      '/admin/affiliate-user/create-affiliate-user',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in createAffiliateUserAPI', e?.message);
    throw e;
  }
};

export const getAffiliateUsersAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get('/user/get-all-admin-users', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getShippingsAPI', e?.message);
    throw e;
  }
};

export const getPublicAffiliateUsersAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get(
      '/public/get-public-affiliate-user',
      {
        params: payload,
      },
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getPublicAffiliateUsersAPI', e?.message);
    throw e;
  }
};
export const exportAffiliateUserAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get(
      '/admin/affiliate-user/export-all-affiliate-users',
      {
        params: payload,
      },
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in exportTopupAPI', e?.message);
    throw e;
  }
};

export const updateAffiliateUserAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/admin/affiliate-user/update-affiliate-user',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateAffiliateUserAPI', e?.message);
    throw e;
  }
};

export const updateAffiliateUserIdAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/admin/affiliate-user/update-affiliate-user-id',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateAffiliateUserIdAPI', e?.message);
    throw e;
  }
};

export const updateAffiliateUserTopupCommissionAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/admin/affiliate-user/update-affiliate-user-topup-commission',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateAffiliateUserAPI', e?.message);
    throw e;
  }
};

export const updateAffiliateUserStatusAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/admin/affiliate-user/update-affiliate-user-status',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateAffiliateUserStatusAPI', e?.message);
    throw e;
  }
};

export const loginAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.post('/auth/login', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in loginAPI', e?.message);
    throw e;
  }
};

export const refreshTokenAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.post('/auth/refresh-token', payload);
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in refreshTokenAPI', e?.message);
    throw e;
  }
};

export const getTransactionFilesAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get(
      '/admin/transaction-files/get-all-transaction-files',
      {
        params: payload,
      },
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getTransactionFilesAPI', e?.message);
    throw e;
  }
};

export const updateUserTopupCommissionAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/admin/users/update-user-topup-commission',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateUserTopupCommissionAPI', e?.message);
    throw e;
  }
};
export const updateUserPlateformFeeAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/user/update-user-plateform-fee-commission',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updateUserPlateformFeeAPI', e?.message);
    throw e;
  }
};

export const getPayoutAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get('/admin/payout/get-payout', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getPayoutAPI', e?.message);
    throw e;
  }
};

export const exportPayoutAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.get('/admin/payout/export-payout', {
      params: payload,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in exportPayoutAPI', e?.message);
    throw e;
  }
};

export const updatePayoutAPI = async payload => {
  try {
    const resp = await DokCreditCardAPI.put(
      '/admin/payout/update-payout',
      payload,
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in updatePayoutAPI', e?.message);
    throw e;
  }
};

export const getUsersChartAPI = async (query = {}) => {
  try {
    const resp = await DokCreditCardAPI.get('/admin/chart/get-users-chart', {
      params: query,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getUsersChartAPI', e?.message);
    throw e;
  }
};

export const getEarningsChartAPI = async (query = {}) => {
  try {
    const resp = await DokCreditCardAPI.get('/admin/chart/get-earnings-chart', {
      params: query,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getEarningsChartAPI', e?.message);
    throw e;
  }
};

export const getDepositsChartAPI = async (query = {}) => {
  try {
    const resp = await DokCreditCardAPI.get('/admin/chart/get-deposits-chart', {
      params: query,
    });
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getDepositsChartApi', e?.message);
    throw e;
  }
};

export const getReapInvoiceChartAPI = async () => {
  try {
    const resp = await DokCreditCardAPI.get(
      '/admin/chart/get-reap-invoice-chart',
    );
    return { status: resp?.status, data: resp?.data?.data };
  } catch (e) {
    console.error('Error in getReapInvoiceChartApi', e?.message);
    throw e;
  }
};
