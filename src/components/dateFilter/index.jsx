import React, { useCallback, useState } from 'react';
import { Box, Menu, Typography } from '@mui/material';
import DownIcon from '@mui/icons-material/ExpandMore';
import UpIcon from '@mui/icons-material/ExpandLess';
import styles from './DateFilter.module.css';
import DateRangePicker from '@/components/dateRangePIcker';
import { useFormikContext } from 'formik';
import { getUserTimezoneOffset } from '@/utils/helper';
import ActionButtons from '@/components/actionButtons';

const DateFilter = ({
  onChange,
  filterApplied,
  filter,
  isTransactionFilter,
}) => {
  const { values, setFieldValue, handleSubmit } = useFormikContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onPressApply = useCallback(() => {
    handleClose();
    handleSubmit();
  }, [handleSubmit]);

  const handleCardClick = useCallback(
    value => {
      onChange({
        target: {
          name: 'dateType',
          value: value,
        },
      });
      setFieldValue('dateType', value);
    },
    [onChange, setFieldValue],
  );

  return (
    <Box>
      <Box
        className={`${styles.dateFilterContainer} ${open ? styles.openedFilter : ''} ${filterApplied ? styles.activeFilter : ''}`}
        onClick={handleClick}>
        <Box>
          {filter?.startDate && filter?.endDate
            ? `${filter?.startDate} to ${filter?.endDate}`
            : 'Date Range'}
        </Box>
        {open ? <UpIcon /> : <DownIcon />}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              width: '330px',
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1,
              background: 'var(--backgroundColor)',
              color: 'var(--font)',
            },
          },
        }}>
        <Box className={styles.dateFilterMenuContainer}>
          <Typography variant='h6'>{'Date Range'}</Typography>
          {isTransactionFilter && (
            <Box className={styles.dateTypeContainer}>
              <Box
                className={`${styles.dateTypeItem} ${values?.dateType === 'paidDate' ? styles.selectedType : ''}`}
                onClick={() => handleCardClick('paidDate')}>
                <h3>Paid date</h3>
                <h3>{getUserTimezoneOffset()}:</h3>
              </Box>
              <Box
                className={`${styles.dateTypeItem} ${values?.dateType === 'clearedDate' ? styles.selectedType : ''}`}
                onClick={() => handleCardClick('clearedDate')}>
                <h3>Cleared date</h3>
                <h3>{getUserTimezoneOffset()}:</h3>
              </Box>
            </Box>
          )}
          <DateRangePicker onChange={onChange} />
          <ActionButtons
            onCancelClick={handleClose}
            onApplyClick={onPressApply}
          />
        </Box>
      </Menu>
    </Box>
  );
};

export default DateFilter;
