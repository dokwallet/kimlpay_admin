'use client';
import React, { useCallback, useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import Checkbox from '@/components/Checkbox';
import dayjs from 'dayjs';
import { validateNumber } from '@/utils/helper';
import TableEditField from '@/components/TableEditField';
import s from './DepositTable.module.css';

const DepositTableItem = ({
  isMultiDepositSelect,
  item,
  onSelectChange,
  selectedDepositId,
  canEdit,
  onPressSaveDepositCommission,
}) => {
  const [state, setState] = useState({
    fee_percentage: item?.fee_percentage?.toString() ?? '',
    master_affiliate_commission_percentage:
      item?.master_affiliate_commission_percentage?.toString() ?? '',
    affiliate_commission_percentage:
      item?.affiliate_commission_percentage?.toString() ?? '',
  });

  const onChangeTopupFee = useCallback(e => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    const valueNumber = validateNumber(value);
    setState(prevState => ({ ...prevState, [name]: valueNumber }));
  }, []);

  const onSave = useCallback(
    type => {
      const {
        fee_percentage,
        master_affiliate_commission_percentage,
        affiliate_commission_percentage,
      } = state;
      const finalPayload = {};
      if (type === 'fee_percentage') {
        finalPayload.fee_percentage = Number(fee_percentage);
      } else if (type === 'master_affiliate_commission_percentage') {
        finalPayload.master_affiliate_commission_percentage = Number(
          master_affiliate_commission_percentage,
        );
      } else if (type === 'affiliate_commission_percentage') {
        finalPayload.affiliate_commission_percentage = Number(
          affiliate_commission_percentage,
        );
      }
      onPressSaveDepositCommission({
        deposit_id: item?._id,
        ...finalPayload,
      });
    },
    [item?._id, onPressSaveDepositCommission, state],
  );

  const {
    affiliate_commission_percentage,
    fee_percentage,
    master_affiliate_commission_percentage,
  } = state;
  return (
    <TableRow hover>
      {isMultiDepositSelect && (
        <TableCell>
          <Checkbox
            onChange={onSelectChange}
            checked={!!selectedDepositId[item?._id]}
          />
        </TableCell>
      )}
      <TableCell>{item?._id}</TableCell>
      <TableCell>
        {dayjs(item?.createdAt).format('DD MMM YYYY hh:mm A')}
      </TableCell>
      <TableCell>{`${item?.user_details?.first_name || ''} ${item?.user_details?.last_name || ''}`}</TableCell>
      <TableCell>{item?.card_id}</TableCell>
      <TableCell>{item?.amount}</TableCell>
      <TableCell>{item?.total_amount}</TableCell>
      <TableCell>
        <div className={s.rowView}>
          {`$${item?.fee_amount ?? ''}`}
          <TableEditField
            type='number'
            name='fee_percentage'
            min={0}
            max={100}
            step={0.1}
            value={fee_percentage}
            onChange={onChangeTopupFee}
            onSave={() => onSave('fee_percentage')}
          />
        </div>
      </TableCell>
      <TableCell>
        <div className={s.rowView}>
          {`$${item?.affiliate_commission_amount ?? ''}`}
          <TableEditField
            type='number'
            name='affiliate_commission_percentage'
            min={0}
            max={100}
            step={0.1}
            value={affiliate_commission_percentage}
            onChange={onChangeTopupFee}
            onSave={() => onSave('affiliate_commission_percentage')}
          />
        </div>
      </TableCell>
      <TableCell>
        <div className={s.rowView}>
          {`$${item?.master_affiliate_commission_amount ?? ''}`}
          <TableEditField
            type='number'
            name='master_affiliate_commission_percentage'
            min={0}
            max={100}
            step={0.1}
            value={master_affiliate_commission_percentage}
            onChange={onChangeTopupFee}
            onSave={() => onSave('master_affiliate_commission_percentage')}
          />
        </div>
      </TableCell>
      <TableCell>
        {`$${item?.total_fee_amount ?? ''} (${item?.total_fee_percentage}%)`}
      </TableCell>
      <TableCell>{item?.affiliate_user_details?.name || '-'}</TableCell>
      <TableCell>{item?.master_affiliate_user_details?.name || '-'}</TableCell>
    </TableRow>
  );
};
export default DepositTableItem;
