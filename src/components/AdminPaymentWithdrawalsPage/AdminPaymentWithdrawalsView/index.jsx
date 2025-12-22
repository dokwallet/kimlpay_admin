import React from 'react';
import Loading from '@/components/Loading';
import styles from './AdminPaymentWithdrawalsView.module.css';
import Pagination from '@/components/pagination';
import AdminPaymentWithdrawalsTable from '../AdminPaymentWithdrawalsTable';

const AdminPaymentWithdrawalsView = props => {
  const { pagination, handlePagination, isLoading, transactions } = props;

  if (isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <Loading />
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyText}>No Withdrawals found</div>
      </div>
    );
  }

  const handlePageChange = value => {
    handlePagination({
      page: value,
      limit: Number(pagination?.itemsPerPage),
    });
  };

  const handlePageSizeChange = value => {
    handlePagination({
      limit: value,
      page: 1,
    });
  };

  return (
    <>
      <AdminPaymentWithdrawalsTable {...props} />
      <Pagination
        items={pagination?.totalItems || 0}
        activePage={pagination?.currentPage || 1}
        setPage={handlePageChange}
        pageSize={pagination?.itemsPerPage || '10'}
        setPageSize={handlePageSizeChange}
      />
    </>
  );
};

export default AdminPaymentWithdrawalsView;
