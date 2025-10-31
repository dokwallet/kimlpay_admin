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

import styles from '../../AdminTopupPage/TopupTable/TopupTable.module.css';
import {
  setSelectedAffiliateUserIds,
  updateAffiliateUserTopupCommission,
} from '@/redux/affiliateUser/affiliateUserSlice';
import Checkbox from '@/components/Checkbox';
import AffiliateTableRow from './AffiliateUserTableItem';
import { getAffiliateOptions } from '@/redux/affiliateUser/affiliateUserSelector';

const AffiliateUsersTable = ({
  affiliateUsers,
  onUpdateStatus,
  selectedAffiliateUserId,
  isMultiAffiliateUserSelect,
  userRolePermissions,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const widthSx = { minWidth: isXs ? 130 : 130 };

  const checkboxWidth = { minWidth: 40 };
  const isSelectedAll = useMemo(() => {
    const allSelectedAffiliateUserIds = Object.keys(selectedAffiliateUserId);
    return allSelectedAffiliateUserIds.length === affiliateUsers?.length;
  }, [selectedAffiliateUserId, affiliateUsers?.length]);

  const affiliateOptions = useSelector(getAffiliateOptions);

  const canEditAffiliateUsers = useMemo(
    () => userRolePermissions.includes('write_affiliate_users'),
    [userRolePermissions],
  );

  const onSelectAllAffiliateUserId = useCallback(() => {
    if (!canEditAffiliateUsers) return;
    const allSelectedAffiliateUserIds = Object.keys(selectedAffiliateUserId);
    if (allSelectedAffiliateUserIds.length === affiliateUsers?.length) {
      dispatch(setSelectedAffiliateUserIds({}));
    } else {
      const allKeys = affiliateUsers.reduce((acc, item) => {
        acc[item?._id] = true;
        return acc;
      }, {});
      dispatch(setSelectedAffiliateUserIds(allKeys));
    }
  }, [
    dispatch,
    selectedAffiliateUserId,
    affiliateUsers,
    canEditAffiliateUsers,
  ]);

  const onPressSaveCommission = useCallback(
    payload => {
      if (!canEditAffiliateUsers) return;
      dispatch(updateAffiliateUserTopupCommission(payload));
    },
    [dispatch, canEditAffiliateUsers],
  );

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <TableContainer
        sx={{ maxHeight: 500 }}
        component={Paper}
        className={styles.tableContainer}>
        <Table className={styles.table} stickyHeader>
          <TableHead>
            <TableRow>
              {isMultiAffiliateUserSelect && (
                <TableCell sx={checkboxWidth} className={styles.tableHeader}>
                  <Checkbox
                    onChange={onSelectAllAffiliateUserId}
                    checked={isSelectedAll}
                    disabled={!canEditAffiliateUsers}
                  />
                </TableCell>
              )}
              <TableCell sx={widthSx} className={styles.tableHeader}>
                DATE
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Name
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Balance
              </TableCell>
              <TableCell
                sx={{
                  minWidth: isXs ? 150 : 200,
                }}
                className={styles.tableHeader}>
                Address
              </TableCell>
              <TableCell
                sx={{ minWidth: isXs ? 30 : 50 }}
                className={styles.tableHeader}>
                Country
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Email
              </TableCell>
              <TableCell
                sx={{ minWidth: isXs ? 50 : 150 }}
                className={styles.tableHeader}>
                BusinessName
              </TableCell>
              <TableCell
                sx={{ minWidth: isXs ? 50 : 150 }}
                className={styles.tableHeader}>
                website
              </TableCell>
              <TableCell
                sx={{ minWidth: isXs ? 50 : 150 }}
                className={styles.tableHeader}>
                Deposit Commission Range
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Status
              </TableCell>
              <TableCell
                sx={{ minWidth: '200px' }}
                className={styles.tableHeader}>
                Affiliate
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {affiliateUsers.map((row, index) => (
              <AffiliateTableRow
                key={row?._id || row?.id || `aff_table_${index}`}
                row={row}
                isMultiAffiliateUserSelect={isMultiAffiliateUserSelect}
                selectedAffiliateUserId={selectedAffiliateUserId}
                onUpdateStatus={onUpdateStatus}
                onPressSaveCommission={onPressSaveCommission}
                affiliateOptions={affiliateOptions}
                userRolePermissions={userRolePermissions}
                canEditAffiliateUsers={canEditAffiliateUsers}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AffiliateUsersTable;
