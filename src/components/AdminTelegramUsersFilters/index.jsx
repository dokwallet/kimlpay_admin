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
  USER_STATUS_DATA,
} from '@/utils/helper';
import SimpleSelect from '@/components/SimpleSelect';
import { topupFiltersValidationSchema } from '@/validations/topupFiltersValidations';
import styles from './AdminTelegramUsersFilter.module.css';
import { getAdminTelegramUserFilter } from '@/redux/adminTelegramUser/adminTelegramUserSelectors';
import {
  getAdminTelegramUsers,
  setAdminTelegramUserFilters,
} from '@/redux/adminTelegramUser/adminTelegramUserSlice';

const AdminTelegramUsersFilters = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const adminTelegramUserFilter = useSelector(getAdminTelegramUserFilter);

  const isDateFilterApplied = !!(
    adminTelegramUserFilter?.startDate && adminTelegramUserFilter?.endDate
  );
  const isStatusFilterApplied = adminTelegramUserFilter?.status;

  const formikProps = useFormik({
    initialValues: { ...adminTelegramUserFilter },
    validationSchema: topupFiltersValidationSchema,
    onSubmit: values => {
      dispatch(
        setAdminTelegramUserFilters({
          page: 1,
          startDate: formatStartDate(values?.startDate, true),
          endDate: formatEndDate(values?.endDate, true),
        }),
      );
      dispatch(
        getAdminTelegramUsers({
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
    dispatch(setAdminTelegramUserFilters(resetValue));
    formikProps.resetForm();
    dispatch(getAdminTelegramUsers(resetValue));
  };

  const onChangeStatus = e => {
    dispatch(
      setAdminTelegramUserFilters({
        status: e?.target?.value,
        page: 1,
      }),
    );
    dispatch(
      getAdminTelegramUsers({
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
              filter={adminTelegramUserFilter}
            />
            <SimpleSelect
              label='Status'
              labelSx={{ left: '15px' }}
              data={USER_STATUS_DATA}
              value={adminTelegramUserFilter?.status}
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

export default AdminTelegramUsersFilters;
