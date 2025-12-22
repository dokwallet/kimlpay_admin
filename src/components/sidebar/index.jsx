import React, { useCallback, useContext, useMemo, useState } from 'react';
import { getAppLogo } from '@/whitelabel/whiteLabelInfo';
import { ThemeContext } from '@/theme/ThemeContext';
import SidebarItem from './sidebarItem';
import CollapseButton from './collapseButton';
import { adminSidebarList } from '@/data/sidebarList';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Logo from '@/assets/logo/logo.png';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import styles from './Sidebar.module.css';
import { useTheme } from '@mui/material/styles';
import { Drawer, IconButton, useMediaQuery } from '@mui/material';
import UserMenu from '../userMenu';
import useWindowSize from '@/hooks/useWindowSize';
import { THRESHOLD_WIDTH } from '@/utils/configValues';
import UserThemeMode from '../userThemeMode';
import { useSelector } from 'react-redux';
import { getPreviousRouteParams } from '@/redux/extraData/extraSelectors';
import Link from 'next/link';
import { getPermissions } from '@/redux/user/userSelector';
import imageLoader from '@/components/NextImageLoader';

const Sidebar = ({ isCollapsed, onCollapseToggle }) => {
  const { width: windowWidth } = useWindowSize();
  const { themeType } = useContext(ThemeContext);
  const applogo = getAppLogo();
  const previousRouteParams = useSelector(getPreviousRouteParams);
  const userRolePermissions = useSelector(getPermissions);
  const path = usePathname();
  const list = useMemo(() => {
    return adminSidebarList.filter(item => {
      if (!item.permission) return true;

      return userRolePermissions.includes(item.permission);
    });
  }, [userRolePermissions]);

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTabletDevice = useMediaQuery(theme.breakpoints.down('lg'));

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const sidebarContent = useMemo(() => {
    return (
      <div>
        <div className={styles.sidebarHeader}>
          <button
            className={`${styles.mobileCloseIcon} ${isCollapsed ? styles.collapsedCloseIcon : ''}`}
            onClick={handleMobileMenuToggle}>
            <CloseIcon fontSize='small' />
          </button>
          <Link href='/'>
            <Image
              priority={true}
              src={isCollapsed ? Logo : applogo?.[themeType]}
              width={isCollapsed ? 45 : 215}
              height={45}
              alt={'App logo'}
              loader={imageLoader}
            />
          </Link>
        </div>
        <nav className={styles.sidebarNav}>
          {list?.map(({ href, label, icon }) => (
            <SidebarItem
              key={label}
              href={previousRouteParams[label] || href}
              label={label}
              icon={icon}
              isSelected={path === href}
              isCollapsed={isCollapsed}
              onClick={handleMobileMenuToggle}
            />
          ))}
        </nav>
        <CollapseButton
          isCollapsed={isCollapsed}
          onCollapseToggle={onCollapseToggle}
        />
      </div>
    );
  }, [
    handleMobileMenuToggle,
    isCollapsed,
    list,
    onCollapseToggle,
    path,
    previousRouteParams,
    themeType,
  ]);

  return (
    <>
      {windowWidth <= THRESHOLD_WIDTH ? (
        <>
          <div className={`${styles.mobileHeader}`}>
            <div className={styles.logoContainer}>
              <IconButton
                className={styles.mobileMenuButton}
                onClick={handleMobileMenuToggle}>
                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
              <Image
                src={applogo?.[themeType]}
                width={170}
                height={35}
                alt={'App logo'}
                loader={imageLoader}
              />
            </div>
            <div className={styles.userMenuWrapper}>
              <UserThemeMode />
              <UserMenu />
            </div>
          </div>
          <Drawer
            anchor='left'
            open={isMobileMenuOpen}
            onClose={handleMobileMenuToggle}
            classes={{ paper: styles.drawerPaper }}>
            {sidebarContent}
          </Drawer>
        </>
      ) : (
        <div
          className={`${styles.parentSidebar} ${isCollapsed ? styles.collapsed : ''}`}>
          <div
            className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
