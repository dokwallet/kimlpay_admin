'use client';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { fetchWhiteLabelInfo, setIsSandbox } from '@/apis/apis';
import { setWhiteLabelInfo } from '@/whitelabel/whiteLabelInfo';
import Loading from '@/components/Loading';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { isReduxStoreLoaded } from '@/redux/extraData/extraSelectors';
import { ThemeContext } from '@/theme/ThemeContext';
import { ToastContainer } from 'react-toastify';
import styles from './appRouting.module.css';
import { getUser } from '@/redux/user/userSlice';
import { setCurrentRoute, setRouter } from '@/utils/routing';
import { checkAndSetAuthUser } from '@/redux/auth/authSlice';
import NextBugfender from '@/utils/bugfender';
import ScheduleMaintenance from '@/components/ScheduleMaintenance';

const secureAdminRoutes = [
  '/dashboard/admin/users',
  '/dashboard/admin/link',
  '/dashboard/admin/telegram-users',
  '/dashboard/admin/withdrawals',
  '/dashboard/admin/transactions',
];

const publicRoutes = ['/', '/login', '/signup', '/forget-password'];

const AppRouting = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isWindowObjectLoaded, setIsWindowObjectLoaded] = useState(false);
  const router = useRouter();
  const isPerformedRedirect = useRef(false);
  const isStoreLoaded = useSelector(isReduxStoreLoaded);
  const { themeType } = useContext(ThemeContext);
  const currentPage = usePathname();
  const currentPageRef = useRef(currentPage);
  const dispatch = useDispatch();

  useEffect(() => {
    currentPageRef.current = currentPage;
    setCurrentRoute(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setRouter(router);
    if (typeof window !== 'undefined') {
      NextBugfender.init();
      const protocol = window.location.protocol;
      const host = window.location.host;
      setIsSandbox(host);
      setIsWindowObjectLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInfos = useCallback(async () => {
    try {
      const resp = await fetchWhiteLabelInfo();
      const data = resp?.data;
      if (data) {
        setWhiteLabelInfo(data);
      }
      setIsFetchingData(false);
    } catch (e) {
      console.error('Error in fetch info');
      setIsFetchingData(false);
    }
  }, []);

  useEffect(() => {
    if (isWindowObjectLoaded) {
      fetchInfos().then(_ => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWindowObjectLoaded]);

  useEffect(() => {
    (async () => {
      if (
        !isFetchingData &&
        !isPerformedRedirect.current &&
        isStoreLoaded &&
        isWindowObjectLoaded
      ) {
        const sessionData = await dispatch(checkAndSetAuthUser()).unwrap();
        if (sessionData) {
          dispatch(getUser());
          if (sessionData?.authUser?.is_admin) {
            if (!secureAdminRoutes.includes(currentPageRef.current)) {
              await router.replace('/dashboard/admin/users');
            }
          }
        } else {
          if (!publicRoutes.includes(currentPageRef.current)) {
            await router.replace('/');
          }
        }
        setIsLoading(false);
        isPerformedRedirect.current = true;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingData, isStoreLoaded, isWindowObjectLoaded]);

  return (
    <div>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <>
          <ScheduleMaintenance isLandingPage={currentPage === '/'} />
          {children}
        </>
      )}
      <ToastContainer
        position='bottom-right'
        draggable
        pauseOnHover
        theme={themeType === 'light' ? 'light' : 'dark'}
      />
    </div>
  );
};

export default AppRouting;
