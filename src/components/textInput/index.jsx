'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useField } from 'formik';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import s from './TextInput.module.css';

let multilineSx = {};

const TextInput = ({ ...props }) => {
  const {
    name,
    label,
    isValid,
    helperText,
    type = 'text',
    value,
    onChange,
    onBlur,
    select,
    children,
    dataType = '',
    ...rest
  } = props;
  const [field, meta, helpers] = useField(props);
  const { onChange: fieldOnChange, ...restFields } = field;
  const isError = meta.touched && meta.error;

  const [showPassword, setShowPassword] = useState(false);

  const [open, setOpen] = useState(false);
  const selectRef = useRef(null);
  const shouldOpenRef = useRef(true);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleKeyDown = event => {
    // console.log(
    //   'KEY DOWN____________________',
    //   event,
    //   event.key,
    //   open,
    //   document.activeElement,
    //   selectRef.current,
    // );
    // if (event.key === 'Escape') {
    //   handleClose();
    //   shouldOpenRef.current = false;
    // } else if (event.key === 'Enter' && open) {
    //   console.log('ENTER IS FIRED_-------', event.key, event.target.innerText);
    //   const value = options.find(
    //     option => option.label === event.target.innerText,
    //   )?.value;
    //
    //   console.log('VALUE IS FOUND__________', value, helpers);
    //   if (value) {
    //     helpers.setValue(value);
    //     console.log('HANDLE CLOSE IS CALLED________________');
    //     handleClose();
    //   }
    //   shouldOpenRef.current = false;
    // }
    // //  else if (event.key === 'Tab' && event.target === selectRef.current  && !open && !field.value) {
    // //   handleOpen();
    // // }
  };

  const handleFocus = event => {
    if (event.target.id === `select-${name}`) {
      if (!open) handleOpen();
    }
  };

  useEffect(() => {
    if (select && selectRef.current) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('focusin', handleFocus);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('focusin', handleFocus);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('focusin', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [select, open, name]);

  // const [open, setOpen] = useState(false);

  // useEffect(() => {
  //   const handleFocus = (event) => {
  //     console.log('TARGET))))))))))))))))', event.target.id, name);
  //     if (event.target.id === `select-${name}`) {
  //       setOpen(true);
  //     }
  //   };

  //   const handleFocusOut = (event) => {
  //     console.log('TARGET))))))))))))))))', event.target.id, name);
  //     if (event.target.id === `select-${name}`) {
  //       setOpen(false);
  //     }
  //   };

  //   window.addEventListener('focusin', handleFocus);

  //   return () => {
  //     window.removeEventListener('focusin', handleFocus);
  //   };
  // }, [name]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  if (rest?.multiline) {
    multilineSx = {
      padding: 0,
    };
  }

  return (
    <FormControl
      variant='outlined'
      className={`${s.textInput} ${rest?.className}`}
      fullWidth>
      <InputLabel
        focused={false}
        sx={{
          color: isError ? 'red' : 'var(--sidebarIcon)',
        }}>
        {label}
      </InputLabel>
      {select ? (
        <Select
          id={`select-${name}`}
          label={label}
          {...field}
          {...rest}
          input={<OutlinedInput label={label} />}
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          onBlur={handleClose}
          ref={selectRef}
          onChange={e => {
            onChange && onChange(e);
            fieldOnChange(e);
            handleClose();
          }}
          MenuProps={{
            PaperProps: {
              onKeyDown: handleKeyDown,
            },
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
              height: '48px',
              width: '100%',
            },
            '& .MuiInputLabel-root': {
              top: '-6px',
            },
            '& .MuiOutlinedInput-input': {
              padding: '12px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isError ? 'red' : 'var(--sidebarIcon)',
            },

            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isError ? 'red' : 'var(--borderActiveColor)',
            },

            '& .MuiInputLabel-outlined': {
              color: isError ? 'red' : 'var(--sidebarIcon)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--sidebarIcon) !important',
            },
            '& .MuiSvgIcon-root': {
              color: 'var(--primary)',
            },
          }}>
          {children}
        </Select>
      ) : (
        <OutlinedInput
          type={type === 'password' && showPassword ? 'text' : type}
          label={label}
          // name={name}
          //   value={value}
          onChange={e => {
            onChange && onChange(e);
            if (dataType === 'number') {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                fieldOnChange(e);
              }
            } else if (dataType === 'decimal') {
              const value = e.target.value;
              const regex = /^\d+(\.\d+)?$/;
              if (regex.test(value)) {
                fieldOnChange(e);
              }
            } else {
              fieldOnChange(e);
            }
          }}
          //   onBlur={onBlur}
          {...restFields}
          {...rest}
          endAdornment={
            <InputAdornment position='end'>
              {type === 'password' ? (
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                  sx={{
                    '&  .MuiSvgIcon-root': {
                      // color: 'var(--borderActiveColor) ',
                      color: 'var(--primary)',
                    },
                  }}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ) : isValid ? (
                <CheckCircleIcon color='success' />
              ) : (
                rest?.endAdornment
              )}
            </InputAdornment>
          }
          sx={{
            '&.MuiInputBase-root.MuiOutlinedInput-root': {
              borderRadius: '6px',
              minHeight: '48px',
              ...multilineSx,
              '& .Mui-disabled': {
                textFillColor: 'var(--gray)',
              },
            },
            '& .MuiInputLabel-root': {
              top: '-6px',
            },
            '& .MuiOutlinedInput-input': {
              padding: '12px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: isError ? 'red' : 'var(--sidebarIcon)',
            },
            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
              borderColor: 'var(--gray)',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: isError ? 'red' : 'var(--borderActiveColor)',
            },

            '& .MuiInputLabel-outlined': {
              color: isError ? 'red' : 'var(--sidebarIcon)',
            },
            '&:hover fieldset': {
              borderColor: 'var(--sidebarIcon) !important',
            },
          }}
        />
      )}
      {isError && (
        <FormHelperText className='helperText'>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default TextInput;
