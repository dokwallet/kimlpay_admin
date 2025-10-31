import React, { useCallback } from 'react';
import { Box, Collapse } from '@mui/material';
import DateFilter from '@/components/dateFilter';
import { FormikProvider, useFormik } from 'formik';
import styles from './TransactionFileFilter.module.css';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/_button';
import {
  formatEndDate,
  formatStartDate,
  TRANSACTION_FILE_TYPE_DATA,
} from '@/utils/helper';
import SimpleSelect from '@/components/SimpleSelect';
import { topupFiltersValidationSchema } from '@/validations/topupFiltersValidations';
import { getTransactionFileFilter } from '@/redux/transactionFile/transactionFileSelectors';
import {
  getTransactionFile,
  setTransactionFileFilters,
} from '@/redux/transactionFile/transactionFileSlice';

const TransactionFileFilter = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const transactionFileFilter = useSelector(getTransactionFileFilter);

  const isDateFilterApplied = !!(
    transactionFileFilter?.startDate && transactionFileFilter?.endDate
  );
  const isTypeFilterApplied = transactionFileFilter?.type;

  const formikProps = useFormik({
    initialValues: { ...transactionFileFilter },
    validationSchema: topupFiltersValidationSchema,
    onSubmit: values => {
      dispatch(
        setTransactionFileFilters({
          page: 1,
          startDate: formatStartDate(values?.startDate, true),
          endDate: formatEndDate(values?.endDate, true),
        }),
      );
      dispatch(
        getTransactionFile({
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
      type: '',
    };
    dispatch(setTransactionFileFilters(resetValue));
    formikProps.resetForm();
    dispatch(getTransactionFile(resetValue));
  };

  const onChangeType = e => {
    dispatch(
      setTransactionFileFilters({
        type: e?.target?.value,
        page: 1,
      }),
    );
    dispatch(
      getTransactionFile({
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
              filter={transactionFileFilter}
            />
            <SimpleSelect
              label='Type'
              labelSx={{ left: '15px' }}
              data={TRANSACTION_FILE_TYPE_DATA}
              value={transactionFileFilter?.type}
              onChange={onChangeType}
              customClass={styles.typeFilter}
              borderColor={
                isTypeFilterApplied
                  ? 'var(--background)'
                  : 'var(--whiteOutline) !important'
              }
              borderWidth={isTypeFilterApplied ? '2px' : '1px'}
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

export default TransactionFileFilter;
