const adminRoutes = [
  { path: '/dashboard/admin/topup', permission: 'read_topup' },
  { path: '/dashboard/admin/shipping', permission: 'read_shipping' },
  { path: '/dashboard/admin/users', permission: 'read_users' },
  {
    path: '/dashboard/admin/affiliate-users',
    permission: 'read_affiliate_users',
  },
  { path: '/dashboard/admin/transactions', permission: 'read_transactions' },
  { path: '/dashboard/admin/link', permission: 'read_links' },
  {
    path: '/dashboard/admin/transaction-files',
    permission: 'read_transactions_files',
  },
  {
    path: '/dashboard/admin/deposit',
    permission: 'read_deposit',
  },
  {
    path: '/dashboard/admin/payout',
    permission: 'read_payout',
  },
  {
    path: '/dashboard/admin/charts',
    permission: 'read_users_chart',
  },
];

export default adminRoutes;
