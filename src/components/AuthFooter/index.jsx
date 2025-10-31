import s from './AuthFooter.module.css';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { getAppName } from '@/whitelabel/whiteLabelInfo';

const AuthFooter = () => {
  const currentYear = useMemo(() => {
    return dayjs().format('YYYY');
  }, []);
  return (
    <div className={s.footerContainer}>
      {`© ${currentYear} ${getAppName()} All Rights Reserved`}
    </div>
  );
};

export default AuthFooter;
