export const getAdminTelegramUserFilter = state =>
  state.adminTelegramUser.adminTelegramUserFilters;

export const getAdminTelegramUsersData = state =>
  state.adminTelegramUser.adminTelegramUsersData;

export const isAdminTelegramUsersFetchedAlready = state =>
  state.adminTelegramUser.isAdminTelegramUsersFetchedAlready;

export const isExpandAdminTelegramUserFilter = state =>
  state.adminTelegramUser.isExpandAdminTelegramUserFilter;

export const getIsAdminTelegramUsersExporting = state =>
  state.adminTelegramUser.isExporting;
