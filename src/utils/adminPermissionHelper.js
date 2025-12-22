const adminRoutes = [
  { path: '/dashboard/admin/users', permission: 'read_users' },
  { path: '/dashboard/admin/link', permission: 'read_links' },
  { path: '/dashboard/admin/transactions', permission: 'read_transactions' },
  { path: '/dashboard/admin/withdrawals', permission: 'read_withdrawals' },
  {
    path: '/dashboard/admin/telegram-users',
    permission: 'read_telegram_users',
  },
];

export default adminRoutes;
