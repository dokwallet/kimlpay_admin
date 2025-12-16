import React from 'react';
import Button from '@/components/_button';
import { Box } from '@mui/material';
import styles from './ActionButtons.module.css';

const ActionButtons = ({ onApplyClick, onCancelClick }) => {
  return (
    <Box className={styles.actionButtonContainer}>
      <Box className={styles.buttonWrapper}>
        <Button className={styles.cancelBtn} onClick={onCancelClick}>
          cancel
        </Button>
        <Button className={styles.applyBtn} onClick={onApplyClick}>
          Apply
        </Button>
      </Box>
    </Box>
  );
};

export default ActionButtons;
