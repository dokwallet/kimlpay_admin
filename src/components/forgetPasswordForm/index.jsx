'use client';
import React, { useCallback, useMemo } from 'react';
import { useFormik, FormikProvider } from 'formik';
import TextInput from '@/components/textInput';
import Button from '@/components/_button';
import s from './ForgetPassword.module.css';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getForgetPasswordFormData } from '@/redux/form/formDataSelector';
import { setForgetPasswordFormValues } from '@/redux/form/formDataSlice';
import AuthContainer from '@/components/AuthContainer';
import { isForgetPasswordSubmitting } from '@/redux/user/userSelector';
import { forgetPassword } from '@/redux/user/userSlice';
import { forgetPasswordValidation } from '@/validations/forget-password-validation';

const ForgetPasswordForm = () => {
  const router = useRouter();
  const forgetPasswordFormData = useSelector(getForgetPasswordFormData);
  const isSubmitting = useSelector(isForgetPasswordSubmitting);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const aid = useMemo(() => {
    return searchParams?.get('aid');
  }, [searchParams]);

  const onSubmit = useCallback(
    async values => {
      dispatch(forgetPassword({ ...values, router }));
    },
    [dispatch, router],
  );

  const formikProps = useFormik({
    initialValues: { ...forgetPasswordFormData },
    validationSchema: forgetPasswordValidation,
    onSubmit: onSubmit,
  });
  const { handleSubmit } = formikProps;

  const onChange = useCallback(
    e => {
      dispatch(
        setForgetPasswordFormValues({ [e.target.name]: e.target.value }),
      );
    },
    [dispatch],
  );

  return (
    <AuthContainer>
      <p className={s.signUp}>
        Have a password?{' '}
        <Link
          href={`/login${aid ? `?aid=${aid}` : ''}`}
          className={s.signupLink}>
          Sign In
        </Link>
      </p>
      <FormikProvider value={formikProps}>
        <TextInput
          label='Email'
          type='email'
          name='email'
          onChange={onChange}
        />

        <Button isLoading={isSubmitting} type='button' onClick={handleSubmit}>
          Continue
        </Button>
      </FormikProvider>
    </AuthContainer>
  );
};

export default ForgetPasswordForm;
