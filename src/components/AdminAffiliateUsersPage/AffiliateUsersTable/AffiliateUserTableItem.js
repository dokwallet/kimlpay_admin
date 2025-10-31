import React, { useCallback, useState } from 'react';
import { TableRow, TableCell, IconButton } from '@mui/material';
import { Save } from '@mui/icons-material';
import dayjs from 'dayjs';
import SimpleSelect from '@/components/SimpleSelect';
import Checkbox from '@/components/Checkbox';
import { useDispatch } from 'react-redux';
import {
  toggleSelectedAffiliateUserIds,
  updateAffiliateUserId,
} from '@/redux/affiliateUser/affiliateUserSlice';
import {
  AFFILIATE_USER_STATUS_DATA,
  AFFILIATE_USER_STATUS_MAP,
} from '@/utils/helper';
import { showToast } from '@/utils/toast';
import AffiliateSelect from '@/components/AffiliateSelect';
import s from './AffiliateUsersTable.module.css';

const AffiliateTableRow = ({
  row,
  isMultiAffiliateUserSelect,
  selectedAffiliateUserId,
  onUpdateStatus,
  onPressSaveCommission,
  affiliateOptions,
  canEditAffiliateUsers,
}) => {
  const dispatch = useDispatch();
  const [minCommission, setMinCommission] = useState(
    row?.affiliate_min_commission ?? '',
  );
  const [maxCommission, setMaxCommission] = useState(
    row?.affiliate_max_commission ?? '',
  );

  const onChangeAffiliate = useCallback(
    value => {
      if (!canEditAffiliateUsers) return;
      if (value?.id === row?.affiliate_user_details?._id) {
        return;
      }
      dispatch(
        updateAffiliateUserId({
          user_id: row?._id,
          affiliate_user_id: value?.id,
        }),
      );
    },
    [
      dispatch,
      row?._id,
      row?.affiliate_user_details?._id,
      canEditAffiliateUsers,
    ],
  );

  return (
    <TableRow hover>
      {isMultiAffiliateUserSelect && (
        <TableCell>
          <Checkbox
            onChange={() => {
              if (canEditAffiliateUsers) {
                dispatch(toggleSelectedAffiliateUserIds(row?._id));
              }
            }}
            checked={!!selectedAffiliateUserId[row?._id]}
            disabled={!canEditAffiliateUsers}
          />
        </TableCell>
      )}
      <TableCell>
        {dayjs(row?.createdAt).format('DD MMM YYYY hh:mm A')}
      </TableCell>
      <TableCell>{row?.name}</TableCell>
      <TableCell>{row?.balance}</TableCell>
      <TableCell>{`${row?.addressLine1 ? row?.addressLine1 + ',' : ''} ${
        row?.addressLine2 ? row?.addressLine2 + ',' : ''
      } ${row?.state ? row?.state + ',' : ''} ${
        row?.zipcode ? row?.zipcode + ',' : ''
      }`}</TableCell>
      <TableCell>{row?.country_code}</TableCell>
      <TableCell>{row?.email}</TableCell>
      <TableCell>{row?.businessName}</TableCell>
      <TableCell>{row?.website}</TableCell>
      <TableCell>
        {canEditAffiliateUsers ? (
          <div className={s.rowView}>
            <div className={s.rowView}>
              <input
                className={s.inputStyle}
                type='number'
                name='commission'
                min={0}
                max={100}
                step={0.1}
                value={minCommission}
                onChange={e => {
                  if (canEditAffiliateUsers) {
                    setMinCommission(e?.target?.value);
                  }
                }}
                disabled={!canEditAffiliateUsers}
              />
              <p className={s.percentageStyle}>%</p>
              <div style={{ padding: '0px 10px' }}> - </div>
              <input
                className={s.inputStyle}
                type='number'
                name='commission'
                min={0}
                max={100}
                step={0.1}
                value={maxCommission}
                onChange={e => {
                  if (canEditAffiliateUsers) {
                    setMaxCommission(e?.target?.value);
                  }
                }}
                disabled={!canEditAffiliateUsers}
              />
              <p className={s.percentageStyle}>%</p>
            </div>
            <IconButton
              aria-label='Save commission'
              onClick={() => {
                if (!canEditAffiliateUsers) return;
                if (minCommission === '' || maxCommission === '') {
                  showToast({
                    type: 'errorToast',
                    title: 'Please enter both min and max commission',
                  });
                  return;
                }
                if (Number(minCommission) > Number(maxCommission)) {
                  showToast({
                    type: 'errorToast',
                    title: 'Min commission should be less than max commission',
                  });
                  return;
                }
                onPressSaveCommission({
                  userId: row?._id,
                  affiliate_min_commission: Number(minCommission),
                  affiliate_max_commission: Number(maxCommission),
                });
              }}
              edge='end'
              disabled={!canEditAffiliateUsers}
              sx={{
                '&  .MuiSvgIcon-root': {
                  color: canEditAffiliateUsers ? 'var(--background)' : 'gray',
                },
              }}>
              <Save />
            </IconButton>
          </div>
        ) : (
          `${row?.min_commission || 0}% - ${row?.max_commission || 0}%`
        )}
      </TableCell>
      <TableCell>
        {canEditAffiliateUsers ? (
          <SimpleSelect
            key={'affiliate_user_select_' + row?._id}
            data={AFFILIATE_USER_STATUS_DATA}
            value={AFFILIATE_USER_STATUS_MAP[row?.status]}
            onChange={e => {
              onUpdateStatus?.([
                {
                  status: e?.target?.value,
                  affiliateUserId: row?._id,
                },
              ]);
            }}
          />
        ) : (
          AFFILIATE_USER_STATUS_MAP[row?.status] || ''
        )}
      </TableCell>
      <TableCell>
        {canEditAffiliateUsers ? (
          <AffiliateSelect
            selectedAffiliateUser={row?.affiliate_user_details}
            affiliateUserDetails={affiliateOptions}
            onChangeAffiliate={onChangeAffiliate}
          />
        ) : (
          row?.affiliate_user_details?.name || ''
        )}
      </TableCell>
    </TableRow>
  );
};

export default AffiliateTableRow;
