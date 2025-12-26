import React, { useContext } from 'react';
import s from './AuthHeader.module.css';
import { ThemeContext } from '@/theme/ThemeContext';
import Image from 'next/image';
import imageLoader from '@/components/NextImageLoader';
import Link from 'next/link';
import { getAppLogo } from '@/whitelabel/whiteLabelInfo';

const AuthHeader = ({ hideTitle }) => {
  const { themeType } = useContext(ThemeContext);

  return (
    <div className={s.authContainer}>
      <Link className={s.logoContainer} href={'/'}>
        <Image
          priority={true}
          src={getAppLogo()?.[themeType]}
          width={250}
          height={50}
          loader={imageLoader}
          alt={'App logo'}
        />
      </Link>
      {!hideTitle && (
        <div className={s.descriptionContainer}>{'Admin Page'}</div>
      )}
    </div>
  );
};

export default AuthHeader;
