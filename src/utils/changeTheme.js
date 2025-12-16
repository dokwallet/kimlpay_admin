'use client';

const changeTheme = theme => {
  document.documentElement.setAttribute('data-theme', theme);
};

export default changeTheme;
