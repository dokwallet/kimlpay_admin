'use client';
import React, { useCallback, useMemo } from 'react';
import { useFormik, FormikProvider, Form } from 'formik';
import TextInput from '../textInput';
import Button from '../_button';
import s from './LoginForm.module.css';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { getLoginFormData } from '@/redux/form/formDataSelector';
import { setLoginFormValues } from '@/redux/form/formDataSlice';
import AuthContainer from '@/components/AuthContainer';
import { isCredentialSubmitting } from '@/redux/user/userSelector';
import { checkUserCredential } from '@/redux/user/userSlice';
import { loginValidation } from '@/validations/login-validation';

const LoginForm = () => {
  const router = useRouter();
  const loginFormData = useSelector(getLoginFormData);
  const isSubmitting = useSelector(isCredentialSubmitting);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const aid = useMemo(() => {
    return searchParams?.get('aid');
  }, [searchParams]);

  const onSubmit = useCallback(
    async values => {
      dispatch(checkUserCredential({ ...values, router }));
    },
    [dispatch, router],
  );

  const formikProps = useFormik({
    initialValues: { ...loginFormData },
    validationSchema: loginValidation,
    onSubmit: onSubmit,
  });
  const { handleSubmit } = formikProps;

  const onChange = useCallback(
    e => {
      dispatch(setLoginFormValues({ [e.target.name]: e.target.value }));
    },
    [dispatch],
  );

  return (
    <AuthContainer>
      <p className={s.signUp}>
        No account yet?{' '}
        <Link
          href={`/signup${aid ? `?aid=${aid}` : ''}`}
          className={s.signupLink}>
          Sign Up for free!
        </Link>
      </p>
      <FormikProvider value={formikProps}>
        <Form
          onKeyDown={e => {
            if (e?.key === 'Enter') {
            }
          }}>
          <TextInput
            label='Email'
            type='email'
            name='email'
            autoFocus={true}
            onChange={onChange}
          />
          <TextInput
            label='Password'
            type='password'
            name='password'
            onChange={onChange}
          />
          <div className={s.forgotPasswordContainer}>
            <Link
              className={s.forgotPassword}
              href={`/forget-password${aid ? `?aid=${aid}` : ''}`}>
              Forgot your password?
            </Link>
          </div>
          <Button isLoading={isSubmitting} type='submit' onClick={handleSubmit}>
            Sign in
          </Button>
        </Form>
      </FormikProvider>
    </AuthContainer>
  );
};

export default LoginForm;
