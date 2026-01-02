# Component Test Suite Summary

## Test Coverage Overview

| UC | Component | Test File | Tests | Main Coverage |
|---|---|---|---|---|
| UC01 | Create Staff | `UC01_CreateStaff/CreateStaff.test.jsx` | 13 | User creation form, validation, API submission |
| UC02 | Login | `UC02_Login/Login.test.jsx` | 9 | Authentication, email validation, role-based navigation |
| UC03 | Forgot Password | `UC03_ForgotPassword/ForgotPassword.test.jsx` | 13 | Email validation, password reset request |
| UC03 | Reset Password | `UC03_ForgotPassword/ResetPassword.test.jsx` | 19 | Password validation, form submission, error handling |
| UC04 | Profile | `UC04_Profile/Profile.test.jsx` | 16 | Profile display, edit, password change, retry logic |
| UC05 | Open Saving Book | `UC05_OpenSavingBook/OpenSavingBook.test.jsx` | 15 | Account creation, minimum balance validation |
| UC06 | Deposit | `UC06_Deposit/Deposit.test.jsx` | 11 | Deposit validation, account lookup, balance verification |
| UC07 | Withdraw | `UC07_Withdraw/Withdraw.test.jsx` | 20 | Fixed/no-term withdrawal, maturity check, balance validation |
| UC08 | Search Saving Book | `UC08_SearchSavingBook/SearchSavingBook.test.jsx` | 32 | Search, filter, pagination, debouncing, results display |
| UC09 | Daily Report | `UC09_DailyReport/DailyReport.test.jsx` | 21 | Report generation, date handling, error/empty states |
| UC10 | Monthly Report | `UC10_MonthlyReport/MonthlyReport.test.jsx` | 27 | Month/type filtering, report generation, calculations |
| UC11 | Regulations | `UC11_Regulations/Regulations.test.jsx` | 30 | Settings load, interest rates, update services, fallback |

**Total: 12 test files | 227 tests**

---

## Component Test Details

### UC01 - Create Staff (User Management)
**File:** `UC01_CreateStaff/CreateStaff.test.jsx` (13 tests)

**Mocks:**
- Service: `staffService.createUser`
- Component: `RoleGuard`, toast/alerts

**Coverage:**
- **Render:** Page loads, Add button visible, dialog opens
- **Validation:** Full name input, email input, form field labels
- **Happy Path:** User creation with form submission, list refresh
- **Error:** Empty required fields rejection, duplicate email error
- **Loading:** Submission state, dialog auto-close

---

### UC02 - Login
**File:** `UC02_Login/Login.test.jsx` (9 tests)

**Mocks:**
- Hook: `useAuth.login`, `useNavigate`, `useConfig`
- Utility: `logger`

**Coverage:**
- **Render:** Login screen, title display, input fields
- **Validation:** Email required, password required, invalid email format
- **Happy Path:** Teller login with navigation, admin navigation, whitespace trimming

---

### UC03 - Forgot Password
**File:** `UC03_ForgotPassword/ForgotPassword.test.jsx` (13 tests)

**Mocks:**
- Service: `authService.requestPasswordReset`
- Component: Toast notification, success callback

**Coverage:**
- **Render:** Email input, submit button, no errors initially
- **Validation:** Email field disabled/enabled, whitespace rejection
- **Happy Path:** Reset request with email callback, pending state
- **Error:** 400 bad request, 404 user not found, generic error
- **Navigation:** Back to login button

---

### UC03 - Reset Password
**File:** `UC03_ForgotPassword/ResetPassword.test.jsx` (19 tests)

**Mocks:**
- Service: `authService.resetPassword`
- Component: Password requirements display, visual feedback

**Coverage:**
- **Render:** Password inputs, requirements list, submit button disabled
- **Validation:** Password mismatch, minimum 6 characters, empty field rejection
- **Happy Path:** Valid password submission with callback, disable during request
- **Error:** Invalid code, expired code, generic error
- **Features:** Password visibility toggle, real-time feedback, error clearing

---

### UC04 - Profile
**File:** `UC04_Profile/Profile.test.jsx` (16 tests)

**Mocks:**
- Service: `userService.getProfile`, `userService.updateProfile`, `userService.changePassword`
- Component: `ServiceUnavailableState`, skeleton loader

