import { string, object, ref, mixed } from 'yup';
import { passwordValidation } from '@/validations/common';
export const registerValidation = object({
  firstName: string().required().max(50),
  lastName: string().required().max(50),
  countryCode: mixed().required(),
  email: string().email().required(),
  password: passwordValidation,
  confirmPassword: string().oneOf(
    [ref('password'), null],
    'Passwords must match',
  ),
}).required();
