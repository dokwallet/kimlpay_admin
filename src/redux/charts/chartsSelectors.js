export const isUsersChartFetchedAlready = state =>
  state.charts.isUsersChartFetchedAlready;

export const isEarningsChartFetchedAlready = state =>
  state.charts.isEarningsChartFetchedAlready;

export const getKycChartData = state => state.charts.kycChartData;

export const getEarningsChartData = state => state.charts.earningsChartData;

export const getChartFilter = state => state.charts.chartFilter;

export const getDepositChartData = state => state.charts.depositChartData;

export const isDepositChartFetchedAlready = state =>
  state.charts.isDepositChartFetchedAlready;

export const isReapInvoiceChartFetchedAlready = state =>
  state.charts.isReapInvoiceChartFetchedAlready;
export const getReapInvoiceChartData = state =>
  state.charts.reapInvoiceChartData;
