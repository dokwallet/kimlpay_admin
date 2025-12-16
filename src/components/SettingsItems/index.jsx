'use client';
import React, { useCallback } from 'react';
import styles from './SettingsItem.module.css';
import { ChevronRight } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedSettingsTab,
  updateSettingsRouteParams,
} from '@/redux/settings/settingsSlice';
import { getSelectedSettingsTab } from '@/redux/settings/settingsSelectors';
import { SETTINGS_DATA } from '@/utils/helper';

const SettingsItem = () => {
  const dispatch = useDispatch();
  const selectedSettingsTab = useSelector(getSelectedSettingsTab);

  const onChangeSettingsTab = useCallback(
    key => {
      dispatch(setSelectedSettingsTab(key));
      updateSettingsRouteParams({ tab: key }, dispatch);
    },
    [dispatch],
  );

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.title}>Settings</h1>
      <div className={`${styles.sidebar}`}>
        {SETTINGS_DATA.map(item => {
          return (
            <div
              onClick={() => onChangeSettingsTab(item.key)}
              key={item.key}
              className={`${styles.menuItem} ${selectedSettingsTab === item?.key ? styles.active : ''}`}>
              <div className={styles.leftMenuItem}>
                {item?.icon}
                <span>{item?.title}</span>
              </div>
              <ChevronRight className={styles.chevronIcon} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsItem;
