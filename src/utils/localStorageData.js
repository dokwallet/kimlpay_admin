'use client';

export const getThemeFromLocalStorage = () =>
  typeof window !== 'undefined' && window.localStorage.getItem('theme');
export const setThemeToLocalStorage = value =>
  typeof window !== 'undefined' && window.localStorage.setItem('theme', value);
