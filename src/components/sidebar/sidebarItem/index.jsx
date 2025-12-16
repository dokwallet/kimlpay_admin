import React from 'react';
import Link from 'next/link';
import styles from './SidebarItem.module.css';

const SidebarItem = ({
  href,
  label,
  icon,
  isSelected,
  isCollapsed,
  onClick,
}) => {
  return (
    <Link href={href}>
      <div
        className={`${styles.sidebarItem} ${isSelected ? styles.selected : ''}`}
        onClick={onClick}>
        {icon}
        {!isCollapsed && (
          <span className={styles.sidebarItemLabel}>{label}</span>
        )}
      </div>
    </Link>
  );
};

export default SidebarItem;
