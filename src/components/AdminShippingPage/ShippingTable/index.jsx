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
  IconButton,
} from '@mui/material';
import dayjs from 'dayjs';
import SimpleSelect from '@/components/SimpleSelect';
import {
  isValidURL,
  SHIPPING_STATUS_DATA,
  SHIPPING_STATUS_MAP,
} from '@/utils/helper';
import { ContentCopy } from '@mui/icons-material';
import { showToast } from '@/utils/toast';
import styles from '../../AdminTopupPage/TopupTable/TopupTable.module.css';
import s from './ShippingTable.module.css';
import { useDispatch } from 'react-redux';
import {
  setSelectedShippingIds,
  toggleSelectedShippingIds,
} from '@/redux/shipping/shippingSlice';
import Checkbox from '@/components/Checkbox';

const ShippingTable = ({
  shippings,
  onUpdateStatus,
  isMultiShippingSelect,
  selectedShippingId,
  userRolePermissions,
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const widthSx = { minWidth: isXs ? 130 : 130 };

  const checkboxWidth = { minWidth: 40 };
  const dispatch = useDispatch();

  const isSelectedAll = useMemo(() => {
    const allSelectedShippingIds = Object.keys(selectedShippingId);
    return allSelectedShippingIds.length === shippings?.length;
  }, [selectedShippingId, shippings?.length]);

  const handleCopyHash = useCallback(content => {
    navigator.clipboard.writeText(content);
    showToast({
      type: 'successToast',
      title: 'Transaction hash copied',
    });
  }, []);

  const onSelectAllShippingId = useCallback(() => {
    const allSelectedShippingIds = Object.keys(selectedShippingId);
    if (allSelectedShippingIds.length === shippings?.length) {
      dispatch(setSelectedShippingIds({}));
    } else {
      const allKeys = shippings.reduce((acc, item) => {
        acc[item?._id] = true;
        return acc;
      }, {});
      dispatch(setSelectedShippingIds(allKeys));
    }
  }, [dispatch, selectedShippingId, shippings]);

  const canEditShipping = useMemo(
    () => userRolePermissions.includes('write_shipping'),
    [userRolePermissions],
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
              {isMultiShippingSelect && (
                <TableCell sx={checkboxWidth} className={styles.tableHeader}>
                  <Checkbox
                    onChange={onSelectAllShippingId}
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
              <TableCell
                sx={{
                  minWidth: isXs ? 150 : 200,
                }}
                className={styles.tableHeader}>
                Shipping Address
              </TableCell>
              <TableCell
                sx={{ minWidth: isXs ? 30 : 50 }}
                className={styles.tableHeader}>
                Country
              </TableCell>
              <TableCell
                sx={{ minWidth: isXs ? 50 : 150 }}
                className={styles.tableHeader}>
                Email
              </TableCell>
              <TableCell
                sx={{ minWidth: isXs ? 50 : 150 }}
                className={styles.tableHeader}>
                Phone
              </TableCell>
              <TableCell
                sx={{ minWidth: isXs ? 50 : 150 }}
                className={styles.tableHeader}>
                Coin Name
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                Amount
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                TX HASH
              </TableCell>
              <TableCell sx={widthSx} className={styles.tableHeader}>
                User
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
            {shippings.map((row, index) => (
              <TableRow key={index} hover>
                {isMultiShippingSelect && (
                  <TableCell>
                    <Checkbox
                      onChange={() => {
                        dispatch(toggleSelectedShippingIds(row?._id));
                      }}
                      checked={!!selectedShippingId[row?._id]}
                    />
                  </TableCell>
                )}

                <TableCell>
                  {dayjs(row?.createdAt).format('DD MMM YYYY hh:mm A')}
                </TableCell>
                <TableCell>{`${row?.shipping_details[0]?.recipientFirstName} ${row?.shipping_details[0]?.recipientLastName}`}</TableCell>
                <TableCell>{row?.card_id}</TableCell>
                <TableCell>{`${row?.shipping_details[0]?.shippingAddress?.line1}, ${row?.shipping_details[0]?.shippingAddress?.line2}, ${row?.shipping_details[0]?.shippingAddress?.city}, ${row?.shipping_details[0]?.shippingAddress?.country}, ${row?.shipping_details[0]?.shippingAddress?.postalCode}`}</TableCell>
                <TableCell>
                  {row?.shipping_details[0]?.shippingAddress?.country}
                </TableCell>
                <TableCell>
                  {row?.shipping_details[0]?.recipientEmail}
                </TableCell>
                <TableCell>{`${row?.shipping_details[0]?.recipientDialCode} ${row?.shipping_details[0]?.recipientPhoneNumber}`}</TableCell>
                <TableCell>{row?.coin_name}</TableCell>
                <TableCell>{row?.amount}</TableCell>
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
                <TableCell>{`${row?.user_details?.first_name || '-'} ${row?.user_details?.last_name || ''}`}</TableCell>
                <TableCell>{`${row?.affiliate_user_details?.name || '-'}`}</TableCell>
                <TableCell>{`${row?.master_affiliate_user_details?.name || '-'}`}</TableCell>
                <TableCell>
                  {canEditShipping ? (
                    <SimpleSelect
                      key={'shipping_select_' + row?._id}
                      data={SHIPPING_STATUS_DATA}
                      value={SHIPPING_STATUS_MAP[row?.status]}
                      onChange={e => {
                        onUpdateStatus?.([
                          {
                            status: e?.target?.value,
                            shippingId: row?._id,
                          },
                        ]);
                      }}
                    />
                  ) : (
                    SHIPPING_STATUS_MAP[row?.status] || ''
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ShippingTable;
