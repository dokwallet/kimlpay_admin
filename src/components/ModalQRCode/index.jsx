'use client';
import React, { useCallback, useContext } from 'react';
import { Box, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './ModalQRCode.module.css';
import QRCode from 'react-qr-code';
import { ThemeContext } from '@/theme/ThemeContext';
import { ContentCopy } from '@mui/icons-material';
import { showToast } from '@/utils/toast';

const ModalQRCode = ({ open, handleClose, qrText }) => {
  const { themeType } = useContext(ThemeContext);

  const onPressCopy = useCallback(() => {
    navigator.clipboard.writeText(qrText);
    showToast({
      type: 'successToast',
      title: 'Copied',
    });
  }, [qrText]);

  return (
    <Modal
      className={styles.modal}
      open={open}
      onClose={handleClose}
      aria-labelledby='show-card-details-title'
      aria-describedby='show-card-details-title'>
      <Box className={styles.modalBox}>
        <div className={styles.modalHeader}>
          <IconButton className={styles.closeICon} onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className={styles.subContainer}>
          <QRCode
            size={256}
            value={qrText}
            viewBox={`0 0 256 256`}
            fgColor={themeType === 'light' ? '#000' : '#fff'}
            bgColor={themeType !== 'light' ? '#000' : '#fff'}
          />
        </div>
        <div className={styles.chainView}>
          <div className={styles.address}>{qrText}</div>
          <IconButton
            aria-label='toggle password visibility'
            onClick={onPressCopy}
            onMouseDown={onPressCopy}
            edge='end'
            sx={{
              '&  .MuiSvgIcon-root': {
                // color: 'var(--borderActiveColor) ',
                color: 'var(--primary)',
              },
            }}>
            <ContentCopy />
          </IconButton>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalQRCode;
