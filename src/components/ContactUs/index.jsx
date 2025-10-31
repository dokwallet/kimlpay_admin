'use client';
import React from 'react';
import s from './contactUs.module.css';
import { Call, Email, LocationOn, WhatsApp } from '@mui/icons-material';

const ContactUs = () => {
  return (
    <div className={s.mainContainer}>
      <div className={s.subContainer}>
        <div className={s.title}>Contact Us</div>
        <div className={s.companyName}>{'KIMEL View HK Ltd'}</div>
        <div className={s.rowView}>
          <LocationOn />
          <div className={s.description}>
            {
              'Room 1406, 14/F, solo Building, 41 - 43 Carnarvon Road,\nTsim Sha Tsui, Hong Kong'
            }
          </div>
        </div>
        <div className={s.rowView}>
          <Email />
          <a className={s.link} href={'mailto:support@kimlcards.com'}>
            {'support@kimlcards.com'}
          </a>
        </div>
        <div className={s.rowView}>
          <Call />
          <a className={s.link} href={'tel:+85281932546'}>
            {'+852 8193 2546'}
          </a>
        </div>
        <div className={s.rowView}>
          <WhatsApp />
          <a
            className={s.link}
            href={
              'https://wa.me/972584291288?text=Hello%20Kiml%20Cards%20Support%21'
            }>
            {'+972 58 429 1288'}
          </a>
        </div>
        <div className={s.chat}>
          {
            '0xF8eC8f7f7D5Ece27130227Bd7846ef24e86E8091 - xmtp.org chat available through '
          }
          <span>
            <a
              className={s.link}
              href={'https://kimlview.xyz'}
              target={'_blank'}>
              {'kimlview.xyz'}
            </a>
          </span>
          {' wallet'}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
