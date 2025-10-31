import React from 'react';
import Loading from '@/components/Loading';
import styles from '../../AdminTopupPage/topupView/TopupView.module.css';
import Pagination from '@/components/pagination';
import AffiliateUsersTable from '../AffiliateUsersTable';

const AffiliateUsersView = props => {
  const {
    pagination,
    handlePagination,
    isLoading,
    affiliateUsers,
    userRolePermissions,
  } = props;

  if (isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <Loading />
      </div>
    );
  }

  if (!affiliateUsers?.length) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyText}>No Affiliate users found</div>
      </div>
    );
  }

  return (
    <>
      <AffiliateUsersTable
        {...props}
        userRolePermissions={userRolePermissions}
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
  );
};

export default AffiliateUsersView;
