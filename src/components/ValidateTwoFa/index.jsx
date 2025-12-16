'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Button from '@/components/_button';
import s from './ValidateTwoFa.module.css';
import CodeInput from '../codeInput';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPasskeyOptions,
  getPreAuthUser,
  getTwoFaQrCodeString,
  getTwoFaSecret,
  getTwoFaOTPAuthUrl,
  isLoadingTwoFA,
} from '@/redux/user/userSelector';
import { useRouter } from 'next/navigation';
import { generateTwoFa, setPassKeyOptions } from '@/redux/user/userSlice';
import AuthContainer from '@/components/AuthContainer';
import Image from 'next/image';
import { login } from '@/redux/auth/authSlice';
import { isSigning } from '@/redux/auth/authSelector';
import SimpleSelect from '@/components/SimpleSelect';
import { TwoFaMethod } from '@/utils/helper';
import { showToast } from '@/utils/toast';

const ValidateTwoFa = () => {
  const [code, setCode] = useState('');
  const [verifyEnabled, setVerifyEnabled] = useState(false);
  const [isOpenAppBtnVisible, setIsOpenAppBtnVisible] = useState(false);
  const user = useSelector(getPreAuthUser);
  const isTwoFALoading = useSelector(isLoadingTwoFA);
  const qrcodeString = useSelector(getTwoFaQrCodeString);
  const secret = useSelector(getTwoFaSecret);
  const authUrl = useSelector(getTwoFaOTPAuthUrl);
  const passkeyOptions = useSelector(getPasskeyOptions);
  const isSubmitting = useSelector(isSigning);
  const dispatch = useDispatch();
  const router = useRouter();

  const twoFaMethods = useMemo(() => {
    return Array.isArray(user?.two_fa_methods)
      ? user?.two_fa_methods
      : TwoFaMethod;
  }, [user?.two_fa_methods]);

  const [selectedTwoFaMethods, setSelectedTwoFaMethods] = useState(
    twoFaMethods[0].value,
  );

  const isPassKeySelected = useMemo(
    () => selectedTwoFaMethods === 'PASSKEY',
    [selectedTwoFaMethods],
  );

  const isAuthenticatorSelected = useMemo(
    () => selectedTwoFaMethods === 'AUTHENTICATOR',
    [selectedTwoFaMethods],
  );

  const isTwoFaEnabled = useMemo(() => !!user?.two_fa_enable, [user]);

  useEffect(() => {
    if (authUrl) {
      const isStandardScheme = authUrl.startsWith('otpauth:');
      setIsOpenAppBtnVisible(isStandardScheme);
    }
  }, [authUrl]);

  const onClickGenerate = useCallback(() => {
    if (!passkeyOptions) {
      dispatch(generateTwoFa({ type: selectedTwoFaMethods, router }));
    } else {
      dispatch(
        login({
          type: selectedTwoFaMethods,
          router,
          passkeyOptions,
        }),
      );
    }
  }, [dispatch, passkeyOptions, router, selectedTwoFaMethods]);

  useEffect(() => {
    setVerifyEnabled(code.length === 6);
  }, [code]);

  useEffect(() => {
    if (user?.two_fa_enable && isPassKeySelected) {
      dispatch(generateTwoFa({ type: selectedTwoFaMethods, router }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.two_fa_enable]);

  const handleChange = codeValue => {
    if (codeValue?.join('').length !== 6) {
      setVerifyEnabled(false);
    }
  };

  const handleCodeComplete = completeCode => {
    setCode(completeCode);
  };

  const handleVerify = useCallback(async () => {
    dispatch(login({ code, router, type: selectedTwoFaMethods }));
  }, [code, dispatch, router, selectedTwoFaMethods]);

  const handleSelection = event => {
    if (event?.target?.value === 'AUTHENTICATOR') {
      dispatch(setPassKeyOptions(null));
    }
    setSelectedTwoFaMethods(event?.target?.value);
  };

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
    <AuthContainer>
      <div className={s.mainContainer}>
        <SimpleSelect
          label={'Select Two FA'}
          selectedFontSize={'16px'}
          customClass={s.twoFaSelect}
          data={twoFaMethods}
          value={selectedTwoFaMethods}
          onChange={handleSelection}
        />
        {(!isTwoFaEnabled || isPassKeySelected) && (
          <Button
            className={s.verifyBtn}
            isLoading={isTwoFALoading || (isPassKeySelected && isSubmitting)}
            onClick={onClickGenerate}>
            {isTwoFaEnabled ? 'Login' : 'Generate'}
          </Button>
        )}
        {!!qrcodeString && isAuthenticatorSelected ? (
          <>
            <p className={s.emailTitle}>
              You need to install Google Authenticator and scan QR code for
              setup 2FA authentication with is required.
            </p>
            <Image
              src={qrcodeString}
              alt={'qr-code'}
              height={200}
              width={200}
            />
            {isOpenAppBtnVisible && (
              <>
                <p className={s.orText}>OR</p>
                <Button
                  className={s.verifyBtn}
                  onClick={onPressOpenAuthenticator}>
                  Open Authenticator app
                </Button>
              </>
            )}
            {!!secret && (
              <>
                <p className={s.orText}>OR</p>
                <Button className={s.verifyBtn} onClick={onPressCopySecret}>
                  Copy Secret
                </Button>
              </>
            )}
          </>
        ) : null}
        {isAuthenticatorSelected && (
          <div className={s.verificationContainer}>
            <p className={s.emailTitle}>
              Please check your Google Authenticator app for the verification
              code sent
            </p>
            <label htmlFor='code' className={s.enterCodeLabel}>
              Enter code
            </label>
            <CodeInput
              length={6}
              onComplete={handleCodeComplete}
              onChange={handleChange}
              onSubmit={handleVerify}
            />
            <Button
              className={s.verifyBtn}
              isLoading={isSubmitting}
              onClick={handleVerify}
              disabled={!verifyEnabled}>
              Verify
            </Button>
            <p className={s.note}>
              Still facing issue? <a href='/support'>Contact Support</a>
            </p>
          </div>
        )}
      </div>
    </AuthContainer>
  );
};

export default ValidateTwoFa;
