# Kiểm Thử Tích Hợp (Integration Tests) - Chi Tiết & Ví Dụ

## 1. Tổng Quan Integration Tests

**Tập Tin:** 11 integration test files  
**Tổng Tests:** 91  
**Thời Gian:** ~10-12 seconds  
**Mục Tiêu:** Kiểm tra toàn bộ luồng người dùng (Use Case), từ page load → submit → success/error recovery

**Công Cụ:** React Testing Library + MemoryRouter (giả lập navigation) + Service mocking

### Phân Loại Theo IT (Integration Test suites)
| IT | Use Case | Tests | Tính Năng Chính |
|----|----------|-------|---|
| IT01 | Login Flow | 11 | Auth, role navigation, logout |
| IT02 | Create Staff | 9 | User creation, validation, list refresh |
| IT03 | Password Reset | 8 | Email request + password reset flow |
| IT04 | Profile Management | 10 | Load profile, edit, change password, 503 retry |
| IT05 | Open Saving Book | 10 | Customer lookup, account creation, validation |
| IT06 | Deposit Flow | 8 | Account lookup, deposit submission |
| IT07 | Withdraw Flow | 9 | Withdrawal types, balance check |
| IT08 | Search & Detail View | 11 | Search, pagination, detail modal |
| IT09 | Daily Report | 9 | Date selection, report generation |
| IT10 | Monthly Report | 9 | Month picker, type filter, 503 retry |
| IT11 | Regulations & Settings | 9 | Load regulations, update settings |

**Ghi Chú:** IT10 = Monthly Report, IT11 = Regulations (không phải tên tương ứng với UC)

---

## 2. Kiểm Thử Gì (✓) & Không Kiểm Thử Gì (✗)

### ✓ Kiểm Thử Được
- **Full Workflow:** Toàn bộ luồng từ đầu đến cuối (UC01-UC11)
- **Multiple Page Transitions:** Page A → Page B → Page C (dùng MemoryRouter)
- **Service Call Sequences:** Verify call order (lookup → create → list refresh)
- **Error Scenarios:** Network errors, validation errors, 503 Service Unavailable
- **Retry Logic:** 503 → Retry button → Service succeeds
- **State Preservation:** Form data không mất khi chuyển page
- **Role-based Navigation:** Admin → Dashboard, Teller → Teller Page
- **Concurrent Requests:** Multiple async calls in sequence

### ✗ Không Kiểm Thử
- ❌ Real API calls (tất cả services mocked)
- ❌ Browser persistence (localStorage - mock nếu cần)
- ❌ Network latency simulation (chỉ dùng deferred promises)
- ❌ Full end-to-end (E2E tests với Cypress/Playwright làm điều này)
- ❌ Load testing (performance testing riêng)

---

## 3. Mẫu Kiểm Thử Integration

### 3.1 Basic Workflow Pattern
```javascript
describe("IT01 - LoginFlow", () => {
  const user = userEvent.setup();

  test("logs in user and navigates to dashboard", async () => {
    // 1. SETUP: Mock all services for this flow
    authService.login.mockResolvedValue({
      user: { id: "u123", name: "Teller A", role: "TELLER" },
      token: "jwt-token"
    });
    dashboardService.getDashboardData.mockResolvedValue({
      totalDeposit: 5000000,
      totalWithdraw: 1000000
    });

    // 2. RENDER: Wrap components with Router for navigation
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>
    );

    // 3. INTERACT: Simulate user actions
    await user.type(screen.getByLabelText("Email"), "teller@bank.com");
    await user.type(screen.getByLabelText("Mật khẩu"), "password123");
    await user.click(screen.getByRole("button", { name: /đăng nhập/i }));

    // 4. VERIFY: Check service calls + UI changes
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: "teller@bank.com",
        password: "password123"
      });
      // User navigated to dashboard
      expect(screen.getByText("Bảng Điều Khiển")).toBeInTheDocument();
      expect(screen.getByText("5.000.000 đ")).toBeInTheDocument();
    });
  });
});
```

