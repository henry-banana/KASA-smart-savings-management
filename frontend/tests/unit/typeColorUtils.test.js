import {
  getTypeBadgeColor,
  getTypeChartColor,
  TYPE_BADGE_COLOR_CLASSES,
  TYPE_CHART_HEX_COLORS,
} from "../../src/utils/typeColorUtils";

describe("typeColorUtils", () => {
  /**
   * GROUP 1: getTypeBadgeColor()
   */
  describe("getTypeBadgeColor()", () => {
    it("should return a valid Tailwind CSS class string from badge palette", () => {
      const color = getTypeBadgeColor("account-type-1");
      expect(TYPE_BADGE_COLOR_CLASSES).toContain(color);
      expect(typeof color).toBe("string");
    });

    it("should be deterministic: same input always returns same color", () => {
      const type = "savings-account";
      const color1 = getTypeBadgeColor(type);
      const color2 = getTypeBadgeColor(type);
      const color3 = getTypeBadgeColor(type);
      expect(color1).toBe(color2);
      expect(color2).toBe(color3);
    });

    it("should handle different inputs and return different colors (distribution)", () => {
      const color1 = getTypeBadgeColor("type-a");
      const color2 = getTypeBadgeColor("type-b");
      const color3 = getTypeBadgeColor("type-c");
      // Different inputs should (likely) produce different colors
      // Note: hash collisions are theoretically possible but statistically rare
      const distinctColors = new Set([color1, color2, color3]);
      expect(distinctColors.size).toBeGreaterThan(1);
    });

    it("should be case-insensitive", () => {
      const colorLower = getTypeBadgeColor("mytype");
      const colorUpper = getTypeBadgeColor("MYTYPE");
      const colorMixed = getTypeBadgeColor("MyType");
      expect(colorLower).toBe(colorUpper);
      expect(colorUpper).toBe(colorMixed);
    });

    it("should handle empty string without crashing", () => {
      const color = getTypeBadgeColor("");
      expect(TYPE_BADGE_COLOR_CLASSES).toContain(color);
    });

    it("should handle null/undefined without crashing", () => {
      const colorNull = getTypeBadgeColor(null);
      const colorUndefined = getTypeBadgeColor(undefined);
      expect(TYPE_BADGE_COLOR_CLASSES).toContain(colorNull);
      expect(TYPE_BADGE_COLOR_CLASSES).toContain(colorUndefined);
    });

    it("should handle numeric input by converting to string", () => {
      const color1 = getTypeBadgeColor(123);
      const color2 = getTypeBadgeColor("123");
      expect(color1).toBe(color2);
      expect(TYPE_BADGE_COLOR_CLASSES).toContain(color1);
    });

    it("should distribute across all available badge colors over multiple types", () => {
      const types = Array.from({ length: 50 }, (_, i) => `type-${i}`);
      const colors = types.map(getTypeBadgeColor);
      const uniqueColors = new Set(colors);
      // With 50 inputs and 17 palette colors, we should hit multiple colors
      expect(uniqueColors.size).toBeGreaterThan(1);
      expect(uniqueColors.size).toBeLessThanOrEqual(
        TYPE_BADGE_COLOR_CLASSES.length
      );
    });
  });

  /**
   * GROUP 2: getTypeChartColor()
   */
  describe("getTypeChartColor()", () => {
    it("should return a valid hex color from chart palette", () => {
      const color = getTypeChartColor("account-type-1");
      expect(TYPE_CHART_HEX_COLORS).toContain(color);
      expect(/^#[0-9A-F]{6}$/i.test(color)).toBe(true);
    });

    it("should be deterministic: same input always returns same color", () => {
      const type = "savings-account";
      const color1 = getTypeChartColor(type);
      const color2 = getTypeChartColor(type);
      const color3 = getTypeChartColor(type);
      expect(color1).toBe(color2);
      expect(color2).toBe(color3);
    });

    it("should be case-insensitive", () => {
      const colorLower = getTypeChartColor("mytype");
      const colorUpper = getTypeChartColor("MYTYPE");
      const colorMixed = getTypeChartColor("MyType");
      expect(colorLower).toBe(colorUpper);
      expect(colorUpper).toBe(colorMixed);
    });

    it("should handle empty string without crashing", () => {
      const color = getTypeChartColor("");
      expect(TYPE_CHART_HEX_COLORS).toContain(color);
    });

    it("should handle null/undefined without crashing", () => {
      const colorNull = getTypeChartColor(null);
      const colorUndefined = getTypeChartColor(undefined);
      expect(TYPE_CHART_HEX_COLORS).toContain(colorNull);
      expect(TYPE_CHART_HEX_COLORS).toContain(colorUndefined);
    });

    it("should handle numeric input by converting to string", () => {
      const color1 = getTypeChartColor(456);
      const color2 = getTypeChartColor("456");
      expect(color1).toBe(color2);
      expect(TYPE_CHART_HEX_COLORS).toContain(color1);
    });

    it("should distribute across all available chart colors over multiple types", () => {
      const types = Array.from({ length: 50 }, (_, i) => `type-${i}`);
      const colors = types.map(getTypeChartColor);
      const uniqueColors = new Set(colors);
      // With 50 inputs and 17 palette colors, we should hit multiple colors
      expect(uniqueColors.size).toBeGreaterThan(1);
      expect(uniqueColors.size).toBeLessThanOrEqual(
        TYPE_CHART_HEX_COLORS.length
      );
    });
  });

  /**
   * GROUP 3: Consistency between Badge and Chart color mappings
   */
  describe("Badge and Chart color consistency", () => {
    it("should map the same type to consistent indices (though different palettes)", () => {
      const type = "test-type";
      const badgeColor = getTypeBadgeColor(type);
      const chartColor = getTypeChartColor(type);

      // Both should exist in their respective palettes
      expect(TYPE_BADGE_COLOR_CLASSES).toContain(badgeColor);
      expect(TYPE_CHART_HEX_COLORS).toContain(chartColor);

      // Same type should produce same color combo on multiple calls
      expect(getTypeBadgeColor(type)).toBe(badgeColor);
      expect(getTypeChartColor(type)).toBe(chartColor);
    });

    it("should handle special characters in type names", () => {
      const specialTypes = [
        "type-with-dashes",
        "type_with_underscores",
        "type.with.dots",
        "type@special",
        "type with spaces",
      ];
      specialTypes.forEach((type) => {
        const badgeColor = getTypeBadgeColor(type);
        const chartColor = getTypeChartColor(type);
        expect(TYPE_BADGE_COLOR_CLASSES).toContain(badgeColor);
        expect(TYPE_CHART_HEX_COLORS).toContain(chartColor);
      });
    });
  });

  /**
   * GROUP 4: Color palette validation
   */
  describe("Color palettes", () => {
    it("should have TYPE_BADGE_COLOR_CLASSES as non-empty array", () => {
      expect(Array.isArray(TYPE_BADGE_COLOR_CLASSES)).toBe(true);
      expect(TYPE_BADGE_COLOR_CLASSES.length).toBeGreaterThan(0);
    });

    it("should have TYPE_CHART_HEX_COLORS as non-empty array", () => {
      expect(Array.isArray(TYPE_CHART_HEX_COLORS)).toBe(true);
      expect(TYPE_CHART_HEX_COLORS.length).toBeGreaterThan(0);
    });

    it("all badge colors should be strings with Tailwind classes", () => {
      TYPE_BADGE_COLOR_CLASSES.forEach((color) => {
        expect(typeof color).toBe("string");
        expect(color.length).toBeGreaterThan(0);
        // Badge colors should contain multiple Tailwind classes
        expect(color.split(" ").length).toBeGreaterThanOrEqual(3);
      });
    });

    it("all hex colors should be valid hex codes", () => {
      TYPE_CHART_HEX_COLORS.forEach((color) => {
        expect(/^#[0-9A-F]{6}$/i.test(color)).toBe(true);
      });
    });

    it("should have matching palette sizes or reasonable distribution", () => {
      // Both palettes should be reasonably sized for design consistency
      expect(TYPE_BADGE_COLOR_CLASSES.length).toBeGreaterThanOrEqual(10);
      expect(TYPE_CHART_HEX_COLORS.length).toBeGreaterThanOrEqual(10);
    });
  });
});
