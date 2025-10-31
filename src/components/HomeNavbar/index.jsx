import React, { useState } from 'react';
import styles from './HomeNavbar.module.css';
import KimlLogo from '@/assets/logo/kiml_logo_dark.png';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { getUserData } from '@/redux/user/userSelector';

const HomeNavbar = () => {
  const user = useSelector(getUserData);

  return (
    <div className={styles.navContainerWrapper}>
      <div className={styles.navContainerDesktop}>
        <Link href={'/'} className={styles.logoWrapper}>
          <Image
            src={KimlLogo}
            width={200}
            alt='KIML Logo'
            className={styles.navbarLogo}
          />
        </Link>
        <Link href={user ? '/dashboard/admin/topup' : '/login'}>
          <button className={styles.containedButton}>
            {user ? 'Dashboard' : 'Login'}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomeNavbar;
