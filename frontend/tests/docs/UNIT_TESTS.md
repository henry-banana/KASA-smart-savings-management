# Kiểm Thử Đơn Vị (Unit Tests) - Chi Tiết & Ví Dụ

## 1. Tổng Quan Unit Tests

**Tập Tin:** 7 unit test files  
**Tổng Tests:** 184  
**Thời Gian:** ~2.3 seconds  
**Mục Tiêu:** Kiểm tra logic thuần (utilities, hooks, constants) độc lập, không cần UI render

### Phân Loại
| Loại | Số Tests | Ví Dụ |
|------|----------|-------|
| **Utilities** | 90 | authErrorMapper, numberFormatter, serverStatusUtils, typeColorUtils |
| **Constants & Validation** | 63 | business.js (validators, constants, interest rates) |
| **React Hooks** | 29 | useApi, useDebounce |

---

## 2. Kiểm Thử Gì (✓) & Không Kiểm Thử Gì (✗)

### ✓ Kiểm Thử Được
- **Hàm thuần (Pure Functions):** Input → Output, không side effects
- **Validators:** CMND (9 chữ số), CCCD (12 chữ số), số tiền (100k-1B VNĐ)
- **Formatters:** Định dạng VNĐ (dấu . cho hàng nghìn, , cho thập phân), phần trăm
- **Error Classification:** Phân loại lỗi HTTP (503, 4xx, 5xx) theo priority
- **Color Utils:** Hash deterministic cho saving types → Tailwind classes
- **Interest Calculation:** Formula: Principal × Rate × Months/12
- **Custom Hooks:** useApi (loading, error, data states), useDebounce (delay timing)

### ✗ Không Kiểm Thử
- ❌ Component rendering (là nhiệm vụ của Component Tests)
- ❌ User interactions (click, type - là nhiệm vụ của Component Tests)
- ❌ Service API calls (giả định services hoạt động)
- ❌ DOM queries (không có DOM trong unit tests)
- ❌ Global state management (nếu có - là Component/Integration Tests)

---

## 3. 7 Unit Test Files Chi Tiết

### 3.1 authErrorMapper.test.js (10 tests)
**Mục Đích:** Map HTTP errors → User-friendly messages theo priority

**Mẫu Kiểm Thử:**
```javascript
// Priority 1: Network errors (highest)
expect(mapAuthErrorToMessage(connectionRefused)).toBe("Lỗi kết nối");
expect(isSessionExpiredError(connectionError)).toBe(true);

// Priority 2: Token expired
expect(mapAuthErrorToMessage(sessionExpired)).toBe("Phiên đã hết hạn");

// Priority 3: Auth errors (401, 403)
expect(mapAuthErrorToMessage(unauthorizedError)).toBe("Bạn không có quyền");

// Kiểm tra priority order
const result = classifyError([error503, error401, errorNetwork]);
expect(result).toBe(errorNetwork); // Network error = highest priority
```

**Use Cases:** UC02 (Login error handling), UC03 (Auth errors), UC04 (Session expired)

---

### 3.2 numberFormatter.test.js (12 tests)
**Mục Đích:** Format số theo Vietnamese locale (VNĐ)

**Mẫu Kiểm Thử:**
```javascript
// Vietnamese format: 1.000.000 (không phải 1,000,000)
expect(formatVnNumber(1000000)).toBe("1.000.000");
expect(formatVnNumber(1000000.5)).toBe("1.000.000,50");

// Percentage text
expect(formatPercentText("5% /năm")).toBe("5% /năm");
expect(formatPercentText("Cộng là 5%")).toBe("Cộng là 5%");

// Edge cases
expect(formatVnNumber(0)).toBe("0");
expect(formatVnNumber(null)).toBe("-");
expect(formatVnNumber(1000000000)).toBe("1.000.000.000");
```

**Use Cases:** All transaction screens (UC05, UC06, UC07), dashboard, reports

---

### 3.3 serverStatusUtils.test.js (46 tests - Biggest!)
**Mục Đích:** Phân loại HTTP errors → Quyết định retry vs show error

