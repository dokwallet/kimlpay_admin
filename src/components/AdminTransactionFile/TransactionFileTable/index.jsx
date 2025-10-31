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
  Button,
} from '@mui/material';
import dayjs from 'dayjs';
import styles from './TransactionFileTable.module.css';
import Download from '@mui/icons-material/Download';
import { downloadFile } from '@/apis/apis';

const TransactionFileTable = ({ transactionFile }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const widthSx = { minWidth: isXs ? 130 : 130 };

  const onPressDownload = useCallback(url => {
    downloadFile(url);
  }, []);

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
                Type
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Url
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactionFile?.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  {dayjs(row?.createdAt).format('DD MMM YYYY hh:mm A')}
                </TableCell>
                <TableCell>{`${row?.name}`}</TableCell>
                <TableCell>{row?.type}</TableCell>
                <TableCell>
                  {
                    <Button
                      className={`${styles.filterButton} `}
                      startIcon={<Download />}
                      onClick={() => onPressDownload(row?.url)}>
                      Download
                    </Button>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TransactionFileTable;
