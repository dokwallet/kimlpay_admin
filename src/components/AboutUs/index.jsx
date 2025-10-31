'use client';

import React from 'react';
import styles from './AboutUs.module.css';

const AboutUs = () => {
  return (
    <div className={styles.aboutUs}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>About Us</h1>
          <div className={styles.underline}></div>
        </div>

        <div>
          <div className={styles.contentBox}>
            <p className={styles.paragraph}>
              At KimlCards, we&#39;re on a mission to make cryptocurrency
              spending simple and accessible for everyone. By connecting
              stablecoins—digital assets pegged to the US dollar—to a credit
              card, we&#39;ve made it possible to spend crypto anywhere, without
              the volatility or complexity often associated with digital
              currencies.
            </p>
          </div>

          <div className={styles.contentBox}>
            <p className={styles.paragraph}>
              Our seamless approach automatically converts stablecoins at
              checkout, so you can enjoy hassle-free payments that feel just
              like using traditional fiat. We built KimlCards in direct response
              to our clients&#39; demand for a better way to leverage
              decentralized finance (DeFi) in everyday life
            </p>
          </div>

          <div className={styles.contentBox}>
            <p className={styles.paragraph}>
              Security and compliance lie at the heart of our solution. From
              robust KYC processes to advanced fraud protection, we&#39;re
              committed to maintaining the highest standards in fintech. Join us
              at KimlCards and experience the future of finance—where
              stablecoins meet the convenience of a credit card
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
