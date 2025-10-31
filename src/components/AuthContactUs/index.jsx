'use client';
import React from 'react';

import AuthContainer from '@/components/AuthContainer';

import ContactUs from '@/components/ContactUs';

const AuthContactUs = () => {
  return (
    <AuthContainer hideTitle={true}>
      <ContactUs />
    </AuthContainer>
  );
};

export default AuthContactUs;
