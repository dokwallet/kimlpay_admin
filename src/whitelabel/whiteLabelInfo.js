let whiteLabelInfo = {};
import favicon from '@/app/favicon.ico';

export const setWhiteLabelInfo = info => {
  whiteLabelInfo = info;
};

export const getAppName = () => {
  return whiteLabelInfo?.name?.toLowerCase() || 'kimlcards';
};

export const getAppTitle = () => {
  return whiteLabelInfo?.title ?? 'Kiml Cards';
};

export const getAppIcon = () => {
  return whiteLabelInfo?.appIcon?.light ?? favicon;
};

export const getAppLogo = () => {
  return whiteLabelInfo?.logo;
};

export const getQuotes = () => {
  return whiteLabelInfo?.quotes || [];
};

export const getVideos = () => {
  return whiteLabelInfo?.videos || [];
};
export const getScheduleMaintenance = () => {
  return whiteLabelInfo?.schedule_maintenance || {};
};
