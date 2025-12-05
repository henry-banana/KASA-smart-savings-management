/**
 * Quick hash test - Run this in Node.js to verify hash distribution
 * node testHashQuick.js
 */

// Simplified hash function for testing (same as typeColorUtils.js)
function hashString(str) {
  const s = String(str || "").toLowerCase();

  // Round 1: djb2 with custom salt
  let hash1 = 5381;
  const salt1 = 33;
  for (let i = 0; i < s.length; i++) {
    hash1 = (hash1 << 5) + hash1 + s.charCodeAt(i) * salt1;
    hash1 = hash1 & 0xffffffff;
  }

  // Round 2: FNV-1a algorithm with different salt
  let hash2 = 2166136261;
  const salt2 = 16777619;
  for (let i = 0; i < s.length; i++) {
    hash2 = hash2 ^ (s.charCodeAt(i) * 37);
    hash2 = (hash2 * salt2) >>> 0;
  }

  // Combine both hashes
  const combined = ((hash1 ^ (hash2 >>> 16)) + (hash2 << 3)) >>> 0;

  return Math.abs(combined);
}

// Test types
const testTypes = ["No Term", "3 Months", "6 Months", "12 Months", "24 Months"];

const paletteSize = 17;

console.log("=== Hash Distribution Test ===\n");
console.log("Testing for collisions with palette size:", paletteSize);
console.log("");

const results = {};
const indices = {};

testTypes.forEach((type) => {
  const hash = hashString(type);
  const index = hash % paletteSize;

  results[type] = { hash, index };

  if (!indices[index]) {
    indices[index] = [];
  }
  indices[index].push(type);

  console.log(`"${type}"`);
  console.log(`  Hash: ${hash}`);
  console.log(`  Index: ${index}`);
  console.log("");
});

// Check collisions
console.log("=== Collision Check ===\n");
let collisionCount = 0;

Object.entries(indices).forEach(([index, types]) => {
  if (types.length > 1) {
    console.log(`❌ COLLISION at index ${index}:`);
    types.forEach((type) => console.log(`   - ${type}`));
    console.log("");
    collisionCount++;
  }
});

if (collisionCount === 0) {
  console.log("✅ No collisions detected!");
  console.log("");
  console.log("All types have unique colors:");
  testTypes.forEach((type) => {
    console.log(`  ${type} → color[${results[type].index}]`);
  });
} else {
  console.log(`⚠️  Found ${collisionCount} collision(s)`);
}

console.log("");
console.log(
  `Tested ${testTypes.length} types with ${paletteSize} colors available`
);
console.log(
  `Distribution efficiency: ${((testTypes.length / paletteSize) * 100).toFixed(
    1
  )}%`
);
