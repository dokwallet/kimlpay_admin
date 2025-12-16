'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './TwoFA.module.css';

import { setSelectedTwoFaTab } from '@/redux/settings/settingsSlice';
import { getSelectedTwoFaTab } from '@/redux/settings/settingsSelectors';

import Tabs from '@/components/Tabs';
import AuthenticatorForm from '@/components/AuthenticatorForm';
import PasskeysForm from '@/components/PasskeysForm';

const ALL_TWO_FA_TABS = ['Passkeys', 'Authenticator'];
const TwoFaForm = () => {
  const dispatch = useDispatch();
  const selectedTwoFaTab = useSelector(getSelectedTwoFaTab);

  const handleTabChange = (event, newValue) => {
    dispatch(setSelectedTwoFaTab(newValue));
  };

  return (
    <>
      <div className={styles.tabContainer}>
        <Tabs
          tabList={ALL_TWO_FA_TABS}
          tabFontSize={14}
          tabsClassName={styles.tabList}
          tabClassName={styles.tab}
          selectedTab={selectedTwoFaTab}
          onTabChange={handleTabChange}
          variant={'fullWidth'}
          scrollButtons={null}
          allowScrollButtonsMobile={false}
        />
      </div>
      {selectedTwoFaTab === 0 && <PasskeysForm />}
      {selectedTwoFaTab === 1 && <AuthenticatorForm />}
    </>
  );
};

export default TwoFaForm;
