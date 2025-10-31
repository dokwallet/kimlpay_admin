import { string, object, ref } from 'yup';
import { otpValidation, passwordValidation } from '@/validations/common';
export const verifyForgetPasswordForm = object({
  password: passwordValidation,
  confirmPassword: string().oneOf(
    [ref('password'), null],
    'Passwords must match',
  ),
  otp: otpValidation,
}).required();
