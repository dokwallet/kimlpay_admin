export const isReduxStoreLoaded = state => state.extraData.isReduxStoreLoaded;
export const getRouteStateData = state => state.extraData.routeStateData;
export const isSidebarCollapsed = state => state.extraData.isSidebarCollapsed;
export const getShowScheduleMaintenance = state =>
  state.extraData.showScheduleMaintenance;
export const getPreviousRouteParams = state =>
  state.extraData.previousRouteParams;
