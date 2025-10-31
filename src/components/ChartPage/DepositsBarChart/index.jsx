import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './DepositsBarChart.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const deposit =
      payload.find(entry => entry.dataKey === 'deposit_amount')?.value || 0;
    const withdrawal =
      payload.find(entry => entry.dataKey === 'withdrawal_amount')?.value || 0;
    const total = deposit - withdrawal;
    const depositCount = payload[0]?.payload?.deposit_count || 0;
    const withdrawalCount = payload[0]?.payload?.withdrawal_count || 0;

    return (
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
        }}>
        <p style={{ margin: 0, color: 'black' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: 0, color: entry.color }}>
            {entry.name}: ${Number(entry.value)?.toFixed(2)}
          </p>
        ))}
        <p style={{ margin: 0, color: 'black' }}>
          Deposit Count: {depositCount}
        </p>
        <p style={{ margin: 0, color: 'black' }}>
          Withdrawal Count: {withdrawalCount}
        </p>
        <p style={{ margin: 0, color: 'black', fontWeight: 'bold' }}>
          Total: ${total?.toFixed(2)}
        </p>
      </div>
    );
  }

  return null;
};

const DepositsBarChart = ({ data = [], chartFilter }) => {
  const barData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    return data.map(item => ({
      period: item.date,
      deposit_amount: Number(item.deposit_amount?.toFixed(2)),
      withdrawal_amount: Number(item.withdrawal_amount?.toFixed(2)),
      total_amount: Number(item.net_amount?.toFixed(2)),
      deposit_count: item.deposit_count || 0,
      withdrawal_count: item.withdrawal_count || 0,
    }));
  }, [data]);

  const isEmpty = barData.length === 0;

  return (
    <Box>
      <Typography
        variant='h6'
        align='center'
        sx={{ marginTop: '20px', color: 'var(--font)' }}
        gutterBottom>
        Deposits Distribution Trends (
        {chartFilter?.type === 'daily' ? 'Daily' : 'Monthly'})
      </Typography>

      {isEmpty ? (
        <Typography
          variant='body2'
          align='center'
          sx={{ padding: '80px 0', color: 'red' }}>
          No data available to display
        </Typography>
      ) : (
        <Box height={300}>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={barData}
              margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='period'
                angle={-45}
                textAnchor='end'
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey='deposit_amount'
                name='Deposit Amount'
                fill='#82ca9d'
              />
              <Bar
                dataKey='withdrawal_amount'
                name='Withdrawal Amount'
                fill='#8884d8'
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default DepositsBarChart;
