import { object } from 'yup';
import { otpValidation } from '@/validations/common';
export const verifyChangeEmailOTPValidation = object({
  current_email_otp: otpValidation,
  new_email_otp: otpValidation,
}).required();
