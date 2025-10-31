import React, { useCallback } from 'react';
import { Box, Collapse } from '@mui/material';
import DateFilter from '@/components/dateFilter';
import { FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/_button';
import {
  AFFILIATE_USER_STATUS_DATA,
  formatEndDate,
  formatStartDate,
} from '@/utils/helper';
import SimpleSelect from '@/components/SimpleSelect';
import { topupFiltersValidationSchema } from '@/validations/topupFiltersValidations';
import { getAffiliateUserFilter } from '@/redux/affiliateUser/affiliateUserSelector';
import {
  getAllAffiliateUser,
  setAffiliateUserFilters,
} from '@/redux/affiliateUser/affiliateUserSlice';
import styles from '../topupFilters/TopupFilter.module.css';

const AffiliateUserFilters = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const affiliateUserFilter = useSelector(getAffiliateUserFilter);

  const isDateFilterApplied = !!(
    affiliateUserFilter?.startDate && affiliateUserFilter?.endDate
  );
  const isStatusFilterApplied = affiliateUserFilter?.status;

  const formikProps = useFormik({
    initialValues: { ...affiliateUserFilter },
    validationSchema: topupFiltersValidationSchema,
    onSubmit: values => {
      dispatch(
        setAffiliateUserFilters({
          page: 1,
          startDate: formatStartDate(values?.startDate, true),
          endDate: formatEndDate(values?.endDate, true),
        }),
      );
      dispatch(
        getAllAffiliateUser({
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
    dispatch(setAffiliateUserFilters(resetValue));
    formikProps.resetForm();
    dispatch(getAllAffiliateUser(resetValue));
  };

  const onChangeStatus = e => {
    dispatch(
      setAffiliateUserFilters({
        status: e?.target?.value,
        page: 1,
      }),
    );
    dispatch(
      getAllAffiliateUser({
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
              filter={affiliateUserFilter}
            />
            <SimpleSelect
              label='Status'
              labelSx={{ left: '15px' }}
              data={AFFILIATE_USER_STATUS_DATA}
              value={affiliateUserFilter?.status}
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

export default AffiliateUserFilters;
