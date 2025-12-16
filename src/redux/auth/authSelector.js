export const isSigning = state => state.auth.isSigning;
export const getPublicAffiliateUsers = state =>
  state.auth?.publicAffiliateUsers;
export const getSelectedPublicAffiliateUser = state =>
  state.auth?.selectedPublicAffiliateUser;

export const getIsLoadingPublicAffiliate = state =>
  state.auth?.isLoadingPublicAffiliate;
