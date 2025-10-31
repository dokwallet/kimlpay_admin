'use client';
import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './AdminTransactionFile.module.css';
import { useSearchParams } from 'next/navigation';
import {
  VALID_LIMIT,
  VALID_TOP_STATUS,
  VALID_TRANSACTION_FILE_TYPE,
  validateNumber,
} from '@/utils/helper';
import useRefreshScrollRestoration from '@/hooks/useRefreshScrollRestoration';
import FilterAndExportButton from '@/components/FilterAndExportButton';
import dayjs from 'dayjs';

import RefreshButton from '@/components/RefreshButton';
import {
  getTransactionFileData,
  getTransactionFileFilter,
  isExpandTransactionFileFilter,
} from '@/redux/transactionFile/transactionFileSelectors';
import {
  getPermissions,
  getUserData,
  isUserLoading,
} from '@/redux/user/userSelector';
import {
  createTransactionFileKey,
  getTransactionFile,
  setIsExpandTransactionFileFilter,
  setTransactionFileFilters,
} from '@/redux/transactionFile/transactionFileSlice';
import TransactionFileView from '@/components/AdminTransactionFile/TransactionFileView';
import TransactionFileFilter from '@/components/transactionFileFilters';
import AccessDenied from '@/components/AccessDenied';
import Loading from '@/components/Loading';

const AdminTransactionFilePage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const isExpand = useSelector(isExpandTransactionFileFilter);
  useRefreshScrollRestoration('transactionFile');
  const filterCountRef = useRef(0);

  const transactionFileData = useSelector(getTransactionFileData);
  const transactionFilter = useSelector(getTransactionFileFilter);

  const userData = useSelector(getUserData);
  const isUserLoaded = useSelector(isUserLoading);
  const userRolePermissions = useSelector(getPermissions);

  const canViewTransactionsFiles = useMemo(() => {
    if (userData && userRolePermissions) {
      return userRolePermissions.includes('read_transactions_files');
    }
    return false;
  }, [userData, userRolePermissions]);

  const { transactionFile, transactionFilePagination, transactionFileLoading } =
    useMemo(() => {
      const key = createTransactionFileKey({
        page: transactionFilter?.page || 1,
        limit: transactionFilter?.limit || 10,
        type: transactionFilter?.type,
        startDate: transactionFilter?.startDate,
        endDate: transactionFilter?.endDate,
      });
      filterCountRef.current = 0;
      if (transactionFilter?.type) {
        filterCountRef.current += 1;
      }
      if (transactionFilter?.startDate && transactionFilter?.endDate) {
        filterCountRef.current += 1;
      }

      const transactionFile = transactionFileData?.[key]?.transactionFile;
      const transactionFilePagination =
        transactionFileData?.[key]?.transactionFilePagination;
      const loading = transactionFileData?.[key]?.isLoading;
      return {
        transactionFile: Array.isArray(transactionFile) ? transactionFile : [],
        transactionFilePagination: transactionFilePagination || {},
        transactionFileLoading: loading || false,
      };
    }, [transactionFileData, transactionFilter]);

  useEffect(() => {
    if (canViewTransactionsFiles) {
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
      const type = searchParams.get('type');
      if (VALID_TRANSACTION_FILE_TYPE.includes(type)) {
        payload.type = type;
      }
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');
      if (dayjs(startDate).isValid() && dayjs(endDate).isValid()) {
        payload.startDate = startDate;
        payload.endDate = endDate;
      }
      if (Object.keys(payload).length) {
        dispatch(setTransactionFileFilters(payload));
      }
      dispatch(getTransactionFile(payload));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canViewTransactionsFiles]);

  const handlePagination = payload => {
    dispatch(setTransactionFileFilters(payload));
    dispatch(getTransactionFile(payload));
  };

  if (isUserLoaded) {
    return <Loading />;
  }

  if (!canViewTransactionsFiles && !userData) {
    return <AccessDenied isLoading={true} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.row}>
        <h1>Transaction File</h1>
        <RefreshButton
          onPressRefresh={() => {
            dispatch(getTransactionFile({ isForceRefresh: true }));
          }}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.filterContainer}>
          <FilterAndExportButton
            onClickFilter={() =>
              dispatch(setIsExpandTransactionFileFilter(!isExpand))
            }
            isExpand={isExpand}
            badgeCount={filterCountRef.current}
            hideExportButton={true}
          />
        </div>
        <TransactionFileFilter isCollapsed={isExpand} />
        <TransactionFileView
          transactionFile={transactionFile}
          pagination={transactionFilePagination}
          isLoading={transactionFileLoading}
          handlePagination={handlePagination}
        />
      </div>
    </div>
  );
};

export default AdminTransactionFilePage;
