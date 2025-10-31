'use client';
import React from 'react';
import styles from './SearchInput.module.css';
import { IconButton, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchInput = ({ value, onChange }) => {
  return (
    <TextField
      className={styles.searchInput}
      value={value}
      onChange={onChange}
      placeholder='Search'
      variant='outlined'
      size='small'
      sx={{
        '& .MuiOutlinedInput-root': {
          padding: '0',
          '& fieldset': {
            border: 'none',
          },
        },
        '& .MuiOutlinedInput-input': {
          padding: '4px 8px', // Adjust this value as needed
        },
        '& .MuiInputAdornment-root': {
          marginLeft: '8px', // Adjust this value to position the icon
        },
        '& .MuiIconButton-root': {
          padding: '0',
          paddingRight: '8px',
        },
      }}
      slotProps={{
        input: {
          startAdornment: <SearchIcon />,
          endAdornment: value ? (
            <IconButton
              aria-label='copyIcon'
              onClick={() => onChange({ target: { value: '' } })}
              edge='end'
              sx={{
                '&  .MuiSvgIcon-root': {
                  color: 'var(--primary)',
                },
              }}>
              <ClearIcon />
            </IconButton>
          ) : null,
        },
      }}
    />
  );
};

export default SearchInput;
