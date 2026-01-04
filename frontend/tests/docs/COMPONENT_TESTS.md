# Kiểm Thử Thành Phần (Component Tests) - Chi Tiết & Ví Dụ

## 1. Tổng Quan Component Tests

**Tập Tin:** 12 component test files  
**Tổng Tests:** 227  
**Thời Gian:** ~8-10 seconds  
**Mục Tiêu:** Kiểm tra mỗi component riêng lẻ, user interactions, form validation, error handling

**Công Cụ:** React Testing Library (RTL) + userEvent + Jest mocking

### Phân Loại Theo UC
| UC | Tên | Component | Tests |
|----|-----|-----------|-------|
| UC01 | Tạo Nhân Viên | CreateStaff | 13 |
| UC02 | Đăng Nhập | Login | 9 |
| UC03a | Quên Mật Khẩu | ForgotPassword | 13 |
| UC03b | Đặt Lại Mật Khẩu | ResetPassword | 19 |
| UC04 | Hồ Sơ Cá Nhân | Profile | 16 |
| UC05 | Mở Sổ Tiết Kiệm | OpenSavingBook | 15 |
| UC06 | Gửi Tiền | Deposit | 11 |
| UC07 | Rút Tiền | Withdraw | 20 |
| UC08 | Tìm Sổ Tiết Kiệm | SearchSavingBook | 32 |
| UC09 | Báo Cáo Hàng Ngày | DailyReport | 21 |
| UC10 | Báo Cáo Hàng Tháng | MonthlyReport | 27 |
| UC11 | Quản Lý Quy Định | Regulations | 30 |

---

## 2. Kiểm Thử Gì (✓) & Không Kiểm Thử Gì (✗)

### ✓ Kiểm Thử Được
- **Component Rendering:** Component load, elements visible (input, button, labels)
- **User Interactions:** Type text, click button, submit form, toggle checkbox
- **Form Validation:** Required field errors, email format, password mismatch
- **Loading States:** Button text changes, disable state, spinner display
- **Error Handling:** Error message display, retry button, 503 handling
- **Service Mocking:** Verify correct service called, correct parameters
- **Navigation (mocked):** useNavigate calls, route changes
- **State Management:** Form state updates, list refreshes

### ✗ Không Kiểm Thử
- ❌ Full page navigation (multipage flows - là IT tests)
- ❌ Browser APIs (localStorage, sessionStorage - mock nếu cần)
- ❌ Global state (Context, Redux - mock nếu needed)
- ❌ Visual styling (CSS - không test trong RTL)
- ❌ Network latency (mock async - không real API calls)

---

## 3. Mẫu Kiểm Thử Chung (Common Patterns)

### 3.1 Setup & Rendering
```javascript
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

// Mock services
jest.mock("../../../src/services/savingBookService");
import * as savingBookService from "../../../src/services/savingBookService";

// Mock heavy components
jest.mock("../shared/RoleGuard", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>
}));

describe("OpenSavingBook Component", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders the page", () => {
    render(<OpenSavingBook />);
    expect(screen.getByText("Mở Sổ Tiết Kiệm")).toBeInTheDocument();
  });
});
```

### 3.2 Testing Form Input
```javascript
test("accepts customer ID input", async () => {
  render(<OpenSavingBook />);
  
  const input = screen.getByPlaceholderText("Nhập mã khách hàng");
  expect(input).toBeInTheDocument();
  
  // User types
  await user.type(input, "KH123456");
  expect(input).toHaveValue("KH123456");
  
  // Whitespace trimming
  await user.clear(input);
  await user.type(input, "  KH123  ");
  expect(input.value.trim()).toBe("KH123");
});
```

### 3.3 Testing Form Submission
```javascript
test("submits form with correct data", async () => {
  savingBookService.createSavingBook.mockResolvedValue({ bookId: "001" });
  
  render(<OpenSavingBook />);
  
  // Fill form
  await user.type(screen.getByLabelText("Tên khách hàng"), "Nguyen Van A");
  await user.type(screen.getByLabelText("Số tiền"), "1000000");
  
  // Submit
  const submitBtn = screen.getByRole("button", { name: /tạo sổ/i });
  await user.click(submitBtn);
  
  // Verify service called
  await waitFor(() => {
    expect(savingBookService.createSavingBook).toHaveBeenCalledWith({
      customerId: expect.any(String),
      amount: 1000000,
      typeId: expect.any(String)
    });
  });
});
```

