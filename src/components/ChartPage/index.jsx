'use client';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Typography } from '@mui/material';
import { FormikProvider, useFormik } from 'formik';
import { useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';

import {
  getUsersChart,
  getEarningsChart,
  setUsersChartFilter,
  createChartKey,
  getDepositsChart,
  getReapInvoicesChart,
} from '@/redux/charts/chartsSlice';
import {
  getKycChartData,
  getEarningsChartData,
  getChartFilter,
  getDepositChartData,
  getReapInvoiceChartData,
} from '@/redux/charts/chartsSelectors';
import {
  formatStartDate,
  formatEndDate,
  CHART_TYPE,
  VALID_USERS_CHART_TYPE,
} from '@/utils/helper';

import DateFilter from '@/components/dateFilter';
import SimpleSelect from '@/components/SimpleSelect';
import UsersPieChart from './UsersPieChart';
import UsersBarChart from './UsersBarChart';
import EarningsPieChart from './EarningsPieChart';

import styles from './UsersChart.module.css';
import Button from '../_button';
import Loading from '@/components/Loading';
import { kycMetricsValidation } from '@/validations/kycMetricsValidation';
import EarningsBarChart from './EarningsBarChart';
import DepositsBarChart from './DepositsBarChart';
import DepositsPieChart from './DepositsPieChart';
import ReapInvoicePieChart from './ReapInvoicePieChart';
import ReapInvoiceBarChart from './ReapInvoiceBarChart';

const UsersChartContainer = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const chartFilter = useSelector(getChartFilter);
  const kycChartData = useSelector(getKycChartData);
  const earningsChartData = useSelector(getEarningsChartData);
  const depositChartData = useSelector(getDepositChartData);
  const reapInvoiceChartData = useSelector(getReapInvoiceChartData);

  const key = useMemo(() => createChartKey(chartFilter || {}), [chartFilter]);

  const userChart = kycChartData?.[key] || {};
  const earningsChart = earningsChartData?.[key] || {};
  const depositChart = depositChartData?.[key] || {};
  const reapInvoiceChart = reapInvoiceChartData || {};

  const loading = userChart?.isLoading;
  const earningsLoading = earningsChart?.isLoading;
  const depositLoading = depositChart?.isLoading;
  const reapInvoiceLoading = reapInvoiceChart?.isLoading;

  const formikProps = useFormik({
    initialValues: { ...chartFilter },
    validationSchema: kycMetricsValidation,
    onSubmit: values => {
      const startDate = formatStartDate(values?.startDate, true);
      const endDate = formatEndDate(values?.endDate, true);
      dispatch(setUsersChartFilter({ startDate, endDate }));
      dispatch(getUsersChart({ startDate, endDate }));
    },
    enableReinitialize: true,
  });

  const isDateFilterApplied = useMemo(
    () => Boolean(chartFilter?.startDate && chartFilter?.endDate),
    [chartFilter],
  );

  const isTypeFilterApplied = useMemo(
    () => Boolean(chartFilter?.type),
    [chartFilter],
  );

  const handleChangeType = useCallback(
    e => {
      const type = e?.target?.value;
      dispatch(setUsersChartFilter({ type }));
      dispatch(getUsersChart({ type }));
      dispatch(getEarningsChart({ type }));
      dispatch(getDepositsChart({ type }));
    },
    [dispatch],
  );

  const handleClearFilters = useCallback(() => {
    dispatch(setUsersChartFilter({ startDate: '', endDate: '' }));
    dispatch(getUsersChart({}));
  }, [dispatch]);

  useEffect(() => {
    if (!loading && userChart?.pieChart) {
      const payload = {};
      if (chartFilter?.startDate && chartFilter?.endDate) {
        payload.startDate = chartFilter.startDate;
        payload.endDate = chartFilter.endDate;
      }
      dispatch(getEarningsChart(payload));
    }
  }, [loading, userChart?.pieChart, chartFilter, dispatch]);

  useEffect(() => {
    if (!earningsLoading && earningsChart?.data?.pieChart) {
      const payload = {};
      if (chartFilter?.startDate && chartFilter?.endDate) {
        payload.startDate = chartFilter.startDate;
        payload.endDate = chartFilter.endDate;
      }
      dispatch(getDepositsChart(payload));
    }
  }, [earningsLoading, earningsChart?.data?.pieChart, chartFilter, dispatch]);

  useEffect(() => {
    if (!depositLoading && depositChart?.data?.pieChart) {
      dispatch(getReapInvoicesChart());
    }
  }, [depositLoading, depositChart?.data?.pieChart, chartFilter, dispatch]);

  useEffect(() => {
    const payload = {};
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (type && VALID_USERS_CHART_TYPE.includes(type)) {
      payload.type = type;
    }
    if (dayjs(startDate).isValid() && dayjs(endDate).isValid()) {
      payload.startDate = startDate;
      payload.endDate = endDate;
    }

    if (Object.keys(payload).length) {
      dispatch(setUsersChartFilter(payload));
    }
    dispatch(getUsersChart());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Paper elevation={3} className={styles.container}>
        <FormikProvider value={formikProps}>
          <Box className={styles.filterWrapper}>
            <Box className={styles.filterContainer}>
              <DateFilter
                filterApplied={isDateFilterApplied}
                filter={chartFilter}
              />
              <Box sx={{ width: '110px', height: '40px' }}>
                <SimpleSelect
                  label='Type'
                  labelSx={{ left: '15px' }}
                  fullWidth
                  data={CHART_TYPE}
                  value={chartFilter?.type}
                  onChange={handleChangeType}
                  customClass={styles.typeFilter}
                  borderColor={
                    isTypeFilterApplied
                      ? 'var(--background)'
                      : 'var(--whiteOutline) !important'
                  }
                  borderWidth={isTypeFilterApplied ? '2px' : '1px'}
                />
              </Box>
            </Box>
            {isDateFilterApplied && (
              <Button className={styles.clearBtn} onClick={handleClearFilters}>
                Clear all
              </Button>
            )}
          </Box>
        </FormikProvider>

        <Typography variant='h5' className={styles.sectionHeading}>
          KYC Metrics
        </Typography>

        {loading ? (
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height={300}
            sx={{ background: 'var(--backgroundColor)' }}>
            <Loading />
          </Box>
        ) : (
          <Box className={styles.chartsContainer}>
            <UsersPieChart data={userChart?.pieChart} />
            <UsersBarChart
              data={userChart?.barChart}
              chartFilter={chartFilter}
            />
          </Box>
        )}
      </Paper>

      <Paper elevation={3} className={styles.earningsContainer} sx={{ mt: 3 }}>
        <Typography variant='h5' className={styles.sectionHeading}>
          Earnings Distribution
        </Typography>

        {earningsLoading || !earningsChart?.data ? (
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height={300}
            sx={{ background: 'var(--backgroundColor)' }}>
            <Loading />
          </Box>
        ) : (
          <Box sx={{ p: 2, background: 'var(--backgroundColor)' }}>
            <EarningsPieChart data={earningsChart?.data?.pieChart} />
            <EarningsBarChart
              data={earningsChart?.data?.barChart}
              chartFilter={chartFilter}
            />
          </Box>
        )}
      </Paper>

      <Paper elevation={3} className={styles.earningsContainer} sx={{ mt: 3 }}>
        <Typography variant='h5' className={styles.sectionHeading}>
          Deposit Distribution
        </Typography>

        {depositLoading || !depositChart?.data ? (
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height={300}
            sx={{ background: 'var(--backgroundColor)' }}>
            <Loading />
          </Box>
        ) : (
          <Box sx={{ p: 2, background: 'var(--backgroundColor)' }}>
            <DepositsPieChart data={depositChart?.data?.pieChart} />
            <DepositsBarChart
              data={depositChart?.data?.barChart}
              chartFilter={chartFilter}
            />
          </Box>
        )}
      </Paper>

      <Paper elevation={3} className={styles.earningsContainer} sx={{ mt: 3 }}>
        <Typography variant='h5' className={styles.sectionHeading}>
          Reap Invoice
        </Typography>

        {reapInvoiceLoading || !reapInvoiceChart?.data ? (
          <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            height={300}
            sx={{ background: 'var(--backgroundColor)' }}>
            <Loading />
          </Box>
        ) : (
          <Box sx={{ p: 2, background: 'var(--backgroundColor)' }}>
            <ReapInvoicePieChart data={reapInvoiceChart?.data?.pieChart} />
            <ReapInvoiceBarChart
              data={reapInvoiceChart?.data?.barChart}
              chartFilter={chartFilter}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UsersChartContainer;
