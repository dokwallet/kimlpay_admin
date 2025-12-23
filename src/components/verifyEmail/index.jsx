'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '@/components/_button';
import s from './VerifyEmail.module.css';
import CodeInput from '../codeInput';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPreAuthUser,
  isEmailOTPSubmitting,
  isResendEmailSubmitting,
} from '@/redux/user/userSelector';
import { useRouter } from 'next/navigation';
import { resendVerifyEmail, verifyEmail } from '@/redux/user/userSlice';
import AuthContainer from '@/components/AuthContainer';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [verifyEnabled, setVerifyEnabled] = useState(false);
  const timerRef = useRef(null);
  const user = useSelector(getPreAuthUser);
  const email = user?.email;
  const isSubmitting = useSelector(isEmailOTPSubmitting);
  const isResendSubmitting = useSelector(isResendEmailSubmitting);
  const dispatch = useDispatch();
  const router = useRouter();

  const startTimer = () => {
    setTimer(60);
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer === 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const sendInitialVerification = async () => {
      await dispatch(resendVerifyEmail()).unwrap();
      startTimer();
    };

    sendInitialVerification();

    return () => clearInterval(timerRef.current);
  }, [dispatch]);

  useEffect(() => {
    setVerifyEnabled(code.length === 6);
  }, [code]);

  const handleChange = codeValue => {
    if (codeValue?.join('').length !== 6) {
      setVerifyEnabled(false);
    }
  };

  const handleCodeComplete = completeCode => {
    setCode(completeCode);
  };

  const handleResend = async () => {
    if (timer === 0) {
      await dispatch(resendVerifyEmail()).unwrap();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      startTimer();
    }
  };

  const handleVerify = useCallback(async () => {
    dispatch(
      verifyEmail({
        userId: user?.userId,
        otp: code,
        router,
      }),
    );
  }, [code, dispatch, router, user?.userId]);

  return (
    <AuthContainer>
      <div className={s.verificationContainer}>
        <h1>We need to verify your email</h1>
        <p className={s.emailTitle}>
          Please check your inbox for the verification code sent to{' '}
          <strong>{email}</strong>
        </p>
        <label htmlFor='code' className={s.enterCodeLabel}>
          Enter code
        </label>
        <CodeInput
          length={6}
          onComplete={handleCodeComplete}
          onChange={handleChange}
        />
        {timer !== 0 && <p>Resend code in: {timer} sec</p>}
        {timer === 0 && (
          <Button
            className={s.resendBtn}
            onClick={handleResend}
            isLoading={isResendSubmitting}>
            Resend Code
          </Button>
        )}
        <Button
          className={s.verifyBtn}
          isLoading={isSubmitting}
          onClick={handleVerify}
          disabled={!verifyEnabled}>
          Verify
        </Button>
        <p>Can&apos;t find it? Please check your spam folder.</p>
      </div>
    </AuthContainer>
  );
};

export default VerifyEmail;