### 3.4 Testing Error Display
```javascript
test("displays error when service fails", async () => {
  savingBookService.createSavingBook.mockRejectedValue(
    new Error("400: Invalid amount")
  );
  
  render(<OpenSavingBook />);
  
  // Fill and submit
  await user.type(screen.getByLabelText("Số tiền"), "50000"); // Too low
  await user.click(screen.getByRole("button", { name: /tạo/ }));
  
  // Error message appears
  await waitFor(() => {
    expect(screen.getByText(/số tiền tối thiểu/i)).toBeInTheDocument();
  });
});
```

### 3.5 Testing 503 Retry Pattern
```javascript
test("shows retry button on 503 Service Unavailable", async () => {
  const error = new Error("503 Service Unavailable");
  error.status = 503;
  savingBookService.getProfile.mockRejectedValueOnce(error);
  
  render(<Profile />);
  
  // Service unavailable component shown
  await waitFor(() => {
    expect(screen.getByText("Dịch vụ tạm thời không khả dụng")).toBeInTheDocument();
  });
  expect(screen.getByRole("button", { name: /thử lại/i })).toBeInTheDocument();
  
  // User clicks retry
  savingBookService.getProfile.mockResolvedValueOnce(profileData);
  await user.click(screen.getByRole("button", { name: /thử lại/i }));
  
  // Data loads successfully
  await waitFor(() => {
    expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
  });
});
```

### 3.6 Testing Async Waiting with deferred Promises
```javascript
// Simulate slow network
const deferred = {};
const promise = new Promise((resolve, reject) => {
  deferred.resolve = resolve;
  deferred.reject = reject;
});
savingBookService.getRegulations.mockReturnValue(promise);

render(<OpenSavingBook />);

// Initially loading
expect(screen.getByRole("button", { name: /tạo sổ/i })).toBeDisabled();

// Resolve after user interaction
act(() => {
  deferred.resolve({ regulations: [...] });
});

await waitFor(() => {
  expect(screen.getByRole("button", { name: /tạo sổ/i })).toBeEnabled();
});
```

### 3.7 Testing Debouncing (useDebounce hook)
```javascript
// SearchSavingBook uses debounce for search input
test("debounces search input", async () => {
  jest.useFakeTimers();
  savingBookService.searchSavingBooks.mockResolvedValue({ results: [] });
  
  render(<SearchSavingBook />);
  const input = screen.getByPlaceholderText("Nhập mã sổ");
  
  // User types fast
  await user.type(input, "S001");
  expect(savingBookService.searchSavingBooks).not.toHaveBeenCalled();
  
  // Wait for debounce (500ms)
  jest.advanceTimersByTime(500);
  
  await waitFor(() => {
    expect(savingBookService.searchSavingBooks).toHaveBeenCalledWith("S001");
  });
  
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
```

---

## 4. Chi Tiết 12 Component Tests

### 4.1 UC01 - CreateStaff (13 tests)
**Mục Đích:** Tạo nhân viên mới, validation email, duplicate check

**Ví Dụ Test:**
```javascript
test("validates required fields on submit", async () => {
  render(<CreateStaff />);
  const submitBtn = screen.getByRole("button", { name: /tạo/ });
  
  await user.click(submitBtn);
  
  // Error messages appear
  expect(screen.getByText("Tên nhân viên là bắt buộc")).toBeInTheDocument();
  expect(screen.getByText("Email là bắt buộc")).toBeInTheDocument();
});

test("creates user and refreshes list", async () => {
  staffService.createUser.mockResolvedValue({ id: "emp123" });
  render(<CreateStaff onSuccess={mockCallback} />);
  
  await user.type(screen.getByLabelText("Tên"), "Nguyen Van B");
  await user.type(screen.getByLabelText("Email"), "user@example.com");
  await user.click(screen.getByRole("button", { name: /tạo/ }));
  
  await waitFor(() => {
    expect(staffService.createUser).toHaveBeenCalledWith({
      fullName: "Nguyen Van B",
      email: "user@example.com"
    });
    expect(mockCallback).toHaveBeenCalled();
  });
});
```

