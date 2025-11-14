'use client';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import {
  USER_STATUS_DATA,
  USER_TABS,
  VALID_LIMIT,
  VALID_USERS_STATUS,
  validateNumber,
} from '@/utils/helper';
import useRefreshScrollRestoration from '@/hooks/useRefreshScrollRestoration';
import FilterAndExportButton from '@/components/FilterAndExportButton';
import dayjs from 'dayjs';
import UsersView from './UsersView';
import Tabs from '../Tabs';
import {
  getIsUsersExporting,
  getSelectedUserIds,
  getSelectedUsersTab,
  getUsersData,
  getUsersFilter,
  isExpandUsersFilter,
  isMultiUserSelectEnable,
  getPermissions,
  getUserData,
  isUserLoading,
} from '@/redux/user/userSelector';
import {
  createUsersKey,
  exportUser,
  getUsers,
  setIsExpandUsersFilter,
  setSelectedUsersTab,
  setUsersFilters,
  toggleSelectMultipleUser,
  updateUserStatus,
} from '@/redux/user/userSlice';
import UsersFilter from '../usersFilters';
import RefreshButton from '../RefreshButton';
import {
  fetchAffiliateOptions,
  getAllAffiliateUser,
} from '@/redux/affiliateUser/affiliateUserSlice';
import styles from '../AdminTopupPage/AdminTopupPage.module.css';
import s from './AdminUsersPage.module.css';
import { Button } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import SimpleSelect from '@/components/SimpleSelect';
import UsersSearch from '@/components/AdminUsersPage/UsersSearch';
import Loading from '@/components/Loading';
import AccessDenied from '@/components/AccessDenied';

const AdminUsersPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const selectedUsersTab = useSelector(getSelectedUsersTab);
  const isExporting = useSelector(getIsUsersExporting);
  const isExpand = useSelector(isExpandUsersFilter);
  useRefreshScrollRestoration('users');
  const filterCountRef = useRef(0);

  const usersData = useSelector(getUsersData);
  const usersFilter = useSelector(getUsersFilter);
  const isMultiUserSelect = useSelector(isMultiUserSelectEnable);
  const selectedUserId = useSelector(getSelectedUserIds);
  const isUserLoaded = useSelector(isUserLoading);
  const userData = useSelector(getUserData);
  const userRolePermissions = useSelector(getPermissions);

  const { canViewUsers, canViewAdminUsers } = useMemo(() => {
    const canViewUsers =
      userData && userRolePermissions?.includes?.('read_users');
    const canViewAdminUsers =
      userData && userRolePermissions?.includes?.('read_admin_users');
    return { canViewUsers, canViewAdminUsers };
  }, [userData, userRolePermissions]);

  const ALL_USERS_TABS = useMemo(() => {
    const tabs = ['User'];
    if (canViewAdminUsers) {
      tabs.push('Admin User');
    }
    return tabs;
  }, [canViewAdminUsers]);

  const userSelectedLength = useMemo(() => {
    const allSelectedUserIds = Object.keys(selectedUserId);
    return allSelectedUserIds.length;
  }, [selectedUserId]);

  const { users, usersPagination, usersLoading } = useMemo(() => {
    const tabName = USER_TABS[selectedUsersTab];
    const currentUserFilter = usersFilter[tabName];
    const key = createUsersKey({
      selectedUsersTab: selectedUsersTab,
      page: currentUserFilter?.page || 1,
      limit: currentUserFilter?.limit || 10,
      status: currentUserFilter?.status,
      startDate: currentUserFilter?.startDate,
      endDate: currentUserFilter?.endDate,
      search: currentUserFilter?.search,
    });
    filterCountRef.current = 0;
    if (currentUserFilter?.status) {
      filterCountRef.current += 1;
    }
    if (currentUserFilter?.startDate && currentUserFilter?.endDate) {
      filterCountRef.current += 1;
    }

    const users = usersData?.[key]?.users;
    const usersPagination = usersData?.[key]?.usersPagination;
    const usersLoading = usersData?.[key]?.isLoading;
    return {
      users: Array.isArray(users) ? users : [],
      usersPagination: usersPagination || {},
      usersLoading: usersLoading || false,
    };
  }, [usersData, usersFilter, selectedUsersTab]);

  useEffect(() => {
    if (!canViewAdminUsers && selectedUsersTab === 1) {
      dispatch(setSelectedUsersTab(0));
    }
    if (canViewUsers) {
      const tab = searchParams.get('tab');
      let tempSelectedUsersTab = null;
      let tabIndex = selectedUsersTab;

      if (!canViewAdminUsers) {
        tempSelectedUsersTab = 'User';
        tabIndex = 0;
        dispatch(setSelectedUsersTab(0));
      } else if (tab) {
        const foundIndex = ALL_USERS_TABS.indexOf(tab);
        if (foundIndex !== -1) {
          tempSelectedUsersTab = ALL_USERS_TABS[foundIndex];
          tabIndex = foundIndex;
          dispatch(setSelectedUsersTab(foundIndex));
        }
      }

      const page = searchParams.get('page');
      const pageNumber = validateNumber(page) || 1;
      const limit = searchParams.get('limit');
      const limitNumber = validateNumber(limit);
      const payload = {
        selectedUsersTab: tabIndex,
        page: pageNumber || 1,
        limit: VALID_LIMIT.includes(limitNumber) ? limitNumber : 10,
      };

      const status = searchParams.get('status');
      if (VALID_USERS_STATUS.includes(status)) {
        payload.status = status;
      }
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      if (dayjs(startDate).isValid() && dayjs(endDate).isValid()) {
        payload.startDate = startDate;
        payload.endDate = endDate;
      }
      const search = searchParams.get('search')?.trim();
      if (search) {
        payload.search = search;
      }

      if (Object.keys(payload).length) {
        dispatch(
          setUsersFilters({
            key: tempSelectedUsersTab || USER_TABS[tabIndex],
            value: payload,
          }),
        );
      }

      dispatch(fetchAffiliateOptions());
      if (tabIndex === 0 || (tabIndex === 1 && canViewAdminUsers)) {
        dispatch(getUsers(payload));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewUsers, canViewAdminUsers]);

  const handleTabChange = (event, newValue) => {
    if (newValue === 1 && !canViewAdminUsers) {
      return;
    }

    const page = searchParams.get('page');
    const pageNumber = validateNumber(page) || 1;
    const limit = searchParams.get('limit');
    const limitNumber = validateNumber(limit);

    const payload = {
      selectedUsersTab: newValue,
      page: pageNumber || 1,
      limit: limitNumber || 10,
    };

    dispatch(setSelectedUsersTab(newValue));
    dispatch(getUsers(payload));
  };

  const handlePagination = payload => {
    dispatch(
      setUsersFilters({
        key: USER_TABS[selectedUsersTab],
        value: payload,
      }),
    );
    dispatch(getUsers({ ...payload }));
  };

  const toggleSelect = useCallback(() => {
    dispatch(toggleSelectMultipleUser());
  }, [dispatch]);

  const onChangeMultipleStatus = useCallback(
    e => {
      const value = e?.target?.value;
      const keys = Object.keys(selectedUserId || {});
      if (keys.length) {
        const payload = keys.map(item => ({ userId: item, status: value }));
        dispatch(updateUserStatus(payload));
      }
    },
    [dispatch, selectedUserId],
  );

  const onUpdateStatus = payload => {
    dispatch(updateUserStatus(payload));
  };

  const onClickExport = useCallback(() => {
    dispatch(exportUser());
  }, [dispatch]);

  if (isUserLoaded) {
    return <Loading />;
  }

  if (!canViewUsers && !userData) {
    return <AccessDenied isLoading={true} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.row}>
        <h1>Users</h1>
        <RefreshButton
          onPressRefresh={() => {
            dispatch(getUsers({ isForceRefresh: true }));
            dispatch(fetchAffiliateOptions({ isForceRefresh: true }));
          }}
        />
      </div>
      <div className={styles.container}>
        <div className={s.tabContainer}>
          <Tabs
            tabList={ALL_USERS_TABS}
            tabFontSize={14}
            tabsClassName={styles.tabList}
            tabClassName={styles.tab}
            selectedTab={selectedUsersTab}
            onTabChange={handleTabChange}
          />
          <div>
            <div className={styles.subRowView}>
              <UsersSearch />
              {userSelectedLength >= 1 && (
                <SimpleSelect
                  customClass={styles.selectView}
                  label={'Select Status'}
                  data={
                    selectedUsersTab === 0
                      ? USER_STATUS_DATA.slice(0, 2)
                      : USER_STATUS_DATA
                  }
                  labelSx={{ fontSize: 12 }}
                  onChange={onChangeMultipleStatus}
                  borderColor={'var(--whiteOutline)'}
                />
              )}
              <FilterAndExportButton
                onClickFilter={() =>
                  dispatch(setIsExpandUsersFilter(!isExpand))
                }
                isExporting={isExporting}
                onClickExport={onClickExport}
                isExpand={isExpand}
                badgeCount={filterCountRef.current}
              />
            </div>
            {userSelectedLength >= 1 && (
              <div
                className={
                  styles.infoText
                }>{`${userSelectedLength} user's are selected`}</div>
            )}
          </div>
        </div>
        <UsersFilter isCollapsed={isExpand} />
        {ALL_USERS_TABS.map((item, index) => (
          <React.Fragment key={item}>
            {selectedUsersTab === index && (
              <UsersView
                users={users}
                pagination={usersPagination}
                isLoading={usersLoading}
                handlePagination={handlePagination}
                onUpdateStatus={onUpdateStatus}
                isMultiUserSelect={isMultiUserSelect}
                selectedUserId={selectedUserId}
                permissions={userRolePermissions}
                isAdminTab={index === 1}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPage;
