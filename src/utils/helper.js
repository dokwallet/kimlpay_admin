import dayjs from 'dayjs';
import {
  Email,
  Groups,
  LocalOffer,
  Password,
  Person,
  Phone,
  Security,
  VideoLibrary,
  QuestionAnswerTwoTone,
} from '@mui/icons-material';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { Lock, Mail, ShieldCheck, User } from 'lucide-react';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export function maskPath(path) {
  return path.replace(/\/([^\/]*)$/, '/*');
}

export const createQueryString = (urlSearchParams, newObj = {}) => {
  const params = new URLSearchParams(urlSearchParams);
  Object.keys(newObj).map(item => {
    if (newObj[item]) {
      params.set(item, newObj[item]);
    }
  });
  return params.toString();
};

export const getCurrencySymbol = code => {
  const currency = {
    840: {
      currency_code: 'USD',
      symbol: '$',
      country: 'United States',
    },
    978: {
      currency_code: 'EUR',
      symbol: '€',
      country: 'European Union',
    },
    826: {
      currency_code: 'GBP',
      symbol: '£',
      country: 'United Kingdom',
    },
    392: {
      currency_code: 'JPY',
      symbol: '¥',
      country: 'Japan',
    },
    36: {
      currency_code: 'AUD',
      symbol: 'A$',
      country: 'Australia',
    },
    124: {
      currency_code: 'CAD',
      symbol: 'C$',
      country: 'Canada',
    },
    756: {
      currency_code: 'CHF',
      symbol: 'CHF',
      country: 'Switzerland',
    },
    156: {
      currency_code: 'CNY',
      symbol: '¥',
      country: 'China',
    },
    752: {
      currency_code: 'SEK',
      symbol: 'kr',
      country: 'Sweden',
    },
    554: {
      currency_code: 'NZD',
      symbol: 'NZ$',
      country: 'New Zealand',
    },
    484: {
      currency_code: 'MXN',
      symbol: '$',
      country: 'Mexico',
    },
    702: {
      currency_code: 'SGD',
      symbol: 'S$',
      country: 'Singapore',
    },
    344: {
      currency_code: 'HKD',
      symbol: 'HK$',
      country: 'Hong Kong',
    },
    578: {
      currency_code: 'NOK',
      symbol: 'kr',
      country: 'Norway',
    },
    410: {
      currency_code: 'KRW',
      symbol: '₩',
      country: 'South Korea',
    },
    949: {
      currency_code: 'TRY',
      symbol: '₺',
      country: 'Turkey',
    },
    643: {
      currency_code: 'RUB',
      symbol: '₽',
      country: 'Russia',
    },
    356: {
      currency_code: 'INR',
      symbol: '₹',
      country: 'India',
    },
    986: {
      currency_code: 'BRL',
      symbol: 'R$',
      country: 'Brazil',
    },
    710: {
      currency_code: 'ZAR',
      symbol: 'R',
      country: 'South Africa',
    },
    208: {
      currency_code: 'DKK',
      symbol: 'kr',
      country: 'Denmark',
    },
    985: {
      currency_code: 'PLN',
      symbol: 'zł',
      country: 'Poland',
    },
    764: {
      currency_code: 'THB',
      symbol: '฿',
      country: 'Thailand',
    },
    360: {
      currency_code: 'IDR',
      symbol: 'Rp',
      country: 'Indonesia',
    },
    348: {
      currency_code: 'HUF',
      symbol: 'Ft',
      country: 'Hungary',
    },
    203: {
      currency_code: 'CZK',
      symbol: 'Kč',
      country: 'Czech Republic',
    },
    376: {
      currency_code: 'ILS',
      symbol: '₪',
      country: 'Israel',
    },
    152: {
      currency_code: 'CLP',
      symbol: '$',
      country: 'Chile',
    },
    608: {
      currency_code: 'PHP',
      symbol: '₱',
      country: 'Philippines',
    },
    784: {
      currency_code: 'AED',
      symbol: 'د.إ',
      country: 'United Arab Emirates',
    },
    170: {
      currency_code: 'COP',
      symbol: '$',
      country: 'Colombia',
    },
    682: {
      currency_code: 'SAR',
      symbol: '﷼',
      country: 'Saudi Arabia',
    },
    458: {
      currency_code: 'MYR',
      symbol: 'RM',
      country: 'Malaysia',
    },
    946: {
      currency_code: 'RON',
      symbol: 'lei',
      country: 'Romania',
    },
  };

  return (
    currency[code] || {
      currency_code: 'Unknown',
      symbol: 'Unknown',
      country: 'Unknown',
    }
  );
};

export const USER_TABS = ['USER', 'ADMIN-USER'];

export const VALID_LIMIT = [10, 25, 50, 100];

export function validateNumber(number) {
  const validNumber = Number(number);
  return isNaN(validNumber) ? null : validNumber;
}

export const getUserTimezoneOffset = () => {
  const offset = new Date().getTimezoneOffset();
  const sign = offset <= 0 ? '+' : '-';
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (absOffset % 60).toString().padStart(2, '0');
  return `UTC ${sign}${hours}:${minutes}`;
};

export const formatStartDate = (date, isForRoute = false) => {
  const dt = dayjs(date ? date : null);
  if (dt.isValid()) {
    if (isForRoute) {
      return dt.format('YYYY-MM-DD');
    }
    return dt.set('hour', 0).set('minute', 0).set('second', 0).toISOString();
  }
  return null;
};