---

### 4.2 UC02 - Login (9 tests)
**Mục Đích:** Email validation, password entry, role-based navigation

**Ví Dụ Test:**
```javascript
test("navigates teller to dashboard", async () => {
  const mockNavigate = jest.fn();
  jest.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate
  }));
  useAuth.login.mockResolvedValue({ role: "TELLER" });
  
  render(<Login />);
  
  await user.type(screen.getByLabelText("Email"), "teller@bank.com");
  await user.type(screen.getByLabelText("Mật khẩu"), "password123");
  await user.click(screen.getByRole("button", { name: /đăng nhập/i }));
  
  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});

test("trims whitespace from email", async () => {
  render(<Login />);
  
  const emailInput = screen.getByLabelText("Email");
  await user.type(emailInput, "  user@example.com  ");
  
  // Submit
  await user.click(screen.getByRole("button", { name: /đăng nhập/i }));
  
  await waitFor(() => {
    expect(useAuth.login).toHaveBeenCalledWith({
      email: "user@example.com",  // Trimmed!
      password: expect.any(String)
    });
  });
});
```

---

### 4.3 UC03a - ForgotPassword (13 tests)
**Mục Đích:** Email validation, request password reset, success message

**Ví Dụ Test:**
```javascript
test("disables submit if email invalid", async () => {
  render(<ForgotPassword />);
  
  const submitBtn = screen.getByRole("button", { name: /gửi/i });
  expect(submitBtn).toBeDisabled();
  
  const emailInput = screen.getByLabelText("Email");
  await user.type(emailInput, "invalid-email");
  expect(submitBtn).toBeDisabled();
  
  await user.clear(emailInput);
  await user.type(emailInput, "valid@example.com");
  expect(submitBtn).toBeEnabled();
});

test("submits reset request", async () => {
  authService.requestPasswordReset.mockResolvedValue({ success: true });
  const mockCallback = jest.fn();
  
  render(<ForgotPassword onSuccess={mockCallback} />);
  
  await user.type(screen.getByLabelText("Email"), "user@example.com");
  await user.click(screen.getByRole("button", { name: /gửi/i }));
  
  await waitFor(() => {
    expect(authService.requestPasswordReset).toHaveBeenCalledWith({
      email: "user@example.com"
    });
    expect(mockCallback).toHaveBeenCalled();
  });
});
```

---

### 4.4 UC03b - ResetPassword (19 tests)
**Mục Đích:** Password validation, confirm mismatch, visual feedback

**Ví Dụ Test:**
```javascript
test("shows password requirement list", () => {
  render(<ResetPassword />);
  
  expect(screen.getByText("Mật khẩu phải có ít nhất 6 ký tự")).toBeInTheDocument();
  expect(screen.getByText("Mật khẩu và xác nhận phải trùng khớp")).toBeInTheDocument();
});

test("disables submit if password < 6 chars", async () => {
  render(<ResetPassword />);
  
  const passwordInput = screen.getByLabelText("Mật khẩu");
  const submitBtn = screen.getByRole("button", { name: /đặt lại/i });
  
  await user.type(passwordInput, "12345"); // 5 chars
  expect(submitBtn).toBeDisabled();
  
  await user.type(passwordInput, "6");     // Now 6 chars
  expect(submitBtn).toBeEnabled();
});

test("validates password match", async () => {
  render(<ResetPassword />);
  
  await user.type(screen.getByLabelText("Mật khẩu"), "password123");
  await user.type(screen.getByLabelText("Xác nhận"), "different");
  
  const submitBtn = screen.getByRole("button", { name: /đặt lại/i });
  expect(submitBtn).toBeDisabled();
});
```

---

### 4.5 UC04 - Profile (16 tests)
**Mục Đích:** Load profile, edit fields, change password, 503 retry