### 3.2 Error Handling Pattern (Non-503)
```javascript
test("shows validation error on form", async () => {
  const error = new Error("400: Email already registered");
  error.status = 400;
  staffService.createUser.mockRejectedValue(error);

  render(<CreateStaffFlow />);

  await user.type(screen.getByLabelText("Tên"), "Nguyen Van B");
  await user.type(screen.getByLabelText("Email"), "existing@example.com");
  await user.click(screen.getByRole("button", { name: /tạo/i }));

  // Error message displays
  await waitFor(() => {
    expect(screen.getByText(/email đã tồn tại/i)).toBeInTheDocument();
  });

  // Dialog still open (user can retry)
  expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
});
```

### 3.3 503 Retry Pattern (CRITICAL!)
```javascript
test("retries on 503 Service Unavailable", async () => {
  // First call: 503 error
  const unavailableError = new Error("503 Service Unavailable");
  unavailableError.status = 503;
  profileService.getProfile.mockRejectedValueOnce(unavailableError);

  // Second call (after retry): Success
  profileService.getProfile.mockResolvedValueOnce({
    id: "u123",
    name: "Nguyen Van A",
    email: "user@example.com"
  });

  render(
    <MemoryRouter initialEntries={["/profile"]}>
      <Routes>
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </MemoryRouter>
  );

  // 503 error → Retry button shown
  await waitFor(() => {
    expect(screen.getByText(/dịch vụ tạm thời không khả dụng/i)).toBeInTheDocument();
  });
  expect(screen.getByRole("button", { name: /thử lại/i })).toBeInTheDocument();

  // User clicks retry
  const retryBtn = screen.getByRole("button", { name: /thử lại/i });
  await user.click(retryBtn);

  // Service succeeds, profile loads
  await waitFor(() => {
    expect(profileService.getProfile).toHaveBeenCalledTimes(2); // First + retry
    expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });
});
```

### 3.4 Multi-Step Workflow Pattern
```javascript
test("opens saving book with customer lookup", async () => {
  // Setup: All services for the complete flow
  customerService.searchCustomerByCitizenId.mockResolvedValue({
    id: "cust123",
    name: "Nguyen Van A",
    balance: 0
  });
  typeSavingService.getAllTypeSavings.mockResolvedValue([
    { id: "type1", name: "Tiết kiệm linh hoạt", rate: 0.02 }
  ]);
  regulationService.getRegulations.mockResolvedValue({
    minBalance: 100000,
    maxTransaction: 1000000000
  });
  savingBookService.createSavingBook.mockResolvedValue({
    id: "book001",
    customerId: "cust123",
    balance: 1000000
  });

  render(
    <MemoryRouter initialEntries={["/open-saving-book"]}>
      <Routes>
        <Route path="/open-saving-book" element={<OpenSavingBook />} />
      </Routes>
    </MemoryRouter>
  );

  // Step 1: Lookup customer
  const customerIdInput = screen.getByPlaceholderText("Nhập CMND");
  await user.type(customerIdInput, "123456789");
  await user.click(screen.getByRole("button", { name: /tìm kiếm/i }));

  // Verify lookup
  await waitFor(() => {
    expect(customerService.searchCustomerByCitizenId).toHaveBeenCalledWith("123456789");
    expect(screen.getByDisplayValue("Nguyen Van A")).toBeInTheDocument();
  });

  // Step 2: Fill form
  await user.type(screen.getByLabelText("Số tiền"), "1000000");
  const typeSelect = screen.getByLabelText("Loại tiết kiệm");
  await user.selectOption(typeSelect, "type1");

  // Step 3: Create book
  await user.click(screen.getByRole("button", { name: /tạo sổ/i }));

  // Verify creation
  await waitFor(() => {
    expect(savingBookService.createSavingBook).toHaveBeenCalledWith({
      customerId: "cust123",
      amount: 1000000,
      typeId: "type1"
    });
    // Success message
    expect(screen.getByText(/sổ tiết kiệm đã được tạo/i)).toBeInTheDocument();
  });
});
```

