import React from 'react';
import { Box } from '@mui/material';
import { useFormikContext } from 'formik';
import DatePicker from '../datePicker';
import styles from './DateRangePicker.module.css';
import dayjs from 'dayjs';

const datePicketStyle = {
  '& .MuiInputBase-root.MuiOutlinedInput-root': {
    borderRadius: '6px',
    height: '48px',
  },
  '& .MuiOutlinedInput-input': {
    padding: '10px 0 10px 10px',
    fontSize: '14px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'var(--whiteOutline)',
  },
  '& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
    {
      borderColor: 'var(--borderActiveColor)',
    },
  '& .MuiInputLabel-outlined': {
    color: 'var(--sidebarIcon)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'var(--sidebarIcon)',
  },
  '& .MuiIconButton-root': {
    padding: '6px',
  },
  '& .MuiSvgIcon-root': {
    height: '18px',
    width: '18px',
  },
};

const DateRangePicker = ({ onChange }) => {
  const { values } = useFormikContext();

  return (
    <Box className={styles.dateRangePickerContainer}>
      <DatePicker
        label='Start Date'
        placeholder='Start date'
        name='startDate'
        className={styles.datePicker}
        onChange={onChange}
        sx={datePicketStyle}
        maxDate={values?.endDate ? dayjs(values?.endDate) : dayjs()}
      />
      <DatePicker
        label='End Date'
        placeholder='End date'
        name='endDate'
        className={styles.datePicker}
        value={values.startDate}
        onChange={onChange}
        sx={datePicketStyle}
        minDate={values?.startDate ? dayjs(values?.startDate) : null}
        maxDate={dayjs()}
      />
    </Box>
  );
};

export default DateRangePicker;
