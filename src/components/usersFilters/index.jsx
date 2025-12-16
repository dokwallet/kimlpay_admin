import React, { useCallback } from 'react';
import { Box, Collapse } from '@mui/material';
import DateFilter from '@/components/dateFilter';
import { FormikProvider, useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@/components/_button';
import {
  formatEndDate,
  formatStartDate,
  USER_STATUS_DATA,
  USER_TABS,
} from '@/utils/helper';
import SimpleSelect from '@/components/SimpleSelect';
import { topupFiltersValidationSchema } from '@/validations/topupFiltersValidations';
import { getSelectedUsersTab, getUsersFilter } from '@/redux/user/userSelector';
import { getUsers, setUsersFilters } from '@/redux/user/userSlice';
import styles from './usersFilters.module.css';

const UsersFilter = ({ isCollapsed }) => {
  const dispatch = useDispatch();
  const usersFiltersData = useSelector(getUsersFilter);
  const selectedUsersTab = useSelector(getSelectedUsersTab);
  const usersFilter = usersFiltersData[USER_TABS[selectedUsersTab]];

  const isDateFilterApplied = !!(
    usersFilter?.startDate && usersFilter?.endDate
  );
  const isStatusFilterApplied = usersFilter?.status;

  const formikProps = useFormik({
    initialValues: { ...usersFilter },
    validationSchema: topupFiltersValidationSchema,
    onSubmit: values => {
      dispatch(
        setUsersFilters({
          key: USER_TABS[selectedUsersTab],
          value: {
            page: 1,
            startDate: formatStartDate(values?.startDate, true),
            endDate: formatEndDate(values?.endDate, true),
          },
        }),
      );
      dispatch(
        getUsers({
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
    dispatch(
      setUsersFilters({
        key: USER_TABS[selectedUsersTab],
        value: resetValue,
      }),
    );
    formikProps.resetForm();
    dispatch(getUsers(resetValue));
  };

  const onChangeStatus = e => {
    dispatch(
      setUsersFilters({
        key: USER_TABS[selectedUsersTab],
        value: {
          status: e?.target?.value,
          page: 1,
        },
      }),
    );
    dispatch(
      getUsers({
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
              filter={usersFilter}
            />
            <SimpleSelect
              label='Status'
              labelSx={{ left: '15px' }}
              data={
                selectedUsersTab === 0
                  ? USER_STATUS_DATA
                  : USER_STATUS_DATA.slice(0, 2)
              }
              value={usersFilter?.status}
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

export default UsersFilter;
