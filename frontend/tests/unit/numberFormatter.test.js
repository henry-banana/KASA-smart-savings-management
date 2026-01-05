import {
  formatVnNumber,
  formatPercentText,
} from "../../src/utils/numberFormatter";

describe("numberFormatter", () => {
  describe("formatVnNumber", () => {
    it("should format numbers with Vietnamese thousand separators", () => {
      const result = formatVnNumber(1234567);
      expect(result).toBe("1.234.567");
    });

    it("should format decimal numbers with Vietnamese comma separator", () => {
      const result = formatVnNumber(1234.5, {
        noFloor: true,
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
      expect(result).toBe("1.234,5");
    });

    it("should respect custom fraction digit options", () => {
      const result = formatVnNumber(1234.567, {
        noFloor: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      expect(result).toBe("1.234,57");
    });

    it("should return '0' for zero input", () => {
      const result = formatVnNumber(0);
      expect(result).toBe("0");
    });

    it("should handle null input safely and return '0'", () => {
      const result = formatVnNumber(null);
      expect(result).toBe("0");
    });

    it("should handle undefined input safely and return '0'", () => {
      const result = formatVnNumber(undefined);
      expect(result).toBe("0");
    });

    it("should format large numbers (>= 1 billion) correctly", () => {
      const result = formatVnNumber(1000000000);
      expect(result).toBe("1.000.000.000");
    });

    it("should format negative numbers with minus sign", () => {
      const result = formatVnNumber(-1234.5, {
        noFloor: true,
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
      expect(result).toBe("-1.234,5");
    });
  });

  describe("formatPercentText", () => {
    it("should replace decimal point with comma in percentage strings", () => {
      const result = formatPercentText("+13.3%");
      expect(result).toBe("+13,3%");
    });

    it("should handle multiple decimal occurrences in text", () => {
      const result = formatPercentText("13.5% change, -5.2% decrease");
      expect(result).toBe("13,5% change, -5,2% decrease");
    });

    it("should return non-string input as-is", () => {
      expect(formatPercentText(null)).toBe(null);
      expect(formatPercentText(undefined)).toBe(undefined);
      expect(formatPercentText(123)).toBe(123);
    });

    it("should handle text without decimals unchanged", () => {
      const result = formatPercentText("+10%");
      expect(result).toBe("+10%");
    });
  });
});
