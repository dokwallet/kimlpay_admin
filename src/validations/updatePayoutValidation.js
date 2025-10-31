import { string, object, number } from 'yup';
export const updatePayoutValidation = previousObj => {
  return object()
    .shape({
      status: number().required().oneOf([1, 2, 3]),
      tx_hash: string().nullable().optional(),
      reason: string().nullable().optional(),
      customField: object().test(
        'is-changed',
        'At least one field must be different from the previous values',
        function (_) {
          const { status, tx_hash = '', reason = '' } = this.parent;
          return (
            status !== previousObj.status ||
            tx_hash !== previousObj.tx_hash ||
            reason !== previousObj.reason
          );
        },
      ),
    })
    .required();
};
