import React from 'react';
import Loading from '@/components/Loading';
import styles from './AdminTransactionsView.module.css';
import Pagination from '@/components/pagination';
import AdminTransactionsTable from '../AdminTransactionsTable';

const AdminTransactionsView = props => {
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
        <div className={styles.emptyText}>No Transactions found</div>
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
      <AdminTransactionsTable {...props} />
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

export default AdminTransactionsView;
