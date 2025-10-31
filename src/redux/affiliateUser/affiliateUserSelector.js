export const isCreateAffiliateUserLoading = state =>
  state.affiliateUser.isCreateAffiliateUserLoading;
export const isAffiliateUserFetchedAlready = state =>
  state.affiliateUser.isAffiliateUserFetchedAlready;
export const getAffiliateUserListData = state =>
  state.affiliateUser.affiliateUserData;
export const getAffiliateUserFilter = state =>
  state.affiliateUser.affiliateUserFilter;
export const isExpandAffiliateUserFilter = state =>
  state.affiliateUser.isExpandAffiliateUserFilter;
export const getIsAffiliateUserExporting = state =>
  state.affiliateUser.isExporting;
export const isMultiAffiliateUserSelectEnable = state =>
  state.affiliateUser.isMultiAffiliateUserSelectEnable;
export const getSelectedAffiliateUserIds = state =>
  state.affiliateUser.selectedAffiliateUserIds;
export const getAffiliateOptions = state =>
  state?.affiliateUser?.affiliateOptions || [];
