import { string, object } from 'yup';
export const updateEmailValidation = object({
  current_email: string()
    .required('Current email is required')
    .email('Current email must be a valid email'),
  new_email: string()
    .required('New email is required')
    .email('New email must be a valid email'),
}).required();
