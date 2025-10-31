import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#FF8042'];

const UsersPieChart = ({ data = {} }) => {
  const pieData = useMemo(
    () => [
      { name: 'KYC Verified', value: data?.kyc_verified || 0 },
      { name: 'KYC Unverified', value: data?.kyc_unverified || 0 },
    ],
    [data],
  );

  const isEmpty = pieData.every(item => item.value === 0);

  return (
    <Box>
      <Typography variant='h6' align='center' gutterBottom>
        KYC Verification Status
      </Typography>
      {isEmpty ? (
        <Typography
          variant='body2'
          align='center'
          mt={4}
          sx={{ padding: '40px 0', color: 'red' }}>
          No data available to display
        </Typography>
      ) : (
        <>
          <Box height={300}>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={pieData}
                  cx='50%'
                  cy='50%'
                  outerRadius={100}
                  fill='#8884d8'
                  dataKey='value'
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }>
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={value => [`${value} users`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Typography variant='body1' align='center' mt={2}>
            Total Users: {data?.total || 0}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default UsersPieChart;
