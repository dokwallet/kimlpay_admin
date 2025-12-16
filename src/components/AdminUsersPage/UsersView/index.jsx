import React, { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Pagination from '@/components/pagination';
import styles from './UsersView.module.css';
import AccessDenied from '@/components/AccessDenied';
import UsersTable from '../UsersTable';

const UsersView = props => {
  const {
    pagination,
    handlePagination,
    isLoading,
    users,
    permissions,
    isAdminTab,
  } = props;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    return () => clearTimeout(timer);
  }, []);

  if (
    isAdminTab &&
    (!permissions || !permissions.includes('read_admin_users'))
  ) {
    return <AccessDenied />;
  }

  if (isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <Loading />
      </div>
    );
  }

  if (!users?.length) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyText}>No Users found</div>
      </div>
    );
  }

  return (
    isVisible && (
      <>
        <UsersTable
          {...props}
          permissions={permissions}
          isAdminTab={isAdminTab}
        />
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
    )
  );
};

export default UsersView;
