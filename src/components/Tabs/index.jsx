'use client';
import React, { useState } from 'react';
import { Box, IconButton, Tab, Tabs as _Tabs } from '@mui/material';
import LeftIcon from '@mui/icons-material/ChevronLeftRounded';
import RightIcon from '@mui/icons-material/ChevronRightRounded';
import styles from './Tabs.module.css';

const CustomTabScrollButton = ({ direction, disabled, onClick }) => {
  return (
    !disabled && (
      <IconButton
        className={styles.scrollBtn}
        disabled={disabled}
        onClick={onClick}>
        {direction === 'left' ? <LeftIcon /> : <RightIcon />}
      </IconButton>
    )
  );
};

const Tabs = ({
  tabList = [],
  selectedTab = 0,
  onTabChange = () => {},
  sx = {},
  tabsClassName = '',
  tabClassName = '',
  tabFontSize = 16,
  ...props
}) => {
  //   const [selectedTab, setSelectedTab] = useState(0);

  //   const handleTabChange = (event, newValue) => {
  //     setSelectedTab(newValue);
  //     tabChange?.(newValue);
  //   };

  return (
    // <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    // </Box>
    <_Tabs
      className={`${tabsClassName ? tabsClassName : ''}`}
      variant='scrollable'
      scrollButtons='auto'
      allowScrollButtonsMobile
      value={selectedTab}
      onChange={onTabChange}
      sx={{
        ...sx,
        '& .MuiTab-root': {
          textTransform: 'none', // Remove uppercase transformation
          fontSize: `${tabFontSize}px`, // Adjust font size to match the design
          color: 'var(--font)', // Adjust tab color
        },
        '& .MuiButtonBase-root.MuiTab-root.Mui-selected': {
          //   color: "#68AEF9", // Adjust selected tab color
          color: 'var(--background)', // Adjust selected tab color
          fontWeight: 'bold', // Adjust selected tab font weight
        },
        '& .MuiTabs-indicator': {
          backgroundColor: 'var(--background)', // Adjust indicator color
        },
      }}
      {...props}
      slots={{
        scrollButton: CustomTabScrollButton,
      }}>
      {tabList?.map((tab, index) => (
        <Tab
          key={index}
          className={`${tabClassName ? tabClassName : ''}`}
          label={tab}
        />
      ))}
      {/* {children} */}
    </_Tabs>
  );
};

export default Tabs;
