import React, { useContext, useState } from 'react';
import {
  Box,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import ContrastIcon from '@mui/icons-material/Contrast';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SystemDefaultIcon from '@mui/icons-material/SettingsBrightness';
import { ThemeContext } from '@/theme/ThemeContext';
import styles from './UserThemeMode.module.css';

const itemTextStyles = {
  '& .MuiTypography-root': {
    fontSize: '14px',
  },
};

const ItemsArr = [
  {
    id: 1,
    title: 'Light',
    icon: <LightModeIcon />,
  },
  {
    id: 2,
    title: 'Dark',
    icon: <DarkModeIcon />,
  },
  {
    id: 3,
    title: 'System',
    icon: <SystemDefaultIcon />,
  },
];

const UserThemeMode = () => {
  const { theme, changeTheme } = useContext(ThemeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <IconButton onClick={handleClick} className={styles.iconBtnWrapper}>
        <ContrastIcon className={styles.modeIcon} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              width: '200px',
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              background: 'var(--backgroundColor)',
              color: 'var(--font)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <Box className={styles.titleWrapper}>
          <Typography variant='body2'>Theme Mode</Typography>
        </Box>
        {ItemsArr.map(item => (
          <MenuItem
            key={item.id}
            className={`${styles.menuItem} ${item.title.toLowerCase() === theme ? styles.activeItem : ''}`}
            onClick={() => changeTheme(item.title.toLowerCase())}>
            {item.icon}
            <ListItemText
              className={styles.itemText}
              primary={item.title}
              sx={itemTextStyles}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default UserThemeMode;
