/**
 * Business Rules & Constants
 * Centralized business logic values
 */

export const BUSINESS_RULES = {
  // Transaction limits
  MIN_DEPOSIT: 100000,
  MIN_INITIAL_DEPOSIT: 100000,
  MAX_TRANSACTION_AMOUNT: 1000000000,
  
  // Account rules
  MIN_ACCOUNT_BALANCE: 0,
  
  // Validation
  ID_CARD_LENGTH: {
    CMND: 9,
    CCCD: 12
  },
  
  // Interest rates (moved from mock data)
  INTEREST_RATES: {
    NO_TERM: 0.02,      // 2%/year
    THREE_MONTHS: 0.045, // 4.5%/year
    SIX_MONTHS: 0.055,   // 5.5%/year
    TWELVE_MONTHS: 0.065 // 6.5%/year
  },
  
  // Terms
  TERMS: {
    NO_TERM: 0,
    THREE_MONTHS: 3,
    SIX_MONTHS: 6,
    TWELVE_MONTHS: 12
  }
};

export const ACCOUNT_TYPES = {
  NO_TERM: 'no-term',
  THREE_MONTHS: '3-months',
  SIX_MONTHS: '6-months',
  TWELVE_MONTHS: '12-months'
};

export const ACCOUNT_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  SUSPENDED: 'suspended'
};

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  INTEREST: 'interest',
  CLOSE: 'close'
};

export const USER_STATUS = {
  ACTIVE: 'active',
  DISABLED: 'disabled',
  PENDING: 'pending'
};

/**
 * Validation helpers
 */
export const validateIdCard = (idCard) => {
  if (!idCard) return false;
  const length = idCard.length;
  return length === BUSINESS_RULES.ID_CARD_LENGTH.CMND || 
         length === BUSINESS_RULES.ID_CARD_LENGTH.CCCD;
};

export const validateAmount = (amount, min = BUSINESS_RULES.MIN_DEPOSIT) => {
  return amount >= min && amount <= BUSINESS_RULES.MAX_TRANSACTION_AMOUNT;
};

export const formatCurrency = (amount) => {
  return amount?.toLocaleString('vi-VN') || '0';
};

export const calculateInterest = (principal, rate, months) => {
  return principal * rate * (months / 12);
};
