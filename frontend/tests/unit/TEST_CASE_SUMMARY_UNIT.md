# TEST_CASE_SUMMARY.md – Frontend Unit Test Suite

## Test Suite Overview
**Total Tests:** 184 passing | **Test Framework:** Jest + @testing-library/react | **Execution Time:** ~2.3s

---

## Test Files Summary

### 1. authErrorMapper.test.js
| Attribute | Details |
|-----------|---------|
| **Module** | `src/utils/authErrorMapper.js` |
| **Functions** | `mapAuthErrorToMessage()`, `isSessionExpiredError()` |
| **Scenarios** | 10 tests: Network errors (priority 1), token expired (priority 2), 401/403 auth errors (priority 3-4), 400/422 validation, 5xx server errors, priority precedence |
| **Count** | 10 tests |

### 2. numberFormatter.test.js
| Attribute | Details |
|-----------|---------|
| **Module** | `src/utils/numberFormatter.js` |
| **Functions** | `formatVnNumber()`, `formatPercentText()` |
| **Scenarios** | 12 tests: Vietnamese thousand separators (. char), decimal formatting (comma), custom fraction digits, null/undefined/zero handling, large numbers (1B+), negative numbers, percentage text replacement |
| **Count** | 12 tests |

### 3. serverStatusUtils.test.js
| Attribute | Details |
|-----------|---------|
| **Module** | `src/utils/serverStatusUtils.js` |
| **Functions** | `isServerUnavailable()`, `isBusinessError()`, `isServerError()`, `classifyError()` |
| **Scenarios** | 46 tests: Network detection (ECONNREFUSED, timeout), 503/status:0 (falsy), 4xx business errors (400/401/403/404/422), 5xx server errors (500/501/502/504/505/599), priority enforcement (unavailable > business > server > unknown) |
| **Count** | 46 tests |

### 4. typeColorUtils.test.js
| Attribute | Details |
|-----------|---------|
| **Module** | `src/utils/typeColorUtils.js` |
| **Functions** | `getTypeBadgeColor()`, `getTypeChartColor()` |
| **Scenarios** | 22 tests: Tailwind badge class returns, hex color returns, deterministic hashing, case-insensitive matching, null/undefined handling, numeric input conversion, distribution validation (50+ types), special character handling, palette consistency |
| **Count** | 22 tests |

### 5. business.test.js
| Attribute | Details |
|-----------|---------|
| **Module** | `src/constants/business.js` |
| **Functions** | `validateIdCard()`, `validateAmount()`, `formatCurrency()`, `calculateInterest()` + Constants: MIN_DEPOSIT, MAX_TRANSACTION_AMOUNT, ACCOUNT_TYPES, interest rates |
| **Scenarios** | 63 tests: Deposit limits (100k-1B), CMND (9-digit) & CCCD (12-digit) validation, amount validation with custom min, interest rate ordering (2%-6.5% by term), currency formatting (Vietnamese locale), interest calculation formula (principal × rate × months/12), enum type consistency |
| **Count** | 63 tests |

### 6. useApi.test.js
| Attribute | Details |
|-----------|---------|
| **Module** | `src/hooks/useApi.js` |
| **Functions** | `execute()`, `reset()`, state: `data`, `loading`, `error` |
| **Scenarios** | 16 tests: Initial state (null/false), successful API calls (data update), failed calls (error capture), loading state management, argument forwarding, default message handling, multiple calls override, reset function cleanup, null/undefined edge cases |
| **Count** | 16 tests |

### 7. useDebounce.test.js
| Attribute | Details |
|-----------|---------|
| **Module** | `src/hooks/useDebounce.js` |
| **Functions** | Hook return: debounced value, dependencies: value, delay (500ms default) |
| **Scenarios** | 13 tests: Initial values (string/number/object/null), delay enforcement (300ms/500ms/0ms), rapid changes (emit last only), delay parameter changes, unmount cleanup (prevents memory leaks), sequential updates, edge cases (null, objects, falsy numbers) |
| **Count** | 13 tests |

---

## How to Run Tests

### Run All Tests
```bash
cd frontend
npx jest
```

### Run Single Test File
```bash
npx jest useApi.test.js
# or
npx jest --testNamePattern="useApi"
```

### Run Specific Test
```bash
npx jest serverStatusUtils.test.js -t "should respect priority"
```

### Run with Coverage
```bash
npx jest --coverage
```

### Watch Mode
```bash
npx jest --watch
```

---

## Unit Test to Use Case / NFR Mapping

| Unit Test File | Supports UC / NFR | Rationale |
|---|---|---|
| **authErrorMapper** | UC02 (Login), UC03 (Auth Errors) + NFR-2 (Error Handling) | Maps all HTTP/network errors to user-friendly messages; priority handling ensures critical errors surface first |
| **numberFormatter** | NFR-1 (Vietnamese Locale) | Formats amounts in Vietnamese (. for thousands, , for decimals); all transaction screens depend on this |
| **serverStatusUtils** | NFR-2 (Resilience), UC-wide | Classifies HTTP errors into actionable categories (network, auth, server) for appropriate retry/recovery logic |
| **typeColorUtils** | UC11 (Savings Display) + NFR-5 (UI Consistency) | Deterministic color mapping for saving account types ensures consistent UI across dashboard/list views |
| **business** | UC04 (Deposit), UC05 (Withdraw), UC06 (Interest Calculation) + NFR-1 (Validation) | Financial boundaries (MIN_DEPOSIT 100k, MAX 1B), interest rate ordering (0% < 4.5% < 6.5%), ID card validation (CMND/CCCD), currency formatting |
| **useApi** | UC-wide (API State Management) + NFR-3 (Async Handling) | Core hook for all async operations; manages loading, error, data states for dashboard/forms; prevents race conditions |
| **useDebounce** | UC10 (Search), UC12 (Form Input) + NFR-4 (Performance) | Debounces rapid user input (search, filtering) to reduce API calls; cleanup prevents memory leaks on unmount |

---

## Test Execution Summary
- **Total Test Files:** 7
- **Total Tests:** 184
- **Pass Rate:** 100%
- **Avg Test Duration:** ~12.6ms per test
- **Total Time:** 2.3 seconds

**Utilities:** 4 files (authErrorMapper, numberFormatter, serverStatusUtils, typeColorUtils) = 90 tests  
**Constants/Validation:** 1 file (business) = 63 tests  
**React Hooks:** 2 files (useApi, useDebounce) = 29 tests  

---

## Key Testing Patterns Used
- **Parametrized Tests:** `it.each()` for concise edge case coverage
- **Fake Timers:** `jest.useFakeTimers()` + `jest.advanceTimersByTime()` for deterministic timing (useDebounce)
- **Hook Testing:** `renderHook()` + `act()` from @testing-library/react
- **Mock Functions:** `jest.fn()` for async API calls and state transitions
- **Priority Testing:** Error classification respects defined priority hierarchies (authErrorMapper, serverStatusUtils)

