# Chỉ Mục Tài Liệu Viva - Hướng Dẫn Bắt Đầu Nhanh

**Cập Nhật Lần Cuối:** 3 Tháng 1, 2026 | **Trạng Thái:** Sẵn Sàng Cho Viva ✅

---

## 📚 Cái Gì Bạn Có

Bạn hiện có **tài liệu chuẩn bị viva hoàn chỉnh, đa tầng** phù hợp với các độ sâu học khác nhau:

| File | Độ Dài | Thời Gian | Best For |
|------|--------|----------|----------|
| **VIVA_CHEATSHEET_VI.md** | 190 dòng | 10 phút | Memory jogger, last-minute review |
| **VIVA_SUMMARY_VI.md** | 204 dòng | 20 phút | Giải thích testing strategy rõ ràng |
| **VIVA_CHECKLIST_VI.md** | 280 dòng | 30 phút | Prep cấu trúc + ví dụ luyện tập |
| **VIVA_QA_VI.md** | 1,100 dòng | 60 phút | Deep Q&A practice + detailed answers |
| **TESTING_OVERVIEW.md** | 343 dòng | 30 phút | Chi tiết chiến lược hoàn chỉnh |
| **UNIT/COMPONENT/INTEGRATION_TESTS.md** | 3,000+ dòng | 3+ giờ | Deep dive kỹ thuật |

---

## 🎯 Timeline Pre-Viva

### 1 Tuần Trước Viva
1. Đọc **VIVA_CHEATSHEET_VI.md** (10 phút) — Quen với các khái niệm chính
2. Đọc **VIVA_SUMMARY_VI.md** (20 phút) — Hiểu chiến lược đầy đủ
3. Skim **VIVA_CHECKLIST_VI.md** (20 phút) — Lên kế hoạch chuẩn bị

### 2-3 Ngày Trước Viva
1. Luyện giải thích 5 khái niệm chính (từ checklist)
2. Review bảng quick reference từ **VIVA_CHEATSHEET_VI.md**
3. Luyện 3-5 câu hỏi từ **VIVA_QA_VI.md**

### Hôm Trước Viva
1. Đọc lại **VIVA_CHEATSHEET_VI.md** (10 phút)
2. Luyện nói: Giải thích testing pyramid (2 phút)
3. Luyện nói: Giải thích mocking (2 phút)
4. Luyện nói: Giải thích 503 retry (2 phút)
5. Ngủ tốt 😴

### Trong Phòng Viva
1. Nếu hoảng sợ, nhớ: "Pyramid 3-layer" — cấu trúc toàn bộ câu trả lời
2. Nếu bị kẹt, hỏi: "Có thể giải thích cách suy nghĩ của tôi?"
3. Tham chiếu con số: 502 tests, 100% pass, 25 giây

---

## 💡 Cách Dùng Mỗi File

### **VIVA_CHEATSHEET_VI.md** (Bắt Đầu Ở Đây ⭐)
```
Cấu Trúc: 15 Q&A chính + bảng quick reference
Dùng: Đọc một lần, skim trước viva
Ghi Nhớ: 
  - 502/184/227/91 (test counts)
  - Khái niệm pyramid 3-layer
  - 5 patterns chính (mocking, async, 503, debounce, fallback)
```

### **VIVA_SUMMARY_VI.md** (Để Giải Thích Rõ Ràng)
```
Cấu Trúc: 6 sections (overview, unit, component, integration, patterns, conclusion)
Dùng: Giải thích testing strategy cho giảng viên
Chứa: 1 code example mỗi layer (realistic nhưng brief)
Luyện: Đọc khi giải thích cách tiếp cận testing
```

### **VIVA_CHECKLIST_VI.md** (Prep Cấu Trúc)
```
Cấu Trúc: Reading phases + key concepts + ví dụ giải thích + checklist
Dùng: Làm theo cấu trúc 3-phase để học
Chứa: 5 sample explanations bạn có thể luyện nói
Luyện: Luyện nói những giải thích này out loud
```

### **VIVA_QA_VI.md** (Deep Dive)
```
Cấu Trúc: 24 Q&A items tổ chức theo topic
Dùng: Khi được hỏi câu tricky, review section liên quan
Chứa: Cả short + long answers cho mỗi câu
Luyện: Luyện Q&A 1-5, skip nếu time-limited
```

### **TESTING_OVERVIEW.md** (Tham Chiếu Hoàn Chỉnh)
```
Cấu Trúc: 11 sections bao phủ strategy, tools, mocking, patterns, runs
Dùng: Khi cần full context trên một khái niệm
Chứa: Nhiều code examples, tables, detailed explanations
Luyện: Review nếu được hỏi "Giải thích testing strategy chi tiết"
```

### **UNIT/COMPONENT/INTEGRATION_TESTS.md** (Chi Tiết Kỹ Thuật)
```
Cấu Trúc: Breakdown chi tiết từng test layer
Dùng: Chỉ nếu được hỏi câu kỹ thuật sâu
Chứa: Tất cả test file names, specific test cases, patterns
Luyện: Đừng ghi nhớ—chỉ biết nó tồn tại
```

---

## ✨ Con Số Chính Để Ghi Nhớ

**Ghi nhớ chính xác những cái này—bạn sẽ nói chúng trong viva:**

```
Tổng tests:            502
├── Unit tests:        184  (36.7%)
├── Component tests:   227  (45.2%)
└── Integration tests: 91   (18.1%)

Test suites:           30
Pass rate:             100% ✅
Total runtime:         khoảng 25 giây

Use Cases tested:      11/11 (100%)
Stack:                 Jest + RTL + userEvent
```

