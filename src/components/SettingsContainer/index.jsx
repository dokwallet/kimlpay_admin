'use client';
import React, { useEffect } from 'react';
import styles from './SettingsContainer.module.css';
import SettingsItem from '@/components/SettingsItems';
import { getSelectedSettingsTab } from '@/redux/settings/settingsSelectors';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedSettingsTab,
  updateSettingsRouteParams,
} from '@/redux/settings/settingsSlice';
import { useSearchParams } from 'next/navigation';
import { SETTINGS_DATA } from '@/utils/helper';
import UpdatePersonalInfoForm from '@/components/UpdatePersonalInfoForm';
import { getUserData, isUserLoading } from '@/redux/user/userSelector';
import Loading from '@/components/Loading';
import useWindowSize from '@/hooks/useWindowSize';
import UpdatePasswordForm from '@/components/UpdatePasswordForm';
import UpdateEmailForm from '@/components/UpdateEmailForm';
import TwoFaForm from '@/components/TwoFAForm';

const SettingsContainer = () => {
  const selectedSettingsTab = useSelector(getSelectedSettingsTab);
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const isLoading = useSelector(isUserLoading);
  const userData = useSelector(getUserData);
  const { width: windowWidth } = useWindowSize();

  useEffect(() => {
    if (windowWidth) {
      const tab = searchParams.get('tab');
      if (
        SETTINGS_DATA.findIndex(item => item.key === tab?.toLowerCase()) !== -1
      ) {
        dispatch(setSelectedSettingsTab(tab));
        updateSettingsRouteParams({ tab: tab }, dispatch, true);
      } else if (selectedSettingsTab && windowWidth < 768) {
        dispatch(setSelectedSettingsTab(''));
      } else if (selectedSettingsTab) {
        updateSettingsRouteParams({ tab: selectedSettingsTab }, dispatch);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowWidth]);

  if (isLoading || !userData) {
    return <Loading />;
  }

  return (
    <div className={styles.mainContainer}>
      {(windowWidth >= 768 || !selectedSettingsTab) && (
        <div className={styles.leftContainer}>
          <SettingsItem />
        </div>
      )}
      {!!selectedSettingsTab && (
        <div className={styles.rightContainer}>
          <div className={styles.formView}>
            {selectedSettingsTab === 'profile_settings' && (
              <UpdatePersonalInfoForm />
            )}
            {selectedSettingsTab === 'change_password' && (
              <UpdatePasswordForm />
            )}
            {selectedSettingsTab === 'change_email' && <UpdateEmailForm />}
            {selectedSettingsTab === '2_fa' && <TwoFaForm />}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsContainer;
