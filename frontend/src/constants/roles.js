export const ROLES = {
  TELLER: 'teller',
  ACCOUNTANT: 'accountant',
  ADMIN: 'admin'
};

export const ROLE_LABELS = {
  [ROLES.TELLER]: 'Giao Dịch Viên',
  [ROLES.ACCOUNTANT]: 'Kế Toán',
  [ROLES.ADMIN]: 'Quản Trị Viên'
};

export const ROLE_PERMISSIONS = {
  [ROLES.TELLER]: [
    'view_dashboard',
    'open_account',
    'deposit',
    'withdraw',
    'search_accounts'
  ],
  [ROLES.ACCOUNTANT]: [
    'view_dashboard',
    'search_accounts',
    'daily_report',
    'monthly_report'
  ],
  [ROLES.ADMIN]: [
    'view_dashboard',
    'open_account',
    'deposit',
    'withdraw',
    'search_accounts',
    'daily_report',
    'monthly_report',
    'regulations',
    'user_management'
  ]
};