**Mẫu Kiểm Thử:**
```javascript
// Network errors (503, timeout, ECONNREFUSED)
expect(isServerUnavailable(error503)).toBe(true);
expect(isServerUnavailable(connectionRefusedError)).toBe(true);

// Business errors (4xx validation/auth)
expect(isBusinessError(error400BadRequest)).toBe(true);
expect(isBusinessError(error401Unauthorized)).toBe(true);
expect(isBusinessError(error422UnprocessableEntity)).toBe(true);

// Server errors (5xx)
expect(isServerError(error500InternalServer)).toBe(true);
expect(isServerError(error502BadGateway)).toBe(true);

// Priority testing
const allErrors = [error503, error401, error500];
expect(classifyError(allErrors)).toBe(error503); // Unavailable = priority 1
```

**Quy Tắc Priority:**
1. **Unavailable** (503, timeout, ECONNREFUSED) → Hiển thị "Retry" button
2. **Business Error** (4xx) → Hiển thị validation message
3. **Server Error** (5xx) → Hiển thị "Try Again" button
4. **Unknown** → Generic error

**Use Cases:** Error handling across all UCs, retry logic (IT04, IT10, IT11)

---

### 3.4 typeColorUtils.test.js (22 tests)
**Mục Đích:** Deterministic color mapping cho saving types (Savings Book Types)

**Mẫu Kiểm Thử:**
```javascript
// Same type → Same color always
expect(getTypeBadgeColor("Tiết kiệm linh hoạt")).toBe("bg-blue-500");
expect(getTypeBadgeColor("Tiết kiệm linh hoạt")).toBe("bg-blue-500"); // Consistent

// Case-insensitive
expect(getTypeBadgeColor("TIẾT KIỆM LINH HOẠT")).toBe("bg-blue-500");

// Null/undefined handling
expect(getTypeBadgeColor(null)).toBe("bg-gray-300");
expect(getTypeBadgeColor(undefined)).toBe("bg-gray-300");

// Chart colors
expect(getTypeChartColor("Tiết kiệm cố định")).toBe("#ff6b6b");
expect(getTypeChartColor("Tiết kiệm cộng lãi")).toBe("#4c6ef5");
```

**Use Cases:** Dashboard (UC11), Savings Book list (UC08), badges in tables

---

### 3.5 business.test.js (63 tests - Largest Suite!)
**Mục Đích:** Business logic: validators, constants, interest rates, currency formatting

**Mẫu Kiểm Thử - Validators:**
```javascript
// ID Validation
expect(validateIdCard("123456789")).toBe(true);   // CMND 9 digits
expect(validateIdCard("123456789012")).toBe(true); // CCCD 12 digits
expect(validateIdCard("12345")).toBe(false);       // Too short
expect(validateIdCard("ABCDEFGHI")).toBe(false);   // Non-numeric

// Amount Validation
expect(validateAmount(100000)).toBe(true);        // MIN_DEPOSIT
expect(validateAmount(1000000000)).toBe(true);    // MAX_TRANSACTION
expect(validateAmount(50000)).toBe(false);        // Below MIN
expect(validateAmount(1000000001)).toBe(false);   // Above MAX
```

**Mẫu Kiểm Thử - Interest Rates:**
```javascript
// Interest rates theo term (ordered by rate ascending)
const rates = getInterestRates();
expect(rates[0].term).toBe(1);      // 1 month = 2%
expect(rates[0].rate).toBe(0.02);
expect(rates[4].term).toBe(36);     // 36 months = 6.5%
expect(rates[4].rate).toBe(0.065);

// Rate ordering: 2% < 4% < 4.5% < 6% < 6.5%
for (let i = 1; i < rates.length; i++) {
  expect(rates[i].rate).toBeGreaterThan(rates[i-1].rate);
}
```

