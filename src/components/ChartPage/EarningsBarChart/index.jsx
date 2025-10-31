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
import './EarningsBarChart.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);
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
        <p style={{ margin: 0, color: 'black', fontWeight: 'bold' }}>
          Total: ${total?.toFixed(2)}
        </p>
      </div>
    );
  }

  return null;
};

const EarningsBarChart = ({ data = [], chartFilter }) => {
  const barData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    return data.map(item => ({
      period: item.date,
      kimlcards_fee: Number(item.kimlcards_fee?.toFixed(2)),
      affiliate_commission: Number(item.affiliate_commission?.toFixed(2)),
      total_fee: Number(item.total_fee?.toFixed(2)),
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
        Earnings Distribution Trends (
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
                dataKey='kimlcards_fee'
                name='KimlCards Fee'
                fill='#82ca9d'
              />
              <Bar
                dataKey='affiliate_commission'
                name='Affiliate Commission'
                fill='#8884d8'
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default EarningsBarChart;
