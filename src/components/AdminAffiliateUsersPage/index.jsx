'use client';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import {
  AFFILIATE_USER_STATUS_DATA,
  VALID_AFFILIATE_USER_STATUS,
  VALID_LIMIT,
  validateNumber,
} from '@/utils/helper';
import useRefreshScrollRestoration from '@/hooks/useRefreshScrollRestoration';
import FilterAndExportButton from '@/components/FilterAndExportButton';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import RefreshButton from '@/components/RefreshButton';
import AffiliateUsersView from './AffiliateUsersView';
import ModalCreateAffiliateUserForm from '../ModalCreateAffiliateUserForm';
import {
  getAffiliateUserFilter,
  getAffiliateUserListData,
  getIsAffiliateUserExporting,
  getSelectedAffiliateUserIds,
  isExpandAffiliateUserFilter,
  isMultiAffiliateUserSelectEnable,
} from '@/redux/affiliateUser/affiliateUserSelector';
import {
  createAffiliateUserKey,
  exportAffiliateUser,
  getAllAffiliateUser,
  setAffiliateUserFilters,
  setIsExpandAffiliateUserFilter,
  updateAffiliateUser,
  toggleSelectMultipleAffiliateUser,
  fetchAffiliateOptions,
} from '@/redux/affiliateUser/affiliateUserSlice';
import AffiliateUserFilters from '../affiliateUserFilters';
import {
  resetCreateAffiliateUserForm,
  setCreateAffiliateUserForm,
} from '@/redux/form/formDataSlice';
import {
  getPermissions,
  getUserData,
  isUserLoading,
} from '@/redux/user/userSelector';
import { showCreateAffiliateUserModal } from '@/redux/form/formDataSelector';
import styles from '../AdminTopupPage/AdminTopupPage.module.css';
import SimpleSelect from '@/components/SimpleSelect';
import AffiliateSearch from '@/components/AdminAffiliateUsersPage/AffiliateSearch';
import Loading from '@/components/Loading';
import AccessDenied from '@/components/AccessDenied';

const AdminAffiliateUsersPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const isShowCreateAffiliateUserModal = useSelector(
    showCreateAffiliateUserModal,
  );
  const isExporting = useSelector(getIsAffiliateUserExporting);
  const isExpand = useSelector(isExpandAffiliateUserFilter);
  useRefreshScrollRestoration('affiliate-users');
  const filterCountRef = useRef(0);

  const affiliateUserData = useSelector(getAffiliateUserListData);
  const affiliateUserFilter = useSelector(getAffiliateUserFilter);
  const isMultiAffiliateUserSelect = useSelector(
    isMultiAffiliateUserSelectEnable,
  );
  const selectedAffiliateUserId = useSelector(getSelectedAffiliateUserIds);

  const userData = useSelector(getUserData);
  const userRolePermissions = useSelector(getPermissions);
  const isUserLoaded = useSelector(isUserLoading);

  const canViewAffiliate = useMemo(() => {
    if (userData && userRolePermissions) {
      return userRolePermissions.includes('read_affiliate_users');
    }
  }, [userData, userRolePermissions]);

  const affiliateUserSelectedLength = useMemo(() => {
    const allSelectedAffiliateUserIds = Object.keys(selectedAffiliateUserId);
    return allSelectedAffiliateUserIds.length;
  }, [selectedAffiliateUserId]);

  const { affiliateUsers, affiliateUserPagination, affiliateUserLoading } =
    useMemo(() => {
      const key = createAffiliateUserKey({
        page: affiliateUserFilter?.page || 1,
        limit: affiliateUserFilter?.limit || 10,
        status: affiliateUserFilter?.status,
        startDate: affiliateUserFilter?.startDate,
        endDate: affiliateUserFilter?.endDate,
        search: affiliateUserFilter?.search,
      });
      filterCountRef.current = 0;
      if (affiliateUserFilter?.status) {
        filterCountRef.current += 1;
      }
      if (affiliateUserFilter?.startDate && affiliateUserFilter?.endDate) {
        filterCountRef.current += 1;
      }

      const affiliateUsers = affiliateUserData?.[key]?.affiliateUsers;
      const affiliateUserPagination =
        affiliateUserData?.[key]?.affiliateUserPagination;
      const affiliateUserLoading = affiliateUserData?.[key]?.isLoading;
      return {
        affiliateUsers: Array.isArray(affiliateUsers) ? affiliateUsers : [],
        affiliateUserPagination: affiliateUserPagination || {},
        affiliateUserLoading: affiliateUserLoading || false,
      };
    }, [affiliateUserData, affiliateUserFilter]);

  useEffect(() => {
    if (canViewAffiliate) {
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
      if (VALID_AFFILIATE_USER_STATUS.includes(status)) {
        payload.status = status;
      }
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      if (dayjs(startDate).isValid() && dayjs(endDate).isValid()) {
        payload.startDate = startDate;
        payload.endDate = endDate;
      }
      const search = searchParams.get('search');
      if (search?.trim?.()) {
        payload.search = search?.trim?.();
      }
      if (Object.keys(payload).length) {
        dispatch(setAffiliateUserFilters(payload));
      }
      dispatch(getAllAffiliateUser(payload));
      dispatch(fetchAffiliateOptions());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewAffiliate]);

  const handlePagination = payload => {
    dispatch(setAffiliateUserFilters(payload));
    dispatch(getAllAffiliateUser(payload));
  };

  const onUpdateStatus = payload => {
    dispatch(updateAffiliateUser(payload));
  };

  const toggleSelect = useCallback(() => {
    dispatch(toggleSelectMultipleAffiliateUser());
  }, [dispatch]);

  const onChangeMultipleStatus = useCallback(
    e => {
      const value = e?.target?.value;
      const keys = Object.keys(selectedAffiliateUserId || {});
      if (keys.length) {
        const payload = keys.map(item => ({
          affiliateUserId: item,
          status: value,
        }));
        dispatch(updateAffiliateUser(payload));
      }
    },
    [dispatch, selectedAffiliateUserId],
  );

  const onClickExport = useCallback(() => {
    dispatch(exportAffiliateUser());
  }, [dispatch]);

  // const onClickAllDispatched = useCallback(() => {
  //   dispatch(dispatchAllShipping());
  // }, [dispatch]);

  const handleClickOpen = () => {
    dispatch(
      setCreateAffiliateUserForm({ showCreateAffiliateUserModal: true }),
    );
  };

  const closeCreateAffiliateUserModal = () => {
    dispatch(
      setCreateAffiliateUserForm({ showCreateAffiliateUserModal: false }),
    );
    dispatch(resetCreateAffiliateUserForm());
  };

  if (isUserLoaded) {
    return <Loading />;
  }

  if (!canViewAffiliate && !userData) {
    return <AccessDenied isLoading={true} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.row}>
        <h1>Admin Users</h1>
        <RefreshButton
          onPressRefresh={() => {
            dispatch(getAllAffiliateUser({ isForceRefresh: true }));
            dispatch(fetchAffiliateOptions({ isForceRefresh: true }));
          }}
        />
        {/*<Button_*/}
        {/*  variant='contained'*/}
        {/*  color='primary'*/}
        {/*  onClick={handleClickOpen}*/}
        {/*  className={s.addButton}>*/}
        {/*  <div className={s.addCardIconText}>*/}
        {/*    <AddCircleIcon />*/}
        {/*    <span>Add Affiliate User</span>*/}
        {/*  </div>*/}
        {/*</Button_>*/}
      </div>
      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <div>
            <Button
              className={`${styles.filterButton}  ${isMultiAffiliateUserSelect ? styles.activeFilter : ''}`}
              startIcon={<CheckCircleOutline />}
              onClick={toggleSelect}>
              Select Multiple
            </Button>
            <AffiliateSearch />
            {affiliateUserSelectedLength >= 1 && (
              <div
                className={
                  styles.infoText
                }>{`${affiliateUserSelectedLength} affiliate user's are selected`}</div>
            )}
          </div>
          <div className={styles.subRowView}>
            {affiliateUserSelectedLength >= 1 && (
              <SimpleSelect
                customClass={styles.selectView}
                label={'Select Status'}
                data={AFFILIATE_USER_STATUS_DATA}
                labelSx={{ fontSize: 12 }}
                onChange={onChangeMultipleStatus}
                borderColor={'var(--whiteOutline)'}
              />
            )}
            <FilterAndExportButton
              onClickFilter={() =>
                dispatch(setIsExpandAffiliateUserFilter(!isExpand))
              }
              isExporting={isExporting}
              onClickExport={onClickExport}
              isExpand={isExpand}
              badgeCount={filterCountRef.current}
            />
          </div>
        </div>
        <AffiliateUserFilters isCollapsed={isExpand} />
        <AffiliateUsersView
          affiliateUsers={affiliateUsers}
          pagination={affiliateUserPagination}
          isLoading={affiliateUserLoading}
          handlePagination={handlePagination}
          onUpdateStatus={onUpdateStatus}
          isMultiAffiliateUserSelect={isMultiAffiliateUserSelect}
          selectedAffiliateUserId={selectedAffiliateUserId}
          userRolePermissions={userRolePermissions}
        />
      </div>
      {isShowCreateAffiliateUserModal && (
        <ModalCreateAffiliateUserForm
          open={isShowCreateAffiliateUserModal}
          handleClose={closeCreateAffiliateUserModal}
        />
      )}
    </div>
  );
};

export default AdminAffiliateUsersPage;
