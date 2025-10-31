import React, { useContext, useEffect, useMemo } from 'react';
import s from './AuthHeader.module.css';
import {
  getAppIcon,
  getAppLogo,
  getAppTitle,
} from '@/whitelabel/whiteLabelInfo';
import { ThemeContext } from '@/theme/ThemeContext';
import Image from 'next/image';
import KimlLogo from '@/assets/logo/kiml_light.png';
import KimlLogoDark from '@/assets/logo/kiml_dark.png';
import Link from 'next/link';

const AuthHeader = ({ hideTitle }) => {
  const { themeType } = useContext(ThemeContext);

  useEffect(() => {
    document.title = getAppTitle();
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = getAppIcon();
  }, []);

  return (
    <div className={s.authContainer}>
      <Link className={s.logoContainer} href={'/'}>
        <Image
          priority={true}
          src={
            KimlLogo?.[themeType]
              ? KimlLogo?.[themeType]
              : themeType === 'light'
                ? KimlLogo
                : KimlLogoDark
          }
          width={250}
          height={50}
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
