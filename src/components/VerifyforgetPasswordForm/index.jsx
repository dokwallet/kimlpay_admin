'use client';
import React, { useCallback } from 'react';
import { useFormik, FormikProvider } from 'formik';
import TextInput from '@/components/textInput';
import Button from '@/components/_button';
import TermsPrivacy from '@/components/termsPrivacy';
import s from './VerifyForgetPasswordForm.module.css';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import AuthContainer from '@/components/AuthContainer';
import { isVerifyForgetPasswordSubmitting } from '@/redux/user/userSelector';
import { verifyForgetPassword } from '@/redux/user/userSlice';
import PasswordStrength from '@/components/PasswordStrength';
import { verifyForgetPasswordForm } from '@/validations/verifyforgetPasswordValidation';
import { getRouteStateData } from '@/redux/extraData/extraSelectors';

const VerifyForgetPasswordForm = () => {
  const router = useRouter();
  const isSubmitting = useSelector(isVerifyForgetPasswordSubmitting);
  const routeData = useSelector(getRouteStateData);
  const email = routeData?.['verify-forget-password']?.email;
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    async values => {
      const payload = {
        email,
        password: values.password,
        otp: values.otp,
        router,
      };
      dispatch(verifyForgetPassword(payload));
    },
    [dispatch, email, router],
  );

  const formikProps = useFormik({
    initialValues: { password: '', confirmPassword: '', otp: '' },
    validationSchema: verifyForgetPasswordForm,
    onSubmit: onSubmit,
  });
  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    formikProps;

  const onChange = useCallback(
    e => {
      handleChange(e);
    },
    [handleChange],
  );

  return (
    <AuthContainer>
      <p
        className={
          s.signUp
        }>{`The forget password OTP is sent to the ${email || ''}. Please check your email`}</p>
      <FormikProvider value={formikProps}>
        <PasswordStrength
          label='Password'
          name='password'
          value={values.password}
          touched={touched.password}
          error={errors.password}
          onChange={onChange}
          onBlur={handleBlur}
        />
        <TextInput
          label='Confirm Password'
          type='password'
          name='confirmPassword'
        />
        <TextInput
          label='OTP'
          name='otp'
          dataType={'number'}
          inputProps={{ maxLength: 6, inputMode: 'numeric' }}
        />
        <Button isLoading={isSubmitting} type='button' onClick={handleSubmit}>
          Reset Password
        </Button>
        <TermsPrivacy />
      </FormikProvider>
    </AuthContainer>
  );
};

export default VerifyForgetPasswordForm;
