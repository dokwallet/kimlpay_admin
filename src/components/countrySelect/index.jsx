'use client';
import React from 'react';
import Image from 'next/image';
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  Autocomplete,
  TextField,
  Box,
  Popper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useField, useFormikContext } from 'formik';
import { countries, SUPPORTED_COUNTRIES } from './countries';
import s from './CountrySelect.module.css';
import imageLoader from '@/components/NextImageLoader';

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
      }}
    />
  );
};

export const countryOption = (props, option) => {
  const { key, ...optionProps } = props;
  return (
    <Box
      key={key}
      component='li'
      sx={{
        '& > img': { mr: 2, flexShrink: 0 },
        color: 'var(--font)',
        '&.Mui-focused': {
          backgroundColor: 'var(--listHover) !important',
        },
        '&[aria-selected=true]': {
          backgroundColor: 'var(--listSelected) !important',
        },
      }}
      {...optionProps}>
      <Image
        loading='lazy'
        height={15}
        width={20}
        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
        alt=''
        loader={imageLoader}
      />
      {option.label} ({option.code}) {option.phone}
    </Box>
  );
};

const CountrySelect = ({ label, isOptionEqualToValue, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const { isValid } = props;
  const [field, meta] = useField(props);
  const isError = meta.touched && meta.error;
  return (
    <FormControl variant='outlined' className={s.countrySelect} fullWidth>
      <Autocomplete
        options={SUPPORTED_COUNTRIES}
        getOptionLabel={option => option.label}
        renderOption={countryOption}
        defaultValue={field?.value}
        onChange={(_, value) => {
          setFieldValue(field.name, value || '');
          props.onChange &&
            props.onChange({
              target: {
                name: field.name,
                value: value || '',
              },
            });
        }}
        renderInput={params => (
          <TextField
            {...params}
            {...field}
            label={label}
            variant='outlined'
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '6px',
                height: '48px',
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
                color: isError ? 'red' : 'var(--sidebarIcon)',
              },
              '& .MuiInputLabel-root': {
                color: isError ? 'red' : 'var(--sidebarIcon)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: isError ? 'red' : 'var(--sidebarIcon)',
              },
              '& .MuiOutlinedInput-input': {
                padding: '12px',
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
                    {isValid ? (
                      <CheckCircleIcon
                        color='success'
                        style={{ color: '#2e7d32' }}
                      />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
        slots={{
          popper: PopperComponent,
        }}
      />
      {isError && (
        <FormHelperText className='helperText'>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default CountrySelect;
