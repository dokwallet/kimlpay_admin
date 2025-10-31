'use client';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AdminTopupPage.module.css';
import { useSearchParams } from 'next/navigation';
import {
  TOPUP_STATUS_DATA,
  VALID_LIMIT,
  VALID_TOP_STATUS,
  validateNumber,
} from '@/utils/helper';
import useRefreshScrollRestoration from '@/hooks/useRefreshScrollRestoration';
import TopupView from '@/components/AdminTopupPage/topupView';
import {
  createTopupKey,
  exportTopup,
  getTopup,
  setIsExpandTopupFilter,
  setTopupFilters,
  toggleSelectMultipleTopup,
  updateTopupStatus,
} from '@/redux/topup/topupSlice';
import {
  getIsTopupExporting,
  getSelectedTopupIds,
  getTopupData,
  getTopupFilter,
  isExpandTopupFilter,
  isMultiTopupSelectEnable,
} from '@/redux/topup/topupSelectors';
import {
  getPermissions,
  getUserData,
  isUserLoading,
} from '@/redux/user/userSelector';
import TopupFilter from '@/components/topupFilters';
import FilterAndExportButton from '@/components/FilterAndExportButton';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import RefreshButton from '@/components/RefreshButton';
import SimpleSelect from '@/components/SimpleSelect';
import TopupSearch from '@/components/AdminTopupPage/TopupSearch';
import AccessDenied from '@/components/AccessDenied';
import Loading from '@/components/Loading'; // Assume this is a reusable loading component

const AdminTopupPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const userData = useSelector(getUserData);
  const isExporting = useSelector(getIsTopupExporting);
  const isExpand = useSelector(isExpandTopupFilter);
  const isMultiTopupSelect = useSelector(isMultiTopupSelectEnable);
  const selectedTopupId = useSelector(getSelectedTopupIds);
  const userRolePermissions = useSelector(getPermissions);
  const isUserLoaded = useSelector(isUserLoading);

  const canViewTopup = useMemo(() => {
    if (userData && userRolePermissions) {
      return userRolePermissions.includes('read_topup');
    }
  }, [userData, userRolePermissions]);

  const topupSelectedLength = useMemo(() => {
    const allSelectedTopupIds = Object.keys(selectedTopupId);
    return allSelectedTopupIds.length;
  }, [selectedTopupId]);

  useRefreshScrollRestoration('topup');
  const filterCountRef = useRef(0);

  const topupData = useSelector(getTopupData);
  const topupFilter = useSelector(getTopupFilter);
  const { topup, topupPagination, topupLoading } = useMemo(() => {
    const key = createTopupKey({
      page: topupFilter?.page || 1,
      limit: topupFilter?.limit || 10,
      status: topupFilter?.status,
      startDate: topupFilter?.startDate,
      endDate: topupFilter?.endDate,
      search: topupFilter?.search,
    });
    filterCountRef.current = 0;
    if (topupFilter?.status) {
      filterCountRef.current += 1;
    }
    if (topupFilter?.startDate && topupFilter?.endDate) {
      filterCountRef.current += 1;
    }

    const topup = topupData?.[key]?.topup;
    const topupPagination = topupData?.[key]?.topupPagination;
    const topupLoading = topupData?.[key]?.isLoading;
    return {
      topup: Array.isArray(topup) ? topup : [],
      topupPagination: topupPagination || {},
      topupLoading: topupLoading || false,
    };
  }, [topupData, topupFilter]);

  useEffect(() => {
    if (canViewTopup) {
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
        dispatch(setTopupFilters(payload));
      }
      dispatch(getTopup(payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewTopup]);

  const handlePagination = payload => {
    dispatch(setTopupFilters(payload));
    dispatch(getTopup(payload));
  };

  const onUpdateStatus = payload => {
    dispatch(updateTopupStatus(payload));
  };

  const onClickExport = useCallback(() => {
    dispatch(exportTopup());
  }, [dispatch]);

  const toggleSelect = useCallback(() => {
    dispatch(toggleSelectMultipleTopup());
  }, [dispatch]);

  const onChangeMultipleStatus = useCallback(
    e => {
      const value = e?.target?.value;
      const keys = Object.keys(selectedTopupId || {});
      if (keys.length) {
        const payload = keys.map(item => ({ topupId: item, status: value }));
        dispatch(updateTopupStatus(payload));
      }
    },
    [dispatch, selectedTopupId],
  );
  if (isUserLoaded) {
    return <Loading />;
  }
  if (!canViewTopup && !userData) {
    return <AccessDenied isLoading={true} />;
  }
  return (
    <div>
      <div className={styles.page}>
        <div className={styles.row}>
          <h1>Topup Requests</h1>
          <RefreshButton
            onPressRefresh={() => {
              dispatch(getTopup({ isForceRefresh: true }));
            }}
          />
        </div>
        <div className={styles.container}>
          <div className={styles.filterContainer}>
            <div>
              <Button
                className={`${styles.filterButton}  ${
                  isMultiTopupSelect ? styles.activeFilter : ''
                }`}
                startIcon={<CheckCircleOutline />}
                onClick={toggleSelect}>
                Select Multiple
              </Button>
              <TopupSearch />
              {topupSelectedLength >= 1 && (
                <div
                  className={
                    styles.infoText
                  }>{`${topupSelectedLength} topup's are selected`}</div>
              )}
            </div>
            <div className={styles.subRowView}>
              {topupSelectedLength >= 1 && (
                <SimpleSelect
                  customClass={styles.selectView}
                  label={'Select Status'}
                  data={TOPUP_STATUS_DATA}
                  labelSx={{ fontSize: 12 }}
                  onChange={onChangeMultipleStatus}
                  borderColor={'var(--whiteOutline)'}
                />
              )}

              <FilterAndExportButton
                onClickFilter={() =>
                  dispatch(setIsExpandTopupFilter(!isExpand))
                }
                isExporting={isExporting}
                onClickExport={onClickExport}
                isExpand={isExpand}
                badgeCount={filterCountRef.current}
              />
            </div>
          </div>
          <TopupFilter isCollapsed={isExpand} />
          <TopupView
            topup={topup}
            pagination={topupPagination}
            isLoading={topupLoading}
            handlePagination={handlePagination}
            onUpdateStatus={onUpdateStatus}
            isMultiTopupSelect={isMultiTopupSelect}
            selectedTopupId={selectedTopupId}
            userRolePermissions={userRolePermissions}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminTopupPage;
