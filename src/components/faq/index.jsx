'use client';
import React from 'react';
import AuthContainer from '@/components/AuthContainer';
import FAQContent from './faqContent';

const FAQ = () => {
  return (
    <AuthContainer hideTitle={true} customStyle={{ maxWidth: '100%' }}>
      <FAQContent />
    </AuthContainer>
  );
};

export default FAQ;