**Ví Dụ Test (503 Retry):**
```javascript
test("shows retry button on 503 error", async () => {
  const error = new Error("503");
  error.status = 503;
  userService.getProfile.mockRejectedValueOnce(error);
  
  render(<Profile />);
  
  await waitFor(() => {
    expect(screen.getByText(/dịch vụ tạm thời không khả dụng/i)).toBeInTheDocument();
  });
  expect(screen.getByRole("button", { name: /thử lại/i })).toBeInTheDocument();
  
  // Click retry
  userService.getProfile.mockResolvedValueOnce({
    id: "u123",
    name: "Nguyen Van A"
  });
  await user.click(screen.getByRole("button", { name: /thử lại/i }));
  
  // Profile loads
  await waitFor(() => {
    expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
  });
});

test("skeleton shows during load", () => {
  const deferred = {};
  const promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
  });
  userService.getProfile.mockReturnValue(promise);
  
  render(<Profile />);
  
  // Skeleton visible initially
  expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
  
  // Resolve
  act(() => {
    deferred.resolve({ name: "User A" });
  });
  
  // Skeleton removed
  waitFor(() => {
    expect(screen.queryByTestId("skeleton-loader")).not.toBeInTheDocument();
  });
});
```

---

### 4.6 UC05 - OpenSavingBook (15 tests)
**Mục Đích:** Lookup customer, create book, validation

**Ví Dụ Test:**
```javascript
test("looks up customer by ID", async () => {
  customerService.getCustomerById.mockResolvedValue({
    id: "KH123",
    name: "Nguyen Van A"
  });
  
  render(<OpenSavingBook />);
  
  await user.type(screen.getByPlaceholderText("Nhập CMND"), "123456789");
  await user.click(screen.getByRole("button", { name: /tìm kiếm/i }));
  
  await waitFor(() => {
    expect(customerService.getCustomerById).toHaveBeenCalledWith("123456789");
    expect(screen.getByDisplayValue("Nguyen Van A")).toBeInTheDocument();
  });
});

test("rejects low amount", async () => {
  render(<OpenSavingBook />);
  
  await user.type(screen.getByLabelText("Số tiền"), "50000"); // MIN=100k
  
  expect(screen.getByText(/tối thiểu 100/i)).toBeInTheDocument();
});
```

---

### 4.7 UC08 - SearchSavingBook (32 tests - Largest!)
**Mục Đích:** Search, filter, pagination, debouncing, empty states

**Ví Dụ Test (Debounce + Filter):**
```javascript
test("debounces search and filters", async () => {
  jest.useFakeTimers();
  savingBookService.searchSavingBooks.mockResolvedValue({
    data: [{ code: "S001", balance: 1000000 }],
    total: 1
  });
  typeSavingService.getAllTypeSavings.mockResolvedValue([
    { id: "1", name: "Tiết kiệm linh hoạt" }
  ]);
  
  render(<SearchSavingBook />);
  
  // User types fast
  const searchInput = screen.getByPlaceholderText("Nhập mã sổ");
  await user.type(searchInput, "S");
  expect(savingBookService.searchSavingBooks).not.toHaveBeenCalled();
  
  // Wait debounce
  jest.advanceTimersByTime(500);
  
  await waitFor(() => {
    expect(savingBookService.searchSavingBooks).toHaveBeenCalledWith(
      expect.objectContaining({ bookCode: "S" })
    );
  });
});

test("shows pagination", async () => {
  savingBookService.searchSavingBooks.mockResolvedValue({
    data: [...Array(10)],  // 10 items
    total: 25,
    page: 1,
    pageSize: 10
  });
  
  render(<SearchSavingBook />);
  
  await waitFor(() => {
    expect(screen.getByText("Trang 1/3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /trang tiếp/i })).toBeEnabled();
  });
});
```

---

### 4.8 UC09 - DailyReport (21 tests)
**Mục Đích:** Date picker, generate report, loading state, 503 retry

