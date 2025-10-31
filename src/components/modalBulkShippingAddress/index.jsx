'use client';
import React, { useCallback, useEffect } from 'react';
import { Box, Typography, Modal, IconButton } from '@mui/material';

import MultiStepForm, { FormStep } from '../multiStepForm';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { getCreateBulkShippingFormData } from '@/redux/form/formDataSelector';
import { setCreateBulkShippingForm } from '@/redux/form/formDataSlice';
import styles from './ModalBulkShippingForm.module.css';
import AddressList from '../addressList';

import Loading from '@/components/Loading';

import {
  getShippingData,
  isShippingLoading,
  isShippingSubmitting,
} from '@/redux/shipping/shippingSelector';
import FormShippingInfo from '@/components/FormShippingInfo';
import {
  createBulkShipping,
  getShippings,
} from '@/redux/shipping/shippingSlice';
import { bulkShippingFormValidationSchema } from '@/validations/bulkShippingFormValidations';

const ModalBulkShippingAddress = ({ open, handleClose, cardIds }) => {
  const shippingCardInitialData = useSelector(getCreateBulkShippingFormData);
  const dispatch = useDispatch();
  const existingShippings = useSelector(getShippingData);
  const isLoading = useSelector(isShippingLoading);
  const { formStep: stepNumber } = shippingCardInitialData;

  const isSubmitting = useSelector(isShippingSubmitting);

  useEffect(() => {
    if (open) {
      dispatch(getShippings());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleAddressChange = event => {
    dispatch(setCreateBulkShippingForm({ shippingId: event.target.value }));
  };

  const next = (_, isLast) => {
    if (!isLast) {
      dispatch(setCreateBulkShippingForm({ formStep: stepNumber + 1 }));
    }
  };

  const previous = () => {
    dispatch(setCreateBulkShippingForm({ formStep: stepNumber - 1 }));
  };

  const onChange = useCallback(
    e => {
      dispatch(setCreateBulkShippingForm({ [e.target.name]: e.target.value }));
    },
    [dispatch],
  );

  const handleSubmit = values => {
    dispatch(createBulkShipping({ ...values, cardIds }));
  };

  return (
    <Modal
      className={styles.modal}
      open={open}
      onClose={handleClose}
      aria-labelledby='add-card-modal-title'
      aria-describedby='add-card-modal-description'>
      <Box className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <Typography
            id='add-card-modal-title'
            className={styles.modalTitle}
            variant='h6'
            component='h2'>
            Select Address
          </Typography>
          <IconButton className={styles.closeICon} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <MultiStepForm
            stepNumber={stepNumber}
            isSubmitting={isSubmitting}
            initialValues={shippingCardInitialData}
            onSubmit={handleSubmit}>
            {existingShippings?.length !== 0 && (
              <FormStep stepName='Choose Address' onSubmit={next}>
                <AddressList
                  name={'shippingId'}
                  existingShippings={existingShippings}
                  selectedValue={shippingCardInitialData?.shippingId}
                  handleChange={handleAddressChange}
                />
              </FormStep>
            )}
            {shippingCardInitialData?.shippingId === 'add_new_shipping' && (
              <FormStep
                stepName='Shipping Address'
                onSubmit={next}
                validationSchema={bulkShippingFormValidationSchema}>
                <FormShippingInfo onChange={onChange} />
              </FormStep>
            )}
          </MultiStepForm>
        )}
      </Box>
    </Modal>
  );
};

export default ModalBulkShippingAddress;
