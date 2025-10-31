'use client';
import { decode } from 'jsonwebtoken';

export const decodeAccessToken = () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      return decode(accessToken);
    }
    return null;
  } catch (e) {
    console.error('Error in decode access token', e);
    return null;
  }
};

export const decodeRefreshToken = () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      return decode(refreshToken);
    }
    return null;
  } catch (e) {
    console.error('Error in decode refresh token', e);
    return null;
  }
};
export const isSessionActive = () => {
  try {
    const decodeData = decodeRefreshToken();
    if (decodeData) {
      const currentTime = new Date.now() / 1000;
      return currentTime < decodeData?.exp;
    }
    return false;
  } catch (e) {
    console.error('Error in isSessionActive', e);
    return false;
  }
};

export const getSessionStorage = () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('accessToken');
  return { refreshToken, accessToken };
};

export const setSessionStorage = (accessToken, refreshToken) => {
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('accessToken', accessToken);
};

export const clearSessionStorage = () => {
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('accessToken');
};
