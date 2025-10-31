'use client';
import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { getAffiliateOptions } from '@/redux/affiliateUser/affiliateUserSelector';
import {
  setSelectedUserIds,
  updateUserTopupCommission,
} from '@/redux/user/userSlice';
import styles from '../../AdminTopupPage/TopupTable/TopupTable.module.css';
import UserTableItem from '@/components/AdminUsersPage/UsersTable/UserTableItem';
import Checkbox from '@/components/Checkbox';

const UsersTable = ({
  users,
  onUpdateStatus,
  isMultiUserSelect,
  selectedUserId,
  permissions,
  isAdminTab,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const widthSx = useMemo(() => {
    return { minWidth: isXs ? 130 : 130 };
  }, [isXs]);

  const isUserTab = useMemo(() => {
    return !isAdminTab;
  }, [isAdminTab]);
  const checkboxWidth = { minWidth: 40 };

  const isSelectedAll = useMemo(() => {
    const allSelectedUserIds = Object.keys(selectedUserId);
    return allSelectedUserIds.length === users?.length;
  }, [selectedUserId, users?.length]);

  const onSelectUserId = useCallback(() => {
    const allSelectedUserIds = Object.keys(selectedUserId);
    if (allSelectedUserIds.length === users?.length) {
      dispatch(setSelectedUserIds({}));
    } else {
      const allKeys = users.reduce((acc, item) => {
        acc[item?._id] = true;
        return acc;
      }, {});
      dispatch(setSelectedUserIds(allKeys));
    }
  }, [dispatch, selectedUserId, users]);

  const affiliateOptions = useSelector(getAffiliateOptions);

  const onPressSaveCommission = useCallback(
    payload => {
      dispatch(updateUserTopupCommission(payload));
    },
    [dispatch],
  );

  const canEdit = useMemo(() => {
    if (isAdminTab) {
      return permissions.includes('write_admin_users');
    } else {
      return permissions.includes('write_users');
    }
  }, [isAdminTab, permissions]);

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <TableContainer
        sx={{ maxHeight: 500 }}
        component={Paper}
        className={styles.tableContainer}>
        <Table className={styles.table} stickyHeader>
          <TableHead>
            <TableRow>
              {isMultiUserSelect && canEdit && (
                <TableCell sx={checkboxWidth} className={styles.tableHeader}>
                  <Checkbox onChange={onSelectUserId} checked={isSelectedAll} />
                </TableCell>
              )}
              <TableCell sx={widthSx} className={styles.tableHeader}>
                DATE
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Name
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Email
              </TableCell>
              <TableCell
                sx={{
                  minWidth: isXs ? 50 : 70,
                }}
                className={styles.tableHeader}>
                Country
              </TableCell>
              {isUserTab && (
                <TableCell sx={widthSx} className={styles.tableHeader}>
                  KYC Status
                </TableCell>
              )}
              {isUserTab && (
                <>
                  <TableCell
                    sx={{ minWidth: '200px' }}
                    className={styles.tableHeader}>
                    Affiliate User
                  </TableCell>
                  <TableCell
                    sx={{ minWidth: '200px' }}
                    className={styles.tableHeader}>
                    Master Affiliate User
                  </TableCell>
                </>
              )}
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Status
              </TableCell>
              {isUserTab && (
                <>
                  <TableCell sx={widthSx} className={styles.tableHeader}>
                    Deposit Fee
                  </TableCell>
                  <TableCell sx={widthSx} className={styles.tableHeader}>
                    Affiliate Commission
                  </TableCell>
                  <TableCell sx={widthSx} className={styles.tableHeader}>
                    Master Affiliate Commission
                  </TableCell>
                  <TableCell sx={widthSx} className={styles.tableHeader}>
                    Total Fee
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((item, index) => (
              <UserTableItem
                key={item.id || item?._id || `user_table_${index}`}
                item={item}
                index={index}
                affiliateOptions={affiliateOptions}
                isUserTab={isUserTab}
                onPressSaveCommission={onPressSaveCommission}
                onUpdateStatus={onUpdateStatus}
                isMultiUserSelect={isMultiUserSelect && canEdit}
                selectedUserId={selectedUserId}
                isKycDone={item?.isKycVerified ? 'Done' : 'Pending'}
                canEdit={canEdit}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsersTable;
