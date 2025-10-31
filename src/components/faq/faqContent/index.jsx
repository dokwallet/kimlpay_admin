'use client';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFaqs, toggleActiveIndex } from '@/redux/faqs/faqSlice';
import {
  selectFaqs,
  selectLoading,
  selectError,
  selectOpenFaqIndexes,
} from '@/redux/faqs/faqsSelector';
import Loading from '@/components/Loading';
import styles from './faqContent.module.css';
import DOMPurify from 'dompurify';

const FAQContent = ({ fullWidth = true }) => {
  const dispatch = useDispatch();
  const faqs = useSelector(selectFaqs);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const activeIndexes = useSelector(selectOpenFaqIndexes);

  useEffect(() => {
    dispatch(fetchFaqs({ is_user: true }));
  }, [dispatch]);

  const toggleItem = index => {
    dispatch(toggleActiveIndex(index));
  };

  const formatAnswer = answer => {
    if (!answer) return null;

    const sanitizedAnswer = DOMPurify.sanitize(answer);
    return <div dangerouslySetInnerHTML={{ __html: sanitizedAnswer }} />;
  };

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.contentSide}>
      <h1 className={styles.mainTitle}>FAQ</h1>
      <div className={`${styles.faqList} ${fullWidth ? styles.fullWidth : ''}`}>
        {faqs.map((item, index) => (
          <div
            key={item._id}
            className={`${styles.faqItem} ${
              activeIndexes.includes(index) ? styles.active : ''
            }`}
            style={{
              animationDelay: `${(index + 1) * 0.1}s`,
            }}>
            <button
              className={styles.question}
              onClick={() => toggleItem(index)}>
              {item.question}
              <span
                className={`${styles.icon} ${
                  activeIndexes.includes(index) ? styles.active : ''
                }`}>
                {activeIndexes.includes(index) ? '−' : '+'}
              </span>
            </button>
            <div
              className={`${styles.answer} ${
                activeIndexes.includes(index) ? styles.expanded : ''
              }`}>
              {formatAnswer(item.answer)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQContent;