**Mẫu Kiểm Thử - Currency Format:**
```javascript
// Format currency = formatVnNumber + " đ"
expect(formatCurrency(1000000)).toBe("1.000.000 đ");
expect(formatCurrency(0)).toBe("0 đ");

// Interest calculation: Principal × Rate × Months / 12
const principal = 1000000;
const rate = 0.05;   // 5%
const months = 12;
const interest = calculateInterest(principal, rate, months);
expect(interest).toBe(50000);  // 1,000,000 × 0.05 = 50,000
```

**Use Cases:** UC04 (Profile), UC05 (Open Book), UC06 (Deposit), UC07 (Withdraw), UC10 (Monthly Report)

---

### 3.6 useApi.test.js (16 tests)
**Mục Đích:** Custom hook quản lý async API calls (loading, error, data states)

**Mẫu Kiểm Thử:**
```javascript
// Initial state
const { result } = renderHook(() => useApi());
expect(result.current.data).toBeNull();
expect(result.current.loading).toBe(false);
expect(result.current.error).toBeNull();

// Successful call
const { result } = renderHook(() => useApi());
const mockFn = jest.fn().mockResolvedValue({ id: 123 });

act(() => {
  result.current.execute(mockFn);
});
await waitFor(() => {
  expect(result.current.loading).toBe(false);
  expect(result.current.data).toEqual({ id: 123 });
});

// Failed call
const { result } = renderHook(() => useApi());
const failFn = jest.fn().mockRejectedValue(new Error("Network error"));

act(() => {
  result.current.execute(failFn);
});
await waitFor(() => {
  expect(result.current.error).not.toBeNull();
  expect(result.current.loading).toBe(false);
});

// Reset function
act(() => {
  result.current.reset();
});
expect(result.current.data).toBeNull();
expect(result.current.error).toBeNull();
```

**Use Cases:** Every page with API calls (UC01-UC11)

---

### 3.7 useDebounce.test.js (13 tests)
**Mục Đích:** Custom hook debounce rapid user input (e.g., search)

**Mẫu Kiểm Thử:**
```javascript
// Initial value
const { result, rerender } = renderHook(
  ({ value, delay }) => useDebounce(value, delay),
  { initialProps: { value: "hello", delay: 500 } }
);
expect(result.current).toBe("hello"); // Initial immediate

// Debounce delay (500ms default)
jest.useFakeTimers();
rerender({ value: "hello world", delay: 500 });
expect(result.current).toBe("hello");  // Still old value
jest.advanceTimersByTime(499);
expect(result.current).toBe("hello");  // Still waiting
jest.advanceTimersByTime(1);
expect(result.current).toBe("hello world"); // Now updated!

// Rapid changes (only last one emits)
rerender({ value: "a", delay: 500 });
jest.advanceTimersByTime(100);
rerender({ value: "ab", delay: 500 });
jest.advanceTimersByTime(100);
rerender({ value: "abc", delay: 500 });
jest.advanceTimersByTime(500);
expect(result.current).toBe("abc");  // Only final value

// Custom delay
rerender({ value: "test", delay: 300 });
jest.advanceTimersByTime(300);
expect(result.current).toBe("test");

// Cleanup on unmount (no memory leaks)
jest.runAllTimers();
unmount();
// No warnings about "can't perform state update on unmounted component"
```

**Use Cases:** UC08 (Search Saving Book - debounce search input), UC12 (Form input debounce if exists)

---

## 4. Mẫu Kiểm Thử Chung (Patterns)

### 4.1 Parametrized Tests (Kiểm Thử Tham Số Hóa)
```javascript
// test.each() thay vì viết lặp lại
describe("validateAmount", () => {
  it.each([
    [100000, true],      // MIN_DEPOSIT
    [500000, true],
    [1000000000, true],  // MAX_AMOUNT
    [50000, false],      // Below MIN
    [1000000001, false], // Above MAX
  ])("validates amount %p", (amount, expected) => {
    expect(validateAmount(amount)).toBe(expected);
  });
});
```

