import React from 'react';
import { Radio } from '@mui/material';
import styles from './AddressList.module.css';
import { useField, useFormikContext } from 'formik';

const AddressList = ({
  handleChange,
  selectedValue,
  existingShippings,
  ...props
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(props);
  const localOnChange = event => {
    setFieldValue([field.name], event.target.value);
    handleChange && handleChange(event);
  };

  return (
    <div className={styles.addressListContainer}>
      <label
        className={`${styles.addressListItem} ${selectedValue === 'add_new_shipping' ? styles.selected : ''}`}>
        <Radio
          size='small'
          checked={selectedValue === 'add_new_shipping'}
          onChange={localOnChange}
          value='add_new_shipping'
          name='radio-buttons'
          inputProps={{ 'aria-label': 'add_new_shipping' }}
          sx={{
            color: 'var(--primary)',
            '&.Mui-checked': {
              color: 'var(--background)',
            },
          }}
        />
        <div className={styles.addressDetailsWrapper}>Add new</div>
      </label>
      {existingShippings?.map((item, index) => (
        <label
          key={index}
          className={`${styles.addressListItem} ${selectedValue === item?._id ? styles.selected : ''}`}>
          <Radio
            size='small'
            checked={selectedValue === item?._id}
            onChange={localOnChange}
            value={item?._id}
            name='radio-buttons'
            inputProps={{
              'aria-label': `${item.shippingAddressLine1} ${item.shippingAddressLine2}`,
            }}
            sx={{
              color: 'var(--primary)',
              '&.Mui-checked': {
                color: 'var(--background)',
              },
            }}
          />
          <div className={styles.addressDetailsWrapper}>
            <h3
              className={
                styles.personalText
              }>{`${item?.shippingAddress?.line1}, ${item?.shippingAddress?.line2}, ${item?.shippingAddress?.city}, ${item?.shippingAddress?.postalCode}`}</h3>
            <h3 className={styles.documentText}>
              {`${item?.recipientFirstName}, ${item?.recipientLastName}, ${item?.recipientDialCode} ${item?.recipientPhoneNumber}, ${item?.recipientEmail}`}
            </h3>
          </div>
        </label>
      ))}
    </div>
  );
};

export default AddressList;
