import React from 'react';
import styles from './tooltip.module.css';
import { Info } from '@mui/icons-material';
import { Tooltip } from '@mui/material';

function CustomTooltip({ message }) {
  return (
    <Tooltip
      enterTouchDelay={0}
      leaveTouchDelay={3000}
      classes={{ tooltip: styles.tooltip }}
      title={message}
      placement={'right-start'}>
      <Info />
    </Tooltip>
  );
}
export default CustomTooltip;
