'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
import TextInput from '@/components/textInput';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Authenticator.module.css';
import Button from '@/components/_button';

import {
  generateNewAuthenticator,
  updateTwoFa,
  verifyUpdateTwoFa,
} from '@/redux/settings/settingsSlice';
import {
  getTwoFaQRCode,
  isUpdatingTwoFa,
  isVerifyingTwoFa,
  getTwoFaSecret,
  getTwoFaOTPAuthUrl,
} from '@/redux/settings/settingsSelectors';
import { FormHelperText } from '@mui/material';
import { updateTwoFAValidation } from '@/validations/updateTwoFAValidation';
import { verifyTwoFAValidation } from '@/validations/verifyTwoFAValidation';
import Image from 'next/image';
import Loading from '@/components/Loading';
import {
  getUpdateTwoFaForm,
  getVerifyTwoFaForm,
} from '@/redux/form/formDataSelector';
import {
  setUpdateTwoFaForm,
  setVerifyTwoFaForm,
} from '@/redux/form/formDataSlice';
import { getUserData } from '@/redux/user/userSelector';
import { showToast } from '@/utils/toast';

const AuthenticatorForm = () => {
  const dispatch = useDispatch();
  const isUpdating = useSelector(isUpdatingTwoFa);
  const isVerifying = useSelector(isVerifyingTwoFa);
  const qrcodeString = useSelector(getTwoFaQRCode);
  const secret = useSelector(getTwoFaSecret);
  const authUrl = useSelector(getTwoFaOTPAuthUrl);
  const twoFAForm = useSelector(getUpdateTwoFaForm);
  const verifyTwoFAForm = useSelector(getVerifyTwoFaForm);
  const userData = useSelector(getUserData);
  const [isOpenAppBtnVisible, setIsOpenAppBtnVisible] = useState(false);

  const isTwoFaAlreadySetup = useMemo(() => {
    const passkeyOptions = Array.isArray(userData?.two_fa_methods)
      ? userData?.two_fa_methods
      : [];
    return !!passkeyOptions.find(item => item.value === 'AUTHENTICATOR');
  }, [userData?.two_fa_methods]);

  useEffect(() => {
    (() => {
      if (authUrl) {
        const isStandardScheme = authUrl.startsWith('otpauth:');
        setIsOpenAppBtnVisible(isStandardScheme);
      }
    })();
  }, [authUrl]);

  const initialObj = useMemo(() => {
    return {
      current_otp: twoFAForm?.current_otp || '',
    };
  }, [twoFAForm?.current_otp]);

  const formikProps = useFormik({
    validationSchema: isTwoFaAlreadySetup ? updateTwoFAValidation : null,
    initialValues: initialObj,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: async values => {
      if (isTwoFaAlreadySetup) {
        dispatch(updateTwoFa(values));
      } else {
        dispatch(generateNewAuthenticator());
      }
    },
  });

  const verifyOTPFormik = useFormik({
    validationSchema: verifyTwoFAValidation,
    initialValues: {
      new_otp: verifyTwoFAForm?.new_otp || '',
    },
    validateOnMount: true,
    onSubmit: async values => {
      try {
        await dispatch(
          verifyUpdateTwoFa({ ...values, isTwoFaAlreadySetup }),
        ).unwrap();
        formikProps.resetForm();
        verifyOTPFormik.resetForm();
      } catch (e) {}
    },
  });

  const onChangeTwoFa = useCallback(
    e => {
      dispatch(setUpdateTwoFaForm({ [e.target.name]: e.target.value }));
    },
    [dispatch],
  );

  const onChangeVerifyTwoFa = useCallback(
    e => {
      dispatch(setVerifyTwoFaForm({ [e.target.name]: e.target.value }));
    },
    [dispatch],
  );

  const onPressOpenAuthenticator = useCallback(() => {
    try {
      window.open(authUrl, '_blank');
    } catch (e) {
      showToast({
        type: 'errorToast',
        title: 'Something went wrong',
      });
    }
  }, [authUrl]);

  const onPressCopySecret = useCallback(() => {
    try {
      navigator.clipboard.writeText(secret);
      showToast({
        type: 'successToast',
        title: 'Secret copied',
      });
    } catch (e) {
      showToast({
        type: 'errorToast',
        title: 'Failed to copy secret',
      });
    }
  }, [secret]);

  return (
    <>
      <FormikProvider value={formikProps}>
        <Form>
          <h3 className={styles.title}>Authenticator App</h3>
          {isTwoFaAlreadySetup && (
            <>
              <div
                className={
                  styles.email
                }>{`Enter current 2-FA Google Authenticator code for update new one`}</div>
              <TextInput
                name='current_otp'
                label='Current OTP'
                inputProps={{
                  inputMode: 'numeric',
                  maxlength: 6,
                }}
                onChange={onChangeTwoFa}
              />
            </>
          )}
          <Button
            isLoading={isUpdating}
            onClick={formikProps.handleSubmit}
            disabled={isTwoFaAlreadySetup ? !formikProps.isValid : false}
            type={'submit'}>
            Generate new
          </Button>
        </Form>
      </FormikProvider>
      {!!qrcodeString && (
        <FormikProvider value={verifyOTPFormik}>
          <Form>
            {isUpdating ? (
              <div className={styles.loadingView}>
                <Loading />
              </div>
            ) : (
              <>
                <div
                  className={
                    styles.email
                  }>{`Scan QR code for ${isTwoFaAlreadySetup ? 'update' : 'generate new'} TWO-FA in Google Authenticator app`}</div>
                <div className={styles.imageContainer}>
                  <Image
                    src={qrcodeString}
                    alt={'qr-code'}
                    height={200}
                    width={200}
                  />
                </div>

                {isOpenAppBtnVisible && (
                  <>
                    <div className={styles.orText}>OR</div>
                    <Button
                      onClick={onPressOpenAuthenticator}
                      className={styles.actionButton || ''}>
                      Open Authenticator app
                    </Button>
                  </>
                )}

                {!!secret && (
                  <>
                    <div className={styles.orText}>OR</div>
                    <Button
                      onClick={onPressCopySecret}
                      className={styles.actionButton || ''}>
                      Copy Secret
                    </Button>
                  </>
                )}

                <TextInput
                  name='new_otp'
                  label='New OTP'
                  inputProps={{
                    inputMode: 'numeric',
                    maxlength: 6,
                  }}
                  onChange={onChangeVerifyTwoFa}
                  className={styles.new_otp}
                />
                <Button
                  isLoading={isVerifying}
                  onClick={verifyOTPFormik.handleSubmit}
                  disabled={!verifyOTPFormik.isValid}
                  type={'submit'}>
                  Verify OTP
                </Button>
              </>
            )}
          </Form>
        </FormikProvider>
      )}
      {isTwoFaAlreadySetup && (
        <FormHelperText className='helperText'>
          {
            'NOTES: When you successfully update 2-FA in google authenticator previous OTP will not work'
          }
        </FormHelperText>
      )}
    </>
  );
};

export default AuthenticatorForm;
