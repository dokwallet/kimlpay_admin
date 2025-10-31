'use client';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import styles from './Passkeys.module.css';
import Button from '@/components/_button';
import AddCircleIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { verifyTwoFA } from '@/redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData, isVerifyingTwoFa } from '@/redux/user/userSelector';
import { IconButton } from '@mui/material';
import { DeleteOutline, Edit } from '@mui/icons-material';
import ConfirmModal from '@/components/confirmModal';
import { deletePasskey } from '@/redux/settings/settingsSlice';
import { isDeletePasskey } from '@/redux/settings/settingsSelectors';
import UpdatePasskeyNameModal from '@/components/updatePasskeyNameModal';

const PasskeysForm = () => {
  const dispatch = useDispatch();
  const isVerifying = useSelector(isVerifyingTwoFa);
  const userData = useSelector(getUserData);
  const isDeleting = useSelector(isDeletePasskey);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const passkeys = useMemo(() => {
    return Array.isArray(userData?.passkeys) ? userData?.passkeys : [];
  }, [userData?.passkeys]);
  const selectedPassKey = useRef(null);

  const onClickNewPasskey = useCallback(() => {
    dispatch(verifyTwoFA({ isNewPasskey: true, type: 'PASSKEY' }));
  }, [dispatch]);

  const onPressDeleteIcon = useCallback(item => {
    selectedPassKey.current = item;
    setShowConfirmModal(true);
  }, []);

  const onPressEditIcon = useCallback(item => {
    selectedPassKey.current = item;
    setShowPasskeyModal(true);
  }, []);

  const onPressConfirmDelete = useCallback(() => {
    setShowConfirmModal(false);
    dispatch(deletePasskey({ passkey_id: selectedPassKey?.current?.id }));
  }, [dispatch]);

  const onPressCancelDelete = useCallback(() => {
    setShowConfirmModal(false);
  }, []);

  const onPressCancelUpdate = useCallback(() => {
    setShowPasskeyModal(false);
  }, []);

  return (
    <>
      <div className={styles.row}>
        <h3 className={styles.title}>Passkeys</h3>
        <Button
          variant='contained'
          color='primary'
          isLoading={isVerifying}
          onClick={onClickNewPasskey}
          className={styles.addPassKeyButton}>
          <div className={styles.addPassKeyIconDiv}>
            <AddCircleIcon />
            <span>Add Passkey</span>
          </div>
        </Button>
      </div>
      {passkeys.map(item => {
        return (
          <div key={item.id} className={styles.itemRow}>
            <div className={styles.itemTitle}>{item?.name}</div>
            {!isDeleting && (
              <div>
                <IconButton
                  aria-label='edit-passkey-icon'
                  onClick={() => onPressEditIcon(item)}
                  edge='end'
                  sx={{
                    '&  .MuiSvgIcon-root': {
                      color: 'var(--primary)',
                      fontSize: 24,
                      marginRight: '16px',
                    },
                  }}>
                  <Edit />
                </IconButton>
                {passkeys.length > 1 && (
                  <IconButton
                    aria-label='delete-passkey-icon'
                    onClick={() => onPressDeleteIcon(item)}
                    edge='end'
                    sx={{
                      '&  .MuiSvgIcon-root': {
                        color: 'red',
                        fontSize: 24,
                      },
                    }}>
                    <DeleteOutline />
                  </IconButton>
                )}
              </div>
            )}
          </div>
        );
      })}
      <ConfirmModal
        title={'Delete Passkey'}
        description={`Are you sure you want to delete '${selectedPassKey?.current?.name || 'this'}'? This action cannot be undone.`}
        confirmText={'Delete'}
        open={showConfirmModal}
        onClose={onPressCancelDelete}
        onCancel={onPressCancelDelete}
        onConfirm={onPressConfirmDelete}
      />
      <UpdatePasskeyNameModal
        selectedPasskey={selectedPassKey?.current}
        open={showPasskeyModal}
        onClose={onPressCancelUpdate}
      />
    </>
  );
};

export default PasskeysForm;
