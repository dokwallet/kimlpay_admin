import React from 'react';
import styles from './get-started.module.css';

export default function GetStarted() {
  return (
    <div className={styles.container}>
      <div className={styles.timeline}>
        <div
          className={`${styles.timelineItem} ${styles.left}`}
          style={{ position: 'relative' }}>
          <div className={styles.content}>
            <h2 className={styles.title}>Sign Up</h2>
            <p className={styles.description}>
              Apply for your virtual or physical card
            </p>
          </div>
          <div className={styles.circle}>1</div>
        </div>

        <div
          className={`${styles.timelineItem} ${styles.right}`}
          style={{ position: 'relative' }}>
          <div className={styles.circle}>2</div>
          <div className={styles.content}>
            <h2 className={styles.title}>KYC</h2>
            <p className={styles.description}>Verify yourself</p>
          </div>
        </div>

        <div
          className={`${styles.timelineItem} ${styles.left}`}
          style={{ position: 'relative' }}>
          <div className={styles.content}>
            <h2 className={styles.title}>Fund Your Card</h2>
            <p className={styles.description}>Send crypto to your Kiml card</p>
          </div>
          <div className={styles.circle}>3</div>
        </div>

        <div
          className={`${styles.timelineItem} ${styles.right}`}
          style={{ position: 'relative' }}>
          <div className={styles.circle}>4</div>
          <div className={styles.content}>
            <h2 className={styles.title}>Start Spending</h2>
            <p className={styles.description}>
              Use wherever credit cards are accepted
            </p>
          </div>
        </div>
      </div>

      <p className={styles.footer}>
        Pay with Google Pay or Apple Pay, and choose between a virtual or
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        physical card—it's that simple.
      </p>
    </div>
  );
}
