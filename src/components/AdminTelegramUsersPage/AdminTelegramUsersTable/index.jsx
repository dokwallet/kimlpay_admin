'use client';
import React, { useMemo } from 'react';
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
  Chip,
} from '@mui/material';
import dayjs from 'dayjs';
import SimpleSelect from '@/components/SimpleSelect';
import styles from '../../AdminTopupPage/TopupTable/TopupTable.module.css';
import { USER_STATUS_DATA, USER_STATUS_MAP } from '@/utils/helper';

const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Pending', value: 'pending' },
];

const AdminTelegramUsersTable = ({
  transactions,
  onUpdateStatus,
  permissions = [],
}) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const widthSx = { minWidth: isXs ? 130 : 130 };

  const canEdit = useMemo(() => {
    if (!permissions || !permissions.includes('write_telegram_users')) {
      return false;
    }
    return true;
  }, [permissions]);

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <TableContainer
        component={Paper}
        className={styles.tableContainer}
        sx={{ boxShadow: 'none' }}>
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableCell className={styles.tableHeader}>DATE</TableCell>
              <TableCell className={styles.tableHeader}>Telegram ID</TableCell>
              <TableCell className={styles.tableHeader}>Username</TableCell>
              <TableCell className={styles.tableHeader}>Email</TableCell>
              <TableCell className={styles.tableHeader}>Full Name</TableCell>
              <TableCell className={styles.tableHeader}>Status</TableCell>
              <TableCell className={styles.tableHeader}>
                Platform Fee (%)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((user, index) => (
              <TableRow key={user?._id || index} hover>
                <TableCell>
                  {user?.createdAt
                    ? dayjs(user.createdAt).format('DD MMM YYYY hh:mm A')
                    : 'N/A'}
                </TableCell>
                <TableCell>{user?.telegram_id || 'N/A'}</TableCell>
                <TableCell>@{user?.telegram_username || 'N/A'}</TableCell>
                <TableCell>{user?.user?.email || 'N/A'}</TableCell>
                <TableCell>
                  {user?.full_name ||
                    `${user?.first_name || ''} ${user?.last_name || ''}`.trim() ||
                    'N/A'}
                </TableCell>
                <TableCell>
                  {canEdit ? (
                    <SimpleSelect
                      key={'user_select_' + user?._id}
                      data={USER_STATUS_DATA}
                      value={USER_STATUS_MAP[user?.status]}
                      onChange={e => {
                        if (onUpdateStatus) {
                          onUpdateStatus(user?.telegram_id, e?.target?.value);
                        }
                      }}
                    />
                  ) : (
                    USER_STATUS_MAP[user?.status] || '-'
                  )}
                </TableCell>
                <TableCell>{user?.platform_fee || '0'}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminTelegramUsersTable;
