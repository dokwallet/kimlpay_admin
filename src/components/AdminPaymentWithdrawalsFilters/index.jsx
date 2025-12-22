import React, { useCallback } from 'react';
import { Box, Collapse } from '@mui/material';
import DateFilter from '@/components/dateFilter';
import { FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/_button';
import {
  formatEndDate,
  formatStartDate,
  ADMIN_TRANSACTION_STATUS_DATA,
  ADMIN_TRANSACTION_STATUS_MAP,
  VALID_ADMIN_PAYMENT_STATUS,
} from '@/utils/helper';
import SimpleSelect from '@/components/SimpleSelect';
import { topupFiltersValidationSchema } from '@/validations/topupFiltersValidations';
import { getAdminPaymentWithdrawalsFilter } from '@/redux/adminPaymentWithdrawals/adminPaymentWithdrawalsSelectors';
import {
  getAdminPaymentWithdrawals,
  setAdminPaymentWithdrawalsFilters,
} from '@/redux/adminPaymentWithdrawals/adminPaymentWithdrawalsSlice';
import styles from './AdminPaymentWithdrawalsFilter.module.css';

const AdminPaymentWithdrawalsFilters = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const adminPaymentWithdrawalsFilter = useSelector(
    getAdminPaymentWithdrawalsFilter,
  );

  const isDateFilterApplied = !!(
    adminPaymentWithdrawalsFilter?.startDate &&
    adminPaymentWithdrawalsFilter?.endDate
  );
  const isStatusFilterApplied = adminPaymentWithdrawalsFilter?.status;

  const formikProps = useFormik({
    initialValues: { ...adminPaymentWithdrawalsFilter },
    validationSchema: topupFiltersValidationSchema,
    onSubmit: values => {
      dispatch(
        setAdminPaymentWithdrawalsFilters({
          page: 1,
          startDate: formatStartDate(values?.startDate, true),
          endDate: formatEndDate(values?.endDate, true),
        }),
      );
      dispatch(
        getAdminPaymentWithdrawals({
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
    dispatch(setAdminPaymentWithdrawalsFilters(resetValue));
    formikProps.resetForm();
    dispatch(getAdminPaymentWithdrawals(resetValue));
  };

  const onChangeStatus = e => {
    dispatch(
      setAdminPaymentWithdrawalsFilters({
        status: e?.target?.value,
        page: 1,
      }),
    );
    dispatch(
      getAdminPaymentWithdrawals({
        status: e?.target?.value,
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
              filter={adminPaymentWithdrawalsFilter}
            />
            <SimpleSelect
              label='Status'
              labelSx={{ left: '15px' }}
              data={VALID_ADMIN_PAYMENT_STATUS.map(status => ({
                label: status,
                value: status,
              }))}
              value={adminPaymentWithdrawalsFilter?.status || ''}
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

export default AdminPaymentWithdrawalsFilters;
