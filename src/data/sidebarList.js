import SettingsIcon from '@mui/icons-material/Settings';
import { PeopleAlt, Paid, Link } from '@mui/icons-material';

export const adminSidebarList = [
  {
    href: '/dashboard/admin/users',
    label: 'Users',
    icon: <PeopleAlt />,
    permission: 'read_users',
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
    href: '/dashboard/admin/transactions',
    label: 'Transactions',
    icon: <Paid />,
    permission: 'read_transactions',
  },

  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: <SettingsIcon />,
  },
];
