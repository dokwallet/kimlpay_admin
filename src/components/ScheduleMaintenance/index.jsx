import React, { memo, useCallback, useMemo } from 'react';
import styles from './ScheduleMaintenance.module.css';
import { IconButton } from '@mui/material';
import { Cancel, ManageHistory } from '@mui/icons-material';
import { getScheduleMaintenance } from '@/whitelabel/whiteLabelInfo';
import dayjs from 'dayjs';
import { getShowScheduleMaintenance } from '@/redux/extraData/extraSelectors';
import { useDispatch, useSelector } from 'react-redux';
import { setShowScheduleMaintenance } from '@/redux/extraData/extraDataSlice';

const ScheduleMaintenance = ({ isLandingPage }) => {
  const { startDate, endDate } = useMemo(() => {
    const scheduleMaintenance = getScheduleMaintenance();
    const startDate = scheduleMaintenance?.start_date;
    const endDate = scheduleMaintenance?.end_date;
    let formattedStartDate = null;
    let formattedEndDate = null;
    if (startDate && endDate && dayjs().isBefore(dayjs(endDate))) {
      formattedStartDate = dayjs(startDate).format('DD MMM YYYY hh:mm A');
      formattedEndDate = dayjs(endDate).format('DD MMM YYYY hh:mm A');
    }
    return { startDate: formattedStartDate, endDate: formattedEndDate };
  }, []);
  const dispatch = useDispatch();
  const showScheduleMaintenance = useSelector(getShowScheduleMaintenance);

  const onPressClose = useCallback(() => {
    dispatch(setShowScheduleMaintenance(false));
  }, [dispatch]);

  if (!startDate || !endDate || !showScheduleMaintenance) {
    return null;
  }

  return (
    <div
      className={styles.mainScheduleDiv}
      style={isLandingPage ? { top: 80 } : {}}>
      <ManageHistory fontSize={'large'} />
      <div className={styles.textDiv}>
        Our website will be undergoing scheduled maintenance from{' '}
        <span className={styles.dateText}>{startDate}</span> to{' '}
        <span className={styles.dateText}>{endDate}</span>. Some features may be
        temporarily unavailable during this time. We apologize for any
        inconvenience and appreciate your understanding.
      </div>
      <IconButton
        aria-label='copyIcon'
        onClick={onPressClose}
        edge='end'
        sx={{
          '&  .MuiSvgIcon-root': {
            color: 'var(--font)',
          },
        }}>
        <Cancel />
      </IconButton>
    </div>
  );
};

export default memo(ScheduleMaintenance);