**Ví Dụ Test:**
```javascript
test("generates report with selected date", async () => {
  reportService.getDailyReport.mockResolvedValue({
    date: "2024-01-15",
    report: { deposits: 5000000, withdrawals: 1000000 }
  });
  
  render(<DailyReport />);
  
  // Select date (default today)
  const generateBtn = screen.getByRole("button", { name: /tạo báo cáo/i });
  await user.click(generateBtn);
  
  await waitFor(() => {
    expect(reportService.getDailyReport).toHaveBeenCalledWith({
      date: expect.stringMatching(/\d{4}-\d{2}-\d{2}/) // yyyy-mm-dd
    });
  });
  
  // Report displayed
  expect(screen.getByText(/gửi tiền/i)).toBeInTheDocument();
});

test("button shows Generating... while loading", async () => {
  const deferred = {};
  const promise = new Promise(resolve => {
    deferred.resolve = resolve;
  });
  reportService.getDailyReport.mockReturnValue(promise);
  
  render(<DailyReport />);
  
  const generateBtn = screen.getByRole("button", { name: /tạo báo cáo/i });
  await user.click(generateBtn);
  
  expect(generateBtn).toHaveTextContent("Đang tạo...");
  expect(generateBtn).toBeDisabled();
  
  // Resolve
  act(() => { deferred.resolve({ report: {} }); });
  
  await waitFor(() => {
    expect(generateBtn).toHaveTextContent("Tạo báo cáo");
  });
});
```

---

### 4.9 UC10 - MonthlyReport (27 tests)
**Mục Đích:** Month picker, type filter, interest rate calculation display

**Ví Dụ Test:**
```javascript
test("loads types on mount and filters report", async () => {
  typeSavingService.getAllTypeSavings.mockResolvedValue([
    { id: "1", name: "Tiết kiệm linh hoạt" },
    { id: "2", name: "Tiết kiệm cố định" }
  ]);
  reportService.getMonthlyOpenCloseReport.mockResolvedValue({
    data: { total: 2, opened: 1, closed: 1 }
  });
  
  render(<MonthlyReport />);
  
  // Types loaded
  await waitFor(() => {
    expect(screen.getByRole("option", { name: /tiết kiệm cố định/i })).toBeInTheDocument();
  });
  
  // Filter by type
  const typeSelect = screen.getByLabelText("Loại tiết kiệm");
  await user.selectOption(typeSelect, "2");
  
  // Report updates
  await waitFor(() => {
    expect(reportService.getMonthlyOpenCloseReport).toHaveBeenCalledWith(
      expect.objectContaining({ typeSavingId: "2" })
    );
  });
});
```

---

### 4.10 UC11 - Regulations (30 tests - Complex!)
**Mục Đích:** Load regulations + interest rates, update services, fallback strategy

**Ví Dụ Test (Fallback):**
```javascript
test("falls back to getAllTypeSavings if interest rates fail", async () => {
  regulationService.getRegulations.mockResolvedValue({
    minBalance: 100000,
    maxTransaction: 1000000000
  });
  regulationService.getInterestRates.mockRejectedValue(
    new Error("Interest rate service down")
  );
  typeSavingService.getAllTypeSavings.mockResolvedValue([
    { id: "1", name: "Type A", rate: 0.04 }
  ]);
  
  render(<Regulations />);
  
  // Regulations loaded
  await waitFor(() => {
    expect(screen.getByDisplayValue("100000")).toBeInTheDocument();
  });
  
  // Falls back to types
  expect(typeSavingService.getAllTypeSavings).toHaveBeenCalled();
  
  // No error shown (graceful fallback)
  expect(screen.queryByText(/lỗi tải lãi suất/i)).not.toBeInTheDocument();
});

test("updates regulations", async () => {
  regulationService.getRegulations.mockResolvedValue({ minBalance: 100000 });
  regulationService.updateRegulations.mockResolvedValue({ success: true });
  
  render(<Regulations />);
  
  // Wait for load
  await waitFor(() => {
    expect(screen.getByDisplayValue("100000")).toBeInTheDocument();
  });
  
  // Edit
  const minBalanceInput = screen.getByDisplayValue("100000");
  await user.clear(minBalanceInput);
  await user.type(minBalanceInput, "200000");
  
  // Submit
  await user.click(screen.getByRole("button", { name: /cập nhật/i }));
  
  // Service called
  await waitFor(() => {
    expect(regulationService.updateRegulations).toHaveBeenCalledWith({
      minBalance: 200000
    });
  });
});
```

---

## 5. Bảng UC ↔ Component Tests

