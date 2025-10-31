import { object } from 'yup';
import { otpValidation } from '@/validations/common';
export const updateTwoFAValidation = object({
  current_otp: otpValidation,
}).required();
