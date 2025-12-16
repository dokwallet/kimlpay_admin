'use client';
import React from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import TextInput from '@/components/textInput';
import { useDispatch, useSelector } from 'react-redux';
import styles from './UpdatePassword.module.css';
import Button from '@/components/_button';
import { updatePasswordValidation } from '@/validations/updatePasswordValidation';
import PasswordStrength from '@/components/PasswordStrength';
import { changePassword } from '@/redux/settings/settingsSlice';
import { isUpdatingPassword } from '@/redux/settings/settingsSelectors';
import { setUpdatePasswordForm } from '@/redux/form/formDataSlice';
import { getUpdatePasswordForm } from '@/redux/form/formDataSelector';

const UpdatePasswordForm = () => {
  const dispatch = useDispatch();
  const isUpdating = useSelector(isUpdatingPassword);
  const formData = useSelector(getUpdatePasswordForm);

  const formikProps = useFormik({
    validationSchema: updatePasswordValidation,
    initialValues: {
      current_password: formData?.current_password || '',
      new_password: formData?.new_password || '',
      confirm_new_password: formData?.confirm_new_password || '',
    },
    validateOnChange: true,
    onSubmit: async values => {
      const payload = {
        current_password: values.current_password,
        new_password: values.new_password,
      };
      dispatch(changePassword(payload));
    },
  });

  const onChange = e => {
    dispatch(setUpdatePasswordForm({ [e.target.name]: e.target.value }));
  };

  return (
    <FormikProvider value={formikProps}>
      <Form>
        <h3 className={styles.title}>Change Password</h3>
        <TextInput
          name='current_password'
          label='Current Password'
          type={'password'}
          onChange={onChange}
        />
        <PasswordStrength
          label='New Password'
          name='new_password'
          onChange={onChange}
        />
        <TextInput
          name='confirm_new_password'
          label='Confirm New Password'
          type={'password'}
          onChange={onChange}
        />
        <Button
          isLoading={isUpdating}
          onClick={formikProps.handleSubmit}
          disabled={!formikProps.isValid}
          type={'submit'}>
          Update
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default UpdatePasswordForm;
