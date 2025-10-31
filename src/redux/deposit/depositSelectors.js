export const isDepositFetchedAlready = state =>
  state.deposit.isDepositFetchedAlready;

export const getDepositData = state => state.deposit.depositData;
export const getDepositFilter = state => state.deposit.depositFilter;

export const isExpandDepositFilter = state =>
  state.deposit.isExpandDepositFilter;

export const getIsDepositExporting = state => state.deposit.isExporting;
export const isMultiDepositSelectEnable = state =>
  state.deposit.isMultiDepositSelectEnable;
export const getSelectedDepositIds = state => state.deposit.selectedDepositIds;
