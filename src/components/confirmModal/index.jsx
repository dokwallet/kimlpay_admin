import React from 'react';
import { Modal, Box, Typography, Button, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import WarningIcon from '@mui/icons-material/WarningAmberOutlined';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({
  type = 'confirm',
  open,
  onClose,
  title = 'Delete',
  description = 'Are you sure you want to delete this? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby='modal-title'
      aria-describedby='modal-description'>
      <Box className={styles.confirmModalWrapper}>
        <IconButton
          aria-label='warning'
          size='large'
          disableRipple
          sx={{
            backgroundColor: type === 'confirm' ? '#FDECEC' : '#E3F2FD',
            marginBottom: 2,
            cursor: 'default',
          }}>
          {type === 'confirm' ? (
            <WarningIcon fontSize='large' sx={{ color: '#F44336' }} />
          ) : (
            <InfoIcon fontSize='large' sx={{ color: '#2196F3' }} />
          )}
        </IconButton>
        <Typography id='modal-title' variant='h6' component='h2'>
          {title}
        </Typography>
        <Typography id='modal-description' sx={{ mt: 1 }}>
          {description}
        </Typography>
        {type === 'confirm' && (
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
              onClick={onCancel}
              variant='contained'
              sx={{ minWidth: '50%' }}>
              {cancelText}
            </Button>
            <Button
              className={styles.confirmBtn}
              size='large'
              onClick={onConfirm}
              variant='contained'
              color='error'
              sx={{ minWidth: '50%' }}>
              {confirmText}
            </Button>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
