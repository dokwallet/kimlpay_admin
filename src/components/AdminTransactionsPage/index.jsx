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
  createAdminTransactionKey,
  getAdminTransactions,
  setIsExpandAdminTransactionFilter,
  setAdminTransactionFilters,
  exportAdminTransactions,
} from '@/redux/adminTransaction/adminTransactionSlice';
import {
  getAdminTransactionFilter,
  getAdminTransactionsData,
  isExpandAdminTransactionFilter,
  getIsAdminTransactionsExporting,
} from '@/redux/adminTransaction/adminTransactionSelectors';
import {
  getPermissions,
  getUserData,
  isUserLoading,
} from '@/redux/user/userSelector';
import AdminTransactionsView from './AdminTransactionsView';
import AdminTransactionsFilters from '../AdminTransactionFilters';
import AdminTransactionSearch from '../AdminTransactionSearch';
import styles from '../AdminTopupPage/AdminTopupPage.module.css';
import Loading from '@/components/Loading';

const AdminTransactionsPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const filterCountRef = useRef(0);

  const userData = useSelector(getUserData);
  const isUserLoaded = useSelector(isUserLoading);
  const userRolePermissions = useSelector(getPermissions);

  const isExporting = useSelector(getIsAdminTransactionsExporting);
  const isExpand = useSelector(isExpandAdminTransactionFilter);

  const adminTransactionFilter = useSelector(getAdminTransactionFilter);
  const AdminTransactionsData = useSelector(getAdminTransactionsData);

  useRefreshScrollRestoration('adminTransactions');

  const canViewTransactions = useMemo(() => {
    if (userData && userRolePermissions) {
      return userRolePermissions.includes('read_transactions');
    }
    return false;
  }, [userData, userRolePermissions]);

  const {
    adminTransactions,
    adminTransactionPagination,
    adminTransactionLoading,
  } = useMemo(() => {
    const key = createAdminTransactionKey({
      page: adminTransactionFilter?.page || 1,
      limit: adminTransactionFilter?.limit || 10,
      status: adminTransactionFilter?.status,
      startDate: adminTransactionFilter?.startDate,
      endDate: adminTransactionFilter?.endDate,
      search: adminTransactionFilter?.search,
    });

    filterCountRef.current = 0;
    if (adminTransactionFilter?.status) filterCountRef.current += 1;
    if (adminTransactionFilter?.startDate && adminTransactionFilter?.endDate)
      filterCountRef.current += 1;

    const adminTransactions = AdminTransactionsData?.[key]?.adminTransactions;
    const adminTransactionPagination =
      AdminTransactionsData?.[key]?.adminTransactionPagination;
    const adminTransactionLoading = AdminTransactionsData?.[key]?.isLoading;

    return {
      adminTransactions: Array.isArray(adminTransactions)
        ? adminTransactions
        : [],
      adminTransactionPagination: adminTransactionPagination || {},
      adminTransactionLoading: adminTransactionLoading || false,
    };
  }, [AdminTransactionsData, adminTransactionFilter]);

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
        dispatch(setAdminTransactionFilters(payload));
      }
      dispatch(getAdminTransactions(payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewTransactions]);

  const handlePagination = payload => {
    dispatch(setAdminTransactionFilters(payload));
    dispatch(getAdminTransactions(payload));
  };

  const onClickExport = useCallback(() => {
    dispatch(exportAdminTransactions());
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
        <h1>Transactions</h1>
        <RefreshButton
          onPressRefresh={() => {
            dispatch(getAdminTransactions({ isForceRefresh: true }));
          }}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <AdminTransactionSearch />
          <FilterAndExportButton
            onClickFilter={() =>
              dispatch(setIsExpandAdminTransactionFilter(!isExpand))
            }
            isExporting={isExporting}
            onClickExport={onClickExport}
            isExpand={isExpand}
            badgeCount={filterCountRef.current}
          />
        </div>
        <AdminTransactionsFilters isCollapsed={isExpand} />
        <AdminTransactionsView
          transactions={adminTransactions}
          pagination={adminTransactionPagination}
          isLoading={adminTransactionLoading}
          handlePagination={handlePagination}
        />
      </div>
    </div>
  );
};

export default AdminTransactionsPage;