### 3.5 List Refresh & Pagination Pattern
```javascript
test("searches and navigates pages", async () => {
  // Initial search results
  savingBookService.searchSavingBooks.mockResolvedValue({
    data: [
      { code: "S001", balance: 1000000, status: "ACTIVE" },
      { code: "S002", balance: 2000000, status: "ACTIVE" }
    ],
    total: 25,
    page: 1,
    pageSize: 2
  });

  render(
    <MemoryRouter initialEntries={["/search-saving-book"]}>
      <Routes>
        <Route path="/search-saving-book" element={<SearchSavingBook />} />
      </Routes>
    </MemoryRouter>
  );

  // Wait for initial load
  await waitFor(() => {
    expect(screen.getByText("S001")).toBeInTheDocument();
    expect(screen.getByText("S002")).toBeInTheDocument();
  });

  // Page info
  expect(screen.getByText("Trang 1/13")).toBeInTheDocument();

  // Navigate to next page
  savingBookService.searchSavingBooks.mockResolvedValue({
    data: [
      { code: "S003", balance: 3000000, status: "ACTIVE" },
      { code: "S004", balance: 4000000, status: "ACTIVE" }
    ],
    total: 25,
    page: 2,
    pageSize: 2
  });

  await user.click(screen.getByRole("button", { name: /trang tiếp/i }));

  // Page 2 displayed
  await waitFor(() => {
    expect(screen.getByText("S003")).toBeInTheDocument();
    expect(screen.getByText("Trang 2/13")).toBeInTheDocument();
  });

  // Verify service called with page parameter
  expect(savingBookService.searchSavingBooks).toHaveBeenLastCalledWith(
    expect.objectContaining({ page: 2 })
  );
});
```

---

## 4. Chi Tiết 11 Integration Tests

### 4.1 IT01 - LoginFlow (11 tests)
**Luồng:** Input credentials → Validate → Call API → Navigate by role

**Các Test Chính:**
- Teller login → Navigate to teller dashboard
- Admin login → Navigate to admin dashboard
- Invalid email → Error message
- Wrong password → 401 Unauthorized
- Network error → Retry option
- Session expired (on dashboard) → Redirect to login

**Emphasis:** Role-based navigation, token management

---

### 4.2 IT02 - CreateStaffFlow (9 tests)
**Luồng:** Open dialog → Fill form → Validate → Create → List refresh

**Các Test Chính:**
- Create with valid data → List updated
- Required fields validation
- Duplicate email error (409)
- Server error (500) → Error message
- Form resets after successful create
- Whitespace trimming
- Form remains open on non-409 errors

**Emphasis:** List refresh after creation

---

### 4.3 IT03 - PasswordResetFlow (8 tests)
**Luồng:** Page1 (Request) → Email validation → Page2 (Reset) → Password validation → Success

**Các Test Chính:**
- Email validation on request page
- Send reset request → Redirect to reset page
- Password validation (6+ chars, match)
- Submit reset → Success message
- Invalid/expired code (400) → Error
- Network error → Retry
- Email appears in form (from previous page)

**Emphasis:** Multi-step flow without losing data

---

### 4.4 IT04 - ProfileManagementFlow (10 tests)
**Luồng:** Load profile → Edit → Save OR Change Password

**Các Test Chính:**
- **🔴 503 RETRY:** Profile unavailable → Retry button → Load success
- Load profile on page init
- Edit profile form → Submit → Success
- Change password dialog → Submit → Success
- Validation errors on edit (email format)
- Server error (500) on save → Error message
- Concurrent calls (get + update) handling
- Error message clears on successful retry

**Emphasis:** 503 Retry handling + State preservation

---

### 4.5 IT05 - OpenSavingBookFlow (10 tests)
**Luồng:** Select type → Lookup customer → Fill amount → Create book

**Các Test Chính:**
- Load regulations + types on page init
- Customer lookup (searchCustomerByCitizenId)
- Amount validation (MIN, MAX)
- Type selection affects form
- Create saving book → List refresh
- Customer not found (404) → Error
- Amount below minimum → Validation error
- Concurrent regulation + type loads

**Emphasis:** Form flow with external data dependencies

---

### 4.6 IT06 - DepositFlow (8 tests)
**Luồng:** Account lookup → Verify type/status → Amount input → Deposit

**Các Test Chính:**
- Account lookup (getSavingBookByCode)
- Closed account rejection
- Non-no-term account rejection
- Deposit submission → Balance update
- Amount validation
- Success message + balance refresh
- Server error → Error message

**Emphasis:** Account state validation

---

### 4.7 IT07 - WithdrawFlow (9 tests)
**Luồng:** Account lookup → Check maturity → Amount validation → Withdraw

