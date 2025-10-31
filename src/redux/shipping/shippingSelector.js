export const isShippingLoading = state => state.shipping.isShippingLoading;
export const getShippingData = state => state.shipping.shippings;
export const isShippingSubmitting = state =>
  state.shipping.isShippingSubmitting;

export const isShippingFetchedAlready = state =>
  state.shipping.isShippingFetchedAlready;

export const getShippingListData = state => state.shipping.shippingData;
export const getShippingFilter = state => state.shipping.shippingFilter;

export const isExpandShippingFilter = state =>
  state.shipping.isExpandShippingFilter;

export const getIsShippingExporting = state => state.shipping.isExporting;

export const isMultiShippingSelectEnable = state =>
  state.shipping.isMultiShippingSelectEnable;
export const getSelectedShippingIds = state =>
  state.shipping.selectedShippingIds;
