import React from 'react';
import styles from './FormShippingInfo.module.css';
import TextInput from '@/components/textInput';
import CountrySelect from '@/components/countrySelect';
import { Typography } from '@mui/material';
import CountryCodeSelect from '@/components/countryCodeSelect';

const FormShippingInfo = ({ onChange, ...props }) => {
  return (
    <div className={styles.listContainer}>
      <Typography
        id='shipping-address-title'
        variant='h6'
        component='h2'
        style={{ marginBottom: '10px' }}>
        Shipping Address
      </Typography>
      <TextInput
        label='Address line 1'
        name='shippingAddressLine1'
        onChange={onChange}
      />
      <TextInput
        label='Address line 2'
        name='shippingAddressLine2'
        onChange={onChange}
      />
      <CountrySelect
        label='Country'
        name='shippingCountry'
        onChange={onChange}
      />
      <TextInput
        label='Postal Code'
        name='shippingPostalCode'
        onChange={onChange}
      />
      <TextInput label='City' name='shippingCity' onChange={onChange} />
      <Typography
        id='shipping-address-title'
        variant='h6'
        component='h2'
        style={{ marginBottom: '10px' }}>
        Recipient Information
      </Typography>
      <div className={styles.inlineRow}>
        <TextInput
          label='First name'
          name='recipientFirstName'
          onChange={onChange}
        />
        <TextInput
          label='Last name'
          name='recipientLastName'
          onChange={onChange}
        />
      </div>
      <div id='phoneNumber' className={styles.recipientphoneNumberField}>
        <CountryCodeSelect
          label='Dial code'
          name='recipientDialCode'
          onChange={onChange}
        />
        <TextInput
          inputProps={{
            inputMode: 'numeric',
          }}
          label='Phone number'
          name='recipientPhoneNumber'
          onChange={onChange}
        />
      </div>
      <TextInput
        label='Email'
        type={'email'}
        name='recipientEmail'
        onChange={onChange}
      />
    </div>
  );
};

export default FormShippingInfo;
