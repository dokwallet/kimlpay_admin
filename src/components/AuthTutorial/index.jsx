'use client';
import React from 'react';
import Tutorial from '@/components/Tutorial';
import AuthContainer from '@/components/AuthContainer';

const AuthTutorial = () => {
  return (
    <AuthContainer hideTitle={true} customStyle={{ maxWidth: '100%' }}>
      <Tutorial />
    </AuthContainer>
  );
};

export default AuthTutorial;
