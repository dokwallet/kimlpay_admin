'use client';
import React, { useMemo } from 'react';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import styles from './SimpleSelect.module.css';

const SimpleSelect = ({
  label = '',
  labelSx = {},
  value,
  data,
  onChange,
  customClass,
  borderColor,
  borderWidth = '1px',
  selectedFontSize,
  fullWidth,
}) => {
  const selectInput = useMemo(() => {
    return (
      <Select
        className={`${styles.pageItemsSelect} ${customClass}`}
        value={value}
        onChange={onChange}
        label={label}
        size='small'
        MenuProps={{
          sx: {
            '& .MuiMenu-paper': {
              color: 'var(--font)',
            },
            '& .MuiMenu-list': {
              backgroundColor: 'var(--listBackground)',
            },
            '& .MuiMenuItem-root': {
              '&:hover': {
                backgroundColor: 'var(--listHover) !important',
              },
              '&.Mui-selected': {
                backgroundColor: 'var(--listSelected) !important',
              },
            },
          },
        }}
        sx={{
          '&.MuiInputBase-root.MuiOutlinedInput-root': {
            borderRadius: '6px',
            fontSize: selectedFontSize || '12px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: borderColor || 'var(--sidebarIcon)',
            borderWidth: borderWidth,
          },

          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: borderColor || 'var(--borderActiveColor)',
            borderWidth: borderWidth,
          },
          '&:hover fieldset': {
            borderColor: borderColor || 'var(--sidebarIcon) !important',
            borderWidth: borderWidth,
          },
          '& .MuiSvgIcon-root': {
            color: 'var(--primary)',
          },
        }}>
        {data.map(item => (
          <MenuItem key={item.value} value={item?.value}>
            {item?.label}
          </MenuItem>
        ))}
      </Select>
    );
  }, [
    borderColor,
    borderWidth,
    customClass,
    data,
    label,
    onChange,
    selectedFontSize,
    value,
  ]);

  return label ? (
    <FormControl variant='outlined' fullWidth={fullWidth}>
      <InputLabel
        focused={false}
        sx={{
          ...labelSx,
          color: 'var(--font)',
          transform: 'translate(14px, 8px) scale(1)',
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
          },
        }}>
        {label}
      </InputLabel>
      {selectInput}
    </FormControl>
  ) : (
    selectInput
  );
};

export default SimpleSelect;