export const formatEndDate = (date, isForRoute = false) => {
  const dt = dayjs(date ? date : null);
  if (dt.isValid()) {
    if (isForRoute) {
      return dt.format('YYYY-MM-DD');
    }
    return dt.set('hour', 23).set('minute', 59).set('second', 59).toISOString();
  }
  return null;
};

export const getFilenameFromUrl = url => {
  return url.split('#')[0].split('?')[0].split('/').pop();
};

export const TOPUP_STATUS_DATA = [
  {
    label: 'Pending',
    value: 'PENDING',
  },
  {
    label: 'Approved',
    value: 'APPROVED',
  },
  {
    label: 'Rejected',
    value: 'REJECTED',
  },
];

export const TOPUP_STATUS_MAP = {
  1: 'PENDING',
  2: 'APPROVED',
  3: 'REJECTED',
};

export const USER_STATUS_DATA = [
  {
    label: 'Active',
    value: 'ACTIVE',
  },
  {
    label: 'Blocked',
    value: 'BLOCKED',
  },
  {
    label: 'Pending',
    value: 'PENDING',
  },
];

export const USER_STATUS_MAP = {
  active: 'ACTIVE',
  blocked: 'BLOCKED',
  pending: 'PENDING',
  1: 'ACTIVE',
  2: 'BLOCKED',
  3: 'PENDING',
};

export const ADMIN_TRANSACTION_STATUS_MAP = [
  {
    label: 'success',
    value: 'SUCCESS',
  },
  {
    label: 'failed',
    value: 'FAILED',
  },
];
export const ADMIN_LINK_STATUS_MAP = [
  {
    label: 'active',
    value: 'active',
  },
  {
    label: 'inactive',
    value: 'inactive',
  },
];

export const ADMIN_TRANSACTION_STATUS_DATA = [
  {
    label: 'Pending',
    value: 'PENDING',
  },
  {
    label: 'Cleared',
    value: 'CLEARED',
  },
  {
    label: 'Declined',
    value: 'DECLINED',
  },
  {
    label: 'Void',
    value: 'VOID',
  },
];

export const SHIPPING_STATUS_DATA = [
  {
    label: 'In Review',
    value: 'IN-REVIEW',
  },
  {
    label: 'Dispatch',
    value: 'DISPATCH',
  },
  {
    label: 'Shipped',
    value: 'SHIPPED',
  },
];

export const TRANSACTION_FILE_TYPE_DATA = [
  {
    label: 'DAILY FILE',
    value: 'DAILY_FILE',
  },
  {
    label: 'Fee file',
    value: 'FEE_FILE',
  },
];

export const CHART_TYPE = [
  {
    label: 'MONTHLY',
    value: 'monthly',
  },
  {
    label: 'DAILY',
    value: 'daily',
  },
];

export const SHIPPING_STATUS_MAP = {
  1: 'IN-REVIEW',
  2: 'DISPATCH',
  3: 'SHIPPED',
};

export const AFFILIATE_USER_STATUS_DATA = [
  {
    label: 'Active',
    value: 'ACTIVE',
  },
  {
    label: 'Blocked',
    value: 'BLOCKED',
  },
  {
    label: 'Requested',
    value: 'REQUESTED',
  },
];

export const AFFILIATE_USER_STATUS_MAP = {
  1: 'ACTIVE',
  2: 'BLOCKED',
  3: 'REQUESTED',
};

export const VALID_TOP_STATUS = ['PENDING', 'APPROVED', 'REJECTED'];
export const VALID_TRANSACTION_FILE_TYPE = ['DAILY_FILE', 'FEE_FILE'];

export const VALID_USERS_STATUS = ['ACTIVE', 'BLOCKED', 'PENDING'];
export const ADMIN_LINK_STATUS = ['ACTIVE', 'INACTIVE'];

export const VALID_SHIPPING_STATUS = ['IN-REVIEW', 'DISPATCH', 'SHIPPED'];
export const VALID_ADMIN_PAYMENT_STATUS = ['pending', 'approved', 'rejected'];

export const VALID_AFFILIATE_USER_STATUS = [
  'BLOCKED',
  'ACTIVE',
  'INACTIVE',
  'REQUESTED',
];
export const VALID_USERS_CHART_TYPE = ['daily', 'monthly'];

export const SETTINGS_DATA = [
  {
    key: 'profile_settings',
    title: 'Profile Settings',
    icon: <User />,
  },
  {
    key: 'change_password',
    title: 'Change Password',
    icon: <Lock />,
  },
  {
    key: 'change_email',
    title: 'Change Email',
    icon: <Mail />,
  },
  {
    key: '2_fa',
    title: '2-FA',
    icon: <ShieldCheck />,
  },
];

export const isValidURL = url => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export function isValidObject(obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

export const TwoFaMethod = [
  {
    label: 'Passkey',
    value: 'PASSKEY',
  },
  {
    label: 'Authenticator App',
    value: 'AUTHENTICATOR',
  },
];

export const PAYOUT_STATUS_MAP = {
  1: 'PENDING',
  2: 'APPROVED',
  3: 'REJECTED',
};

export const WITHDRAWALS_STATUS_DATA = [
  {
    label: 'PENDING',
    value: 'pending',
  },
  {
    label: 'APPROVED',
    value: 'approved',
  },
];