### 4.2 Testing Edge Cases
```javascript
describe("numberFormatter", () => {
  it("handles null/undefined gracefully", () => {
    expect(formatVnNumber(null)).toBe("-");
    expect(formatVnNumber(undefined)).toBe("-");
  });

  it("handles zero", () => {
    expect(formatVnNumber(0)).toBe("0");
  });

  it("handles negative numbers", () => {
    expect(formatVnNumber(-1000000)).toBe("-1.000.000");
  });

  it("handles very large numbers (1B+)", () => {
    expect(formatVnNumber(1000000000)).toBe("1.000.000.000");
    expect(formatVnNumber(999999999999)).toBe("999.999.999.999");
  });
});
```

### 4.3 Hook Testing with act() & waitFor()
```javascript
it("loads data and updates state correctly", async () => {
  const { result } = renderHook(() => useApi());
  const mockService = jest.fn().mockResolvedValue({ status: "ok" });

  act(() => {
    result.current.execute(mockService);
  });

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });

  expect(result.current.data).toEqual({ status: "ok" });
});
```

---

## 5. Chạy Unit Tests

### 5.1 Tất Cả Unit Tests
```bash
cd frontend
npx jest tests/unit          # Chạy tất cả
npx jest tests/unit -i       # Sequential (nếu có timeout issues)
```

### 5.2 Một File Cụ Thể
```bash
npx jest tests/unit/serverStatusUtils.test.js
npx jest tests/unit/business.test.js
npx jest tests/unit/useApi.test.js
```

### 5.3 Một Test Cụ Thể
```bash
npx jest tests/unit/business.test.js -t "validateIdCard"
npx jest tests/unit/serverStatusUtils.test.js -t "priority"
```

### 5.4 Watch Mode (Dev)
```bash
npx jest tests/unit --watch
```

### 5.5 Coverage
```bash
npx jest tests/unit --coverage
```

---

## 6. Bảng UC ↔ Unit Tests

| UC | Use Case | Utilities Needed | Unit Tests |
|----|----------|-----------------|-----------|
| UC02 | Đăng Nhập | Auth error mapping, validation | authErrorMapper (10) |
| UC03 | Quên Mật Khẩu | Email validation, error handling | authErrorMapper (10) |
| UC04 | Hồ Sơ Cá Nhân | Formatters, profile validation | numberFormatter (12) |
| UC05 | Mở Sổ | Validators (ID, amount), business logic | business (63), validators |
| UC06 | Gửi Tiền | Amount validation, formatting | business (63), numberFormatter (12) |
| UC07 | Rút Tiền | Amount validation, interest calc | business (63), validators |
| UC08 | Tìm Sổ | Debounce search, type color mapping | useDebounce (13), typeColorUtils (22) |
| UC09 | Báo Cáo Ngày | Formatter, error handling | numberFormatter (12), serverStatusUtils (46) |
| UC10 | Báo Cáo Tháng | Interest calculation, formatting | business (63), numberFormatter (12) |
| UC11 | Quy Định | Validator, error classification | business (63), serverStatusUtils (46) |

**Ghi Chú:** Hầu hết UCs dùng **serverStatusUtils (46 tests)** để handle errors

---

## 7. Thống Kê & Tốc Độ

| Mục | Giá Trị |
|-----|--------|
| **Tổng Files** | 7 |
| **Tổng Tests** | 184 |
| **Thời Gian** | 2.3s |
| **Trung bình/test** | 12.6ms |
| **Largest Suite** | business.test.js (63 tests) |
| **Smallest Suite** | authErrorMapper.test.js (10 tests) |

---

## 8. Giả Định & Giới Hạn

### ⚠️ Giả Định
- Tất cả validators được gọi với valid input types (string, number - không null)
- Services hoạt động như mong đợi (tested riêng biệt trong Component/IT tests)
- Không test React lifecycle (side effects, cleanup) - đó là Component Tests

### 📌 Giới Hạn
- Unit tests KHÔNG verify component rendering
- KHÔNG test async component logic (e.g., useEffect hooks) - Component Tests làm điều này
- KHÔNG test service mocking - Services được mock ở Component/Integration level

---

**Phiên Bản:** 1.0 | **Cập Nhật:** 2024  
**Tổng Tests:** 184/502 (36.7% of frontend tests)
