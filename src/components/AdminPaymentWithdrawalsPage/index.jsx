'use client';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import dayjs from 'dayjs';
import {
  VALID_LIMIT,
  VALID_SHIPPING_STATUS,
  validateNumber,
} from '@/utils/helper';
import useRefreshScrollRestoration from '@/hooks/useRefreshScrollRestoration';
import FilterAndExportButton from '@/components/FilterAndExportButton';
import RefreshButton from '@/components/RefreshButton';
import AccessDenied from '@/components/AccessDenied';
import {
  createAdminPaymentWithdrawalsKey,
  exportAdminPaymentWithdrawals,
  getAdminPaymentWithdrawals,
  setAdminPaymentWithdrawalsFilters,
  setIsExpandAdminPaymentWithdrawalsFilter,
} from '@/redux/adminPaymentWithdrawals/adminPaymentWithdrawalsSlice';
import {
  getAdminPaymentWithdrawalsData,
  getAdminPaymentWithdrawalsFilter,
  getIsAdminPaymentWithdrawalsExporting,
  isExpandAdminPaymentWithdrawalsFilter,
} from '@/redux/adminPaymentWithdrawals/adminPaymentWithdrawalsSelectors';
import {
  getPermissions,
  getUserData,
  isUserLoading,
} from '@/redux/user/userSelector';
import AdminPaymentWithdrawalsView from './AdminPaymentWithdrawalsView';
import AdminPaymentWithdrawalsFilters from '../AdminPaymentWithdrawalsFilters';
import AdminPaymentWithdrawalsSearch from '../AdminPaymentWithdrawalsSearch';
import styles from './AdminPaymentWithdrawals.module.css';
import Loading from '@/components/Loading';

const AdminPaymentWithdrawalsPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const filterCountRef = useRef(0);

  const userData = useSelector(getUserData);
  const isUserLoaded = useSelector(isUserLoading);
  const userRolePermissions = useSelector(getPermissions);

  const isExporting = useSelector(getIsAdminPaymentWithdrawalsExporting);
  const isExpand = useSelector(isExpandAdminPaymentWithdrawalsFilter);

  const adminPaymentWithdrawalFilter = useSelector(
    getAdminPaymentWithdrawalsFilter,
  );
  const adminPaymentWithdrawalsData = useSelector(
    getAdminPaymentWithdrawalsData,
  );

  useRefreshScrollRestoration('adminPaymentWithdrawals');

  const canViewTransactions = useMemo(() => {
    if (userData && userRolePermissions) {
      return userRolePermissions.includes('read_withdrawals');
    }
    return false;
  }, [userData, userRolePermissions]);

  const {
    adminPaymentWithdrawals,
    adminPaymentWithdrawalPagination,
    adminPaymentWithdrawalLoading,
  } = useMemo(() => {
    const key = createAdminPaymentWithdrawalsKey({
      page: adminPaymentWithdrawalFilter?.page || 1,
      limit: adminPaymentWithdrawalFilter?.limit || 10,
      status: adminPaymentWithdrawalFilter?.status,
      startDate: adminPaymentWithdrawalFilter?.startDate,
      endDate: adminPaymentWithdrawalFilter?.endDate,
      search: adminPaymentWithdrawalFilter?.search,
    });

    filterCountRef.current = 0;
    if (adminPaymentWithdrawalFilter?.status) filterCountRef.current += 1;
    if (
      adminPaymentWithdrawalFilter?.startDate &&
      adminPaymentWithdrawalFilter?.endDate
    )
      filterCountRef.current += 1;

    const adminPaymentWithdrawals =
      adminPaymentWithdrawalsData?.[key]?.adminPaymentWithdrawals;
    const adminPaymentWithdrawalPagination =
      adminPaymentWithdrawalsData?.[key]?.adminPaymentWithdrawalsPagination;
    const adminPaymentWithdrawalLoading =
      adminPaymentWithdrawalsData?.[key]?.isLoading;

    return {
      adminPaymentWithdrawals: Array.isArray(adminPaymentWithdrawals)
        ? adminPaymentWithdrawals
        : [],
      adminPaymentWithdrawalPagination: adminPaymentWithdrawalPagination || {},
      adminPaymentWithdrawalLoading: adminPaymentWithdrawalLoading || false,
    };
  }, [adminPaymentWithdrawalsData, adminPaymentWithdrawalFilter]);

  useEffect(() => {
    if (canViewTransactions) {
      const page = searchParams.get('page');
      const pageNumber = validateNumber(page) || 1;
      const limit = searchParams.get('limit');
      const limitNumber = validateNumber(limit);
      const payload = {};

      if (pageNumber) payload.page = pageNumber;
      if (VALID_LIMIT.includes(limitNumber)) payload.limit = limitNumber;

      const status = searchParams.get('status');
      if (VALID_SHIPPING_STATUS.includes(status)) payload.status = status;

      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      if (dayjs(startDate).isValid() && dayjs(endDate).isValid()) {
        payload.startDate = startDate;
        payload.endDate = endDate;
      }

      const search = searchParams.get('search');
      if (search) payload.search = search;

      if (Object.keys(payload).length) {
        dispatch(setAdminPaymentWithdrawalsFilters(payload));
      }
      dispatch(getAdminPaymentWithdrawals(payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewTransactions]);

  const handlePagination = payload => {
    dispatch(setAdminPaymentWithdrawalsFilters(payload));
    dispatch(getAdminPaymentWithdrawals(payload));
  };

  const onClickExport = useCallback(() => {
    dispatch(exportAdminPaymentWithdrawals());
  }, [dispatch]);

  if (isUserLoaded) {
    return <Loading />;
  }

  if (!canViewTransactions && !userData) {
    return <AccessDenied isLoading={true} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.row}>
        <h1>Withdrawals</h1>
        <RefreshButton
          onPressRefresh={() => {
            dispatch(getAdminPaymentWithdrawals({ isForceRefresh: true }));
          }}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <AdminPaymentWithdrawalsSearch />
          <FilterAndExportButton
            onClickFilter={() =>
              dispatch(setIsExpandAdminPaymentWithdrawalsFilter(!isExpand))
            }
            isExporting={isExporting}
            onClickExport={onClickExport}
            isExpand={isExpand}
            badgeCount={filterCountRef.current}
          />
        </div>
        <AdminPaymentWithdrawalsFilters isCollapsed={isExpand} />
        <AdminPaymentWithdrawalsView
          transactions={adminPaymentWithdrawals}
          pagination={adminPaymentWithdrawalPagination}
          isLoading={adminPaymentWithdrawalLoading}
          handlePagination={handlePagination}
        />
      </div>
    </div>
  );
};

export default AdminPaymentWithdrawalsPage;
