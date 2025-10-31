'use client';
import React from 'react';
import AuthHeader from '@/components/authHeader';
import s from './AuthContainer.module.css';
import RightPanel from '@/components/rightPanel';
import AuthFooter from '@/components/AuthFooter';
import useWindowSize from '@/hooks/useWindowSize';
import { THRESHOLD_WIDTH } from '@/utils/configValues';

const AuthContainer = ({ children, hideTitle, customStyle, showVideo }) => {
  const { width: windowWidth } = useWindowSize();

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
      {windowWidth > THRESHOLD_WIDTH && <RightPanel showVideo={showVideo} />}
    </div>
  );
};

export default AuthContainer;
