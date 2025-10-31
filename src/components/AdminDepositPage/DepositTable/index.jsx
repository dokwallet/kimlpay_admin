'use client';
import React, { useCallback, useMemo } from 'react';
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
import styles from './DepositTable.module.css';
import Checkbox from '@/components/Checkbox';
import {
  setSelectedDepositIds,
  toggleSelectedDepositIds,
  updateDepositCommission,
} from '@/redux/deposit/depositSlice';
import { useDispatch, useSelector } from 'react-redux';
import DepositTableItem from '@/components/AdminDepositPage/DepositTable/DepositTableItem';
import { getPermissions } from '@/redux/user/userSelector';

const DepositTable = ({ deposit, isMultiDepositSelect, selectedDepositId }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const widthSx = { minWidth: isXs ? 130 : 130 };
  const checkboxWidth = { minWidth: 40 };
  const dispatch = useDispatch();

  const isSelectedAll = useMemo(() => {
    const allSelectedDepositIds = Object.keys(selectedDepositId);
    return allSelectedDepositIds.length === deposit?.length;
  }, [selectedDepositId, deposit?.length]);
  const permissions = useSelector(getPermissions);

  const onSelectAllDepositId = useCallback(() => {
    const allSelectedDepositIds = Object.keys(selectedDepositId);
    if (allSelectedDepositIds.length === deposit?.length) {
      dispatch(setSelectedDepositIds({}));
    } else {
      const allKeys = deposit.reduce((acc, item) => {
        acc[item?._id] = true;
        return acc;
      }, {});
      dispatch(setSelectedDepositIds(allKeys));
    }
  }, [dispatch, selectedDepositId, deposit]);

  const onSelectChange = useCallback(
    item => {
      dispatch(toggleSelectedDepositIds(item?._id));
    },
    [dispatch],
  );

  const canEdit = useMemo(() => {
    return permissions.includes('write_deposit');
  }, [permissions]);

  const onPressSaveDepositCommission = useCallback(
    payload => {
      dispatch(updateDepositCommission(payload));
    },
    [dispatch],
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
              {isMultiDepositSelect && (
                <TableCell sx={checkboxWidth} className={styles.tableHeader}>
                  <Checkbox
                    onChange={onSelectAllDepositId}
                    checked={isSelectedAll}
                  />
                </TableCell>
              )}
              <TableCell sx={widthSx} className={styles.tableHeader}>
                ID
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                DATE
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Name
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Card Id
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Deposit Amount
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Total Amount
              </TableCell>
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
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Affiliate
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Master Affiliate
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deposit.map(row => (
              <DepositTableItem
                key={row?._id}
                item={row}
                onSelectChange={onSelectChange}
                isMultiDepositSelect={isMultiDepositSelect}
                selectedDepositId={selectedDepositId}
                canEdit={canEdit}
                onPressSaveDepositCommission={onPressSaveDepositCommission}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DepositTable;
