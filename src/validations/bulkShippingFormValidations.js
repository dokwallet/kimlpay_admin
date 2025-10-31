import { mixed, object, string } from 'yup';

export const bulkShippingFormValidationSchema = object({
  shippingAddressLine1: string().required(
    'Shipping address line 1 is required',
  ),
  shippingCountry: mixed().required('Shipping country is required'),
  shippingPostalCode: string().required('Shipping postal code is required'),
  shippingCity: string().required('Shipping city is required'),
  recipientFirstName: string().required('Recipient first name is required'),
  recipientLastName: string().required('Recipient last name is required'),
  recipientPhoneNumber: string()
    .matches(/^[0-9]{7,11}$/)
    .required(),
  recipientDialCode: string().required('Recipient dial code is required'),
  recipientEmail: string()
    .email('Invalid email format')
    .required('Recipient email is required'),
});