**Coverage:**
- **Render:** Profile page with user data, email display, sections
- **Loading:** Skeleton display, skeleton removal after load
- **Error:** Server unavailable (503), retry button, non-server errors
- **Happy Path:** Edit dialog open, full name update, form submission
- **Features:** Change password dialog, password change submission, error messages

---

### UC05 - Open Saving Book
**File:** `UC05_OpenSavingBook/OpenSavingBook.test.jsx` (15 tests)

**Mocks:**
- Service: `savingBookService.createSavingBook`, `typeSavingService.getAllTypeSavings`, `customerService.getCustomerById`
- Component: `RoleGuard`, toast alerts

**Coverage:**
- **Render:** Page with main fields, lookup/submit buttons
- **Validation:** Empty submit errors, invalid ID, low amount, type not selected
- **Happy Path:** Account lookup, book creation with payload verification, form reset
- **Error:** Creation failure, customer not found (404), conflict (409)
- **Loading:** Pending state during creation

---

### UC06 - Deposit
**File:** `UC06_Deposit/Deposit.test.jsx` (11 tests)

**Mocks:**
- Service: `savingBookService.deposit`, `savingBookService.getSavingBookByCode`, `regulationService.getRegulations`
- Component: `RoleGuard`, toast alerts

**Coverage:**
- **Render:** Deposit page with lookup input, lookup button
- **Validation:** Closed account rejection, non-no-term account rejection
- **Happy Path:** Account lookup, customer details display, deposit submission
- **Error:** Server error, loading state during deposit
- **Features:** Success message, balance verification, minimum balance check

---

### UC07 - Withdraw
**File:** `UC07_Withdraw/Withdraw.test.jsx` (20 tests)

**Mocks:**
- Service: `savingBookService.withdraw`, `savingBookService.getSavingBookByCode`, `regulationService.getRegulations`
- Component: `RoleGuard`, date utilities

**Coverage:**
- **Render:** Withdraw page with account code input, lookup button
- **Validation:** Closed account rejection, minimum days rejection, amount exceeds balance
- **Happy Path:** No-term withdrawal with balance, partial withdrawal, fixed-term maturity withdrawal
- **Features:** Auto-fill full balance for fixed-term, maturity status display, current balance display
- **Error:** Account lookup failure, invalid account type, withdrawal service failure

---

### UC08 - Search Saving Book
**File:** `UC08_SearchSavingBook/SearchSavingBook.test.jsx` (32 tests)

**Mocks:**
- Service: `savingBookService.searchSavingBooks`, `typeSavingService.getAllTypeSavings`
- Component: `RoleGuard`, `CuteEmptyState`, `ServiceUnavailableState`

**Coverage:**
- **Render:** Search page with title, input field, filter dropdowns, results table, pagination
- **Validation:** Not shown initially, default filter values
- **Filtering:** By type, by status, combined filters
- **Happy Path:** Search by account code, display results with balance/type/status badges
- **Navigation:** Details button, modal display, modal close, pagination (next/previous/first/last)
- **Error:** Service unavailable (503) with retry, skeleton loading, disabled pagination during load
- **Features:** Debouncing search input, empty state display, pagination info (page/total), `jest.useFakeTimers()` for debounce

---

### UC09 - Daily Report
**File:** `UC09_DailyReport/DailyReport.test.jsx` (21 tests)

**Mocks:**
- Service: `reportService.getDailyReport`
- Component: Skeleton loader, `ServiceUnavailableState`

**Coverage:**
- **Render:** Page with title, date picker (Select Date label), Generate button
- **Controls:** Date picker, Generate button state management
- **Service Calls:** Generate with date string, default to today's date, single call per click
- **Loading:** Button shows "Generating...", button disabled, skeleton display, removal on load
- **Success:** Report header display, report container render, loading state removal
- **Empty:** "No Data Found" message, helpful message display
- **Error:** Service unavailable (503) with retry, network failure, error messages
- **Format:** yyyy-mm-dd date format for API, multiple sequential reports

---

### UC10 - Monthly Report
**File:** `UC10_MonthlyReport/MonthlyReport.test.jsx` (27 tests)

**Mocks:**
- Service: `reportService.getMonthlyOpenCloseReport`, `typeSavingService.getAllTypeSavings`
- Utility: Print/export utilities (no-op mocks)

