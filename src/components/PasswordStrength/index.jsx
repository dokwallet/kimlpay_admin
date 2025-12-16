'use client';
import React, { useEffect, useState } from 'react';
import {
  LinearProgress,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { CheckCircle, Cancel } from '@mui/icons-material';
import TextInput from '../textInput';
import s from './PasswordStrength.module.css';
import { useField } from 'formik';

const strengthMeter = password => {
  let strengths = [
    { regex: /.{8,}/, label: 'Minimum password length: 8' },
    {
      regex: /(?=.*[a-z])(?=.*[A-Z])/,
      label: 'Uppercase and lowercase (A, z)',
    },
    {
      regex: /([0-9]|[^a-zA-Z0-9])/,
      label: 'Contains numeric character (0–9) or symbol',
    },
    {
      regex: /.{8,32}/,
      label: 'Must be at least medium strength',
    },
  ];

  let passedTests = strengths.filter(test => test.regex.test(password)).length;

  return {
    score: (passedTests / strengths.length) * 100,
    strengths,
  };
};

const PasswordStrength = ({ ...props }) => {
  const { label, name, onChange } = props;
  const [strength, setStrength] = useState({ score: 0, strengths: [] });
  const [field] = useField(props);
  const { value: password } = field;

  useEffect(() => {
    setStrength(strengthMeter(password));
  }, [password]);

  const getProgressBarColor = score => {
    if (score <= 33) {
      return 'error'; // Too weak
    } else if (score < 100) {
      return 'warning'; // Could be stronger
    } else if (score === 100) {
      return 'success'; // Strong
    }
  };

  return (
    <Box className={s.passwordStrengthContainer}>
      <TextInput
        type='password'
        label={label}
        name={name}
        onChange={onChange}
      />
      {password && (
        <Box>
          <Box display='flex' alignItems='center'>
            <Box sx={{ width: '100%' }}>
              <LinearProgress
                className={s.passwordStrengthProgress}
                variant='determinate'
                value={strength?.score}
                color={getProgressBarColor(strength?.score)}
              />
            </Box>
            <Typography className={s.passwordStengthStatus}>
              {strength.score < 50
                ? 'Too weak'
                : strength.score <= 99
                  ? 'Could be stronger'
                  : strength.score === 100
                    ? 'Strong'
                    : ''}
            </Typography>
          </Box>
          <List className={s.passwordStrengthList}>
            {strength.strengths.map((test, index) => (
              <ListItem key={index} className={s.passwordStrengthListItem}>
                <ListItemIcon className={s.passwordStrengthListItemIcon}>
                  {test.regex.test(password) ? (
                    <CheckCircle color='success' />
                  ) : (
                    <Cancel color='error' />
                  )}
                </ListItemIcon>
                <ListItemText
                  className={s.passwordStrengthListItemText}
                  sx={{
                    '& .MuiTypography-root': {
                      color: 'var(--font)',
                      fontSize: '.75rem',
                      fontWeight: 500,
                      lineHeight: 1.5,
                      textDecorationLine: test.regex.test(password)
                        ? 'line-through'
                        : 'none',
                    },
                  }}
                  primary={test.label}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default PasswordStrength;
