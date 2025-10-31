import { string, object } from 'yup';
export const addAffiliateUserValidation = object({
  name: string().required('Name is required').max(50),
  email: string().email().nullable().optional(),
}).required();
