import { date, string } from 'yup';

export const passwordValidation = string()
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/`~])[A-Za-z\d!@#$%^&*()_\-+={[}\]|\\:;"'<,>.?/`~]{8,32}$/,
    'Your password must be 8-32 characters long, including at least one uppercase letter, one lowercase letter, one special character, and one number.',
  )
  .required();

export const otpValidation = string().required().min(6).max(6);

export const startDateValidation = date()
  .optional()
  .test(
    'is-before-end',
    'Start date must be before end date',
    function (value) {
      const { endDate } = this.parent;
      return !value || !endDate || value <= endDate;
    },
  );

export const endDateValidation = date()
  .optional()
  .test(
    'is-after-start',
    'End date must be after start date',
    function (value) {
      const { startDate } = this.parent;
      return !value || !startDate || value >= startDate;
    },
  );
