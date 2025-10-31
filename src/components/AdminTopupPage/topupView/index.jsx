import React from 'react';
import Loading from '@/components/Loading';
import styles from './TopupView.module.css';
import Pagination from '@/components/pagination';
import TopupTable from '@/components/AdminTopupPage/TopupTable';

const TopupView = props => {
  const {
    pagination,
    handlePagination,
    isLoading,
    topup,
    userRolePermissions,
  } = props;

  if (isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <Loading />
      </div>
    );
  }

  if (!topup?.length) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyText}>No Deposit found</div>
      </div>
    );
  }

  return (
    <>
      <TopupTable {...props} userRolePermissions={userRolePermissions} />

      <Pagination
        items={pagination?.totalItems || 0}
        activePage={pagination?.currentPage || 1}
        setPage={value => {
          handlePagination({
            page: value,
            limit: Number(pagination?.itemsPerPage),
          });
        }}
        pageSize={pagination?.itemsPerPage || '10'}
        setPageSize={value => {
          handlePagination({
            limit: value,
            page: 1,
          });
        }}
      />
    </>
  );
};

export default TopupView;
