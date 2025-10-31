'use client';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import {
  SHIPPING_STATUS_DATA,
  VALID_LIMIT,
  VALID_SHIPPING_STATUS,
  validateNumber,
} from '@/utils/helper';
import useRefreshScrollRestoration from '@/hooks/useRefreshScrollRestoration';
import FilterAndExportButton from '@/components/FilterAndExportButton';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import RefreshButton from '@/components/RefreshButton';
import {
  createShippingKey,
  exportShipping,
  getAllShipping,
  setIsExpandShippingFilter,
  setShippingFilters,
  toggleSelectMultipleShipping,
  updateShippingStatus,
} from '@/redux/shipping/shippingSlice';
import {
  getIsShippingExporting,
  getSelectedShippingIds,
  getShippingFilter,
  getShippingListData,
  isExpandShippingFilter,
  isMultiShippingSelectEnable,
} from '@/redux/shipping/shippingSelector';
import ShippingView from './shippingView';
import ShippingFilter from '../shippingFilters';
import styles from '../AdminTopupPage/AdminTopupPage.module.css';
import SimpleSelect from '@/components/SimpleSelect';
import ModalBulkShippingAddress from '../modalBulkShippingAddress';
import ShippingSearch from '@/components/AdminShippingPage/ShippingSearch';
import {
  getPermissions,
  getUserData,
  isUserLoading,
} from '@/redux/user/userSelector';
import Loading from '@/components/Loading';
import AccessDenied from '@/components/AccessDenied';

const AdminShippingPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const isExporting = useSelector(getIsShippingExporting);
  const isExpand = useSelector(isExpandShippingFilter);
  useRefreshScrollRestoration('shipping');
  const filterCountRef = useRef(0);
  const isMultiShippingSelect = useSelector(isMultiShippingSelectEnable);
  const selectedShippingId = useSelector(getSelectedShippingIds);
  const [openBulkShippingAddress, setOpenBulkShippingAddress] = useState(false);
  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const isUserLoaded = useSelector(isUserLoading);
  const userData = useSelector(getUserData);
  const userRolePermissions = useSelector(getPermissions);

  const canViewShipping = useMemo(() => {
    if (userData && userRolePermissions) {
      return userRolePermissions.includes('read_shipping');
    }
  }, [userData, userRolePermissions]);

  const shippingSelectedLength = useMemo(() => {
    const allSelectedShippingIds = Object.keys(selectedShippingId);
    return allSelectedShippingIds.length;
  }, [selectedShippingId]);

  const ShippingData = useSelector(getShippingListData);
  const shippingFilter = useSelector(getShippingFilter);
  const { shippings, shippingPagination, shippingLoading } = useMemo(() => {
    const key = createShippingKey({
      page: shippingFilter?.page || 1,
      limit: shippingFilter?.limit || 10,
      status: shippingFilter?.status,
      startDate: shippingFilter?.startDate,
      endDate: shippingFilter?.endDate,
      search: shippingFilter?.search,
    });
    filterCountRef.current = 0;
    if (shippingFilter?.status) {
      filterCountRef.current += 1;
    }
    if (shippingFilter?.startDate && shippingFilter?.endDate) {
      filterCountRef.current += 1;
    }

    const shippings = ShippingData?.[key]?.shippings;
    const shippingPagination = ShippingData?.[key]?.shippingPagination;
    const shippingLoading = ShippingData?.[key]?.isLoading;
    return {
      shippings: Array.isArray(shippings) ? shippings : [],
      shippingPagination: shippingPagination || {},
      shippingLoading: shippingLoading || false,
    };
  }, [ShippingData, shippingFilter]);

  useEffect(() => {
    if (canViewShipping) {
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
      if (VALID_SHIPPING_STATUS.includes(status)) {
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
        dispatch(setShippingFilters(payload));
      }
      dispatch(getAllShipping(payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewShipping]);

  const handlePagination = payload => {
    dispatch(setShippingFilters(payload));
    dispatch(getAllShipping(payload));
  };

  const onChangeMultipleStatus = useCallback(
    e => {
      const value = e?.target?.value;
      const keys = Object.keys(selectedShippingId || {});
      if (keys.length) {
        const payload = keys.map(item => ({
          shippingId: item,
          status: value,
        }));
        dispatch(updateShippingStatus(payload));
      }
    },
    [dispatch, selectedShippingId],
  );

  useEffect(() => {
    const relevantCardIds = Object.keys(selectedShippingId || {}).map(
      item => shippings.find(shipping => shipping._id === item)?.card_id,
    );
    setSelectedCardIds(relevantCardIds);
  }, [selectedShippingId, shippings]);

  const onBulkShip = useCallback(() => {
    setOpenBulkShippingAddress(true);
  }, []);

  const onUpdateStatus = useCallback(
    payload => {
      dispatch(updateShippingStatus(payload));
    },
    [dispatch],
  );

  const onClickExport = useCallback(() => {
    dispatch(exportShipping());
  }, [dispatch]);

  const onToggleMultipleSelect = useCallback(() => {
    dispatch(toggleSelectMultipleShipping());
  }, [dispatch]);

  if (isUserLoaded) {
    return <Loading />;
  }

  if (!canViewShipping && !userData) {
    return <AccessDenied isLoading={true} />;
  }

  return (
    <div className={styles.page}>
      <ModalBulkShippingAddress
        cardIds={selectedCardIds}
        open={openBulkShippingAddress}
        handleClose={() => setOpenBulkShippingAddress(false)}
      />
      <div className={styles.row}>
        <h1>Shipping</h1>
        <RefreshButton
          onPressRefresh={() => {
            dispatch(getAllShipping({ isForceRefresh: true }));
          }}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <div>
            <Button
              className={`${styles.filterButton}  ${isMultiShippingSelect ? styles.activeFilter : ''}`}
              startIcon={<CheckCircleOutline />}
              onClick={onToggleMultipleSelect}>
              Select Multiple
            </Button>
            <ShippingSearch />
            {shippingSelectedLength >= 1 && (
              <div
                className={
                  styles.infoText
                }>{`${shippingSelectedLength} shipping's are selected`}</div>
            )}
          </div>
          <div className={styles.subRowView}>
            {shippingSelectedLength >= 1 && (
              <div className={styles.subRowView}>
                <SimpleSelect
                  customClass={styles.selectView}
                  label={'Select Status'}
                  data={SHIPPING_STATUS_DATA}
                  labelSx={{ fontSize: 12 }}
                  onChange={onChangeMultipleStatus}
                  borderColor={'var(--whiteOutline)'}
                />
                <Button
                  className={`${styles.filterButton}`}
                  // startIcon={<FilterListIcon />}
                  onClick={onBulkShip}>
                  Bulk Ship
                </Button>
              </div>
            )}
            <FilterAndExportButton
              onClickFilter={() =>
                dispatch(setIsExpandShippingFilter(!isExpand))
              }
              isExporting={isExporting}
              onClickExport={onClickExport}
              isExpand={isExpand}
              badgeCount={filterCountRef.current}
            />
          </div>
        </div>
        <ShippingFilter isCollapsed={isExpand} />
        <ShippingView
          shippings={shippings}
          pagination={shippingPagination}
          isLoading={shippingLoading}
          handlePagination={handlePagination}
          onUpdateStatus={onUpdateStatus}
          isMultiShippingSelect={isMultiShippingSelect}
          selectedShippingId={selectedShippingId}
          userRolePermissions={userRolePermissions}
        />
      </div>
    </div>
  );
};

export default AdminShippingPage;
