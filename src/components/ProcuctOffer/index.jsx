'use client';
import React from 'react';
import s from './ProcuctOffer.module.css';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

const ProductOffer = () => {
  return (
    <div className={s.contentWrapper}>
      <div className={`${roboto.className}`}>
        <h1 className={s.mainTitle}>KimlCards Product Overview</h1>

        <p className={s.description}>
          KimlCards is designed to simplify how you spend cryptocurrency.
          Whether you&#39;re a seasoned crypto user or new to the space, we
          offer a seamless bridge between cryptocurrencies and everyday
          spending.
        </p>

        <div className={s.sectionsContainer}>
          <Section
            number='1'
            title='Real-Time Stablecoin Payments'
            items={[
              [
                'Spend Crypto Anywhere',
                'Use your Kiml Card wherever credit cards are accepted, online or in-store.',
              ],
              [
                'Instant Conversion',
                'Your stablecoins automatically convert to fiat at checkout—no manual exchanges or extra steps.',
              ],
            ]}
          />

          <Section
            number='2'
            title='Virtual & Physical Cards'
            items={[
              [
                'Virtual Card',
                'Perfect for immediate online purchases. No waiting—use it right after sign-up.',
              ],
              [
                'Physical Card',
                'For those who prefer a tangible card. Enjoy the convenience of contactless payments and global acceptance.',
              ],
            ]}
          />

          <Section
            number='3'
            title='Google Pay & Apple Pay Integration'
            items={[
              [
                'Tap & Go',
                'Link your Kiml Card with Google Pay or Apple Pay for seamless, on-the-go transactions.',
              ],
              [
                'Secure Payments',
                'Benefit from built-in security features and biometric verification on your smartphone.',
              ],
            ]}
          />

          <Section
            number='4'
            title='Simple Sign-Up & KYC'
            items={[
              [
                'Fast Registration',
                'Open an account in minutes with a quick KYC process.',
              ],
              [
                'Transparent Verification',
                'Industry-leading ID and biometric checks keep your account secure and compliant.',
              ],
            ]}
          />

          <Section
            number='5'
            title='Referral Rewards'
            items={[
              [
                'Earn Up to 3%',
                'Invite friends and family to join KimlCards and get rewarded.',
              ],
              [
                'Easy Tracking',
                'Monitor referral progress and earnings through our transparent system.',
              ],
            ]}
          />

          <Section
            number='6'
            title='Advanced Security & Compliance'
            items={[
              [
                'Regulatory Confidence',
                'Compliant with AML and KYC regulations to protect your assets.',
              ],
              [
                'Fraud Protection',
                'Cutting-edge tools to prevent unauthorized activity, giving you peace of mind.',
              ],
            ]}
          />
        </div>

        <p className={s.footerText}>
          At KimlCards, we believe that spending your digital assets should be
          as effortless and familiar as using any traditional payment card. Join
          us and experience the ease of real-world crypto transactions—no
          complexity, no compromises.
        </p>
      </div>
    </div>
  );
};

const Section = ({ number, title, items }) => {
  return (
    <div className={s.section}>
      <h2 className={s.sectionTitle}>
        <span className={s.sectionNumber}>{number}.</span>
        <span>{title}</span>
      </h2>
      <div className={s.sectionContent}>
        {items.map(([itemTitle, description], index) => (
          <div key={index} className={s.sectionItem}>
            <h3 className={s.itemTitle}>{itemTitle}</h3>
            <p className={s.itemDescription}>{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductOffer;
