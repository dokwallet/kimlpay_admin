'use client';
import React from 'react';
import {
  FormControl,
  InputAdornment,
  Autocomplete,
  TextField,
  Box,
  Popper,
  FormHelperText,
  CircularProgress,
} from '@mui/material';

const PopperComponent = props => {
  return (
    <Popper
      {...props}
      sx={{
        '& .MuiAutocomplete-paper': {
          backgroundColor: 'var(--listBackground)',
        },
        '& .MuiAutocomplete-noOptions': {
          color: 'var(--font)',
        },
        '& .MuiAutocomplete-loading': {
          color: 'var(--font)',
        },
      }}
    />
  );
};

export const Option = (props, option, renderOptionItem) => {
  const { key, ...optionProps } = props;
  return (
    <Box
      key={key}
      component='li'
      sx={{
        color: 'var(--font)',
        '&.Mui-focused': {
          backgroundColor: 'var(--listHover) !important',
        },
        '&[aria-selected=true]': {
          backgroundColor: 'var(--listSelected) !important',
        },
      }}
      {...optionProps}>
      {renderOptionItem?.(option) || option?.label}
    </Box>
  );
};

const SelectWithSearch = ({
  label,
  optionList = [],
  renderOptionItem = null,
  variant = 'outlined',
  value,
  inputValue = null,
  onInputChange = null,
  onChange,
  className = '',
  isError = false,
  height = '55px',
  loading = false,
  placeholder,
  onEndReached,
  ...props
}) => {
  // const [loading, SetLoading] = useState(false);
  let optionalProps = {};

  if (inputValue !== null && inputValue !== undefined) {
    optionalProps = {
      ...optionalProps,
      inputValue,
    };
  }

  return (
    <>
      <Autocomplete
        className={`${className ? className : ''}`}
        options={optionList}
        getOptionLabel={option => option.label}
        renderOption={(props, option) =>
          Option(props, option, renderOptionItem)
        }
        loading={loading}
        value={value}
        isOptionEqualToValue={(option, value) =>
          option.id === value.id || props.defaultValue?.id
        }
        {...optionalProps}
        onInputChange={onInputChange}
        onChange={(_, value) => {
          onChange && onChange(value);
        }}
        renderInput={params => (
          <TextField
            {...params}
            label={label}
            variant={variant}
            placeholder={placeholder}
            sx={{
              '& .MuiFilledInput-root': {
                backgroundColor: 'var(--backgroundColor)', // Customize the background color here
                borderRadius: '6px 6px 0 0',
                height: height,
                '&:hover fieldset': {
                  borderColor: 'var(--sidebarIcon) !important', // Customize the hover border color here
                },
                '&::after': {
                  borderBottom: '2px solid var(--borderActiveColor)',
                },
              },
              '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
                height: height,
                '& fieldset': {
                  borderColor: isError ? 'red' : 'var(--sidebarIcon)', // Customize the border color here
                },
                '&:hover fieldset': {
                  borderColor: 'var(--sidebarIcon) !important', // Customize the hover border color here
                },
                '&.Mui-focused fieldset': {
                  borderColor: isError ? 'red' : 'var(--borderActiveColor)', // Customize the focused border color here
                },
              },
              '& .MuiInputLabel-outlined': {
                color: 'var(--font)',
              },
              '& .MuiInputLabel-root': {
                color: 'var(--font)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'var(--font)',
              },
              '& .MuiFilledInput-input': {
                color: 'var(--font)',
              },
              '& .MuiSvgIcon-root': {
                color: 'var(--primary)',
              },
            }}
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position='end'>
                    {loading ? (
                      <CircularProgress
                        size={18}
                        sx={{ color: 'var(--font)' }}
                      />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
        {...props}
        slots={{
          popper: PopperComponent,
        }}
        slotProps={{
          listbox: {
            onScroll: event => {
              const listboxNode = event.currentTarget;
              if (
                listboxNode.scrollTop + listboxNode.clientHeight ===
                listboxNode.scrollHeight
              ) {
                onEndReached?.();
              }
            },
          },
        }}
      />
      {isError && (
        <FormHelperText className='helperText'>{isError}</FormHelperText>
      )}
    </>
  );
};

export default SelectWithSearch;
