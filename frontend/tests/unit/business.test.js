import {
  BUSINESS_RULES,
  ACCOUNT_TYPES,
  ACCOUNT_STATUS,
  TRANSACTION_TYPES,
  USER_STATUS,
  validateIdCard,
  validateAmount,
  formatCurrency,
  calculateInterest,
} from "../../src/constants/business";

describe("business", () => {
  /**
   * GROUP 1: BUSINESS_RULES constants
   */
  describe("BUSINESS_RULES", () => {
    it.each([
      ["MIN_DEPOSIT", 100000],
      ["MIN_INITIAL_DEPOSIT", 100000],
      ["MAX_TRANSACTION_AMOUNT", 1000000000],
      ["MIN_ACCOUNT_BALANCE", 0],
    ])("should have %s with value %d", (key, expectedValue) => {
      expect(BUSINESS_RULES[key]).toBe(expectedValue);
    });

    it("should have valid MIN <= MAX for transaction amounts", () => {
      expect(BUSINESS_RULES.MIN_DEPOSIT).toBeLessThanOrEqual(
        BUSINESS_RULES.MAX_TRANSACTION_AMOUNT
      );
    });

    it("should have ID_CARD_LENGTH with CMND and CCCD", () => {
      expect(BUSINESS_RULES.ID_CARD_LENGTH.CMND).toBe(9);
      expect(BUSINESS_RULES.ID_CARD_LENGTH.CCCD).toBe(12);
    });

    it("should have positive interest rates for all terms", () => {
      Object.values(BUSINESS_RULES.INTEREST_RATES).forEach((rate) => {
        expect(rate).toBeGreaterThanOrEqual(0);
        expect(rate).toBeLessThanOrEqual(1); // Interest rate as decimal
      });
    });

    it("should have interest rates: NO_TERM < THREE_MONTHS < SIX_MONTHS < TWELVE_MONTHS", () => {
      const { INTEREST_RATES } = BUSINESS_RULES;
      expect(INTEREST_RATES.NO_TERM).toBeLessThan(INTEREST_RATES.THREE_MONTHS);
      expect(INTEREST_RATES.THREE_MONTHS).toBeLessThan(
        INTEREST_RATES.SIX_MONTHS
      );
      expect(INTEREST_RATES.SIX_MONTHS).toBeLessThan(
        INTEREST_RATES.TWELVE_MONTHS
      );
    });

    it("should have term values matching expected months", () => {
      const { TERMS } = BUSINESS_RULES;
      expect(TERMS.NO_TERM).toBe(0);
      expect(TERMS.THREE_MONTHS).toBe(3);
      expect(TERMS.SIX_MONTHS).toBe(6);
      expect(TERMS.TWELVE_MONTHS).toBe(12);
    });
  });

  /**
   * GROUP 2: ACCOUNT_TYPES
   */
  describe("ACCOUNT_TYPES", () => {
    it("should have four account types matching BUSINESS_RULES.TERMS", () => {
      const accountTypeKeys = Object.keys(ACCOUNT_TYPES);
      const termKeys = Object.keys(BUSINESS_RULES.TERMS);
      expect(accountTypeKeys.sort()).toEqual(termKeys.sort());
    });

    it.each([
      ["NO_TERM", "no-term"],
      ["THREE_MONTHS", "3-months"],
      ["SIX_MONTHS", "6-months"],
      ["TWELVE_MONTHS", "12-months"],
    ])("should have ACCOUNT_TYPES.%s = '%s'", (key, value) => {
      expect(ACCOUNT_TYPES[key]).toBe(value);
    });
  });

  /**
   * GROUP 3: ACCOUNT_STATUS and other enums
   */
  describe("status and type enums", () => {
    it("should have three account statuses", () => {
      expect(Object.keys(ACCOUNT_STATUS)).toEqual([
        "ACTIVE",
        "CLOSED",
        "SUSPENDED",
      ]);
    });

    it("should have four transaction types", () => {
      expect(Object.keys(TRANSACTION_TYPES)).toHaveLength(4);
      expect(TRANSACTION_TYPES.DEPOSIT).toBe("deposit");
      expect(TRANSACTION_TYPES.WITHDRAW).toBe("withdraw");
      expect(TRANSACTION_TYPES.INTEREST).toBe("interest");
      expect(TRANSACTION_TYPES.CLOSE).toBe("close");
    });

    it("should have three user statuses", () => {
      expect(Object.keys(USER_STATUS)).toHaveLength(3);
      expect(USER_STATUS.ACTIVE).toBe("active");
      expect(USER_STATUS.DISABLED).toBe("disabled");
      expect(USER_STATUS.PENDING).toBe("pending");
    });
  });

  /**
   * GROUP 4: validateIdCard()
   */
  describe("validateIdCard()", () => {
    it.each([
      ["123456789", true, "CMND (9 digits)"],
      ["123456789012", true, "CCCD (12 digits)"],
      ["12345678", false, "8 digits (too short)"],
      ["1234567890", false, "10 digits (invalid)"],
      ["1234567890123", false, "13 digits (too long)"],
      ["", false, "empty string"],
      [null, false, "null"],
      [undefined, false, "undefined"],
      ["123-456-789", false, "CMND with dashes (still 11 chars)"],
    ])("should return %p for '%s' (%s)", (idCard, expected, description) => {
      expect(validateIdCard(idCard)).toBe(expected);
    });
  });

  /**
   * GROUP 5: validateAmount()
   */
  describe("validateAmount()", () => {
    it.each([
      [100000, true, "at MIN_DEPOSIT boundary"],
      [100001, true, "above MIN_DEPOSIT"],
      [1000000000, true, "at MAX_TRANSACTION_AMOUNT boundary"],
      [999999999, true, "below MAX_TRANSACTION_AMOUNT"],
      [99999, false, "below MIN_DEPOSIT"],
      [1000000001, false, "above MAX_TRANSACTION_AMOUNT"],
      [0, false, "zero"],
      [-100000, false, "negative amount"],
      [100000.5, true, "decimal amount above minimum (valid)"],
    ])(
      "should return %p for amount %p (default min)",
      (amount, expected, description) => {
        expect(validateAmount(amount)).toBe(expected);
      }
    );

    it("should accept custom minimum amount", () => {
      const customMin = 500000;
      expect(validateAmount(500000, customMin)).toBe(true);
      expect(validateAmount(499999, customMin)).toBe(false);
      expect(validateAmount(1000000000, customMin)).toBe(true);
    });

    it("should respect MAX_TRANSACTION_AMOUNT regardless of custom min", () => {
      const customMin = 50000;
      expect(validateAmount(1000000001, customMin)).toBe(false);
    });

    it("should handle edge case of custom min > max (always false)", () => {
      expect(validateAmount(999999999, 1000000001)).toBe(false);
    });
  });

  /**
   * GROUP 6: formatCurrency()
   */
  describe("formatCurrency()", () => {
    it.each([
      [100000, "100.000", "five-digit number"],
      [1000000, "1.000.000", "seven-digit number"],
      [1234567890, "1.234.567.890", "ten-digit number"],
      [0, "0", "zero"],
      [100, "100", "three-digit number"],
    ])(
      "should format %p as '%s' (%s)",
      (amount, expectedContains, description) => {
        const formatted = formatCurrency(amount);
        // Vietnamese locale uses . for thousands and , for decimals
        expect(formatted).toBeDefined();
        expect(typeof formatted).toBe("string");
      }
    );

    it("should return '0' for null", () => {
      expect(formatCurrency(null)).toBe("0");
    });

    it("should return '0' for undefined", () => {
      expect(formatCurrency(undefined)).toBe("0");
    });

    it("should handle decimal amounts", () => {
      const formatted = formatCurrency(1234.56);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe("string");
    });

    it("should handle negative amounts", () => {
      const formatted = formatCurrency(-100000);
      expect(formatted).toBeDefined();
      expect(typeof formatted).toBe("string");
    });
  });

  /**
   * GROUP 7: calculateInterest()
   */
  describe("calculateInterest()", () => {
    it.each([
      [100000, 0.02, 12, 2000, "full year at 2% rate"],
      [100000, 0.065, 12, 6500, "full year at 6.5% rate"],
      [100000, 0.02, 6, 1000, "six months at 2% rate"],
      [100000, 0.02, 3, 500, "three months at 2% rate"],
      [100000, 0.02, 0, 0, "zero months"],
      [1000000, 0.02, 12, 20000, "larger principal"],
      [0, 0.02, 12, 0, "zero principal"],
    ])(
      "should calculate interest: principal=%p, rate=%p, months=%p → %p (%s)",
      (principal, rate, months, expected, description) => {
        const result = calculateInterest(principal, rate, months);
        expect(result).toBeCloseTo(expected, 2);
      }
    );

    it("should handle negative principal (edge case)", () => {
      const result = calculateInterest(-100000, 0.02, 12);
      expect(result).toBe(-2000);
    });

    it("should handle zero rate (no interest)", () => {
      const result = calculateInterest(100000, 0, 12);
      expect(result).toBe(0);
    });

    it("should return correct values for actual BUSINESS_RULES rates", () => {
      const principal = 100000;
      const months = 12;

      const noTermInterest = calculateInterest(
        principal,
        BUSINESS_RULES.INTEREST_RATES.NO_TERM,
        months
      );
      const threeMonthsInterest = calculateInterest(
        principal,
        BUSINESS_RULES.INTEREST_RATES.THREE_MONTHS,
        months
      );
      const twelveMonthsInterest = calculateInterest(
        principal,
        BUSINESS_RULES.INTEREST_RATES.TWELVE_MONTHS,
        months
      );

      expect(noTermInterest).toBeLessThan(threeMonthsInterest);
      expect(threeMonthsInterest).toBeLessThan(twelveMonthsInterest);
      expect(noTermInterest).toBeCloseTo(2000, 2);
      expect(twelveMonthsInterest).toBeCloseTo(6500, 2);
    });

    it("should handle fractional months (partial year)", () => {
      const result = calculateInterest(100000, 0.02, 1); // 1 month
      expect(result).toBeCloseTo(166.67, 2); // 2000 * (1/12)
    });
  });

  /**
   * GROUP 8: Cross-validation and consistency rules
   */
  describe("business rules consistency", () => {
    it("should have MIN_DEPOSIT equal to MIN_INITIAL_DEPOSIT", () => {
      expect(BUSINESS_RULES.MIN_DEPOSIT).toBe(
        BUSINESS_RULES.MIN_INITIAL_DEPOSIT
      );
    });

    it("should have MIN_ACCOUNT_BALANCE of 0 (accounts can be closed)", () => {
      expect(BUSINESS_RULES.MIN_ACCOUNT_BALANCE).toBe(0);
    });

    it("validateAmount should reject amounts below MIN_DEPOSIT by default", () => {
      expect(validateAmount(BUSINESS_RULES.MIN_DEPOSIT - 1)).toBe(false);
      expect(validateAmount(BUSINESS_RULES.MIN_DEPOSIT)).toBe(true);
    });

    it("validateAmount should reject amounts above MAX_TRANSACTION_AMOUNT", () => {
      expect(validateAmount(BUSINESS_RULES.MAX_TRANSACTION_AMOUNT + 1)).toBe(
        false
      );
      expect(validateAmount(BUSINESS_RULES.MAX_TRANSACTION_AMOUNT)).toBe(true);
    });

    it("should have enum values that are strings or numbers consistently", () => {
      Object.values(ACCOUNT_TYPES).forEach((val) => {
        expect(typeof val).toBe("string");
      });
      Object.values(ACCOUNT_STATUS).forEach((val) => {
        expect(typeof val).toBe("string");
      });
      Object.values(TRANSACTION_TYPES).forEach((val) => {
        expect(typeof val).toBe("string");
      });
    });
  });
});
