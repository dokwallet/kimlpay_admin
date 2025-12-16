import { string, object } from 'yup';

export const forgetPasswordValidation = object({
  email: string().email().required(),
}).required();
