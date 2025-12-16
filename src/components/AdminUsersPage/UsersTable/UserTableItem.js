import React, { useCallback, useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import SimpleSelect from '@/components/SimpleSelect';
import {
  USER_STATUS_DATA,
  USER_STATUS_MAP,
  validateNumber,
} from '@/utils/helper';
import TableEditField from '@/components/TableEditField';

const UserTableItem = ({
  item,
  index,
  isUserTab,
  onUpdateStatus,
  onPressSaveCommission,
  canEdit,
}) => {
  const [state, setState] = useState({
    affiliate_topup_commission:
      item?.affiliate_topup_commission?.toString() ?? '',
    master_affiliate_topup_commission:
      item?.master_affiliate_topup_commission?.toString() ?? '',
    topup_fee: item?.topup_fee?.toString() ?? '',
    platform_fee: item?.platform_fee?.toString() ?? '',
  });
  const dispatch = useDispatch();

  const onChangePlateFormFee = useCallback(e => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    const valueNumber = validateNumber(value);
    setState(prevState => ({ ...prevState, [name]: valueNumber }));
  }, []);

  const onSave = useCallback(
    type => {
      const { platform_fee } = state;
      const payload = {
        user_id: item?._id,
      };
      if (type === 'platform_fee') {
        payload.platform_fee = Number(platform_fee);
      }
      onPressSaveCommission(payload);
    },
    [item?._id, onPressSaveCommission, state],
  );
  return (
    <TableRow key={index} hover>
      <TableCell>
        {dayjs(item?.createdAt).format('DD MMM YYYY hh:mm A')}
      </TableCell>
      <TableCell>{`${item?.first_name} ${item?.last_name}`}</TableCell>
      <TableCell>{`${item?.email}`}</TableCell>
      {isUserTab && (
        <>
          <TableCell>
            {canEdit ? (
              <TableEditField
                type='number'
                name='platform_fee'
                min={0}
                max={100}
                step={0.1}
                value={state.platform_fee}
                onChange={onChangePlateFormFee}
                onSave={() => onSave('platform_fee')}
              />
            ) : (
              `${item?.platform_fee || 0}%`
            )}
          </TableCell>
        </>
      )}

      <TableCell>
        {canEdit ? (
          <SimpleSelect
            key={'user_select_' + item?._id}
            data={isUserTab ? USER_STATUS_DATA : USER_STATUS_DATA}
            value={USER_STATUS_MAP[item?.status]}
            onChange={e => {
              onUpdateStatus?.([
                {
                  status: e?.target?.value,
                  userId: item?._id,
                },
              ]);
            }}
          />
        ) : (
          USER_STATUS_MAP[item?.status] || '-'
        )}
      </TableCell>
    </TableRow>
  );
};

export default UserTableItem;
