import { object } from 'yup';
import { endDateValidation, startDateValidation } from '@/validations/common';

export const topupFiltersValidationSchema = object({
  startDate: startDateValidation,
  endDate: endDateValidation,
});
