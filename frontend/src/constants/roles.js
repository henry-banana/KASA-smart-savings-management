export const ROLES = {
  TELLER: "teller",
  ACCOUNTANT: "accountant",
  ADMIN: "admin",
};

export const ROLE_LABELS = {
  [ROLES.TELLER]: "Teller",
  [ROLES.ACCOUNTANT]: "Accountant",
  [ROLES.ADMIN]: "Administrator",
};

export const ROLE_PERMISSIONS = {
  [ROLES.TELLER]: [
    "view_dashboard",
    "open_account",
    "deposit",
    "withdraw",
    "search_accounts",
  ],
  [ROLES.ACCOUNTANT]: [
    "view_dashboard",
    "search_accounts",
    "daily_report",
    "monthly_report",
  ],
  [ROLES.ADMIN]: ["regulations", "user_management"],
};
