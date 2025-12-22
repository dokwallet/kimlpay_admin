import { string, object, ref, mixed } from 'yup';
import { passwordValidation } from '@/validations/common';
export const registerValidation = object({
  email: string().email().required(),
  password: passwordValidation,
  confirmPassword: string().oneOf(
    [ref('password'), null],
    'Passwords must match',
  ),
}).required();
