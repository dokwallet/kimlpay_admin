import React from 'react';
import Loading from '@/components/Loading';
import styles from './AdminTransactionsView.module.css';
import Pagination from '@/components/pagination';
import AdminTransactionsTable from '../AdminTelegramUsersTable';
import AdminTelegramUsersTable from '../AdminTelegramUsersTable';
import AccessDenied from '@/components/AccessDenied';

const AdminTelegramUsersView = props => {
  const {
    pagination,
    handlePagination,
    isLoading,
    transactions,
    onUpdateStatus,
    permissions = [],
  } = props;

  if (isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <Loading />
      </div>
    );
  }

  if (!permissions || !permissions.includes('read_telegram_users')) {
    return <AccessDenied />;
  }

  if (!transactions?.length) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyText}>No Telegram Users found</div>
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
      <AdminTelegramUsersTable
        transactions={transactions}
        onUpdateStatus={onUpdateStatus}
        permissions={permissions}
      />
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

export default AdminTelegramUsersView;
