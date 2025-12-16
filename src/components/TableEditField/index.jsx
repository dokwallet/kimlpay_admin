'use client';
import React from 'react';
import styles from './TableEditField.module.css';
import { IconButton } from '@mui/material';
import { Save } from '@mui/icons-material';

const TableEditField = ({ value, name, onChange, onSave, ...props }) => {
  return (
    <div className={styles.rowView}>
      <input
        className={styles.inputStyle}
        onChange={onChange}
        value={value}
        name={name}
        {...props}
      />
      <p className={styles.percentageStyle}>%</p>
      <IconButton
        aria-label='Save commission'
        onClick={onSave}
        edge='end'
        sx={{
          '&  .MuiSvgIcon-root': {
            color: 'var(--background)',
          },
        }}>
        <Save />
      </IconButton>
    </div>
  );
};

export default TableEditField;
