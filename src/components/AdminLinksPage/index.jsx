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
  getPermissions,
  getUserData,
  isUserLoading,
} from '@/redux/user/userSelector';
import styles from '../AdminTopupPage/AdminTopupPage.module.css';
import Loading from '@/components/Loading';
import AdminLinksSearch from '../AdminLinksSearch';
import AdminLinksFilters from '../AdminLinksFilters';
import AdminLinksView from './AdminLinksView';
import {
  getAdminLinkFilter,
  getAdminLinksData,
  getIsAdminLinksExporting,
  isExpandAdminLinkFilter,
} from '@/redux/adminLink/adminLinkSelectors';
import {
  createAdminLinkKey,
  exportAdminLinks,
  getAdminLinks,
  setAdminLinkFilters,
  setIsExpandAdminLinkFilter,
} from '@/redux/adminLink/adminLinkSlice';

const AdminLinksPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const filterCountRef = useRef(0);

  const userData = useSelector(getUserData);
  const isUserLoaded = useSelector(isUserLoading);
  const userRolePermissions = useSelector(getPermissions);

  const isExporting = useSelector(getIsAdminLinksExporting);
  const isExpand = useSelector(isExpandAdminLinkFilter);

  const adminLinkFilter = useSelector(getAdminLinkFilter);
  const AdminLinksData = useSelector(getAdminLinksData);

  useRefreshScrollRestoration('adminLinks');

  const canViewLinks = useMemo(() => {
    if (userData && userRolePermissions) {
      return userRolePermissions.includes('read_links');
    }
    return false;
  }, [userData, userRolePermissions]);

  const { adminLinks, adminLinkPagination, adminLinkLoading } = useMemo(() => {
    const key = createAdminLinkKey({
      page: adminLinkFilter?.page || 1,
      limit: adminLinkFilter?.limit || 10,
      status: adminLinkFilter?.status,
      startDate: adminLinkFilter?.startDate,
      endDate: adminLinkFilter?.endDate,
      search: adminLinkFilter?.search,
    });

    filterCountRef.current = 0;
    if (adminLinkFilter?.status) filterCountRef.current += 1;
    if (adminLinkFilter?.startDate && adminLinkFilter?.endDate)
      filterCountRef.current += 1;

    const adminLinks = AdminLinksData?.[key]?.adminLinks;
    const adminLinkPagination = AdminLinksData?.[key]?.adminLinkPagination;
    const adminLinkLoading = AdminLinksData?.[key]?.isLoading;

    return {
      adminLinks: Array.isArray(adminLinks) ? adminLinks : [],
      adminLinkPagination: adminLinkPagination || {},
      adminLinkLoading: adminLinkLoading || false,
    };
  }, [AdminLinksData, adminLinkFilter]);

  useEffect(() => {
    if (canViewLinks) {
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
        dispatch(setAdminLinkFilters(payload));
      }
      dispatch(getAdminLinks(payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewLinks]);

  const handlePagination = payload => {
    dispatch(setAdminLinkFilters(payload));
    dispatch(getAdminLinks(payload));
  };

  const onClickExport = useCallback(() => {
    dispatch(exportAdminLinks());
  }, [dispatch]);

  if (isUserLoaded) {
    return <Loading />;
  }

  if (!canViewLinks && !userData) {
    return <AccessDenied isLoading={true} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.row}>
        <h1>Links</h1>
        <RefreshButton
          onPressRefresh={() => {
            dispatch(getAdminLinks({ isForceRefresh: true }));
          }}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <AdminLinksSearch />
          <FilterAndExportButton
            onClickFilter={() =>
              dispatch(setIsExpandAdminLinkFilter(!isExpand))
            }
            isExporting={isExporting}
            onClickExport={onClickExport}
            isExpand={isExpand}
            badgeCount={filterCountRef.current}
          />
        </div>
        <AdminLinksFilters isCollapsed={isExpand} />
        <AdminLinksView
          links={adminLinks}
          pagination={adminLinkPagination}
          isLoading={adminLinkLoading}
          handlePagination={handlePagination}
        />
      </div>
    </div>
  );
};

export default AdminLinksPage;
