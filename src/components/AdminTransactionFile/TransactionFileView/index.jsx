import React from 'react';
import Loading from '@/components/Loading';
import styles from './TransactionFile.module.css';
import Pagination from '@/components/pagination';
import TransactionFileTable from '@/components/AdminTransactionFile/TransactionFileTable';

const TransactionFileView = props => {
  const { pagination, handlePagination, isLoading, transactionFile } = props;

  if (isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <Loading />
      </div>
    );
  }
  if (!transactionFile?.length) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyText}>No Transaction file found</div>
      </div>
    );
  }

  return (
    <>
      <TransactionFileTable {...props} />
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

export default TransactionFileView;
