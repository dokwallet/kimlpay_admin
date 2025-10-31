import React, { useMemo } from 'react';
import styles from './HomeFooter.module.css';
import { getAppName } from '@/whitelabel/whiteLabelInfo';
import dayjs from 'dayjs';

const HomeFooter = ({ optional = false }) => {
  const currentYear = useMemo(() => {
    return dayjs().format('YYYY');
  }, []);
  return (
    <div
      className={`${styles.footer} ${optional ? styles.optionalFooter : ''}`}
      id='footer'>
      <div className={styles.footerWrapper}>
        <p>
          © {currentYear} {getAppName()} All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default HomeFooter;
