import { string, object, mixed } from 'yup';
export const updateAffiliateUserValidation = previousObj => {
  return object()
    .shape({
      name: string().required().max(50),
      email: string().email().nullable().optional(),
      country: mixed().nullable().optional(),
      addressLine1: string().nullable().optional(),
      addressLine2: string().nullable().optional(),
      city: string().nullable().optional(),
      zipcode: string().nullable().optional(),
      state: string().nullable().optional(),
      businessName: string().nullable().optional(),
      website: string().nullable().optional(),
      description: string().nullable().optional(),
      notes: string().nullable().optional(),
      customField: object().test(
        'is-changed',
        'At least one field must be different from the previous values',
        function (value) {
          const {
            name,
            email,
            country,
            addressLine1,
            addressLine2,
            city,
            zipcode,
            state,
            businessName,
            website,
            description,
            notes,
          } = this.parent;
          return (
            name !== previousObj.name ||
            email !== previousObj.email ||
            addressLine1 !== previousObj.addressLine1 ||
            addressLine2 !== previousObj.addressLine2 ||
            city !== previousObj.city ||
            zipcode !== previousObj.zipcode ||
            state !== previousObj.state ||
            businessName !== previousObj.businessName ||
            website !== previousObj.website ||
            description !== previousObj.description ||
            notes !== previousObj.notes ||
            JSON.stringify(country) !== JSON.stringify(previousObj.country)
          );
        },
      ),
    })
    .required();
};
