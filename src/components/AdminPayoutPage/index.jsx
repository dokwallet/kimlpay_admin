'use client';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AdminPayoutPage.module.css';
import { useSearchParams } from 'next/navigation';
import { VALID_LIMIT, VALID_TOP_STATUS, validateNumber } from '@/utils/helper';
import useRefreshScrollRestoration from '@/hooks/useRefreshScrollRestoration';
import PayoutView from '@/components/AdminPayoutPage/payoutView';
import {
  createPayoutKey,
  exportPayout,
  getPayout,
  setIsExpandPayoutFilter,
  setPayoutFilters,
} from '@/redux/payout/payoutSlice';
import {
  getIsPayoutExporting,
  getSelectedPayoutIds,
  getPayoutData,
  getPayoutFilter,
  isExpandPayoutFilter,
  isMultiPayoutSelectEnable,
} from '@/redux/payout/payoutSelectors';
import {
  getPermissions,
  getUserData,
  isUserLoading,
} from '@/redux/user/userSelector';
import PayoutFilter from '@/components/payoutFilters';
import FilterAndExportButton from '@/components/FilterAndExportButton';
import dayjs from 'dayjs';
import RefreshButton from '@/components/RefreshButton';
import PayoutSearch from '@/components/AdminPayoutPage/PayoutSearch';
import AccessDenied from '@/components/AccessDenied';
import Loading from '@/components/Loading'; // Assume this is a reusable loading component

const AdminPayoutPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const userData = useSelector(getUserData);
  const isExporting = useSelector(getIsPayoutExporting);
  const isExpand = useSelector(isExpandPayoutFilter);
  const isMultiPayoutSelect = useSelector(isMultiPayoutSelectEnable);
  const selectedPayoutId = useSelector(getSelectedPayoutIds);
  const userRolePermissions = useSelector(getPermissions);
  const isUserLoaded = useSelector(isUserLoading);

  const canViewPayout = useMemo(() => {
    if (userData && userRolePermissions) {
      return userRolePermissions.includes('read_payout');
    }
  }, [userData, userRolePermissions]);

  useRefreshScrollRestoration('payout');
  const filterCountRef = useRef(0);

  const payoutData = useSelector(getPayoutData);
  const payoutFilter = useSelector(getPayoutFilter);
  const { payout, payoutPagination, payoutLoading } = useMemo(() => {
    const key = createPayoutKey({
      page: payoutFilter?.page || 1,
      limit: payoutFilter?.limit || 10,
      status: payoutFilter?.status,
      startDate: payoutFilter?.startDate,
      endDate: payoutFilter?.endDate,
      search: payoutFilter?.search,
    });
    filterCountRef.current = 0;
    if (payoutFilter?.status) {
      filterCountRef.current += 1;
    }
    if (payoutFilter?.startDate && payoutFilter?.endDate) {
      filterCountRef.current += 1;
    }

    const payout = payoutData?.[key]?.payout;
    const payoutPagination = payoutData?.[key]?.payoutPagination;
    const payoutLoading = payoutData?.[key]?.isLoading;
    return {
      payout: Array.isArray(payout) ? payout : [],
      payoutPagination: payoutPagination || {},
      payoutLoading: payoutLoading || false,
    };
  }, [payoutData, payoutFilter]);

  useEffect(() => {
    if (canViewPayout) {
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
        dispatch(setPayoutFilters(payload));
      }
      dispatch(getPayout(payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewPayout]);

  const handlePagination = payload => {
    dispatch(setPayoutFilters(payload));
    dispatch(getPayout(payload));
  };

  const onClickExport = useCallback(() => {
    dispatch(exportPayout());
  }, [dispatch]);

  if (isUserLoaded) {
    return <Loading />;
  }
  if (!canViewPayout && !userData) {
    return <AccessDenied isLoading={true} />;
  }
  return (
    <div>
      <div className={styles.page}>
        <div className={styles.row}>
          <h1>Payout Requests</h1>
          <RefreshButton
            onPressRefresh={() => {
              dispatch(getPayout({ isForceRefresh: true }));
            }}
          />
        </div>
        <div className={styles.container}>
          <div className={styles.filterContainer}>
            <PayoutSearch />

            <div className={styles.subRowView}>
              <FilterAndExportButton
                onClickFilter={() =>
                  dispatch(setIsExpandPayoutFilter(!isExpand))
                }
                isExporting={isExporting}
                onClickExport={onClickExport}
                isExpand={isExpand}
                badgeCount={filterCountRef.current}
              />
            </div>
          </div>
          <PayoutFilter isCollapsed={isExpand} />
          <PayoutView
            payout={payout}
            pagination={payoutPagination}
            isLoading={payoutLoading}
            handlePagination={handlePagination}
            isMultiPayoutSelect={isMultiPayoutSelect}
            selectedPayoutId={selectedPayoutId}
            userRolePermissions={userRolePermissions}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPayoutPage;
