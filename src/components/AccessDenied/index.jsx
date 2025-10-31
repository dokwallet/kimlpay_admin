import React from 'react';
import Loading from '../Loading';
import styles from './AcessDenied.module.css';

function AccessDenied({ isLoading }) {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles['no-permission-container']}>
      <div className={styles['no-permission-content']}>
        <h1 className={styles['no-permission-title']}>Access Denied</h1>
        <div className={styles['no-permission-icon']} aria-hidden='true'>
          🚫
        </div>
        <p className={styles['no-permission-message']}>
          Sorry, you dont have permission to view this page.
        </p>
      </div>
    </div>
  );
}

export default AccessDenied;
