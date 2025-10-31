import { string, object, ref } from 'yup';
import { otpValidation, passwordValidation } from '@/validations/common';
export const verifyTwoFAValidation = object({
  new_otp: otpValidation,
}).required();
