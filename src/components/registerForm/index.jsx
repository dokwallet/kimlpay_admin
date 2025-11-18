'use client';
import React, { useCallback } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import TextInput from '../textInput';
import Button from '../_button';
import CountrySelect from '../countrySelect';
import style from '../loginForm/LoginForm.module.css';
import PasswordStrength from '../PasswordStrength';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerValidation } from '@/validations/registerValidation';
import { useDispatch, useSelector } from 'react-redux';
import { getRegisterFormData } from '@/redux/form/formDataSelector';
import { setRegisterFormValues } from '@/redux/form/formDataSlice';
import { register } from '@/redux/user/userSlice';
import { isRegisterSubmitting } from '@/redux/user/userSelector';
import AuthContainer from '@/components/AuthContainer';
import s from './RegisterForm.module.css';

import { getSelectedPublicAffiliateUser } from '@/redux/auth/authSelector';
import { setSelectedPublicAffiliateUsers } from '@/redux/auth/authSlice';

const RegisterForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const registerFormData = useSelector(getRegisterFormData);
  const isSubmitting = useSelector(isRegisterSubmitting);
  const selectedPublicAffiliateUser = useSelector(
    getSelectedPublicAffiliateUser,
  );

  const onRegister = useCallback(
    async values => {
      const payload = { ...values };
      if (selectedPublicAffiliateUser?.username) {
        payload.aid = selectedPublicAffiliateUser?.username;
      }
      dispatch(register({ ...payload, router }));
    },
    [selectedPublicAffiliateUser?.username, dispatch, router],
  );

  const formikProps = useFormik({
    initialValues: { ...registerFormData },
    validationSchema: registerValidation,
    onSubmit: onRegister,
    enableReinitialize: false,
  });
  const { handleSubmit } = formikProps;

  const onChange = useCallback(
    e => {
      dispatch(setRegisterFormValues({ [e.target.name]: e.target.value }));
    },
    [dispatch],
  );

  const onChangeAffiliate = useCallback(
    value => {
      dispatch(setSelectedPublicAffiliateUsers(value));
      const username = value?.username;
      router.replace(`/signup`);
    },
    [dispatch, router],
  );

  return (
    <AuthContainer showVideo={true} customStyle={{ maxWidth: 700 }}>
      <div className={s.mainRegisterForm}>
        <p className={style.signUp}>
          Already have an account?{' '}
          <Link href={`/login`} className={style.signupLink}>
            Log in
          </Link>
        </p>
        <div className={s.mainRegisterForm}>
          <FormikProvider value={formikProps}>
            <Form>
              <div className={s.nameFields}>
                <TextInput
                  label='First name'
                  name='firstName'
                  onChange={onChange}
                />
                <TextInput
                  label='Last name'
                  name='lastName'
                  onChange={onChange}
                />
              </div>
              <CountrySelect
                label='Country of operations'
                name='countryCode'
                onChange={onChange}
              />
              <TextInput
                label='Email'
                type='email'
                name='email'
                onChange={onChange}
              />
              <PasswordStrength
                label='Password'
                name='password'
                onChange={onChange}
              />
              <TextInput
                label='Confirm Password'
                type='password'
                name='confirmPassword'
                onChange={onChange}
              />
              {/* {isLoadingPublicAffiliate ? (
                <TextInput
                  label='Loading Affiliates'
                  name='tempAffiliate'
                  disabled={true}
                />
              ) : (
                <div className={s.affiliateDiv}>
                  <AffiliateSelect
                    selectedAffiliateUser={selectedPublicAffiliateUser}
                    affiliateUserDetails={publicAffiliateUsers}
                    onChangeAffiliate={onChangeAffiliate}
                    isPublic={true}
                  />
                </div>
              )} */}
              <Button
                type='submit'
                onClick={handleSubmit}
                isLoading={isSubmitting}>
                Sign up
              </Button>
            </Form>
          </FormikProvider>
        </div>
      </div>
    </AuthContainer>
  );
};

export default RegisterForm;
