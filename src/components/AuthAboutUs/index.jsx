'use client';
import React from 'react';
import AuthContainer from '@/components/AuthContainer';
import AboutUs from '@/components/AboutUs';

const AuthAboutUs = () => {
  return (
    <AuthContainer hideTitle={true} customStyle={{ maxWidth: '95%' }}>
      <AboutUs />
    </AuthContainer>
  );
};

export default AuthAboutUs;
