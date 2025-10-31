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
import Checkbox from '@/components/Checkbox';
import { toggleSelectedUserIds, updateUser } from '@/redux/user/userSlice';
import AffiliateSelect from '@/components/AffiliateSelect';
import TableEditField from '@/components/TableEditField';

const UserTableItem = ({
  item,
  index,
  isUserTab,
  affiliateOptions,
  onUpdateStatus,
  onPressSaveCommission,
  isMultiUserSelect,
  selectedUserId,
  isKycDone,
  canEdit,
}) => {
  const [state, setState] = useState({
    affiliate_topup_commission:
      item?.affiliate_topup_commission?.toString() ?? '',
    master_affiliate_topup_commission:
      item?.master_affiliate_topup_commission?.toString() ?? '',
    topup_fee: item?.topup_fee?.toString() ?? '',
  });
  const dispatch = useDispatch();

  const onChangeAffiliate = useCallback(
    value => {
      if (value?.id === item?.affiliate_user_details?._id) {
        return;
      }
      dispatch(
        updateUser({
          userId: item?._id,
          affiliate_user_id: value?.id,
        }),
      );
    },
    [dispatch, item?._id, item?.affiliate_user_details?._id],
  );

  const onChangeTopupFee = useCallback(e => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    const valueNumber = validateNumber(value);
    setState(prevState => ({ ...prevState, [name]: valueNumber }));
  }, []);

  const onSave = useCallback(
    type => {
      const {
        affiliate_topup_commission,
        master_affiliate_topup_commission,
        topup_fee,
      } = state;
      const payload = {
        user_id: item?._id,
      };
      if (type === 'affiliate_topup_commission') {
        payload.affiliate_topup_commission = Number(affiliate_topup_commission);
      } else if (type === 'master_affiliate_topup_commission') {
        payload.master_affiliate_topup_commission = Number(
          master_affiliate_topup_commission,
        );
      } else if (type === 'topup_fee') {
        payload.topup_fee = Number(topup_fee);
      }
      onPressSaveCommission(payload);
    },
    [item?._id, onPressSaveCommission, state],
  );

  return (
    <TableRow key={index} hover>
      {isMultiUserSelect && (
        <TableCell>
          <Checkbox
            onChange={() => {
              dispatch(toggleSelectedUserIds(item?._id));
            }}
            checked={!!selectedUserId[item?._id]}
          />
        </TableCell>
      )}
      <TableCell>
        {dayjs(item?.createdAt).format('DD MMM YYYY hh:mm A')}
      </TableCell>
      <TableCell>{`${item?.first_name} ${item?.last_name}`}</TableCell>
      <TableCell>{item?.email}</TableCell>
      <TableCell>{item?.country_code}</TableCell>
      {isUserTab && <TableCell>{isKycDone}</TableCell>}
      {isUserTab && (
        <TableCell>
          {canEdit ? (
            <AffiliateSelect
              selectedAffiliateUser={item.affiliate_user_details}
              affiliateUserDetails={affiliateOptions}
              onChangeAffiliate={onChangeAffiliate}
            />
          ) : (
            item.affiliate_user_details?.name || '-'
          )}
        </TableCell>
      )}
      {isUserTab && (
        <TableCell>{item.master_affiliate_user_details?.name || '-'}</TableCell>
      )}
      <TableCell>
        {canEdit ? (
          <SimpleSelect
            key={'user_select_' + item?._id}
            data={USER_STATUS_DATA}
            value={USER_STATUS_DATA[item?.status]}
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
      {isUserTab && (
        <>
          <TableCell>
            {canEdit ? (
              <TableEditField
                type='number'
                name='topup_fee'
                min={0}
                max={100}
                step={0.1}
                value={state.topup_fee}
                onChange={onChangeTopupFee}
                onSave={() => onSave('topup_fee')}
              />
            ) : (
              `${item?.topup_fee || 0}%`
            )}
          </TableCell>
          <TableCell>
            {canEdit ? (
              <TableEditField
                type='number'
                name='affiliate_topup_commission'
                min={0}
                max={100}
                step={0.1}
                value={state.affiliate_topup_commission}
                onChange={onChangeTopupFee}
                onSave={() => onSave('affiliate_topup_commission')}
              />
            ) : (
              `${item?.affiliate_topup_commission || 0}%`
            )}
          </TableCell>
          <TableCell>
            {canEdit ? (
              <TableEditField
                type='number'
                name='master_affiliate_topup_commission'
                min={0}
                max={100}
                step={0.1}
                value={state.master_affiliate_topup_commission}
                onChange={onChangeTopupFee}
                onSave={() => onSave('master_affiliate_topup_commission')}
              />
            ) : (
              `${item?.master_affiliate_topup_commission || 0}%`
            )}
          </TableCell>
          <TableCell>{`${item?.total_topup_fee || 0}%`}</TableCell>
        </>
      )}
    </TableRow>
  );
};

export default UserTableItem;
