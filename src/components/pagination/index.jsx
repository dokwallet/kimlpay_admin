import React from 'react';
import { Pagination as _Pagination } from '@mui/material';
import styles from './Pagination.module.css';
import SimpleSelect from '@/components/SimpleSelect';

const LIMIT_DATA = [
  {
    label: '10',
    value: '10',
  },
  {
    label: '25',
    value: '25',
  },
  {
    label: '50',
    value: '50',
  },
  {
    label: '100',
    value: '100',
  },
];
const Pagination = ({
  items,
  activePage = 1,
  pageSize = '10',
  setPage,
  setPageSize,
  ...props
}) => {
  const handleChange = (_, value) => {
    setPage(value);
  };

  return (
    <>
      <div className={styles.mobileTableAttr}>
        Showing <strong>{(activePage - 1) * parseInt(pageSize) + 1}</strong> to{' '}
        <strong>
          {items < parseInt(pageSize) * activePage
            ? items
            : parseInt(pageSize) * activePage}
        </strong>{' '}
        of <strong>{items}</strong> results
      </div>
      <div className={styles.paginationWrapper}>
        <div className={styles.tableAttr}>
          Showing <strong>{(activePage - 1) * parseInt(pageSize) + 1}</strong>{' '}
          to{' '}
          <strong>
            {items < parseInt(pageSize) * activePage
              ? items
              : parseInt(pageSize) * activePage}
          </strong>{' '}
          of <strong>{items}</strong> results
        </div>
        <div className={styles.paginationContainer}>
          <_Pagination
            {...props}
            page={activePage}
            onChange={handleChange}
            count={Math.ceil(items / parseInt(pageSize))}
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'var(--font)',
                '&.Mui-selected': {
                  backgroundColor: 'var(--secondBackground)',
                },
                '&:hover': {
                  backgroundColor: 'var(--headerBorder)',
                  color: 'var(--primary)',
                },
              },
            }}
          />
        </div>
        <div className={styles.itemsPerPageContainer}>
          <div className={styles.tableAttrPage}>items per page</div>
          <div className={styles.limitContainer}>
            <SimpleSelect
              data={LIMIT_DATA}
              value={pageSize}
              onChange={event => setPageSize(event.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Pagination;
