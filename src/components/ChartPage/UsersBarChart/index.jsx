import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './UsersBarChart.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
        }}>
        <p style={{ margin: 0, color: 'black' }}>{label}</p>
        <p style={{ margin: 0, color: 'black' }}>
          Registration: {payload[0].value} users
        </p>
      </div>
    );
  }

  return null;
};

const UsersBarChart = ({ data = {}, chartFilter }) => {
  const barData = useMemo(
    () =>
      Object.entries(data).map(([period, count]) => ({
        period,
        users: count,
      })),
    [data],
  );

  const isEmpty =
    barData.length === 0 || barData.every(item => item.users === 0);

  return (
    <Box>
      <Typography
        variant='h6'
        align='center'
        sx={{ marginTop: '20px' }}
        gutterBottom>
        User Registration Trends (
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
              <Bar dataKey='users' fill='#8884d8' />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default UsersBarChart;
