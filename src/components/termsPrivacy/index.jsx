import React from 'react';
import s from './TermsPrivacy.module.css';
import { getAppTitle } from '@/whitelabel/whiteLabelInfo';
import Link from 'next/link';

const TermsPrivacy = ({
  type = 'signin',
  termsUrl = 'https://reap.global/terms-conditions',
}) => {
  return (
    <div className={s.termsContainer}>
      {type === 'signin'
        ? `By continuing you accept ${getAppTitle()}`
        : `By clicking Sign up, I agree to ${getAppTitle()}’s`}{' '}
      <span>
        <br />
        <a
          href={'/terms-conditions'}
          target='_blank'
          rel='noopener noreferrer'
          className={s.linkText}>
          Terms of Services
        </a>
      </span>{' '}
      and{' '}
      <Link
        href={'/privacy-policy'}
        target='_blank'
        rel='noopener noreferrer'
        className={s.linkText}>
        Privacy Policy
      </Link>
    </div>
  );
};

export default TermsPrivacy;
