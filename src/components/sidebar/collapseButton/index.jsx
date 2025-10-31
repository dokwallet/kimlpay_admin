import React from 'react';
import LeftIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import RightIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import styles from './CollapseButton.module.css';

const CollapseButton = ({ isCollapsed, onCollapseToggle }) => {
  return (
    <div
      className={`${styles.collapseButton} ${isCollapsed ? styles.collapsed : ''}`}
      onClick={onCollapseToggle}>
      {isCollapsed ? <RightIcon /> : <LeftIcon />}
      {!isCollapsed && (
        <span className={styles.collapseText}>Collapse menu</span>
      )}
    </div>
  );
};

export default CollapseButton;
