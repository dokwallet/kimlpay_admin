import { string, object, mixed } from 'yup';
export const updatePersonalInfoValidation = previousObj => {
  return object()
    .shape({
      first_name: string().required().max(50),
      last_name: string().required().max(50),
      country_code: mixed().required(),
      customField: object().test(
        'is-changed',
        'At least one field must be different from the previous values',
        function (value) {
          const { first_name, last_name, country_code } = this.parent;
          return (
            first_name !== previousObj.first_name ||
            last_name !== previousObj.last_name ||
            JSON.stringify(country_code) !==
              JSON.stringify(previousObj.country_code)
          );
        },
      ),
    })
    .required();
};
