export const isPayoutFetchedAlready = state =>
  state.payout.isPayoutFetchedAlready;

export const getPayoutData = state => state.payout.payoutData;
export const getPayoutFilter = state => state.payout.payoutFilter;

export const isExpandPayoutFilter = state => state.payout.isExpandPayoutFilter;

export const getIsPayoutExporting = state => state.payout.isExporting;
export const isMultiPayoutSelectEnable = state =>
  state.payout.isMultiPayoutSelectEnable;
export const getSelectedPayoutIds = state => state.payout.selectedPayoutIds;
export const getShowEditPayoutModal = state => state.payout.showEditPayoutModal;
export const getIsUpdatingPayout = state => state.payout.isUpdatingPayout;
