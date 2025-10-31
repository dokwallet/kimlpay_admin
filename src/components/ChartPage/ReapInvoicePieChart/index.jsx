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
import styles from './ReapInvoicePieChart.module.css';

const COLORS = ['#4CAF50', '#FF9800'];

const ReapInvoicePieChart = ({ data = {} }) => {
  const pieData = useMemo(
    () => [
      {
        name: 'Total Fees',
        value: Number((data?.total_fees || 0)?.toFixed(2)),
      },
      {
        name: 'Total Revenue',
        value: Number((data?.total_revenue || 0)?.toFixed(2)),
      },
    ],
    [data],
  );

  const isEmpty = pieData.every(item => item.value === 0);

  return (
    <Box className={styles.earningsContainer}>
      <Typography variant='h6' className={styles.earningsTitle}>
        Reap Invoice
      </Typography>
      {isEmpty ? (
        <Typography variant='body2' className={styles.noDataMessage}>
          No reap invoice data available to display
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
            Total : $
            {Number(data?.total_fees + data?.total_revenue || 0)?.toFixed(2)}
          </Typography>
          <Box className={styles.transactionCounts}>
            <Typography variant='body2'>
              Total Fees: {data?.total_fees?.toFixed(2) || 0}
            </Typography>
            <Typography variant='body2'>
              Total Revenue: {data?.total_revenue?.toFixed(2) || 0}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ReapInvoicePieChart;
