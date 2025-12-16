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

import styles from './AdminTelegramUsers.module.css';
import Loading from '@/components/Loading';
import AdminTelegramUsersView from './AdminTelegramUsersView';
import {
  createAdminTelegramUserKey,
  exportAdminTelegramUsers,
  getAdminTelegramUsers,
  setAdminTelegramUserFilters,
  setAdminTelegramUserLoading,
  setIsExpandAdminTelegramUserFilter,
  updateTelegramUserStatus,
} from '@/redux/adminTelegramUser/adminTelegramUserSlice';
import {
  getAdminTelegramUserFilter,
  getAdminTelegramUsersData,
  getIsAdminTelegramUsersExporting,
  isExpandAdminTelegramUserFilter,
} from '@/redux/adminTelegramUser/adminTelegramUserSelectors';
import AdminTelegramUsersSearch from '../AdminTelegramSearch';
import AdminTelegramUsersFilters from '../AdminTelegramUsersFilters';
import {
  createAdminTransactionKey,
  setIsExpandAdminTransactionFilter,
} from '@/redux/adminTransaction/adminTransactionSlice';
import { updateUserStatus } from '@/redux/user/userSlice';

const AdminTransactionsPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const filterCountRef = useRef(0);

  const userData = useSelector(getUserData);
  const isUserLoaded = useSelector(isUserLoading);
  const userRolePermissions = useSelector(getPermissions);

  const isExporting = useSelector(getIsAdminTelegramUsersExporting);
  const isExpand = useSelector(isExpandAdminTelegramUserFilter);

  const adminTelegramUsersFilter = useSelector(getAdminTelegramUserFilter);
  const AdminTelegramUsersData = useSelector(getAdminTelegramUsersData);

  useRefreshScrollRestoration('adminTelegramUsers');

  // const canViewTelegramUsers = useMemo(() => {
  //   if (userData && userRolePermissions) {
  //     return userRolePermissions.includes('write_telegram_users');
  //   }
  //   return false;
  // }, [userData, userRolePermissions]);

  const { canViewTelegramUsers, canWriteTelegramUsers } = useMemo(() => {
    const canViewTelegramUsers =
      userData && userRolePermissions?.includes?.('read_telegram_users');
    const canWriteTelegramUsers =
      userData && userRolePermissions?.includes?.('write_telegram_users');
    return { canViewTelegramUsers, canWriteTelegramUsers };
  }, [userData, userRolePermissions]);

  const {
    adminTelegramUsers,
    adminTelegramUserPagination,
    adminTelegramUserLoading,
  } = useMemo(() => {
    const key = createAdminTelegramUserKey({
      page: adminTelegramUsersFilter?.page || 1,
      limit: adminTelegramUsersFilter?.limit || 10,
      status: adminTelegramUsersFilter?.status,
      startDate: adminTelegramUsersFilter?.startDate,
      endDate: adminTelegramUsersFilter?.endDate,
      search: adminTelegramUsersFilter?.search,
    });

    filterCountRef.current = 0;
    if (adminTelegramUsersFilter?.status) filterCountRef.current += 1;
    if (
      adminTelegramUsersFilter?.startDate &&
      adminTelegramUsersFilter?.endDate
    )
      filterCountRef.current += 1;

    const adminTelegramUsers =
      AdminTelegramUsersData?.[key]?.adminTelegramUsers;
    const adminTelegramUserPagination =
      AdminTelegramUsersData?.[key]?.adminTelegramUserPagination;
    const adminTelegramUserLoading = AdminTelegramUsersData?.[key]?.isLoading;

    return {
      adminTelegramUsers: Array.isArray(adminTelegramUsers)
        ? adminTelegramUsers
        : [],
      adminTelegramUserPagination: adminTelegramUserPagination || {},
      adminTelegramUserLoading: adminTelegramUserLoading || false,
    };
  }, [AdminTelegramUsersData, adminTelegramUsersFilter]);

  useEffect(() => {
    if (canViewTelegramUsers) {
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
        dispatch(setAdminTelegramUserFilters(payload));
      }
      dispatch(getAdminTelegramUsers(payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewTelegramUsers]);

  const handlePagination = payload => {
    dispatch(setAdminTelegramUserFilters(payload));
    dispatch(setAdminTelegramUserLoading(payload));
  };

  const onClickExport = useCallback(() => {
    dispatch(exportAdminTelegramUsers());
  }, [dispatch]);

  if (isUserLoaded) {
    return <Loading />;
  }

  const onUpdateStatus = (telegramId, status) => {
    dispatch(updateTelegramUserStatus({ telegramId, status }));
  };

  if (!canViewTelegramUsers && !userData) {
    return <AccessDenied isLoading={true} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.row}>
        <h1>Telegram Users</h1>
        <RefreshButton
          onPressRefresh={() => {
            dispatch(getAdminTelegramUsers({ isForceRefresh: true }));
          }}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <AdminTelegramUsersSearch />
          <FilterAndExportButton
            onClickFilter={() =>
              dispatch(setIsExpandAdminTelegramUserFilter(!isExpand))
            }
            isExporting={isExporting}
            onClickExport={onClickExport}
            isExpand={isExpand}
            badgeCount={filterCountRef.current}
          />
        </div>
        <AdminTelegramUsersFilters isCollapsed={isExpand} />
        <AdminTelegramUsersView
          onUpdateStatus={onUpdateStatus}
          transactions={adminTelegramUsers}
          pagination={adminTelegramUserPagination}
          isLoading={adminTelegramUserLoading}
          handlePagination={handlePagination}
          permissions={userRolePermissions}
        />
      </div>
    </div>
  );
};

export default AdminTransactionsPage;
