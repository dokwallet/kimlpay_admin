import React from 'react';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  createTheme,
  FormControl,
  FormHelperText,
  ThemeProvider,
} from '@mui/material';
import { useField } from 'formik';
import dayjs from 'dayjs';
import s from '../textInput/TextInput.module.css';

const DatePicker = ({ label, sx = {}, required = true, ...props }) => {
  const [field, meta, helpers] = useField(props);
  const { setValue } = helpers;

  let isError = false;
  if (required) {
    isError = meta.touched && meta.error;
  }

  const themeMode =
    document.documentElement.getAttribute('data-theme') || 'dark';
  const theme = createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: themeMode === 'dark' ? '#90caf9' : '#1976d2',
      },
      text: {
        primary: themeMode === 'dark' ? '#ffffff' : '#000000',
      },
      background: {
        default: themeMode === 'dark' ? '#303030' : '#ffffff',
        paper: themeMode === 'dark' ? '#424242' : '#ffffff',
      },
      divider: themeMode === 'dark' ? '#555555' : '#cccccc',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <FormControl
        variant='outlined'
        className={`${s.textInput} ${props?.className}`}
        fullWidth
        error={isError}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MuiDatePicker
            label={label}
            {...field}
            {...props}
            slotProps={{
              field: {
                readOnly: true,
              },
            }}
            value={field.value ? dayjs(field.value) : null}
            onChange={value => {
              const correctDate = dayjs(value);
              if (correctDate.isValid()) {
                props.onChange &&
                  props.onChange({
                    target: {
                      name: field.name,
                      value: correctDate.toISOString(),
                    },
                  });
                setValue(correctDate.toISOString());
              }
            }}
            sx={{
              '& .MuiInputBase-root.MuiOutlinedInput-root': {
                borderRadius: '6px',
                height: '48px',
              },
              '& .MuiOutlinedInput-input': {
                padding: '12px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isError ? 'red' : 'var(--sidebarIcon)',
              },
              '& .MuiInputBase-root.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':
                {
                  borderColor: isError ? 'red' : 'var(--borderActiveColor)',
                },
              '& .MuiInputLabel-outlined': {
                color: isError ? 'red' : 'var(--sidebarIcon)',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: isError ? 'red' : 'var(--sidebarIcon)',
              },
              '&:hover fieldset': {
                borderColor: 'var(--sidebarIcon) !important',
              },
              ...sx,
            }}
          />
        </LocalizationProvider>
        {isError && (
          <FormHelperText className='helperText'>{meta.error}</FormHelperText>
        )}
      </FormControl>
    </ThemeProvider>
  );
};

export default DatePicker;
