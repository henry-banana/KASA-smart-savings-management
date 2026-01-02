# Chiến Lược Testing Frontend - Tóm Tắt Viva
**KASA Smart Savings Management** | Cho Trình Bày Học Thuật

---

## 1. Tổng Quan Chiến Lược Testing

Chúng tôi sử dụng **cách tiếp cận pyramid 3-layer** để đảm bảo chất lượng ở mỗi cấp:

| Layer | Mục Đích | Số Lượng | Tại Sao |
|-------|---------|---------|---------|
| **Unit** | Test logic cô lập (functions, hooks, validators) | 184 | Feedback nhanh, bắt edge cases |
| **Component** | Test UI component riêng lẻ với user interactions | 227 | Xác minh behavior form/UI trước integration |
| **Integration** | Test quy trình hoàn chỉnh (11 Use Cases) | 91 | Xác minh end-to-end workflows hoạt động |

**Tổng cộng: 502 tests, 100% pass rate, khoảng 25 giây runtime**

Cấu trúc pyramid này đảm bảo:
- ✅ Unit test nhanh chạy thường xuyên (trong development)
- ✅ Component test bắt lỗi UI sớm
- ✅ Integration test xác minh quy trình thực hoạt động

**Stack:** Jest (test runner + mocking) + React Testing Library (user-centric queries) + userEvent (realistic interactions)

---

## 2. Unit Tests (184 tests)

**Mục Đích:** Xác minh logic thuần túy mà không có UI involvement

**Cái gì chúng tôi test:**
- Error classification & mapping (HTTP status codes → user-friendly messages)
- Input validators (CMND/CCCD format, amount ranges: 100k-1B VNĐ)
- Number formatters (Vietnamese locale: 1.000.000 không phải 1,000,000)
- Custom hooks (`useApi` cho async state, `useDebounce` cho search)
- Interest rate calculations & ordering

**Scope:** Gọi function trực tiếp—không render, không component dependencies

**Ví Dụ: Validator Test**
```javascript
describe("validateIdCard", () => {
  it("nhận CMND (9 digits) và CCCD (12 digits)", () => {
    expect(validateIdCard("123456789")).toBe(true);
    expect(validateIdCard("123456789012")).toBe(true);
    expect(validateIdCard("12345")).toBe(false);
  });
});
```

**Tại sao tách riêng unit test?**
- Nhanh (2.3 giây cho 184 tests)
- Cô lập—failure chỉ trực tiếp đến bug
- Validators & formatters cần trong tất cả UCs

---

## 3. Component Tests (227 tests)

**Mục Đích:** Xác minh component render đúng và xử lý user interactions

**Cái gì chúng tôi test:**
- Form rendering & field validation (required, min/max values, format)
- User interactions (`userEvent.type()`, `userEvent.click()`)
- Error display và loading states
- Service integration (mocked services)
- 503 Service Unavailable retry mechanism

**Scope:** Component đơn lẻ trong RTL environment. Tất cả services mocked.

**Ví Dụ: Form với Error Handling**
```javascript
test("hiển thị error và giữ form mở trên validation failure", async () => {
  savingBookService.create.mockRejectedValue(
    new Error("400: Amount too low")
  );
  
  render(<OpenSavingBook />);
  await user.type(screen.getByLabelText("Amount"), "50000");
  await user.click(screen.getByRole("button", { name: /Create/i }));
  
  expect(screen.getByText(/minimum 100k/i)).toBeInTheDocument();
  expect(screen.getByLabelText("Amount")).toBeInTheDocument(); // Form vẫn visible
});
```

**Tại sao RTL thay vì enzyme/snapshots?**
- Test perspektif người dùng (role, text, labels)—không implementation details
- Bền bỉ với refactor (querySelector break; `getByRole` adapt)
- Khuyến khích semantic HTML & accessibility

---

## 4. Integration Tests (91 tests)

**Mục Đích:** Xác minh quy trình hoàn chỉnh từ load trang đến success/error recovery

