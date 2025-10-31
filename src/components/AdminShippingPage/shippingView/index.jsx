import React from 'react';
import Loading from '@/components/Loading';
import styles from '../../AdminTopupPage/topupView/TopupView.module.css';
import Pagination from '@/components/pagination';
import ShippingTable from '../ShippingTable';

const ShippingView = props => {
  const {
    pagination,
    handlePagination,
    isLoading,
    shippings,
    userRolePermissions,
  } = props;

  if (isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <Loading />
      </div>
    );
  }

  if (!shippings?.length) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyText}>No Shipping found</div>
      </div>
    );
  }

  return (
    <>
      <ShippingTable {...props} userRolePermissions={userRolePermissions} />
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

export default ShippingView;
