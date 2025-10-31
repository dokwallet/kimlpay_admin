import { object } from 'yup';
import { endDateValidation, startDateValidation } from '@/validations/common';

export const payoutFiltersValidationSchema = object({
  startDate: startDateValidation,
  endDate: endDateValidation,
});
