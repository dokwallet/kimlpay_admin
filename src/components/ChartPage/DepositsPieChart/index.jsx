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
import styles from './DepositsPieChart.module.css';

const COLORS = ['#4CAF50', '#FF9800'];

const DepositsPieChart = ({ data = {} }) => {
  const pieData = useMemo(
    () => [
      {
        name: 'Deposit Amount',
        value: Number((data?.deposit_amount || 0)?.toFixed(2)),
      },
      {
        name: 'Withdrawal Amount',
        value: Number((data?.withdrawal_amount || 0)?.toFixed(2)),
      },
    ],
    [data],
  );

  const isEmpty = pieData.every(item => item.value === 0);

  return (
    <Box className={styles.earningsContainer}>
      <Typography variant='h6' className={styles.earningsTitle}>
        Deposit Distribution
      </Typography>
      {isEmpty ? (
        <Typography variant='body2' className={styles.noDataMessage}>
          No deposits data available to display
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
                    `${name}: ${(percent * 100)?.toFixed(0)}%`
                  }>
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={value => [`$${Number(value)?.toFixed(2)}`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          <Typography variant='body1' className={styles.totalFees}>
            Total Deposit: ${Number(data?.total_deposit || 0)?.toFixed(2)}
          </Typography>
          <Box className={styles.transactionCounts}>
            <Typography variant='body2'>
              Deposit Count: {data?.deposit_count || 0}
            </Typography>
            <Typography variant='body2'>
              Withdrawal Count: {data?.withdrawal_count || 0}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default DepositsPieChart;
