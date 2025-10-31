import React, { useCallback } from 'react';
import { Box, Collapse } from '@mui/material';
import DateFilter from '@/components/dateFilter';
import { FormikProvider, useFormik } from 'formik';
import styles from './DepositFilter.module.css';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/_button';
import {
  formatEndDate,
  formatStartDate,
  TOPUP_STATUS_DATA,
} from '@/utils/helper';
import SimpleSelect from '@/components/SimpleSelect';
import { getDeposit, setDepositFilters } from '@/redux/deposit/depositSlice';
import { depositFiltersValidationSchema } from '@/validations/depositFiltersValidations';
import { getDepositFilter } from '@/redux/deposit/depositSelectors';

const DepositFilter = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const depositFilter = useSelector(getDepositFilter);

  const isDateFilterApplied = !!(
    depositFilter?.startDate && depositFilter?.endDate
  );
  const isStatusFilterApplied = depositFilter?.status;

  const formikProps = useFormik({
    initialValues: { ...depositFilter },
    validationSchema: depositFiltersValidationSchema,
    onSubmit: values => {
      dispatch(
        setDepositFilters({
          page: 1,
          startDate: formatStartDate(values?.startDate, true),
          endDate: formatEndDate(values?.endDate, true),
        }),
      );
      dispatch(
        getDeposit({
          page: 1,
          startDate: formatStartDate(values?.startDate, true),
          endDate: formatEndDate(values?.endDate, true),
        }),
      );
    },
    enableReinitialize: false,
  });

  const onChange = useCallback(() => {}, []);

  const handleClearFilters = () => {
    const resetValue = {
      startDate: null,
      endDate: null,
    };
    dispatch(setDepositFilters(resetValue));
    formikProps.resetForm();
    dispatch(getDeposit(resetValue));
  };

  return (
    <FormikProvider value={formikProps}>
      <Collapse in={isCollapsed}>
        <Box className={styles.filterWrapper}>
          <Box className={styles.filterContainer}>
            <DateFilter
              onChange={onChange}
              filterApplied={isDateFilterApplied}
              filter={depositFilter}
            />
          </Box>
          <Button className={styles.clearBtn} onClick={handleClearFilters}>
            Clear all
          </Button>
        </Box>
      </Collapse>
    </FormikProvider>
  );
};

export default DepositFilter;
