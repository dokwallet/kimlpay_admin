'use client';
import React, { useCallback, useState } from 'react';
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
  IconButton,
} from '@mui/material';
import dayjs from 'dayjs';
import styles from './AdminPaymentWithdrawalsTable.module.css';
import TransactionWrapper from '@/components/TransactionWrapper';
import { Edit } from '@mui/icons-material';
import { setShowEditWithdrawalModal } from '@/redux/adminPaymentWithdrawals/adminPaymentWithdrawalsSlice';
import { getShowEditWithdrawalModal } from '@/redux/adminPaymentWithdrawals/adminPaymentWithdrawalsSelectors';
import { useSelector, useDispatch } from 'react-redux';
import ModalEditWithdrawal from '@/components/ModalEditWithdrawal';

const AdminPaymentWithdrawalsTable = ({ transactions }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const widthSx = { minWidth: isXs ? 130 : 130 };
  const [selectedWithdrawals, setSelectedWithdrawals] = useState(null);
  const showEditWithdrawalModal = useSelector(getShowEditWithdrawalModal);
  const dispatch = useDispatch();
  const onPressWithdrawal = useCallback(
    item => {
      setSelectedWithdrawals(item);
      dispatch(setShowEditWithdrawalModal(true));
    },
    [dispatch],
  );

  const onCloseModal = useCallback(() => {
    dispatch(setShowEditWithdrawalModal(false));
  }, [dispatch]);

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
                EMAIL
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                STATUS
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                WITHDRAWAL ADDRESS
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                AMOUNT
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                TX HASH
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                REASON
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Action
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
                <TableCell>{row?.user?.email || 'N/A'}</TableCell>
                <TableCell>{row?.status || 'N/A'}</TableCell>
                <TableCell>{row?.walletAddress || 'N/A'}</TableCell>
                <TableCell>{row?.amount || 'N/A'}</TableCell>
                <TableCell>
                  {row?.tx_hash ? (
                    <TransactionWrapper tx_hash={row?.tx_hash} />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>{row?.reason || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label='edit-withdrawal'
                    sx={{
                      '&  .MuiSvgIcon-root': {
                        color: 'var(--primary)',
                      },
                    }}
                    onClick={() => onPressWithdrawal(row)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!!selectedWithdrawals && showEditWithdrawalModal ? (
        <ModalEditWithdrawal
          selectedWithdrawal={selectedWithdrawals}
          handleClose={onCloseModal}
          open={showEditWithdrawalModal}
        />
      ) : null}
    </Box>
  );
};

export default AdminPaymentWithdrawalsTable;
