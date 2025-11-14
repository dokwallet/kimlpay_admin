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
  ADMIN_LINK_STATUS_MAP,
} from '@/utils/helper';
import SimpleSelect from '@/components/SimpleSelect';
import { topupFiltersValidationSchema } from '@/validations/topupFiltersValidations';
import { getAdminLinkFilter } from '@/redux/adminLink/adminLinkSelectors';
import {
  getAdminLinks,
  setAdminLinkFilters,
} from '@/redux/adminLink/adminLinkSlice';
import styles from './AdminLinksFilter.module.css';

const AdminLinksFilters = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const adminLinkFilter = useSelector(getAdminLinkFilter);

  const isDateFilterApplied = !!(
    adminLinkFilter?.startDate && adminLinkFilter?.endDate
  );
  const isStatusFilterApplied = adminLinkFilter?.status;

  const formikProps = useFormik({
    initialValues: { ...adminLinkFilter },
    validationSchema: topupFiltersValidationSchema,
    onSubmit: values => {
      dispatch(
        setAdminLinkFilters({
          page: 1,
          startDate: formatStartDate(values?.startDate, true),
          endDate: formatEndDate(values?.endDate, true),
        }),
      );
      dispatch(
        getAdminLinks({
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
    dispatch(setAdminLinkFilters(resetValue));
    formikProps.resetForm();
    dispatch(getAdminLinks(resetValue));
  };

  const onChangeStatus = e => {
    dispatch(
      setAdminLinkFilters({
        status: e?.target?.value,
        page: 1,
      }),
    );
    dispatch(
      getAdminLinks({
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
              filter={adminLinkFilter}
            />
            <SimpleSelect
              label='Status'
              labelSx={{ left: '15px' }}
              data={ADMIN_LINK_STATUS_MAP}
              value={adminLinkFilter?.status}
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

export default AdminLinksFilters;
