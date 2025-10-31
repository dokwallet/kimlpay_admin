import React, { useCallback, useState } from 'react';
import {
  Avatar,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
  Box,
  Tooltip,
} from '@mui/material';
import styles from './UserMenu.module.css';
import { getUserData } from '@/redux/user/userSelector';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setSelectedSettingsTab } from '@/redux/settings/settingsSlice';
import { signout } from '@/redux/auth/authSlice';

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openTooltip, setOpenTooltip] = useState(false);
  const open = Boolean(anchorEl);
  const userData = useSelector(getUserData);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onPressLogout = useCallback(async () => {
    handleClose();
    dispatch(signout());
  }, [dispatch]);

  const onPressSettings = useCallback(async () => {
    dispatch(setSelectedSettingsTab('profile_settings'));
    handleClose();
    router.push('/dashboard/settings?tab=profile_settings');
  }, [dispatch, router]);

  const handleOpenTooltip = () => {
    if (userData?.email?.length >= 70) {
      setOpenTooltip(true);
    }
  };

  const handleCloseTooltip = () => {
    if (userData?.email?.length >= 70) {
      setOpenTooltip(false);
    }
  };

  return (
    <div className={styles.userMenu}>
      <Avatar onClick={handleClick} className={styles.avatar}>
        {/* User initials or image */}
      </Avatar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              width: '250px',
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              background: 'var(--backgroundColor)',
              color: 'var(--font)',
              '& .MuiAvatar-root': {
                width: 40,
                height: 40,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'var(--backgroundColor)',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <Box className={styles.avatarContainer}>
          <Box className={styles.avatarWrapper}>
            <Avatar />
            <div className={styles.userNameText}>{userData?.first_name}</div>
            <Tooltip
              arrow
              open={openTooltip}
              onClose={handleCloseTooltip}
              onOpen={handleOpenTooltip}
              title={
                <span style={{ fontSize: '14px' }}>{userData?.email}</span>
              }>
              <div className={styles.userEmail}>{userData?.email}</div>
            </Tooltip>
          </Box>
        </Box>
        <Divider />
        <MenuItem>
          <ListItemText primary='Account settings' onClick={onPressSettings} />
        </MenuItem>
        <MenuItem>
          <ListItemText primary='Logout' onClick={onPressLogout} />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserMenu;
