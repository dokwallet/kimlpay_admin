import * as Yup from 'yup';
import { endDateValidation, startDateValidation } from './common';

export const kycMetricsValidation = Yup.object().shape({
  startDate: startDateValidation.required(),
  endDate: endDateValidation.required(),
});
