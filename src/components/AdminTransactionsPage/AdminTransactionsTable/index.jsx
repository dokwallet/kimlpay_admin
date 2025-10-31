'use client';
import React, { useCallback } from 'react';
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
import dayjs from 'dayjs';
import { getCurrencySymbol } from '@/utils/helper';
import { showToast } from '@/utils/toast';
import styles from '../../AdminTopupPage/TopupTable/TopupTable.module.css';

const AdminTransactionsTable = ({ transactions }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const widthSx = { minWidth: isXs ? 130 : 130 };

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
                TID
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                DATE
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                ACTIVITY
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Status
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                TRANSACTION AMOUNT
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                USD AMOUNT
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((row, index) => (
              <TableRow key={row?.id} hover>
                <TableCell> {row?.id}</TableCell>
                <TableCell>
                  {' '}
                  {dayjs(row?.created_at).format('DD MMM YYYY hh:MM A')}
                </TableCell>
                <TableCell>{row.merchant_data?.merchant_name}</TableCell>
                <TableCell>{row?.status}</TableCell>
                <TableCell>
                  {getCurrencySymbol(row.transaction_currency)?.symbol}{' '}
                  <strong>{row?.transaction_amount}</strong>
                </TableCell>
                <TableCell>
                  {getCurrencySymbol(row.bill_currency)?.symbol}{' '}
                  <strong>{row?.bill_amount}</strong>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminTransactionsTable;
