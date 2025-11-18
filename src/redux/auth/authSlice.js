import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPreAuthUser } from '@/redux/user/userSelector';
import {
  getPublicAffiliateUsersAPI,
  loginAPI,
  refreshTokenAPI,
  setAuthToken,
} from '@/apis/apis';
import { showToast } from '@/utils/toast';
import { getUser } from '@/redux/user/userSlice';
import jwt from 'jsonwebtoken';
import { logout } from '@/utils/logout';
import {
  clearSessionStorage,
  decodeAccessToken,
  decodeRefreshToken,
  getSessionStorage,
  setSessionStorage,
} from '@/utils/sessionStorageData';
import {
  startPasskeyAuthentication,
  startPasskeyRegistration,
} from '@/utils/passkey';
import NextBugfender from '@/utils/bugfender';

const initialState = {
  authUser: null,
  accessToken: null,
  refreshToken: null,
  isSigning: false,
  isSingingOut: false,
  publicAffiliateUsers: [],
  selectedPublicAffiliateUser: null,
  isLoadingPublicAffiliate: false,
};

const storeAuthData = (dispatch, data) => {
  const accessToken = data.accessToken;
  const refreshToken = data.refreshToken;
  if (!accessToken || !refreshToken) {
    throw new Error('Not found token');
  }
  setAuthToken(accessToken);
  const decodeTokenData = jwt.decode(accessToken);
  dispatch(
    setAuthData({
      authUser: decodeTokenData,
      accessToken,
      refreshToken,
    }),
  );
  setSessionStorage(accessToken, refreshToken);
  return { authUser: decodeTokenData };
};
export const login = createAsyncThunk(
  'auth/login',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsSigning(true));
      const router = payload.router;
      const currentState = thunkAPI.getState();
      const user = getPreAuthUser(currentState);
      const isTwoFAEnabled = user.two_fa_enable;
      const finalPayload = {
        email: user?.email,
        password: user?.password,
        type: payload?.type,
      };
      if (payload.code) {
        finalPayload.otp = payload.code;
      }

      if (payload?.type === 'PASSKEY' && payload.passkeyOptions) {
        finalPayload.passkeyData = isTwoFAEnabled
          ? await startPasskeyAuthentication(payload.passkeyOptions)
          : await startPasskeyRegistration(payload.passkeyOptions);
      }
      const response = await loginAPI(finalPayload);
      storeAuthData(dispatch, response?.data);
      dispatch(setIsSigning(false));
      dispatch(getUser());
      NextBugfender.setDeviceKey(finalPayload.email);
      router.replace('/dashboard/admin/users');
    } catch (e) {
      console.error('Error in login', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsSigning(false));
    }
  },
);

export const checkAndSetAuthUser = createAsyncThunk(
  'auth/checkAndSetAuthUser',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      const { accessToken, refreshToken } = getSessionStorage();
      const decodedAccessTokenData = decodeAccessToken();
      const currentTime = Date.now() / 1000;
      if (decodedAccessTokenData?.exp > currentTime) {
        return storeAuthData(dispatch, { accessToken, refreshToken });
      } else {
        const decodedRefreshTokenData = decodeRefreshToken();
        if (decodedRefreshTokenData?.exp > currentTime) {
          const resp = await refreshTokenAPI({ refreshToken });
          return storeAuthData(dispatch, resp?.data);
        } else {
          clearSessionStorage();
          return null;
        }
      }
    } catch (e) {
      clearSessionStorage();
      console.error('Error in checkAndSetAuthUser', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      return null;
    }
  },
);

export const fetchPublicAffiliateUser = createAsyncThunk(
  'auth/fetchPublicAffiliateUser',
  async (payload, thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    try {
      dispatch(setIsLoadingPublicAffiliate(true));
      const finalPayload = {
        limit: payload?.limit || 20,
        page: payload?.page || 1,
      };
      if (payload?.username) {
        finalPayload.username = payload?.username;
      }
      const resp = await getPublicAffiliateUsersAPI(finalPayload);
      const affiliateUsersData = resp.data?.items;
      if (affiliateUsersData) {
        dispatch(setPublicAffiliateUsers(affiliateUsersData));
        if (finalPayload?.username && affiliateUsersData[0])
          dispatch(setSelectedPublicAffiliateUsers(affiliateUsersData[0]));
      } else {
        throw new Error('Something went wrong in fetching affiliate users');
      }
    } catch (e) {
      console.error('Error in getPublicAffiliateUser', e);
      showToast({
        type: 'errorToast',
        error: e,
      });
      dispatch(setIsLoadingPublicAffiliate(false));
    }
  },
);

export const signout = createAsyncThunk('auth/signout', async (_, thunkAPI) => {
  const dispatch = thunkAPI.dispatch;
  try {
    setIsSigningOut(true);
    await logout(dispatch);
  } catch (e) {
    console.error('Error in logout', e);
    showToast({
      type: 'errorToast',
      error: e,
    });
    dispatch(setIsSigningOut(false));
  }
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsSigning: (state, { payload }) => {
      state.isSigning = payload;
    },
    setIsSigningOut: (state, { payload }) => {
      state.isSingingOut = payload;
    },
    setAuthData(state, { payload }) {
      state.authUser = payload?.authUser;
      state.accessToken = payload?.accessToken;
      state.refreshToken = payload?.refreshToken;
    },
    setPublicAffiliateUsers: (state, { payload }) => {
      state.publicAffiliateUsers = payload;
      state.isLoadingPublicAffiliate = false;
    },
    setIsLoadingPublicAffiliate: (state, { payload }) => {
      state.isLoadingPublicAffiliate = payload;
    },
    setSelectedPublicAffiliateUsers: (state, { payload }) => {
      state.selectedPublicAffiliateUser = payload;
    },
    resetAuthData() {
      return initialState;
    },
  },
});

export const {
  resetAuthData,
  setAuthData,
  setIsSigning,
  setIsSigningOut,
  setPublicAffiliateUsers,
  setSelectedPublicAffiliateUsers,
  setIsLoadingPublicAffiliate,
} = authSlice.actions;
