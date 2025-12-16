import s from './AuthFooter.module.css';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const AuthFooter = () => {
  const currentYear = useMemo(() => {
    return dayjs().format('YYYY');
  }, []);
  return (
    <div className={s.footerContainer}>
      {`© ${currentYear} KIML pay All Rights Reserved`}
    </div>
  );
};

export default AuthFooter;
