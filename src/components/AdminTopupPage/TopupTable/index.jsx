'use client';
import React, { useCallback, useMemo, useState } from 'react';
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
import SimpleSelect from '@/components/SimpleSelect';
import {
  isValidURL,
  TOPUP_STATUS_DATA,
  TOPUP_STATUS_MAP,
} from '@/utils/helper';
import { ContentCopy, QrCode } from '@mui/icons-material';
import { showToast } from '@/utils/toast';
import styles from './TopupTable.module.css';
import Checkbox from '@/components/Checkbox';
import {
  setSelectedTopupIds,
  toggleSelectedTopupIds,
} from '@/redux/topup/topupSlice';
import { useDispatch } from 'react-redux';
import ModalQRCode from '@/components/ModalQRCode';

const TopupTable = ({
  topup,
  onUpdateStatus,
  isMultiTopupSelect,
  selectedTopupId,
  userRolePermissions,
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const widthSx = { minWidth: isXs ? 130 : 130 };
  const checkboxWidth = { minWidth: 40 };
  const dispatch = useDispatch();
  const [qrText, setQrText] = useState('');

  const isSelectedAll = useMemo(() => {
    const allSelectedTopupIds = Object.keys(selectedTopupId);
    return allSelectedTopupIds.length === topup?.length;
  }, [selectedTopupId, topup?.length]);

  const handleCopyHash = useCallback(content => {
    navigator.clipboard.writeText(content);
    showToast({
      type: 'successToast',
      title: 'Transaction hash copied',
    });
  }, []);

  const handleCopyAddress = useCallback(content => {
    navigator.clipboard.writeText(content);
    showToast({
      type: 'successToast',
      title: 'Address copied',
    });
  }, []);

  const onSelectAllTopupId = useCallback(() => {
    const allSelectedTopupIds = Object.keys(selectedTopupId);
    if (allSelectedTopupIds.length === topup?.length) {
      dispatch(setSelectedTopupIds({}));
    } else {
      const allKeys = topup.reduce((acc, item) => {
        acc[item?._id] = true;
        return acc;
      }, {});
      dispatch(setSelectedTopupIds(allKeys));
    }
  }, [dispatch, selectedTopupId, topup]);

  const canEditStatus = useMemo(
    () => userRolePermissions.includes('write_topup'),
    [userRolePermissions],
  );

  const onPressQR = useCallback(item => {
    setQrText(item);
  }, []);

  const handleCloseQRModal = useCallback(() => {
    setQrText('');
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
              {isMultiTopupSelect && (
                <TableCell sx={checkboxWidth} className={styles.tableHeader}>
                  <Checkbox
                    onChange={onSelectAllTopupId}
                    checked={isSelectedAll}
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
                Card Id
              </TableCell>
              {topup?.[0]?.card_address && (
                <TableCell
                  sx={{
                    minWidth: isXs ? 100 : 150,
                  }}
                  className={styles.tableHeader}>
                  Deposit Address
                </TableCell>
              )}
              <TableCell
                sx={{ minWidth: isXs ? 50 : 150 }}
                className={styles.tableHeader}>
                Coin Name
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Amount
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Topup Fee
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
                TX HASH
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Affiliate
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Master Affiliate
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topup.map((row, index) => (
              <TableRow key={index} hover>
                {isMultiTopupSelect && (
                  <TableCell>
                    <Checkbox
                      onChange={() => {
                        dispatch(toggleSelectedTopupIds(row?._id));
                      }}
                      checked={!!selectedTopupId[row?._id]}
                    />
                  </TableCell>
                )}
                <TableCell>
                  {dayjs(row?.createdAt).format('DD MMM YYYY hh:mm A')}
                </TableCell>
                <TableCell>{`${row?.user_details?.first_name || ''} ${row?.user_details?.last_name || ''}`}</TableCell>
                <TableCell>{row?.card_id}</TableCell>
                {row?.card_address && (
                  <TableCell>
                    <div className={s.transactionHashWrapper}>
                      {row?.card_address}
                      <IconButton
                        aria-label='copyIcon'
                        edge='end'
                        onClick={() => handleCopyAddress(row?.card_address)}>
                        <ContentCopy />
                      </IconButton>
                      <IconButton
                        aria-label='qrIcon'
                        onClick={() => onPressQR(row?.card_address)}
                        edge='end'
                        sx={{
                          '&  .MuiSvgIcon-root': {
                            color: 'var(--primary)',
                          },
                        }}>
                        <QrCode fontSize='small' />
                      </IconButton>
                    </div>
                  </TableCell>
                )}
                <TableCell>{row?.coin_name}</TableCell>
                <TableCell>{row?.amount}</TableCell>
                <TableCell>
                  {row?.fee_amount
                    ? `$${row?.fee_amount ?? ''} (${row?.fee_percentage}%)`
                    : `${row?.fee_percentage}%`}
                </TableCell>
                <TableCell>
                  {row?.affiliate_commission_amount
                    ? `$${row?.affiliate_commission_amount ?? ''} (${row?.affiliate_commission_percentage}%)`
                    : row?.affiliate_commission_percentage
                      ? `${row?.affiliate_commission_percentage}%`
                      : '-'}
                </TableCell>
                <TableCell>
                  {row?.master_affiliate_commission_amount
                    ? `$${row?.master_affiliate_commission_amount ?? ''} (${row?.master_affiliate_commission_percentage}%)`
                    : row?.master_affiliate_commission_percentage
                      ? `${row?.master_affiliate_commission_percentage}%`
                      : '-'}
                </TableCell>
                <TableCell>
                  {row?.total_fee_amount
                    ? `$${row?.total_fee_amount ?? ''} (${row?.total_fee_percentage}%)`
                    : `${row?.total_fee_percentage}%`}
                </TableCell>
                <TableCell>
                  <div className={s.transactionHashWrapper}>
                    <span
                      className={`${s.txHashContainer} ${isValidURL(row?.tx_hash) ? s.urlTextOverflow : ''}`}>
                      {isValidURL(row?.tx_hash) ? (
                        <a href={row?.tx_hash} target='_blank'>
                          {row?.tx_hash}
                        </a>
                      ) : (
                        row?.tx_hash
                      )}
                    </span>
                    <IconButton
                      aria-label='copyIcon'
                      edge='end'
                      onClick={() => handleCopyHash(row?.tx_hash)}>
                      <ContentCopy />
                    </IconButton>
                  </div>
                </TableCell>
                <TableCell>
                  {row?.affiliate_user_details?.name || '-'}
                </TableCell>
                <TableCell>
                  {row?.master_affiliate_user_details?.name || '-'}
                </TableCell>
                <TableCell>
                  {canEditStatus ? (
                    <SimpleSelect
                      key={'topup_select_' + row?._id}
                      data={TOPUP_STATUS_DATA}
                      value={TOPUP_STATUS_MAP[row?.status]}
                      onChange={e => {
                        onUpdateStatus?.([
                          {
                            status: e?.target?.value,
                            topupId: row?._id,
                          },
                        ]);
                      }}
                    />
                  ) : (
                    TOPUP_STATUS_MAP[row?.status] || ''
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ModalQRCode
        qrText={qrText}
        handleClose={handleCloseQRModal}
        open={!!qrText}
      />
    </Box>
  );
};

export default TopupTable;