**Coverage:**
- **Controls:** Month picker, Savings Type select (All Types default), Generate button
- **Service Calls:** Month number + year + savings type, default current month, single call per click
- **Validation:** Service availability on mount, type selection changes
- **Loading:** Button shows "Generating...", button disabled, skeleton display, removal on load
- **Success:** Report header, report container, loading removal, totals calculation
- **Empty:** "No Data Found" message, helpful message display
- **Error:** Service unavailable (503) with retry, network failure, generic error alert
- **Features:** Savings type loading on mount, type change propagation, print/export capability, month picker changes

---

### UC11 - Change Regulations
**File:** `UC11_Regulations/Regulations.test.jsx` (30 tests)

**Mocks:**
- Service: `regulationService.getRegulations`, `regulationService.updateRegulations`, `regulationService.getInterestRates`, `regulationService.updateInterestRates`, `typeSavingService.getAllTypeSavings`
- Component: `RoleGuard`, `ServiceUnavailableState`, `CuteComponents` (StarDecor)

**Coverage:**
- **Render:** Page title "Regulation Settings", form inputs, update button
- **Service Calls:** Load regulations on mount (once), load interest rates on mount, single call verification
- **Data Loading:** Successful fetch, data processing, state storage (minimum balance, term days)
- **Loading:** Skeleton display during load, skeleton removal after load, form availability
- **Error:** Service unavailable (503), network failure, generic error handling
- **Interest Rates:** Load and process interest rates, data structure validation, store in state
- **Fallback:** Handle interest rates fetch failure, fallback to getAllTypeSavings, handle fallback failure gracefully
- **Services:** updateRegulations and updateInterestRates service availability
- **Consistency:** Data consistency maintenance, multiple service call coordination

---

## Test Utilities & Patterns

### Custom Render Utility
**Location:** `tests/test-utils/render.js`

Features:
- RTL `render()` with provider context
- `screen`, `waitFor`, `act` exports
- User event setup via `userEvent`

### Common Mocking Strategies

**Services:**
- `jest.mock()` with module path
- Return resolved/rejected promises
- Verify call count and arguments with `toHaveBeenCalled()`, `toHaveBeenCalledWith()`

**Heavy Components:**
- Mock `RoleGuard`, `ServiceUnavailableState`, `CuteComponents`
- Replace with lightweight divs or no-op components
- Preserve prop passing (callbacks, children)

**Async Testing:**
- `waitFor()` with timeout options (default 1000ms, custom 3000ms for complex scenarios)
- `userEvent.setup()` for user interactions
- Deferred promises for loading state verification
- `jest.useFakeTimers()` for debounce testing (UC08)

**Error Handling:**
- Mock service failures with `.mockRejectedValue()`
- 503 status for server unavailable, 404 for not found, custom errors
- Verify error message display

---

## How to Run Component Tests

### Run All Component Tests
```bash
cd frontend
npx jest tests/component -i
```

### Run Specific UC Test Suite
```bash
npx jest tests/component/UC08_SearchSavingBook -i
npx jest tests/component/UC02_Login -i
npx jest tests/component/UC11_Regulations -i
```

### Run Single Test File
```bash
npx jest tests/component/UC02_Login/Login.test.jsx -i
```

### Run with Coverage
```bash
npx jest tests/component --coverage
```

### Run in Watch Mode
```bash
npx jest tests/component --watch
```

### Run with Extended Timeout (Complex Tests)
```bash
npx jest tests/component --testTimeout=10000
```

---

## Notes

- **Total Tests:** 227 component tests across 12 test files
- **Unit Tests:** Documented separately in `TEST_CASES_SUMMARY.md` (backend tests not included here)
- **Mocking Approach:** Minimal mocking to avoid component initialization issues; service mocks are primary
- **Timeout Handling:** Most tests use default 1000ms; UC08 (SearchSavingBook) uses fake timers for debounce; complex flows use 3000ms
- **Error Patterns:** 503 = server unavailable, 404 = not found, network errors, validation errors
- **Loading States:** Skeleton loaders, disabled buttons, button text changes (e.g., "Generating...")
- **All Tests Passing:** Full component suite validates correctly with mocked services

