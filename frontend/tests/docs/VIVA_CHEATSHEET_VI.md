# Bảng Gợi Ý Viva - Frontend Testing (Tham Chiếu Nhanh)

**Thời gian đọc: ~10 phút | Dùng để ghi nhớ các khái niệm chính**

---

## 1. Có bao nhiêu test và cấu trúc ra sao?

**Trả lời:** 502 test trên 3 layer—184 unit (logic nhanh), 227 component (tương tác UI), 91 integration (quy trình toàn bộ). Pass rate 100%, khoảng 25 giây tổng cộng.

**Mở rộng:** 
- Unit: 7 file (validators, hooks, formatters)
- Component: 12 file (một cho mỗi UC)
- Integration: 11 file (11 quy trình use case)

---

## 2. Tại sao chia thành 3 layer thay vì chỉ làm integration test?

**Trả lời:** Vì mỗi layer có rủi ro khác nhau. Unit test bắt lỗi logic nhanh (2.3s), component test bắt lỗi UI trước integration, integration test xác thực quy trình hoạt động từ đầu đến cuối.

**Mở rộng:**
- Unit: Cô lập, feedback nhanh, bắt edge cases
- Component: Xác minh form behavior, RTL queries, mock service
- Integration: MemoryRouter navigation, service sequences, retry 503

---

## 3. Tại sao React Testing Library thay vì Enzyme hoặc Snapshots?

**Trả lời:** RTL test behavior của người dùng (role, text, labels), không test implementation. Bền bỉ hơn với refactor và khuyến khích semantic HTML.

**Mở rộng:**
- `getByRole("button")` vs `querySelector`—cái đầu tiên sống sót qua refactor
- Test accessibility khi bạn test functionality
- Enzyme đã lỗi thời; Cypress dùng cho E2E, không phải unit/component

---

## 4. Chiến lược mock của bạn là gì?

**Trả lời:** Module-level jest.mock() ở đầu file test. Mock service hoàn toàn (không có API thực), mock component nặng (RoleGuard), nhưng KHÔNG mock form input mà người dùng tương tác.

**Mở rộng:**
- `jest.mock("../services/...")` một lần mỗi file
- `clearAllMocks()` trong beforeEach
- Xác minh gọi: `expect(service).toHaveBeenCalledWith(payload)`

---

## 5. Bạn test async operation mà không dùng setTimeout?

**Trả lời:** Dùng `waitFor()` cái mà retry assertion cho đến khi pass (max 1000ms default). Không phải setTimeout—race condition và chậm.

**Mở rộng:**
- Cho load states: Deferred promises (kiểm soát khi service resolve)
- `act()` cho state updates bên ngoài userEvent
- `jest.useFakeTimers()` cho debounce/timing

---

## 6. Cái gì đặc biệt về test 503 Service Unavailable?

**Trả lời:** Khi service trả 503, hiển thị Retry button (không error message). Người dùng click → gọi service lại. Nếu thành công, hiển thị data. Test cái này 7+ lần vì nó critical cho production.

**Mở rộng:**
- Bao phủ: Profile, DailyReport, MonthlyReport workflows
- Mock: Lần đầu reject 503, lần 2 resolve
- Xác minh app xử lý outage tạm thời gracefully

---

## 7. Bạn test debouncing (ví dụ search input) thế nào?

**Trả lời:** Dùng `jest.useFakeTimers()`. Người dùng type → advance fake time bằng debounce delay (500ms) → service called. Tránh chờ thực; deterministic.

**Mở rộng:**
- Người dùng type "S001" → service chưa gọi
- `jest.advanceTimersByTime(500)` → BÂY GIỜ service called
- Tested trong SearchSavingBook UC (32 tests, lớn nhất)

---

## 8. Fallback strategy trong Regulations UC là gì?

**Trả lời:** Load regulations + lãi suất. Nếu interest rates service fail, fallback lấy lãi suất từ savings types list. Trang vẫn dùng được—graceful degradation.

**Mở rộng:**
- Primary: `getInterestRates()` service
- Fallback: `getAllTypeSavings()` service
- Không hiển thị error cho user (transparent retry)

---

## 9. Bạn xác minh service được gọi đúng cách thế nào?

**Trả lời:** Sau user interaction, dùng `await waitFor()` và `toHaveBeenCalledWith(expectedPayload)` để xác minh service gọi với parameters đúng.

**Mở rộng:**
- Đợi async assertion hoàn thành
- Kiểm tra call count: `toHaveBeenCalledTimes(2)` cho retry scenario
- Xác minh payload structure, không chỉ được gọi

---

## 10. Sự khác nhau giữa Unit và Component test?

**Trả lời:** Unit test gọi function trực tiếp (không render). Component test render với RTL, simulate user interactions (type, click), mock service, xác minh error display và loading states.

**Mở rộng:**
- Unit: `validateIdCard("123456789")` → `expect(result).toBe(true)`
- Component: Render form, `user.type(input, "123")`, check error message
- Component = pre-integration validation

---

## 11. Tại sao dùng MemoryRouter cho integration test thay vì real routing?

**Trả lời:** MemoryRouter cho phép test navigation logic trong test mà không cần start real server. Nhanh, deterministic, test quy trình mà không cần browser-level dependencies.

**Mở rộng:**
- Multi-page workflows: Login → Dashboard → Search
- Test page transitions (component routing)
- Mock `useNavigate` cho expected redirects

---

## 12. Bạn xử lý những loại lỗi nào và cách nào?

**Trả lời:** 503 (unavailable) → Retry button | 4xx (validation) → Error message, form mở | 5xx (server) → Error message. Ưu tiên: unavailable > validation > server.

**Mở rộng:**
- 503 = Hiển thị retry, đừng dismiss form
- 400/401/404 = Hiển thị error, user có thể fix và resubmit
- 500 = Hiển thị error, không retry
- serverStatusUtils (46 tests) xử lý ưu tiên classification

---

## 13. Có bao nhiêu UC (use case) được test?

**Trả lời:** Tất cả 11 UCs (UC01 Create Staff → UC11 Regulations). Mỗi cái có unit tests (nếu logic heavy), component test (12 tổng cộng), và integration test (11 tổng cộng).

**Mở rộng:**
- UC01-UC04: User/auth workflows
- UC05-UC07: Savings transactions
- UC08-UC10: Search and reports
- UC11: Settings

---

## 14. Chuyện gì xảy ra nếu bạn thay đổi DOM structure?

**Trả lời:** Nếu bạn refactor HTML, RTL semantic queries (getByRole, getByLabel) vẫn hoạt động. Snapshots và querySelector break. Đây là lý do RTL tốt hơn cho maintainability.

**Mở rộng:**
- `getByRole("button", { name: /create/i })` = semantic
- `querySelector("button.submit")` = break on HTML change
- RTL khuyến khích accessible HTML = win hai lần

---

## 15. Test sẽ như thế nào nếu một workflow fail trong production?

**Trả lời:** Kiểm tra integration tests trước (workflow tests). Nếu chúng pass nhưng production fail, kiểm tra: service mocks match reality? Network handling? State không persist giữa requests?

**Mở rộng:**
- IT tests xác minh happy path + retry 503
- Nếu production fail khác, có thể: real API trả unexpected shape, hoặc real network timing khác
- Đây là tại sao retry 503 được test một cách mở rộng

---

## Tham Chiếu Nhanh

| Câu Hỏi | Khái Niệm Chính | Tại Sao Quan Trọng |
|---------|--------|---------|
| Bao nhiêu test? | 502 (184U/227C/91I) | Biết quy mô của bạn |
| Tại sao 3 layer? | Rủi ro ở mỗi level | Biện minh test investment |
| Tại sao RTL? | Semantic queries | Maintainability |
| Mocking? | Module-level jest.mock | Consistency |
| Async? | waitFor(), không setTimeout | Flaky tests prevention |
| Retry 503? | Production resilience | Real-world scenarios |
| Debounce? | Fake timers cho determinism | Performance optimization |
| Fallback? | Graceful degradation | UX khi service fail |

---

**Mẹo cuối cho viva:** Bắt đầu trả lời bằng framework "3-layer pyramid". Mọi thứ phù hợp với unit/component/integration.