**Các Test Chính:**
- Fixed-term maturity check
- Auto-fill full balance for mature accounts
- Partial withdrawal validation
- Closed account rejection
- Minimum days check (non-mature withdrawal forbidden)
- Balance validation (can't exceed balance)
- Success → Balance update
- Multiple withdrawal types (no-term vs fixed-term)

**Emphasis:** Business logic complexity (maturity dates)

---

### 4.8 IT08 - SearchAndDetailFlow (11 tests)
**Luồng:** Search → Filter → Paginate → View detail → Close modal

**Các Test Chính:**
- Search with debouncing
- Filter by type + status
- Pagination (next, previous, first, last)
- Results table display
- Detail modal open → Show account info
- Modal close → Return to list
- Empty results handling
- Search with no results
- Pagination disabled during load

**Emphasis:** Complex UI with multiple interactions

---

### 4.9 IT09 - DailyReportFlow (9 tests)
**Luồng:** Page load → Date selection → Generate → Display report OR retry

**Các Test Chính:**
- Date picker initialization (default today)
- Generate with selected date
- Report display on success
- Empty report (no data) message
- **503 RETRY:** Service unavailable → Retry button → Load success
- Button state management (Generating... → Generate)
- Error message display (500)
- Skeleton loader during load

**Emphasis:** 503 Retry handling

---

### 4.10 IT10 - MonthlyReportFlow (9 tests)
**Luồng:** Load types → Month selection → Type filter → Generate → Display

**Các Test Chính:**
- Load types on page init (concurrent with regulations)
- Month picker initialization
- Type filter changes trigger new report
- Report generation with month + year + type
- **503 RETRY:** Service unavailable → Retry → Load success
- Concurrent regulations + types + report loads
- Empty report handling
- Skeleton during report generation

**Emphasis:** Multi-parameter report generation + 503 Retry

---

### 4.11 IT11 - RegulationsSettingsFlow (9 tests)
**Luồng:** Load regulations + rates → Edit → Update

**Các Test Chính:**
- Load regulations on page init
- Load interest rates on page init
- Interest rates data structure validation
- **Fallback Logic:** If interest rates fail → Try getAllTypeSavings → Use as fallback
- Edit regulation fields
- Update regulations service call
- Update interest rates service call
- Error on update → Error message
- Consistency between regulations + rates

**Emphasis:** Fallback strategy when primary service fails

---

## 5. 503 Service Unavailable Retry Pattern (CRITICAL!)

### Khi Nào Xảy Ra
```javascript
const error = new Error("Service Unavailable");
error.status = 503;
// hoặc
const error = new Error("Network error");
error.code = "ECONNREFUSED"; // Kết nối từ chối
```

### Cách Xử Lý Trong IT Tests
```javascript
test("IT04 - Shows retry on 503", async () => {
  // 1. Mock first call → 503 error
  profileService.getProfile.mockRejectedValueOnce(unavailableError);

  render(<MemoryRouter>...<Profile />...</MemoryRouter>);

  // 2. UI shows retry option
  await waitFor(() => {
    expect(screen.getByText(/dịch vụ tạm thời không khả dụng/i)).toBeInTheDocument();
  });
  const retryBtn = screen.getByRole("button", { name: /thử lại/i });
  expect(retryBtn).toBeEnabled();

  // 3. Mock second call → Success
  profileService.getProfile.mockResolvedValueOnce(profileData);

  // 4. User clicks retry
  await user.click(retryBtn);

  // 5. Service succeeds, UI updates
  await waitFor(() => {
    expect(profileService.getProfile).toHaveBeenCalledTimes(2);
    expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
  });
});
```

### Các UC Có 503 Handling
- **IT04** (Profile): Load profile → Retry
- **IT09** (Daily Report): Generate report → Retry
- **IT10** (Monthly Report): Generate report → Retry
- **IT11** (Regulations): Load rates → Fallback (not typical retry)

---

## 6. Bảng IT ↔ UC Mapping

| IT | Use Case | Tests | 503 Handling | Complexity |
|---|----------|-------|:------------:|-----------|
| IT01 | Login | 11 | Network error handling | High (role-based) |
| IT02 | Create Staff | 9 | Error on create | Medium |
| IT03 | Password Reset | 8 | Multi-step flow | Medium |
| IT04 | Profile | 10 | ✓ 503 Retry | High |
| IT05 | Open Book | 10 | | High (multi-service) |
| IT06 | Deposit | 8 | | Medium |
| IT07 | Withdraw | 9 | | High (business logic) |
| IT08 | Search | 11 | | High (pagination) |
| IT09 | Daily Report | 9 | ✓ 503 Retry | Medium |
| IT10 | Monthly Report | 9 | ✓ 503 Retry | Medium |
| IT11 | Regulations | 9 | Fallback strategy | High (fallback) |

---

## 7. Chạy Integration Tests

### 7.1 Tất Cả Integration Tests
```bash
cd frontend
npx jest tests/integration
npx jest tests/integration -i  # Sequential if issues
```

### 7.2 Một IT Cụ Thể
```bash
npx jest tests/integration/IT01_LoginFlow
npx jest tests/integration/IT11_RegulationsFlow
npx jest tests/integration/IT04_ProfileManagementFlow  # For 503 retry
```

### 7.3 Một Test Cụ Thể (e.g., 503 Retry)
```bash
npx jest tests/integration/IT04_ProfileManagementFlow -t "503"
npx jest tests/integration/IT10_MonthlyReportFlow -t "retry"
```

### 7.4 Watch Mode
```bash
npx jest tests/integration --watch
```

### 7.5 With Extended Timeout
```bash
npx jest tests/integration --testTimeout=10000
```

---

## 8. Thống Kê & Tốc Độ

| Mục | Giá Trị |
|-----|--------|
| **Tổng Files** | 11 |
| **Tổng Tests** | 91 |
| **Largest Suite** | IT08_SearchFlow (11 tests) |
| **Smallest Suite** | IT03_PasswordResetFlow (8 tests) |
| **Trung bình/IT** | ~8.3 tests |
| **Thời Gian Chạy** | ~10-12s |
| **503 Retry Tests** | 7 tests across IT04, IT09, IT10 |

---

## 9. Router Setup (MemoryRouter Pattern)

### Ví Dụ Đầy Đủ
```javascript
// tests/integration/IT05_OpenSavingBookFlow/OpenSavingBookFlow.test.jsx

import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";

describe("IT05 - OpenSavingBookFlow", () => {
  test("opens saving book with all steps", async () => {
    // Setup services
    typeSavingService.getAllTypeSavings.mockResolvedValue([...]);
    regulationService.getRegulations.mockResolvedValue({...});
    customerService.searchCustomerByCitizenId.mockResolvedValue({...});
    savingBookService.createSavingBook.mockResolvedValue({...});

    // Render with Router
    render(
      <MemoryRouter initialEntries={["/open-saving-book"]}>
        <Routes>
          <Route path="/open-saving-book" element={<OpenSavingBook />} />
          <Route path="/saving-book-list" element={<SavingBookList />} />
        </Routes>
      </MemoryRouter>
    );

    // ... test interactions ...

    // If component navigates to list after successful create:
    await waitFor(() => {
      expect(screen.getByText("Danh Sách Sổ Tiết Kiệm")).toBeInTheDocument();
    });
  });
});
```

---

## 10. Giả Định & Giới Hạn

### ⚠️ Giả Định
- Tất cả services mocked (không real API)
- Router configurations chính xác (paths match)
- User interactions deterministic (không time-dependent)
- Service responses match component expectations

### 📌 Giới Hạn
- IT tests KHÔNG cover browser-level state (localStorage - mock if needed)
- KHÔNG test CSS styling
- KHÔNG test network latency realistically (mock immediately)
- KHÔNG test performance (separate load testing)

---

## 11. Kiểm Tra Danh Sách

✅ **Kiểm Thử Được:**
- [x] Full user workflows (IT01-IT11)
- [x] Service call sequences
- [x] 503 Retry logic (IT04, IT09, IT10)
- [x] Error scenarios (4xx, 5xx)
- [x] Multi-page navigation
- [x] Form validation + submission
- [x] List refresh after operations
- [x] Pagination + filtering
- [x] Fallback strategies (IT11)

❌ **KHÔNG Kiểm Thử:**
- [ ] Real API calls
- [ ] Browser persistence
- [ ] Visual testing
- [ ] Performance/load
- [ ] Accessibility (covered separately)

---

**Phiên Bản:** 1.0 | **Cập Nhật:** 2024  
**Tổng Tests:** 91/502 (18.1% of frontend tests)  
**IT Coverage:** 11/11 (100%)  
**503 Handling Tests:** 7+ across multiple flows
