import { string, object, ref } from 'yup';
import { passwordValidation } from '@/validations/common';
export const updatePasswordValidation = object({
  current_password: passwordValidation,
  new_password: passwordValidation,
  confirm_new_password: string().oneOf(
    [ref('new_password'), null],
    'Passwords must match',
  ),
}).required();
