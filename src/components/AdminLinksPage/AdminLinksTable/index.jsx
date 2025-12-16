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
import styles from './AdminLinksTable.module.css';

const AdminLinksTable = ({ links }) => {
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
                Link Id
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Status
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Link Type
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Used
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Usage Count
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                USD Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {links.map((row, index) => (
              <TableRow key={row?.id} hover>
                <TableCell>
                  {dayjs(row?.created_at || row?.createdAt).format(
                    'DD MMM YYYY hh:mm A',
                  )}
                </TableCell>
                <TableCell>{row?.linkId || 'N/A'}</TableCell>
                <TableCell>{row?.status || 'N/A'}</TableCell>
                <TableCell>
                  <span
                    className={`${styles.statusBadge} ${styles[row?.status?.toLowerCase()] || ''}`}>
                    {row?.linkType || 'N/A'}
                  </span>
                </TableCell>
                <TableCell>{row?.used || 'N/A'}</TableCell>
                <TableCell>{row?.usageCount || 'N/A'}</TableCell>
                <TableCell>{row?.usdAmount || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminLinksTable;
