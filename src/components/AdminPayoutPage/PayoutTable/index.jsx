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
import styles from './PayoutTable.module.css';
import { PAYOUT_STATUS_MAP } from '@/utils/helper';
import CustomTooltip from '@/components/Tooltip';
import TransactionWrapper from '@/components/TransactionWrapper';
import ModalEditPayout from '@/components/ModalEditPayout';
import { useDispatch, useSelector } from 'react-redux';
import { setShowEditPayoutModal } from '@/redux/payout/payoutSlice';
import { Edit } from '@mui/icons-material';
import { getShowEditPayoutModal } from '@/redux/payout/payoutSelectors';

const PayoutTable = ({ payout }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const showEditPayoutModal = useSelector(getShowEditPayoutModal);
  const widthSx = { minWidth: isXs ? 130 : 130 };
  const dispatch = useDispatch();
  const [selectedPayout, setSelectedPayout] = useState(null);
  const onPressPayout = useCallback(
    item => {
      setSelectedPayout(item);
      dispatch(setShowEditPayoutModal(true));
    },
    [dispatch],
  );

  const onCloseModal = useCallback(() => {
    dispatch(setShowEditPayoutModal(false));
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
                Affiliate User
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Available Balance
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                COIN NAME
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                USD AMOUNT
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                WITHDRAWAL ADDRESS
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                WITHDRAWAL ADDRESS MEMO
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                STATUS
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                TX HASH
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payout.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  {dayjs(row?.createdAt).format('DD MMM YYYY hh:mm A')}
                </TableCell>
                <TableCell>{`${row?.affiliate_user_details?.name || '-'}`}</TableCell>
                <TableCell>{`${row?.affiliate_user_details?.balance || '-'}`}</TableCell>
                <TableCell>{`${row?.coin_name}`}</TableCell>
                <TableCell>{`$${row?.usd_amount}`}</TableCell>
                <TableCell>{`${row?.withdrawal_address}`}</TableCell>
                <TableCell>{`${row?.withdrawal_address_memo || '-'}`}</TableCell>
                <TableCell>
                  <div className={styles.rowView}>
                    {`${PAYOUT_STATUS_MAP[row?.status] || '-'}`}
                    {row?.reason && <CustomTooltip message={row?.reason} />}
                  </div>
                </TableCell>
                <TableCell>
                  {row?.tx_hash ? (
                    <TransactionWrapper tx_hash={row?.tx_hash} />
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    aria-label='edit-payout'
                    sx={{
                      '&  .MuiSvgIcon-root': {
                        color: 'var(--primary)',
                      },
                    }}
                    onClick={() => onPressPayout(row)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {!!selectedPayout && showEditPayoutModal ? (
        <ModalEditPayout
          selectedPayout={selectedPayout}
          handleClose={onCloseModal}
          open={showEditPayoutModal}
        />
      ) : null}
    </Box>
  );
};

export default PayoutTable;
