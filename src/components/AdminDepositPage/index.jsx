'use client';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AdminDepositPage.module.css';
import { useSearchParams } from 'next/navigation';
import { VALID_LIMIT, VALID_TOP_STATUS, validateNumber } from '@/utils/helper';
import useRefreshScrollRestoration from '@/hooks/useRefreshScrollRestoration';
import DepositView from '@/components/AdminDepositPage/depositView';
import {
  createDepositKey,
  exportDeposit,
  getDeposit,
  setIsExpandDepositFilter,
  setDepositFilters,
} from '@/redux/deposit/depositSlice';
import {
  getIsDepositExporting,
  getSelectedDepositIds,
  getDepositData,
  getDepositFilter,
  isExpandDepositFilter,
  isMultiDepositSelectEnable,
} from '@/redux/deposit/depositSelectors';
import {
  getPermissions,
  getUserData,
  isUserLoading,
} from '@/redux/user/userSelector';
import DepositFilter from '@/components/depositFilters';
import FilterAndExportButton from '@/components/FilterAndExportButton';
import dayjs from 'dayjs';
import RefreshButton from '@/components/RefreshButton';
import DepositSearch from '@/components/AdminDepositPage/DepositSearch';
import AccessDenied from '@/components/AccessDenied';
import Loading from '@/components/Loading'; // Assume this is a reusable loading component

const AdminDepositPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const userData = useSelector(getUserData);
  const isExporting = useSelector(getIsDepositExporting);
  const isExpand = useSelector(isExpandDepositFilter);
  const isMultiDepositSelect = useSelector(isMultiDepositSelectEnable);
  const selectedDepositId = useSelector(getSelectedDepositIds);
  const userRolePermissions = useSelector(getPermissions);
  const isUserLoaded = useSelector(isUserLoading);

  const canViewDeposit = useMemo(() => {
    if (userData && userRolePermissions) {
      return userRolePermissions.includes('read_deposit');
    }
  }, [userData, userRolePermissions]);

  useRefreshScrollRestoration('deposit');
  const filterCountRef = useRef(0);

  const depositData = useSelector(getDepositData);
  const depositFilter = useSelector(getDepositFilter);
  const { deposit, depositPagination, depositLoading } = useMemo(() => {
    const key = createDepositKey({
      page: depositFilter?.page || 1,
      limit: depositFilter?.limit || 10,
      status: depositFilter?.status,
      startDate: depositFilter?.startDate,
      endDate: depositFilter?.endDate,
      search: depositFilter?.search,
    });
    filterCountRef.current = 0;
    if (depositFilter?.status) {
      filterCountRef.current += 1;
    }
    if (depositFilter?.startDate && depositFilter?.endDate) {
      filterCountRef.current += 1;
    }

    const deposit = depositData?.[key]?.deposit;
    const depositPagination = depositData?.[key]?.depositPagination;
    const depositLoading = depositData?.[key]?.isLoading;
    return {
      deposit: Array.isArray(deposit) ? deposit : [],
      depositPagination: depositPagination || {},
      depositLoading: depositLoading || false,
    };
  }, [depositData, depositFilter]);

  useEffect(() => {
    if (canViewDeposit) {
      const page = searchParams.get('page');
      const pageNumber = validateNumber(page) || 1;
      const limit = searchParams.get('limit');
      const limitNumber = validateNumber(limit);
      const payload = {};
      if (pageNumber) {
        payload.page = pageNumber;
      }
      if (VALID_LIMIT.includes(limitNumber)) {
        payload.limit = limitNumber;
      }
      const status = searchParams.get('status');
      if (VALID_TOP_STATUS.includes(status)) {
        payload.status = status;
      }
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      if (dayjs(startDate).isValid() && dayjs(endDate).isValid()) {
        payload.startDate = startDate;
        payload.endDate = endDate;
      }
      const search = searchParams.get('search');
      if (search) {
        payload.search = search;
      }
      if (Object.keys(payload).length) {
        dispatch(setDepositFilters(payload));
      }
      dispatch(getDeposit(payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewDeposit]);

  const handlePagination = payload => {
    dispatch(setDepositFilters(payload));
    dispatch(getDeposit(payload));
  };

  const onClickExport = useCallback(() => {
    dispatch(exportDeposit());
  }, [dispatch]);

  if (isUserLoaded) {
    return <Loading />;
  }
  if (!canViewDeposit && !userData) {
    return <AccessDenied isLoading={true} />;
  }
  return (
    <div>
      <div className={styles.page}>
        <div className={styles.row}>
          <h1>Deposits</h1>
          <RefreshButton
            onPressRefresh={() => {
              dispatch(getDeposit({ isForceRefresh: true }));
            }}
          />
        </div>
        <div className={styles.container}>
          <div className={styles.filterContainer}>
            <DepositSearch />
            <div className={styles.subRowView}>
              <FilterAndExportButton
                onClickFilter={() =>
                  dispatch(setIsExpandDepositFilter(!isExpand))
                }
                isExporting={isExporting}
                onClickExport={onClickExport}
                isExpand={isExpand}
                badgeCount={filterCountRef.current}
              />
            </div>
          </div>
          <DepositFilter isCollapsed={isExpand} />
          <DepositView
            deposit={deposit}
            pagination={depositPagination}
            isLoading={depositLoading}
            handlePagination={handlePagination}
            isMultiDepositSelect={isMultiDepositSelect}
            selectedDepositId={selectedDepositId}
            userRolePermissions={userRolePermissions}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDepositPage;
