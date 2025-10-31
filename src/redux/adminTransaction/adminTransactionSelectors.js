export const getAdminTransactionFilter = state =>
  state.adminTransaction.adminTransactionFilters;

export const getAdminTransactionsData = state =>
  state.adminTransaction.adminTransactionsData;

export const isAdminTransactionsFetchedAlready = state =>
  state.adminTransaction.isAdminTransactionsFetchedAlready;

export const isExpandAdminTransactionFilter = state =>
  state.adminTransaction.isExpandAdminTransactionFilter;

export const getIsAdminTransactionsExporting = state =>
  state.adminTransaction.isExporting;
