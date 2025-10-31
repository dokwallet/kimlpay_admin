import React, { useCallback } from 'react';
import { Box, Collapse } from '@mui/material';
import DateFilter from '@/components/dateFilter';
import { FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/_button';
import {
  formatEndDate,
  formatStartDate,
  SHIPPING_STATUS_DATA,
} from '@/utils/helper';
import SimpleSelect from '@/components/SimpleSelect';
import { topupFiltersValidationSchema } from '@/validations/topupFiltersValidations';
import { getShippingFilter } from '@/redux/shipping/shippingSelector';
import {
  getAllShipping,
  setShippingFilters,
} from '@/redux/shipping/shippingSlice';
import styles from '../topupFilters/TopupFilter.module.css';

const ShippingFilter = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const shippingFilter = useSelector(getShippingFilter);

  const isDateFilterApplied = !!(
    shippingFilter?.startDate && shippingFilter?.endDate
  );
  const isStatusFilterApplied = shippingFilter?.status;

  const formikProps = useFormik({
    initialValues: { ...shippingFilter },
    validationSchema: topupFiltersValidationSchema,
    onSubmit: values => {
      dispatch(
        setShippingFilters({
          page: 1,
          startDate: formatStartDate(values?.startDate, true),
          endDate: formatEndDate(values?.endDate, true),
        }),
      );
      dispatch(
        getAllShipping({
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
    dispatch(setShippingFilters(resetValue));
    formikProps.resetForm();
    dispatch(getAllShipping(resetValue));
  };

  const onChangeStatus = e => {
    dispatch(
      setShippingFilters({
        status: e?.target?.value,
        page: 1,
      }),
    );
    dispatch(
      getAllShipping({
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
              filter={shippingFilter}
            />
            <SimpleSelect
              label='Status'
              labelSx={{ left: '15px' }}
              data={SHIPPING_STATUS_DATA}
              value={shippingFilter?.status}
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

export default ShippingFilter;
