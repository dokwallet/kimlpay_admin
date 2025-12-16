'use client';
import React, { useMemo } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import TextInput from '@/components/textInput';
import { getUserData } from '@/redux/user/userSelector';
import { useDispatch, useSelector } from 'react-redux';
import CountrySelect from '@/components/countrySelect';
import { countries } from '@/components/countrySelect/countries';
import styles from './UpdatePersonalInfoForm.module.css';
import Button from '@/components/_button';
import { updatePersonalInfoValidation } from '@/validations/updatePersonalInfoValidation';
import { updatePersonalInfo } from '@/redux/settings/settingsSlice';
import { isUpdatingPersonalInfo } from '@/redux/settings/settingsSelectors';
import { getUpdatePersonalInfoForm } from '@/redux/form/formDataSelector';
import { setUpdatePersonalInfoForm } from '@/redux/form/formDataSlice';

const UpdatePersonalInfoForm = () => {
  const userData = useSelector(getUserData);
  const dispatch = useDispatch();
  const isUpdating = useSelector(isUpdatingPersonalInfo);
  const formObj = useSelector(getUpdatePersonalInfoForm);

  const initialObj = useMemo(() => {
    return {
      first_name: formObj?.first_name || userData?.first_name || '',
      last_name: formObj?.last_name || userData?.last_name || '',
      country_code:
        formObj?.country_code ||
        countries.find(item => item.countryCode === userData?.country_code),
    };
  }, [
    formObj?.country_code,
    formObj?.first_name,
    formObj?.last_name,
    userData?.country_code,
    userData?.first_name,
    userData?.last_name,
  ]);

  const userDataObj = useMemo(() => {
    return {
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      country_code: countries.find(
        item => item.countryCode === userData?.country_code,
      ),
    };
  }, [userData?.country_code, userData?.first_name, userData?.last_name]);

  const formikProps = useFormik({
    enableReinitialize: true,
    validationSchema: updatePersonalInfoValidation(userDataObj),
    initialValues: initialObj,
    validateOnMount: true,
    onSubmit: async values => {
      const payload = {
        first_name: values?.first_name,
        last_name: values?.last_name,
        country_code: values?.country_code?.countryCode,
      };
      dispatch(updatePersonalInfo(payload));
    },
  });

  const onChange = e => {
    dispatch(setUpdatePersonalInfoForm({ [e.target.name]: e.target.value }));
  };

  return (
    <FormikProvider value={formikProps}>
      <Form>
        <h3 className={styles.title}>Personal information</h3>
        <TextInput name='first_name' label='First Name' onChange={onChange} />
        <TextInput name='last_name' label='last Name' onChange={onChange} />
        <CountrySelect
          label='Country'
          name='country_code'
          onChange={onChange}
          isOptionEqualToValue={(option, value) => option.code === value.code}
        />
        <Button
          isLoading={!!isUpdating}
          onClick={formikProps.handleSubmit}
          disabled={!formikProps.isValid}
          type={'submit'}>
          Update
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default UpdatePersonalInfoForm;
