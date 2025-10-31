'use client';
import React, { useCallback, useMemo } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import TextInput from '@/components/textInput';
import { getUserData } from '@/redux/user/userSelector';
import { useDispatch, useSelector } from 'react-redux';
import styles from './UpdateEmail.module.css';
import Button from '@/components/_button';

import {
  sendChangeEmailOTP,
  verifyEmailOTP,
} from '@/redux/settings/settingsSlice';
import {
  isEmailOTPSubmitting,
  isEmailOTPSubmittingSuccessfully,
  isVerifyingEmailOTP,
} from '@/redux/settings/settingsSelectors';
import { updateEmailValidation } from '@/validations/updateEmailValidation';
import { FormHelperText } from '@mui/material';
import { verifyChangeEmailOTPValidation } from '@/validations/verifyChangeEmailOTPValidation';
import {
  getUpdateEmailForm,
  getVerifyEmailForm,
} from '@/redux/form/formDataSelector';
import {
  setUpdateEmailForm,
  setVerifyEmailForm,
} from '@/redux/form/formDataSlice';

const UpdateEmailForm = () => {
  const dispatch = useDispatch();
  const userData = useSelector(getUserData);
  const isUpdating = useSelector(isEmailOTPSubmitting);
  const isVerifying = useSelector(isVerifyingEmailOTP);
  const isSentOTP = useSelector(isEmailOTPSubmittingSuccessfully);
  const emailForm = useSelector(getUpdateEmailForm);
  const verifyEmailForm = useSelector(getVerifyEmailForm);

  const initialObj = useMemo(() => {
    return {
      current_email: userData?.email || '',
      new_email: emailForm?.new_email || '',
    };
  }, [emailForm?.new_email, userData?.email]);

  const formikProps = useFormik({
    validationSchema: updateEmailValidation,
    initialValues: initialObj,
    validateOnMount: true,
    onSubmit: async values => {
      const payload = {
        current_password: values.current_password,
        new_email: values.new_email,
      };
      dispatch(sendChangeEmailOTP(payload));
    },
  });

  const verifyOTPFormik = useFormik({
    validationSchema: verifyChangeEmailOTPValidation,
    initialValues: {
      current_email_otp: verifyEmailForm?.current_email_otp || '',
      new_email_otp: verifyEmailForm?.new_email_otp || '',
    },
    validateOnMount: true,
    onSubmit: async values => {
      dispatch(verifyEmailOTP(values));
    },
  });

  const onChangeEmail = useCallback(
    e => {
      dispatch(setUpdateEmailForm({ [e.target.name]: e.target.value }));
    },
    [dispatch],
  );

  const onChangeVerifyEmail = useCallback(
    e => {
      dispatch(setVerifyEmailForm({ [e.target.name]: e.target.value }));
    },
    [dispatch],
  );

  return (
    <>
      <FormikProvider value={formikProps}>
        <Form>
          <h3 className={styles.title}>Change Email</h3>
          <TextInput
            name='current_email'
            label='Current Email'
            type={'email'}
            disabled={true}
          />
          <TextInput
            name='new_email'
            label='New email'
            type={'email'}
            onChange={onChangeEmail}
          />
          <Button
            isLoading={isUpdating}
            onClick={formikProps.handleSubmit}
            disabled={!formikProps.isValid || isSentOTP}
            type={'submit'}>
            Send OTP
          </Button>
        </Form>
      </FormikProvider>
      {isSentOTP && (
        <FormikProvider value={verifyOTPFormik}>
          <Form>
            <div
              className={
                styles.email
              }>{`OTP sent to ${formikProps?.values?.current_email}`}</div>
            <TextInput
              name='current_email_otp'
              label='Current Email OTP'
              dataType={'number'}
              inputProps={{
                inputMode: 'numeric',
                maxlength: 6,
              }}
              onChange={onChangeVerifyEmail}
            />
            <div
              style={{ margin: '0 0 24px 0' }}
              className={
                styles.email
              }>{`OTP sent to ${formikProps?.values?.new_email}`}</div>
            <TextInput
              name='new_email_otp'
              label='New email OTP'
              dataType={'number'}
              inputProps={{
                inputMode: 'numeric',
                maxlength: 6,
              }}
              onChange={onChangeVerifyEmail}
            />
            <Button
              isLoading={isVerifying}
              onClick={verifyOTPFormik.handleSubmit}
              disabled={!verifyOTPFormik.isValid}
              type={'submit'}>
              Verify OTP
            </Button>
          </Form>
        </FormikProvider>
      )}
      <FormHelperText className='helperText'>
        {
          'NOTES: Email confirmation will be sent to both emails current email and new email'
        }
      </FormHelperText>
    </>
  );
};

export default UpdateEmailForm;
