'use client';
import React from 'react';
import AuthContainer from '@/components/AuthContainer';
import ProductOffer from '@/components/ProcuctOffer';

const AuthProductOffer = () => {
  return (
    <AuthContainer hideTitle={true} customStyle={{ maxWidth: '100%' }}>
      <ProductOffer />
    </AuthContainer>
  );
};

export default AuthProductOffer;
