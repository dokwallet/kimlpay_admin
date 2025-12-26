export const getAdminPaymentWithdrawalsFilter = state =>
  state.adminPaymentWithdrawals.adminPaymentWithdrawalsFilters;

export const getAdminPaymentWithdrawalsData = state =>
  state.adminPaymentWithdrawals.adminPaymentWithdrawalsData;

export const isAdminPaymentWithdrawalsFetchedAlready = state =>
  state.adminPaymentWithdrawals.isAdminPaymentWithdrawalsFetchedAlready;

export const isExpandAdminPaymentWithdrawalsFilter = state =>
  state.adminPaymentWithdrawals.isExpandAdminPaymentWithdrawalsFilter;

export const getIsAdminPaymentWithdrawalsExporting = state =>
  state.adminPaymentWithdrawals.isExporting;

export const getShowEditWithdrawalModal = state =>
  state.adminPaymentWithdrawals.showWithdrawalEditModal;

export const getIsUpdatingWithdrawal = state =>
  state.adminPaymentWithdrawals.isUpdatingWithdrawal;
