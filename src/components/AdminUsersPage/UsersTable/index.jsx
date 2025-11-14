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
  updateUserPlateformFeeCommission,
  updateUserTopupCommission,
} from '@/redux/user/userSlice';
import styles from '../../AdminTopupPage/TopupTable/TopupTable.module.css';
import UserTableItem from '@/components/AdminUsersPage/UsersTable/UserTableItem';

const UsersTable = ({ users, onUpdateStatus, permissions, isAdminTab }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const widthSx = useMemo(() => {
    return { minWidth: isXs ? 130 : 130 };
  }, [isXs]);

  const isUserTab = useMemo(() => {
    return !isAdminTab;
  }, [isAdminTab]);

  const affiliateOptions = useSelector(getAffiliateOptions);

  const onPressSaveCommission = useCallback(
    payload => {
      dispatch(updateUserPlateformFeeCommission(payload));
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
              <TableCell sx={widthSx} className={styles.tableHeader}>
                DATE
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Name
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Email
              </TableCell>
              {isUserTab && (
                <>
                  <TableCell sx={widthSx} className={styles.tableHeader}>
                    Plateform Fee
                  </TableCell>
                </>
              )}
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Status
              </TableCell>
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
