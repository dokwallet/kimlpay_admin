'use client';
import React, { useCallback, useMemo } from 'react';
import { Box, Modal, IconButton, Collapse, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import TextInput from '@/components/textInput';
import Button from '@/components/_button';
import styles from './ModalCreateAffiliateUserForm.module.css';
import { addAffiliateUserValidation } from '@/validations/addAffiliateUserValidations';
import { updateAffiliateUserValidation } from '@/validations/updateAffiliateUserValidation';
import {
  createAffiliateUser,
  updateAffiliateUser,
} from '@/redux/affiliateUser/affiliateUserSlice';
import { isCreateAffiliateUserLoading } from '@/redux/affiliateUser/affiliateUserSelector';
import { setCreateAffiliateUserForm } from '@/redux/form/formDataSlice';
import CountrySelect from '../countrySelect';
import { getCreateAffiliateUserFormData } from '@/redux/form/formDataSelector';

const ModalCreateAffiliateUserForm = ({ open, handleClose }) => {
  const createAffiliateUserFormData = useSelector(
    getCreateAffiliateUserFormData,
  );
  const isSubmitting = useSelector(isCreateAffiliateUserLoading);
  const dispatch = useDispatch();

  const userDataObj = useMemo(() => {
    return {
      name: createAffiliateUserFormData?.name || undefined,
      country: createAffiliateUserFormData?.country,
      email: createAffiliateUserFormData?.email || undefined,
      addressLine1: createAffiliateUserFormData?.addressLine1 || undefined,
      addressLine2: createAffiliateUserFormData?.addressLine2 || undefined,
      city: createAffiliateUserFormData?.city || undefined,
      zipcode: createAffiliateUserFormData?.zipcode || undefined,
      state: createAffiliateUserFormData?.state || undefined,
      businessName: createAffiliateUserFormData?.businessName || undefined,
      website: createAffiliateUserFormData?.website || undefined,
      description: createAffiliateUserFormData?.description || undefined,
      notes: createAffiliateUserFormData?.notes || undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let validateSchema;
  if (createAffiliateUserFormData?._id) {
    validateSchema = updateAffiliateUserValidation(userDataObj);
  } else {
    validateSchema = addAffiliateUserValidation;
  }

  const formikProps = useFormik({
    enableReinitialize: true,
    validationSchema: validateSchema,
    validateOnMount: true,
    initialValues: { ...createAffiliateUserFormData },
    onSubmit: values => {
      if (values?._id) {
        const { _id, country, ...rest } = values;
        const payload = {
          ...rest,
          userId: _id,
          country: country?.countryCode,
        };

        dispatch(updateAffiliateUser(payload));
      } else {
        dispatch(createAffiliateUser(values));
      }
    },
  });

  const onChange = useCallback(
    e => {
      dispatch(setCreateAffiliateUserForm({ [e.target.name]: e.target.value }));
    },
    [dispatch],
  );

  return (
    <Modal
      className={styles.modal}
      open={open}
      onClose={handleClose}
      aria-labelledby='show-card-details-title'
      aria-describedby='show-card-details-title'>
      <Box className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <Typography
            id='add-affiliate-user-modal-title'
            className={styles.modalTitle}
            variant='h6'
            component='h2'>
            {`${formikProps.values?._id ? 'Edit' : 'Add'} Affiliate User`}
          </Typography>
          <IconButton className={styles.closeICon} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className={styles.subContainer}>
          <div className={styles.affiliateUserFormContainer}>
            <FormikProvider value={formikProps}>
              <Form>
                <div className={styles.row}>
                  <TextInput label='Name' name='name' onChange={onChange} />
                  <TextInput label='Email' name='email' onChange={onChange} />
                </div>
                <div className={styles.spacer} />
                <div className={styles.row}>
                  <CountrySelect
                    label='Country'
                    name='country'
                    onChange={onChange}
                  />
                  <TextInput label='State' name='state' onChange={onChange} />
                </div>
                <div className={styles.spacer} />
                <div className={styles.row}>
                  <TextInput label='City' name='city' onChange={onChange} />
                  <TextInput
                    label='Zipcode'
                    name='zipcode'
                    type={'number'}
                    onChange={onChange}
                  />
                </div>
                <div className={styles.spacer} />
                <div className={styles.row}>
                  <TextInput
                    label='Website'
                    name='website'
                    onChange={onChange}
                  />
                  <TextInput
                    label='Business Name'
                    name='businessName'
                    onChange={onChange}
                  />
                </div>
                <div className={styles.spacer} />
                <TextInput
                  multiline
                  maxRows={4}
                  label='Description'
                  name='description'
                  onChange={onChange}
                />
                <div className={styles.spacer} />
                <TextInput
                  label='Address Line 1'
                  name='addressLine1'
                  onChange={onChange}
                />
                <div className={styles.spacer} />
                <TextInput
                  label='Address Line 2'
                  name='addressLine2'
                  onChange={onChange}
                />
                <div className={styles.spacer} />
                <TextInput label='Notes' name='notes' onChange={onChange} />
                <div className={styles.spacer} />
                <Button
                  onClick={formikProps.handleSubmit}
                  isLoading={isSubmitting}
                  disabled={!formikProps.isValid}>
                  Submit
                </Button>
              </Form>
            </FormikProvider>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalCreateAffiliateUserForm;
