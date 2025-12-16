import React from 'react';
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  Popper,
  TextField,
} from '@mui/material';
import { countries, SUPPORTED_COUNTRIES } from '../countrySelect/countries';
import s from './CountryCodeSelect.module.css';
import { countryOption } from '../countrySelect';
import { useField, useFormikContext } from 'formik';
import dayjs from 'dayjs';

const CodePopperComponent = props => {
  const inputWidth = document.getElementById('phoneNumber')?.clientWidth;

  return (
    <Popper
      {...props}
      placement='bottom-start'
      style={{ ...props.style, width: inputWidth || '360px' }}
      sx={{
        '& .MuiAutocomplete-paper': {
          backgroundColor: 'var(--listBackground)',
        },
      }}
    />
  );
};

const CountryCodeSelect = ({ label, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);
  const isError = meta.touched && meta.error;

  return (
    <FormControl
      variant='outlined'
      className={s.countryCodeSelect}
      fullWidth
      error={isError}>
      <Autocomplete
        clearIcon={false}
        getOptionKey={option => option.code}
        inputValue={field?.value || ''}
        options={SUPPORTED_COUNTRIES}
        getOptionLabel={option => option.phone}
        renderOption={countryOption}
        onChange={(_, item) => {
          props.onChange &&
            props.onChange({
              target: {
                name: field.name,
                value: item?.phone,
              },
            });
          setFieldValue(field.name, item?.phone || '');
        }}
        filterOptions={(options, state) => {
          return options.filter(option => {
            const labelMatch = option.label
              .toLowerCase()
              .includes(state.inputValue.toLowerCase());
            const phoneMatch = option.phone.includes(state.inputValue);
            return labelMatch || phoneMatch;
          });
        }}
        renderInput={params => (
          <TextField
            {...params}
            {...field}
            label={label}
            variant='outlined'
            error={isError}
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
              '& .MuiAutocomplete-input': {
                minWidth: '52px !important',
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
              },
            }}
          />
        )}
        isOptionEqualToValue={(option, value) => {
          return option.phone === value.phone;
        }}
        slots={{
          popper: CodePopperComponent,
        }}
      />
      {isError && (
        <FormHelperText className='helperText'>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default CountryCodeSelect;
