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
} from '@/utils/helper';
import SimpleSelect from '@/components/SimpleSelect';
import { topupFiltersValidationSchema } from '@/validations/topupFiltersValidations';
import { getAdminTransactionFilter } from '@/redux/adminTransaction/adminTransactionSelectors';
import {
  getAdminTransactions,
  setAdminTransactionFilters,
} from '@/redux/adminTransaction/adminTransactionSlice';
import styles from './AdminTransactionFilter.module.css';

const AdminTransactionFilters = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const adminTransactionFilter = useSelector(getAdminTransactionFilter);

  const isDateFilterApplied = !!(
    adminTransactionFilter?.startDate && adminTransactionFilter?.endDate
  );
  const isStatusFilterApplied = adminTransactionFilter?.status;

  const formikProps = useFormik({
    initialValues: { ...adminTransactionFilter },
    validationSchema: topupFiltersValidationSchema,
    onSubmit: values => {
      dispatch(
        setAdminTransactionFilters({
          page: 1,
          startDate: formatStartDate(values?.startDate, true),
          endDate: formatEndDate(values?.endDate, true),
        }),
      );
      dispatch(
        getAdminTransactions({
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
    dispatch(setAdminTransactionFilters(resetValue));
    formikProps.resetForm();
    dispatch(getAdminTransactions(resetValue));
  };

  const onChangeStatus = e => {
    dispatch(
      setAdminTransactionFilters({
        status: e?.target?.value,
        page: 1,
      }),
    );
    dispatch(
      getAdminTransactions({
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
              filter={adminTransactionFilter}
            />
            <SimpleSelect
              label='Status'
              labelSx={{ left: '15px' }}
              data={ADMIN_TRANSACTION_STATUS_DATA}
              value={adminTransactionFilter?.status}
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

export default AdminTransactionFilters;