---

## 🗣️ Giải Thích Chính (Luyện Những Cái Này Nói Lớn)

**Giữ khoảng 30 giây mỗi cái:**

### 1. Testing Pyramid
"Chúng tôi dùng 3 layers: Unit tests nhanh và cô lập, bắt logic bugs. Component tests xác minh UI và user interactions. Integration tests xác minh complete workflows. Cách tiếp cận pyramid này cân bằng speed với confidence."

### 2. Tại Sao React Testing Library
"Chúng tôi dùng RTL vì nó query DOM như người dùng—bằng role, text, labels—không implementation details. Điều này làm tests bền bỉ hơn với refactor và khuyến khích semantic, accessible HTML."

### 3. Mocking Strategy
"Chúng tôi mock services và components nặng nhưng không bao giờ mock form inputs. Chúng tôi dùng module-level jest.mock() ở đầu file test, clear mocks giữa tests, và xác minh services được gọi với parameters đúng."

### 4. 503 Retry
"Khi service trả 503 (unavailable), chúng tôi không chỉ hiển thị error. Chúng tôi hiển thị nút Retry. Người dùng click nó, trigger cùng service call lại. Nếu thành công, hiển thị data. Điều này critical cho production vì outages tạm thời xảy ra."

### 5. Debouncing
"Cho search input, chúng tôi dùng fake timers để test debouncing một cách deterministic. Người dùng type—API chưa gọi. Chúng tôi advance time bằng debounce delay (500ms), sau đó xác minh service được gọi. Điều này tránh chờ thực sự và test rằng chúng tôi giảm API load từ rapid input."

---

## ⚡ Emergency Cheat (Nếu Bạn Quên Tất Cả)

**Trả lời backup cho BẤT KỲ câu viva nào:**

> "Cho phép tôi giải thích dùng cách tiếp cận 3-layer testing của chúng tôi:
> 1. Unit tests (184) xác minh logic cô lập—validators, formatters, hooks
> 2. Component tests (227) xác minh UI—form rendering, user interactions, error display  
> 3. Integration tests (91) xác minh workflows—navigation, service sequences, 503 retry
>
> Chúng tôi chọn cách này vì [unit tests nhanh] / [components bắt UI bugs sớm] / [integration tests cho end-to-end confidence]. Chúng tôi dùng Jest để chạy, React Testing Library cho user-centric queries, và mock tất cả services."

Cách này bao phủ hầu như BẤT KỲ câu testing nào. 😎

---

## 📖 Theo Subject

**Nếu được hỏi về...**

| Topic | Đọc Trước | Sau Đó Đọc |
|-------|----------|-----------|
| Test counts & structure | VIVA_CHEATSHEET_VI #1 | VIVA_SUMMARY_VI §1 |
| Tại sao 3 layers | VIVA_CHEATSHEET_VI #2 | VIVA_SUMMARY_VI §1 |
| Jest/RTL choices | VIVA_CHEATSHEET_VI #3 | TESTING_OVERVIEW §2 |
| Mocking | VIVA_CHEATSHEET_VI #4 | VIVA_SUMMARY_VI §5 |
| Async/waitFor | VIVA_CHEATSHEET_VI #5 | VIVA_SUMMARY_VI §5 |
| 503 retry | VIVA_CHEATSHEET_VI #6 | VIVA_SUMMARY_VI §5 |
| Debounce | VIVA_CHEATSHEET_VI #7 | VIVA_SUMMARY_VI §5 |
| Error handling | VIVA_CHEATSHEET_VI #12 | INTEGRATION_TESTS.md |
| Test coverage | VIVA_CHEATSHEET_VI #13 | TESTING_OVERVIEW §6 |
| Maintenance | VIVA_CHEATSHEET_VI #14 | VIVA_SUMMARY_VI §6 |

---

## ✅ Checklist Final (24 Giờ Trước Viva)

- [ ] Đọc VIVA_CHEATSHEET_VI.md một lần (10 phút)
- [ ] Ghi nhớ 4 con số test count (2 phút)
- [ ] Luyện nói: Testing pyramid explanation (2 phút)
- [ ] Luyện nói: Mocking explanation (2 phút)
- [ ] Luyện nói: 503 retry explanation (2 phút)
- [ ] Skim VIVA_SUMMARY_VI.md lần nữa (10 phút)
- [ ] Review bảng quick reference (5 phút)
- [ ] Ngủ tốt
- [ ] Ăn sáng trước viva
- [ ] Nhớ: Bạn đã build 502 passing tests—bạn biết cái này ✨

---

## 🚀 Trong Phòng Viva

**Bạn:** "Cảm ơn câu hỏi của bạn. Cho phép tôi giải thích dùng chiến lược testing của chúng tôi..."
**Bạn:** *Dùng pyramid 3-layer để cấu trúc câu trả lời*
**Bạn:** *Cho một concrete example từ VIVA_SUMMARY_VI*
**Bạn:** *Giải thích "why" (trade-off hoặc risk)*
**Giảng Viên:** "Câu trả lời tốt." ✅

---

**Chúc may mắn! Bạn sẽ làm tốt.** 💪

Cho các câu hỏi, tham chiếu:
- **Câu trả lời nhanh:** VIVA_CHEATSHEET_VI.md
- **Câu trả lời chi tiết:** VIVA_SUMMARY_VI.md
- **Giải thích sâu:** File detail tương ứng

**Nhớ:** Giảng viên quan tâm *lý luận* của bạn, không phải syntax hoàn hảo.
