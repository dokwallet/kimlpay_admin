import React, { useCallback } from 'react';
import { Modal, Box, IconButton, Typography } from '@mui/material';
import styles from './updatePasskeyName.module.css';
import TextInput from '@/components/textInput';
import { FormikProvider, useFormik } from 'formik';
import { passkeyNameValidation } from '@/validations/passkeyNameValidation';
import { updatePasskey } from '@/redux/settings/settingsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { isUpdatingPasskey } from '@/redux/settings/settingsSelectors';
import Button from '@/components/_button';

const UpdatePasskeyNameModal = ({ selectedPasskey, open, onClose }) => {
  const dispatch = useDispatch();
  const isUpdating = useSelector(isUpdatingPasskey);

  const onClickUpdate = useCallback(
    async values => {
      const name = values.name;
      const id = selectedPasskey?.id;
      const payload = {
        passkey_id: id,
        name,
      };
      await dispatch(updatePasskey(payload)).unwrap();
      onClose();
    },
    [dispatch, onClose, selectedPasskey?.id],
  );

  const formikProps = useFormik({
    initialValues: { name: selectedPasskey?.name || '' },
    validationSchema: passkeyNameValidation,
    onSubmit: onClickUpdate,
    enableReinitialize: true,
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-title'
      aria-describedby='modal-description'>
      <Box className={styles.confirmModalWrapper}>
        <Typography
          id='modal-title'
          variant='h6'
          component='h2'
          sx={{ marginBottom: '16px' }}>
          {'Update Passkey Name'}
        </Typography>
        <FormikProvider value={formikProps}>
          <TextInput label='Name' name='name' />
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'space-between',
              gap: '14px',
            }}>
            <Button
              className={styles.cancelBtn}
              size='large'
              onClick={onClose}
              variant='contained'
              sx={{ minWidth: '50%' }}>
              {'Cancel'}
            </Button>
            <Button
              className={styles.confirmBtn}
              size='large'
              isLoading={isUpdating}
              onClick={formikProps.handleSubmit}
              variant='contained'
              sx={{ minWidth: '50%' }}>
              {'Update'}
            </Button>
          </Box>
        </FormikProvider>
      </Box>
    </Modal>
  );
};

export default UpdatePasskeyNameModal;
