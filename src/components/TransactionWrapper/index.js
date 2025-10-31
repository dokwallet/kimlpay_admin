import React, { useCallback } from 'react';
import s from './TransactionWrapper.module.css';
import { isValidURL } from '@/utils/helper';
import { IconButton } from '@mui/material';
import { showToast } from '@/utils/toast';
import { ContentCopy } from '@mui/icons-material';
const TransactionWrapper = ({ tx_hash }) => {
  const handleCopyHash = useCallback(() => {
    navigator.clipboard.writeText(tx_hash);
    showToast({
      type: 'successToast',
      title: 'Transaction hash copied',
    });
  }, [tx_hash]);

  return (
    <div className={s.transactionHashWrapper}>
      <span
        className={`${s.txHashContainer} ${isValidURL(tx_hash) ? s.urlTextOverflow : ''}`}>
        {isValidURL(tx_hash) ? (
          <a href={tx_hash} target='_blank'>
            {tx_hash}
          </a>
        ) : (
          tx_hash
        )}
      </span>
      <IconButton
        aria-label='copyIcon'
        edge='end'
        sx={{
          '&  .MuiSvgIcon-root': {
            color: 'var(--primary)',
          },
        }}
        onClick={handleCopyHash}>
        <ContentCopy />
      </IconButton>
    </div>
  );
};

export default TransactionWrapper;
