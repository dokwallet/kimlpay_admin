import { string, object } from 'yup';
export const passkeyNameValidation = object({
  name: string().required().max(50),
}).required();
