'use client';
import React, { useMemo } from 'react';
import { Box, Modal, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { Form, FormikProvider, useFormik } from 'formik';
import TextInput from '@/components/textInput';
import Button from '@/components/_button';
import styles from './ModalEditWithdrawal.module.css';
import { updateWithdrawalsValidation } from '@/validations/updateWithdrawalsValidation';
import SimpleSelect from '@/components/SimpleSelect';
import { WITHDRAWALS_STATUS_DATA } from '@/utils/helper';
import { getIsUpdatingWithdrawal } from '@/redux/adminPaymentWithdrawals/adminPaymentWithdrawalsSelectors';
import { updatePaymentWithdrawals } from '@/redux/adminPaymentWithdrawals/adminPaymentWithdrawalsSlice';

const ModalEditWithdrawal = ({ open, handleClose, selectedWithdrawal }) => {
  const isSubmitting = useSelector(getIsUpdatingWithdrawal);
  const dispatch = useDispatch();

  const payoutObj = useMemo(() => {
    return {
      status: selectedWithdrawal?.status || '',
      tx_hash: selectedWithdrawal?.tx_hash || '',
      reason: selectedWithdrawal?.reason || '',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWithdrawal]);

  const formikProps = useFormik({
    enableReinitialize: true,
    validationSchema: updateWithdrawalsValidation(payoutObj),
    validateOnMount: true,
    initialValues: { ...payoutObj },
    onSubmit: values => {
      if (!selectedWithdrawal?._id) {
        console.warn('No payout id found', selectedWithdrawal?._id);
        return;
      }

      const withdrawals = {
        withdrawal_id: selectedWithdrawal?._id,
      };
      if (values?.status != null) {
        withdrawals.status = values?.status;
      }
      if (values?.tx_hash != null) {
        withdrawals.tx_hash = values?.tx_hash;
      }
      if (values?.reason != null) {
        withdrawals.reason = values?.reason;
      }
      dispatch(updatePaymentWithdrawals(withdrawals));
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
            {`Edit Payment Withdrawal`}
          </Typography>
          <IconButton className={styles.closeICon} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <HeaderItem
          label={'User Email :'}
          value={selectedWithdrawal?.user?.email || ''}
        />
        <HeaderItem
          label={'Amount :'}
          value={selectedWithdrawal?.amount || ''}
        />

        <div className={styles.subContainer}>
          <div className={styles.affiliateUserFormContainer}>
            <FormikProvider value={formikProps}>
              <Form>
                <div className={styles.typeFilter}>
                  <SimpleSelect
                    label='Status'
                    data={WITHDRAWALS_STATUS_DATA}
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
                  type='submit'
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

export default ModalEditWithdrawal;
