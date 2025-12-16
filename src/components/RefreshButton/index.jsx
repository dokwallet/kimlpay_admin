import React from 'react';
import { IconButton } from '@mui/material';
import styles from './RefreshButton.module.css';
import { Refresh } from '@mui/icons-material';

const RefreshButton = ({ onPressRefresh, disabled }) => {
  return (
    <IconButton
      className={styles.iconButton}
      onClick={onPressRefresh}
      disabled={disabled}>
      <Refresh />
    </IconButton>
  );
};

export default RefreshButton;
