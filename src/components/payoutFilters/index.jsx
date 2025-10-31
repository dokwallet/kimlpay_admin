import React, { useCallback } from 'react';
import { Box, Collapse } from '@mui/material';
import DateFilter from '@/components/dateFilter';
import { FormikProvider, useFormik } from 'formik';
import styles from './PayoutFilter.module.css';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/_button';
import {
  formatEndDate,
  formatStartDate,
  TOPUP_STATUS_DATA,
} from '@/utils/helper';
import SimpleSelect from '@/components/SimpleSelect';
import { getPayout, setPayoutFilters } from '@/redux/payout/payoutSlice';
import { payoutFiltersValidationSchema } from '@/validations/payoutFiltersValidations';
import { getPayoutFilter } from '@/redux/payout/payoutSelectors';

const PayoutFilter = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const payoutFilter = useSelector(getPayoutFilter);

  const isDateFilterApplied = !!(
    payoutFilter?.startDate && payoutFilter?.endDate
  );
  const isStatusFilterApplied = payoutFilter?.status;

  const formikProps = useFormik({
    initialValues: { ...payoutFilter },
    validationSchema: payoutFiltersValidationSchema,
    onSubmit: values => {
      dispatch(
        setPayoutFilters({
          page: 1,
          startDate: formatStartDate(values?.startDate, true),
          endDate: formatEndDate(values?.endDate, true),
        }),
      );
      dispatch(
        getPayout({
          page: 1,
          startDate: formatStartDate(values?.startDate, true),
          endDate: formatEndDate(values?.endDate, true),
        }),
      );
    },
    enableReinitialize: false,
  });

  const onChange = useCallback(e => {}, []);

  const handleClearFilters = () => {
    const resetValue = {
      startDate: null,
      endDate: null,
      status: '',
    };
    dispatch(setPayoutFilters(resetValue));
    formikProps.resetForm();
    dispatch(getPayout(resetValue));
  };

  const onChangeStatus = e => {
    dispatch(
      setPayoutFilters({
        status: e?.target?.value,
        page: 1,
      }),
    );
    dispatch(
      getPayout({
        type: e?.target?.value,
        page: 1,
      }),
    );
  };

  return (
    <FormikProvider value={formikProps}>
      <Collapse in={isCollapsed}>
        <Box className={styles.filterWrapper}>
          <Box className={styles.filterContainer}>
            <DateFilter
              onChange={onChange}
              filterApplied={isDateFilterApplied}
              filter={payoutFilter}
            />
            <SimpleSelect
              label='Status'
              labelSx={{ left: '15px' }}
              data={TOPUP_STATUS_DATA}
              value={payoutFilter?.status}
              onChange={onChangeStatus}
              customClass={styles.typeFilter}
              borderColor={
                isStatusFilterApplied
                  ? 'var(--background)'
                  : 'var(--whiteOutline) !important'
              }
              borderWidth={isStatusFilterApplied ? '2px' : '1px'}
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

export default PayoutFilter;
