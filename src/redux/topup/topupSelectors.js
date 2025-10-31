export const isTopupFetchedAlready = state => state.topup.isTopupFetchedAlready;

export const getTopupData = state => state.topup.topupData;
export const getTopupFilter = state => state.topup.topupFilter;

export const isExpandTopupFilter = state => state.topup.isExpandTopupFilter;

export const getIsTopupExporting = state => state.topup.isExporting;
export const isMultiTopupSelectEnable = state =>
  state.topup.isMultiTopupSelectEnable;
export const getSelectedTopupIds = state => state.topup.selectedTopupIds;
