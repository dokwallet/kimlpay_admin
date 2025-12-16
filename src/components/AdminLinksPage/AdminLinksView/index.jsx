import React from 'react';
import Loading from '@/components/Loading';
import styles from './AdminLinksView.module.css';
import Pagination from '@/components/pagination';
import AdminLinksTable from '../AdminLinksTable';

const AdminLinksView = props => {
  const { pagination, handlePagination, isLoading, links } = props;

  if (isLoading) {
    return (
      <div className={styles.emptyContainer}>
        <Loading />
      </div>
    );
  }

  if (!links?.length) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyText}>No Links found</div>
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
      <AdminLinksTable {...props} />
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

export default AdminLinksView;
