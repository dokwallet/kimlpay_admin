import SettingsIcon from '@mui/icons-material/Settings';
import {
  AccountBalanceWallet,
  LocalShipping,
  PeopleAlt,
  Person,
  Paid,
  FilePresent,
  PieChart,
  Link,
} from '@mui/icons-material';
import { HandCoins, Wallet } from 'lucide-react';

export const adminSidebarList = [
  {
    href: '/dashboard/admin/topup',
    label: 'Topup Request',
    icon: <AccountBalanceWallet />,
    permission: 'read_topup',
  },
  {
    href: '/dashboard/admin/shipping',
    label: 'Shipping',
    icon: <LocalShipping />,
    permission: 'read_shipping',
  },
  {
    href: '/dashboard/admin/users',
    label: 'Users',
    icon: <PeopleAlt />,
    permission: 'read_users',
  },
  {
    href: '/dashboard/admin/affiliate-users',
    label: 'Affiliate Users',
    icon: <Person />,
    permission: 'read_affiliate_users',
  },

  {
    href: '/dashboard/admin/link',
    label: 'Link',
    icon: <Link />,
    permission: 'read_links',
  },
  {
    href: '/dashboard/admin/telegram-users',
    label: 'Telegram Users',
    icon: <Link />,
    permission: 'read_telegram_users',
  },

  {
    href: '/dashboard/admin/deposit',
    label: 'Deposits',
    icon: <AccountBalanceWallet />,
    permission: 'read_deposit',
  },
  {
    href: '/dashboard/admin/payout',
    label: 'Payout',
    icon: <HandCoins />,
    permission: 'read_payout',
  },
  {
    href: '/dashboard/admin/transactions',
    label: 'Transactions',
    icon: <Paid />,
    permission: 'read_transactions',
  },
  {
    href: '/dashboard/admin/transaction-files',
    label: 'Transaction Files',
    icon: <FilePresent />,
    permission: 'read_transactions_files',
  },
  {
    href: '/dashboard/admin/charts',
    label: 'Charts',
    icon: <PieChart />,
    permission: 'read_users_chart',
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: <SettingsIcon />,
  },
];
