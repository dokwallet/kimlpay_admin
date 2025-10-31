import React, { useCallback } from 'react';
import { Box, Collapse } from '@mui/material';
import DateFilter from '@/components/dateFilter';
import { FormikProvider, useFormik } from 'formik';
import styles from './TopupFilter.module.css';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/_button';
import {
  formatEndDate,
  formatStartDate,
  TOPUP_STATUS_DATA,
} from '@/utils/helper';
import SimpleSelect from '@/components/SimpleSelect';
import { getTopup, setTopupFilters } from '@/redux/topup/topupSlice';
import { topupFiltersValidationSchema } from '@/validations/topupFiltersValidations';
import { getTopupFilter } from '@/redux/topup/topupSelectors';

const TopupFilter = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const topupFilter = useSelector(getTopupFilter);

  const isDateFilterApplied = !!(
    topupFilter?.startDate && topupFilter?.endDate
  );
  const isStatusFilterApplied = topupFilter?.status;

  const formikProps = useFormik({
    initialValues: { ...topupFilter },
    validationSchema: topupFiltersValidationSchema,
    onSubmit: values => {
      dispatch(
        setTopupFilters({
          page: 1,
          startDate: formatStartDate(values?.startDate, true),
          endDate: formatEndDate(values?.endDate, true),
        }),
      );
      dispatch(
        getTopup({
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
    dispatch(setTopupFilters(resetValue));
    formikProps.resetForm();
    dispatch(getTopup(resetValue));
  };

  const onChangeStatus = e => {
    dispatch(
      setTopupFilters({
        status: e?.target?.value,
        page: 1,
      }),
    );
    dispatch(
      getTopup({
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
              filter={topupFilter}
            />
            <SimpleSelect
              label='Status'
              labelSx={{ left: '15px' }}
              data={TOPUP_STATUS_DATA}
              value={topupFilter?.status}
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

export default TopupFilter;
