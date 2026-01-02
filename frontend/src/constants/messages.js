export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Cannot connect to server",
  AUTH_ERROR: "Session expired",
  PERMISSION_ERROR: "You do not have permission to access",
  NOT_FOUND: "Data not found",
  SERVER_ERROR: "Server error",
  VALIDATION_ERROR: "Invalid data",
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  ACCOUNT_CREATED: "Savings account opened successfully",
  DEPOSIT_SUCCESS: "Deposit successful",
  WITHDRAW_SUCCESS: "Withdrawal successful",
};

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  MIN_AMOUNT: (min) => `Minimum amount: ${min.toLocaleString("vi-VN")} VND`,
  INVALID_ID_CARD: "Invalid ID card number",
};
