# Type Color System

This document describes the centralized color system for account types across the application.

## Overview

The type color system provides **consistent, deterministic color mapping** for account types (savings types) across different UI components including:
- Badge components in tables and lists
- Chart components (PieChart, BarChart, etc.)
- Any visual representation of account types

## Location

`src/utils/typeColorUtils.js`

## Key Features

1. **Deterministic Hashing**: Uses djb2 hash algorithm to ensure the same type name always gets the same color
2. **17 Color Palette**: Supports unlimited account types with good color distribution
3. **Two Format Types**:
   - Badge classes (Tailwind CSS classes for badge styling)
   - Hex colors (for charts and canvas elements)

## API

### `getTypeBadgeColor(type)`
Returns Tailwind CSS classes for badge styling.

```javascript
import { getTypeBadgeColor } from '@/utils/typeColorUtils';

const colorClass = getTypeBadgeColor("3 Months");
// Returns: "bg-blue-100 text-blue-700 border-blue-200"

<Badge className={getTypeBadgeColor(account.accountTypeName)}>
  {account.accountTypeName}
</Badge>
```

### `getTypeChartColor(type)`
Returns hex color code for charts.

```javascript
import { getTypeChartColor } from '@/utils/typeColorUtils';

const hexColor = getTypeChartColor("3 Months");
// Returns: "#3B82F6"

const chartData = types.map(type => ({
  name: type.name,
  value: type.count,
  color: getTypeChartColor(type.name)
}));
```

### `getTypeLabel(type)`
Returns display label (utility function).

```javascript
import { getTypeLabel } from '@/utils/typeColorUtils';

const label = getTypeLabel("3 Months");
// Returns: "3 Months"
```

## Color Palettes

### Badge Classes (17 colors)
- Blue, Cyan, Sky, Indigo, Violet, Purple, Fuchsia
- Pink, Rose, Red, Orange, Amber, Yellow
- Lime, Green, Emerald, Teal

### Chart Hex Colors (17 colors)
Corresponding hex values from Tailwind's 500 shade:
- `#3B82F6` (blue), `#06B6D4` (cyan), `#0EA5E9` (sky), etc.

## Usage Examples

### SearchAccounts Page
```javascript
import { getTypeBadgeColor, getTypeLabel } from '@/utils/typeColorUtils';

<Badge className={getTypeBadgeColor(account.accountTypeName)}>
  {getTypeLabel(account.accountTypeName)}
</Badge>
```

### Dashboard PieChart
```javascript
// In mock data calculation
import { getTypeChartColor } from '@/utils/typeColorUtils';

const accountTypeDistribution = types.map(type => ({
  name: type.typeName,
  value: type.count,
  color: getTypeChartColor(type.typeName)
}));
```

### Any New Component
```javascript
import { getTypeBadgeColor, getTypeChartColor } from '@/utils/typeColorUtils';

// For badges/text elements
<div className={getTypeBadgeColor(typeName)}>{typeName}</div>

// For charts/canvas
<PieChart data={data.map(d => ({ ...d, color: getTypeChartColor(d.name) }))} />
```

## Benefits

1. **Consistency**: Same type always shows same color across entire app
2. **Maintainability**: Single source of truth for type colors
3. **Scalability**: Supports unlimited types without manual color definition
4. **Accessibility**: Uses Tailwind's tested color combinations for good contrast
5. **Performance**: Hash function is O(n) where n is string length (very fast)

## Migration Notes

Components previously using local color definitions should import and use these utilities:
- ✅ `SearchAccounts.jsx` - Updated to use `getTypeBadgeColor`
- ✅ `dashboard.js` (mock data) - Updated to use `getTypeChartColor`
- 🔄 Any future components should use these utilities from the start

## Technical Details

### Improved Hash Algorithm (djb2 + FNV-1a Hybrid)
The system uses a **two-round hybrid hash** to minimize collisions:

**Round 1 - djb2 with salt:**
- **Formula**: `hash = ((hash << 5) + hash) + (charCode * 33)`
- **Salt**: Prime multiplier (33) for better distribution
- **Properties**: Fast, good distribution for short strings

**Round 2 - FNV-1a with salt:**
- **Formula**: `hash = (hash ^ (charCode * 37)) * 16777619`
- **Salt**: Additional prime (37) to differentiate similar strings
- **Properties**: Excellent avalanche effect (small changes = big hash differences)

**Combination:**
- XOR and rotate both hashes: `(hash1 ^ (hash2 >>> 16)) + (hash2 << 3)`
- Ensures "6 Months" and "12 Months" get different colors
- **32-bit conversion**: Ensures consistent results across platforms
- **Case-insensitive**: Converts input to lowercase before hashing

### Why 17 Colors?
- Balanced palette providing good visual distinction
- Covers most common use cases (typically 5-10 types)
- Falls back gracefully when types exceed palette size (hash wraps around)
- Avoids colors that are too similar or hard to distinguish

## Testing & Debugging

### Test Color Distribution
Use the test utility to verify no collisions exist:

```javascript
import { testColorDistribution, generateColorPreview } from '@/utils/testTypeColors';

// Run in browser console
testColorDistribution();
// Outputs color assignments and collision report

// Generate HTML preview
generateColorPreview();
// Outputs HTML you can save and open in browser
```

### Expected Test Results
- ✅ "6 Months" and "12 Months" should have **different colors**
- ✅ "3 Months", "6 Months", "12 Months", "24 Months" all distinct
- ✅ English and Vietnamese variants ("No Term" vs "Không kỳ hạn") different

## Future Enhancements

Potential improvements:
- [ ] Add user preference for color scheme (light/dark mode variants)
- [ ] Add accessibility mode with high-contrast colors
- [ ] Export color mapping for testing/debugging
- [x] Add color preview tool for admins when creating new types (✅ testTypeColors.js)
- [x] Improved hash algorithm to reduce collisions (✅ hybrid djb2 + FNV-1a)
