import React from 'react';
import Loading from '@/components/Loading';
import styles from './PayoutView.module.css';
import Pagination from '@/components/pagination';
import PayoutTable from '@/components/AdminPayoutPage/PayoutTable';

const PayoutView = props => {
  const {
    pagination,
    handlePagination,
    isLoading,
    payout,
    userRolePermissions,
  } = props;

  if (isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <Loading />
      </div>
    );
  }

  if (!payout?.length) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyText}>No Deposit found</div>
      </div>
    );
  }

  return (
    <>
      <PayoutTable {...props} userRolePermissions={userRolePermissions} />

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

export default PayoutView;
