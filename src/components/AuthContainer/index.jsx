'use client';
import React from 'react';
import AuthHeader from '@/components/authHeader';
import s from './AuthContainer.module.css';
import AuthFooter from '@/components/AuthFooter';

const AuthContainer = ({ children, hideTitle, customStyle, showVideo }) => {
  return (
    <div className={s.app}>
      <div className={s.mainContainer}>
        <div
          className={s.registerFormContainer}
          style={customStyle ? customStyle : {}}>
          <AuthHeader hideTitle={hideTitle} />
          <div className={s.subContainer}>{children}</div>
        </div>
        <AuthFooter />
      </div>
    </div>
  );
};

export default AuthContainer;
