'use client';
import React, { useMemo } from 'react';
import { Box, Modal, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import TextInput from '@/components/textInput';
import Button from '@/components/_button';
import styles from './ModalEditPayout.module.css';
import { updatePayoutValidation } from '@/validations/updatePayoutValidation';
import SimpleSelect from '@/components/SimpleSelect';
import { PAYOUT_STATUS_DATA } from '@/utils/helper';
import { updatePayout } from '@/redux/payout/payoutSlice';
import { getIsUpdatingPayout } from '@/redux/payout/payoutSelectors';

const ModalEditPayout = ({ open, handleClose, selectedPayout }) => {
  const isSubmitting = useSelector(getIsUpdatingPayout);
  const dispatch = useDispatch();

  const payoutObj = useMemo(() => {
    return {
      status: selectedPayout?.status || '',
      tx_hash: selectedPayout?.tx_hash || '',
      reason: selectedPayout?.reason || '',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPayout]);

  const formikProps = useFormik({
    enableReinitialize: true,
    validationSchema: updatePayoutValidation(payoutObj),
    validateOnMount: true,
    initialValues: { ...payoutObj },
    onSubmit: values => {
      if (!selectedPayout?._id) {
        console.warn('No payout id found', selectedPayout?._id);
        return;
      }
      const payload = {
        payout_id: selectedPayout?._id,
      };
      if (values?.status != null) {
        payload.status = values?.status;
      }
      if (values?.tx_hash != null) {
        payload.tx_hash = values?.tx_hash;
      }
      if (values?.reason != null) {
        payload.reason = values?.reason;
      }
      dispatch(updatePayout(payload));
    },
  });
  const { values } = formikProps;
  return (
    <Modal
      className={styles.modal}
      open={open}
      onClose={handleClose}
      aria-labelledby='show-card-details-title'
      aria-describedby='show-card-details-title'>
      <Box className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <Typography id='update-payout' variant='h6' component='h2'>
            {`Edit Payout`}
          </Typography>
          <IconButton className={styles.closeICon} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <HeaderItem
          label={'Affiliate Name :'}
          value={selectedPayout?.affiliate_user_details?.name || ''}
        />
        <HeaderItem
          label={'Amount :'}
          value={selectedPayout?.usd_amount || ''}
        />
        <HeaderItem
          label={'Balance :'}
          value={selectedPayout?.affiliate_user_details?.balance || ''}
        />
        <div className={styles.subContainer}>
          <div className={styles.affiliateUserFormContainer}>
            <FormikProvider value={formikProps}>
              <Form>
                <div className={styles.typeFilter}>
                  <SimpleSelect
                    label='Status'
                    data={PAYOUT_STATUS_DATA}
                    value={values?.status}
                    onChange={e => {
                      formikProps.setFieldValue('status', e?.target.value);
                    }}
                    customClass={styles.typeFilter}
                    fullWidth={true}
                  />
                </div>
                <TextInput label='TX Hash' name='tx_hash' />
                <TextInput
                  label='Reason'
                  placeholder={'Reason (Optional)'}
                  name='reason'
                />
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

const HeaderItem = ({ label, value }) => {
  return (
    <div className={styles.rowView}>
      <div className={styles.itemLabel}>{label}</div>
      <div className={styles.itemValue}>{value}</div>
    </div>
  );
};

export default ModalEditPayout;