**Cái gì chúng tôi test:**
- Multi-page navigation dùng MemoryRouter
- Sequential service calls (lookup → validate → create → refresh list)
- Error recovery (4xx validation vs 5xx server errors)
- 503 retry logic (3 UCs: Profile, DailyReport, MonthlyReport)
- Fallback strategy khi service fail (Regulations UC)

**Scope:** Full Use Case (UC01-UC11) với nhiều trang và services

**Ví Dụ: 503 Retry Flow**
```javascript
test("IT04 - Retry trên 503 Service Unavailable", async () => {
  const error503 = new Error("503");
  error503.status = 503;
  
  // Lần đầu fail
  profileService.getProfile.mockRejectedValueOnce(error503);
  
  render(<MemoryRouter><Profile /></MemoryRouter>);
  expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument();
  
  // User click retry
  profileService.getProfile.mockResolvedValueOnce({ name: "User A" });
  await user.click(screen.getByRole("button", { name: /Retry/i }));
  
  // Service thành công
  expect(screen.getByText("User A")).toBeInTheDocument();
});
```

**Tại sao integration test quan trọng?**
- Unit + Component tests pass ≠ workflow hoạt động
- Bắt service sequencing bugs
- Xác minh 503 retry (critical cho production)

---

## 5. Key Testing Patterns & Decisions

### Mocking Strategy
**Module-level mocking** (không inline)—consistent trên 500+ tests:
```javascript
// ✓ TỐT: Module level
jest.mock("../services/savingBookService");
import * as savingBookService from "../services/savingBookService";

// ❌ TRÁNH: Inline, mất reference trên tests
```

**Tại sao?** Sạch hơn, reusable, dễ debug.

### Async Testing: `waitFor()` không phải `setTimeout()`
```javascript
// ✓ TỐT: Retries cho đến assertion pass
await waitFor(() => {
  expect(service.call).toHaveBeenCalled();
});

// ❌ XẤU: Race condition, chậm, non-deterministic
setTimeout(() => { expect(...) }, 500);
```

### 503 Retry Pattern (Production-Critical)
Khi service trả 503 hoặc network error:
1. Hiển thị "Service temporarily unavailable" + Retry button
2. Người dùng click Retry → Gọi service lại
3. Nếu thành công: Hiển thị data; nếu fail: Hiển thị error

**7+ tests bao phủ cái này** (Profile, DailyReport, MonthlyReport) vì retry cần thiết cho resilience.

### Debounce Testing (Search Optimization)
```javascript
// Fake timers để test debounce delay mà không chờ thời gian thực
jest.useFakeTimers();
await user.type(input, "S001");  // Chưa gọi service
jest.advanceTimersByTime(500);    // Advance debounce delay
expect(service.search).toHaveBeenCalledWith("S001"); // BÂY GIỜ called
```

**Tại sao?** SearchSavingBook không nên gọi API cho mỗi keystroke; debounce giảm load.

### Fallback Strategy (Graceful Degradation)
Trong Regulations UC: Nếu interest rates service fail, fallback dùng savings types như rates source. Graceful degradation—trang vẫn dùng được.

---

## 6. Kết Luận

**Tại sao cách tiếp cận này hoạt động:**

1. **Risk Mitigation:** Unit tests (nhanh) bắt logic bugs; Component tests (trung bình) bắt UI bugs; Integration tests (kỹ lưỡng) bắt workflow bugs
2. **Maintainability:** 502 tests documented, passing, không flaky—developers có thể refactor với confidence
3. **Production Readiness:** 503 retry & fallback strategies tested đảm bảo app xử lý real-world failures
4. **Coverage:** Tất cả 11 Use Cases tested trên tất cả 3 layers

**Cho Viva:** Cấu trúc testing này chứng minh chúng tôi:
- ✅ Hiểu trade-offs testing (speed vs coverage)
- ✅ Áp dụng industry patterns (pyramid, mocking, async handling)
- ✅ Ưu tiên production resilience (503 retry, fallback)
- ✅ Viết tests maintainable (semantic queries, không flaky)

**Testing philosophy:** "Viết tests cho confidence, không cho coverage"

---

**Tổng Tài Liệu:** 502 tests | **Pass Rate:** 100% | **Runtime:** khoảng 25 giây
