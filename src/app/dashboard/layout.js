'use client';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import UserMenu from '@/components/userMenu';
import { isSidebarCollapsed } from '@/redux/extraData/extraSelectors';
import { setSidebarCollapsed } from '@/redux/extraData/extraDataSlice';
import styles from './Dashboard.module.css';
import UserThemeMode from '@/components/userThemeMode';
import useWindowSize from '@/hooks/useWindowSize';
import { THRESHOLD_WIDTH } from '@/utils/configValues';
import NavigationHeader from '@/components/navigationHeader';
import { usePathname } from 'next/navigation';
import { getSelectedSettingsTab } from '@/redux/settings/settingsSelectors';
import {
  setSelectedSettingsTab,
  updateSettingsRouteParams,
} from '@/redux/settings/settingsSlice';
import { getPermissions, getUserData } from '@/redux/user/userSelector';
import adminRoutes from '@/utils/adminPermissionHelper';
import Loading from '@/components/Loading';
import { showToast } from '@/utils/toast';

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { width: windowWidth } = useWindowSize();
  const pathname = usePathname();
  const selectedSettingsTab = useSelector(getSelectedSettingsTab);
  const permissionsData = useSelector(getPermissions);
  const userData = useSelector(getUserData);
  const isCollapsed = useSelector(isSidebarCollapsed);

  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleCollapseToggle = () => {
    dispatch(setSidebarCollapsed(!isCollapsed));
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isRedirectCall = useRef(false);

  useEffect(() => {
    if (userData && !isRedirectCall.current) {
      isRedirectCall.current = true;
      if (permissionsData?.length) {
        const currentRouteIndex = adminRoutes.findIndex(
          route => route.path === pathname,
        );
        const userPermissions = permissionsData || [];
        if (
          currentRouteIndex === -1 ||
          !userPermissions.includes(adminRoutes[currentRouteIndex].permission)
        ) {
          const allowedRoute = adminRoutes.find(route =>
            userPermissions.includes(route.permission),
          );
          if (allowedRoute) {
            router.replace(allowedRoute.path);
          } else {
            router.replace('/dashboard/settings');
          }
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        showToast({
          type: 'errorToast',
          title: 'Not have a proper role',
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionsData]);

  const onPressSettingsBack = useCallback(() => {
    dispatch(setSelectedSettingsTab(''));
    updateSettingsRouteParams({ tab: null }, dispatch);
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className={styles.layout}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Sidebar
        isCollapsed={isCollapsed}
        onCollapseToggle={handleCollapseToggle}
      />
      <div
        className={`${styles.mainContainer} ${windowWidth <= THRESHOLD_WIDTH ? styles.fullWidth : ''}`}>
        <div
          className={`${styles.header} ${scrolled ? styles.header_background : ''}`}>
          <UserThemeMode />
          <UserMenu />
        </div>
        {windowWidth <= 768 &&
          pathname === '/dashboard/settings' &&
          !!selectedSettingsTab && (
            <NavigationHeader
              backText={'Settings'}
              onPressBack={onPressSettingsBack}
            />
          )}
        <div className={styles.contentArea}>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