| UC | Component | Tests | Main Coverage |
|----|-----------|-------|---|
| UC01 | CreateStaff | 13 | User creation, email validation, list refresh |
| UC02 | Login | 9 | Auth, role navigation, email validation |
| UC03a | ForgotPassword | 13 | Email validation, reset request |
| UC03b | ResetPassword | 19 | Password validation, confirm match, visual feedback |
| UC04 | Profile | 16 | Load profile, edit, change password, 503 retry |
| UC05 | OpenSavingBook | 15 | Customer lookup, account creation, validation |
| UC06 | Deposit | 11 | Account lookup, deposit submission, validation |
| UC07 | Withdraw | 20 | Withdrawal types, maturity check, balance validation |
| UC08 | SearchSavingBook | 32 | Search debouncing, filtering, pagination, empty states |
| UC09 | DailyReport | 21 | Date picker, report generation, 503 retry |
| UC10 | MonthlyReport | 27 | Month picker, type filtering, calculations |
| UC11 | Regulations | 30 | Load regulations + rates, update, fallback strategy |

---

## 6. Mocking Best Practices

### 6.1 Service Mocking
```javascript
// ✓ Good: Mock at module level
jest.mock("../../../src/services/savingBookService");
import * as savingBookService from "../../../src/services/savingBookService";

// Use in tests
savingBookService.createSavingBook.mockResolvedValue({ id: "001" });

// ✗ Bad: Mock in render (loses reference)
jest.mock("../services/...", () => ({
  createSavingBook: jest.fn() // Creates new fn each test
}));
```

### 6.2 Component Mocking (Only Heavy Components)
```javascript
// ✓ Good: Mock RoleGuard, ServiceUnavailableState (don't need UI)
jest.mock("../shared/RoleGuard", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>
}));

// ✗ Bad: Mock form components (users interact with them)
// jest.mock("../components/TextField"); // DON'T DO THIS
```

### 6.3 Async Handling
```javascript
// ✓ Good: Use waitFor with async assertions
await waitFor(() => {
  expect(savingBookService.createSavingBook).toHaveBeenCalled();
});

// ✗ Bad: setTimeout (not deterministic)
setTimeout(() => {
  expect(...).toBeTruthy();
}, 1000);

// ✓ Good: Deferred promises for control
const deferred = {};
const promise = new Promise((resolve, reject) => {
  deferred.resolve = resolve;
  deferred.reject = reject;
});
savingBookService.getProfile.mockReturnValue(promise);

// ✗ Bad: Real API calls (should be mocked)
// const data = await fetch("/api/..."); // Don't do in tests!
```

---

## 7. Chạy Component Tests

### 7.1 Tất Cả Component Tests
```bash
cd frontend
npx jest tests/component
npx jest tests/component -i  # Sequential if issues
```

### 7.2 Một UC Cụ Thể
```bash
npx jest tests/component/UC02_Login
npx jest tests/component/UC08_SearchSavingBook
npx jest tests/component/UC11_Regulations
```

### 7.3 Một File Cụ Thể
```bash
npx jest tests/component/UC02_Login/Login.test.jsx
```

### 7.4 Watch Mode
```bash
npx jest tests/component --watch
```

### 7.5 With Extended Timeout
```bash
npx jest tests/component --testTimeout=10000
```

---

## 8. Thống Kê & Tốc Độ

| Mục | Giá Trị |
|-----|--------|
| **Tổng Files** | 12 |
| **Tổng Tests** | 227 |
| **Largest Suite** | UC08_SearchSavingBook (32 tests) |
| **Smallest Suite** | UC02_Login (9 tests) |
| **Trung bình/UC** | ~19 tests |
| **Thời Gian Chạy** | ~8-10s |

---

## 9. Giả Định & Giới Hạn

### ⚠️ Giả Định
- Services mocked hoàn toàn (không gọi real API)
- Component props hợp lệ (không test prop drilling errors)
- RTL queries stable (data-testid, role, placeholder text)
- Không test browser APIs (localStorage, fetch - mock nếu cần)

### 📌 Giới Hạn
- Component tests KHÔNG cover multiple-page flows (IT tests làm)
- KHÔNG test CSS styling
- KHÔNG test component tree deep integration (parent-child complexities - IT tests cover)

---

**Phiên Bản:** 1.0 | **Cập Nhật:** 2024  
**Tổng Tests:** 227/502 (45.2% of frontend tests)  
**UC Coverage:** 12/12 (100%)
