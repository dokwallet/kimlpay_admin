import { object } from 'yup';
import { endDateValidation, startDateValidation } from '@/validations/common';

export const depositFiltersValidationSchema = object({
  startDate: startDateValidation,
  endDate: endDateValidation,
});
