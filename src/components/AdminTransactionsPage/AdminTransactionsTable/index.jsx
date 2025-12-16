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
import styles from './AdminTransactionsTable.module.css';

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
                DATE
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                TID
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Status
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Fiat Total
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Crypto Amount
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Provider Fee
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Kiml Fee
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((row, index) => (
              <TableRow key={row?.id} hover>
                <TableCell>
                  {dayjs(row?.created_at || row?.createdAt).format(
                    'DD MMM YYYY hh:mm A',
                  )}
                </TableCell>
                <TableCell>{row?.external_tx_id || 'N/A'}</TableCell>
                <TableCell>
                  <span
                    className={`${styles.statusBadge} ${styles[row?.status?.toLowerCase()] || ''}`}>
                    {row?.status || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>
                  {row?.total_amount} {row?.currency_from}
                </TableCell>
                <TableCell>
                  {row?.amount_received} {row?.currency_to}
                </TableCell>
                <TableCell>
                  {row?.provider_fees} {row?.currency_from}
                </TableCell>
                <TableCell>
                  {row?.kiml_fees} {row?.currency_from}
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
