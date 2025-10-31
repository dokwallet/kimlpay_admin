import { object, string } from 'yup';
import { passwordValidation } from '@/validations/common';

export const loginValidation = object({
  email: string().email().required(),
  password: passwordValidation,
}).required();
