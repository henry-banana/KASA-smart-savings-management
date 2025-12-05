/**
 * Test utility to verify hash distribution and detect collisions
 * Run this in browser console to test color assignments
 */

import {
  getTypeBadgeColor,
  getTypeChartColor,
  TYPE_BADGE_COLOR_CLASSES,
  TYPE_CHART_HEX_COLORS,
} from "./typeColorUtils";

// Common account type names to test
const testTypes = [
  "No Term",
  "Không kỳ hạn",
  "3 Months",
  "3 tháng",
  "6 Months",
  "6 tháng",
  "12 Months",
  "12 tháng",
  "24 Months",
  "24 tháng",
  "36 Months",
  "1 Month",
  "2 Months",
  "9 Months",
  "18 Months",
];

/**
 * Test hash distribution and print results
 */
export function testColorDistribution() {
  console.log("=== Type Color Distribution Test ===\n");

  const badgeResults = {};
  const chartResults = {};

  testTypes.forEach((type) => {
    const badgeColor = getTypeBadgeColor(type);
    const chartColor = getTypeChartColor(type);

    console.log(`Type: "${type}"`);
    console.log(`  Badge: ${badgeColor}`);
    console.log(`  Chart: ${chartColor}`);
    console.log("");

    // Track for collision detection
    badgeResults[type] = badgeColor;
    chartResults[type] = chartColor;
  });

  // Check for collisions
  const badgeColorCount = {};
  const chartColorCount = {};

  Object.entries(badgeResults).forEach(([type, color]) => {
    if (!badgeColorCount[color]) {
      badgeColorCount[color] = [];
    }
    badgeColorCount[color].push(type);
  });

  Object.entries(chartResults).forEach(([type, color]) => {
    if (!chartColorCount[color]) {
      chartColorCount[color] = [];
    }
    chartColorCount[color].push(type);
  });

  // Report collisions
  console.log("=== Collision Report ===\n");

  let badgeCollisions = 0;
  let chartCollisions = 0;

  console.log("Badge Color Collisions:");
  Object.entries(badgeColorCount).forEach(([color, types]) => {
    if (types.length > 1) {
      console.log(`  ⚠️  ${color}`);
      console.log(`     Types: ${types.join(", ")}`);
      badgeCollisions++;
    }
  });
  if (badgeCollisions === 0) {
    console.log("  ✅ No collisions detected!");
  }

  console.log("\nChart Color Collisions:");
  Object.entries(chartColorCount).forEach(([color, types]) => {
    if (types.length > 1) {
      console.log(`  ⚠️  ${color}`);
      console.log(`     Types: ${types.join(", ")}`);
      chartCollisions++;
    }
  });
  if (chartCollisions === 0) {
    console.log("  ✅ No collisions detected!");
  }

  console.log(
    `\nTotal palette size: ${TYPE_BADGE_COLOR_CLASSES.length} badge colors, ${TYPE_CHART_HEX_COLORS.length} chart colors`
  );
  console.log(`Types tested: ${testTypes.length}`);
  console.log(`Badge collisions: ${badgeCollisions}`);
  console.log(`Chart collisions: ${chartCollisions}`);

  return {
    badgeResults,
    chartResults,
    badgeCollisions,
    chartCollisions,
  };
}

/**
 * Generate HTML preview of color assignments
 */
export function generateColorPreview() {
  const results = testColorDistribution();

  console.log("\n=== Generating HTML Preview ===");
  console.log(
    "Copy the HTML below and open in browser to see visual preview:\n"
  );

  let html = `
<!DOCTYPE html>
<html>
<head>
  <title>Type Color Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui; padding: 20px; background: #f9fafb; }
    .container { max-width: 1200px; margin: 0 auto; }
    .section { background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .badge-demo { display: inline-block; padding: 4px 12px; border-radius: 6px; border-width: 1px; font-size: 14px; margin: 4px; }
    .chart-demo { display: inline-block; width: 60px; height: 60px; border-radius: 8px; margin: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Account Type Color Preview</h1>
    
    <div class="section">
      <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Badge Colors</h2>
`;

  testTypes.forEach((type) => {
    const badgeColor = getTypeBadgeColor(type);
    html += `      <span class="badge-demo ${badgeColor}">${type}</span>\n`;
  });

  html += `
    </div>
    
    <div class="section">
      <h2 style="font-size: 18px; font-weight: 600; margin-bottom: 16px;">Chart Colors</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
`;

  testTypes.forEach((type) => {
    const chartColor = getTypeChartColor(type);
    html += `        <div>
          <div class="chart-demo" style="background-color: ${chartColor};"></div>
          <div style="font-size: 12px; text-align: center; margin-top: 4px;">${type}</div>
        </div>\n`;
  });

  html += `
      </div>
    </div>
  </div>
</body>
</html>
`;

  console.log(html);

  return html;
}

// Export for use in tests or console
if (typeof window !== "undefined") {
  window.testColorDistribution = testColorDistribution;
  window.generateColorPreview = generateColorPreview;
}
