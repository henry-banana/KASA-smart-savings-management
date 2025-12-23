# Tóm tắt Test Cases - Unit Tests

## Danh sách Test Cases từ Tài liệu PDF

### UC01 - Cấp tài khoản cho nhân viên

| Mã Test Case | Tên Test Case                         | Trạng thái | File Test                                                                                                                     | Ghi chú |
| ------------ | ------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------- | ------- |
| TC_UC01_01   | Cấp tài khoản thành công (Teller)     | ✅         | `controllers/userAccount.controller.test.js`                                                                                  |         |
| TC_UC01_02   | Cấp tài khoản thành công (Accountant) | ✅         | `controllers/userAccount.controller.test.js`                                                                                  |         |
| TC_UC01_03   | Lỗi bỏ trống thông tin                | ✅         | `controllers/userAccount.controller.test.js`                                                                                  |         |
| TC_UC01_04   | Lỗi Email sai định dạng               | ✅         | `controllers/userAccount.controller.test.js`                                                                                  |         |
| TC_UC01_05   | Lỗi trùng Mã NV/Email                 | ✅         | `controllers/userAccount.controller.test.js`                                                                                  |         |
| TC_UC01_06   | Kiểm tra trạng thái mặc định          | ✅         | `controllers/userAccount.controller.test.js`                                                                                  |         |
| TC_UC01_07   | Lỗi gửi Email thông báo               | ✅         | `controllers/userAccount.controller.test.js`                                                                                  |         |
| TC_UC01_08   | Kiểm tra mã hóa mật khẩu              | ✅         | `controllers/userAccount.controller.test.js`, `services/userAccount.service.test.js`, `middleware/hashing.middleware.test.js` |         |
| TC_UC01_09   | Lỗi chưa chọn Vai trò                 | ✅         | `controllers/userAccount.controller.test.js`                                                                                  |         |
| TC_UC01_10   | Ghi Audit Log khi tạo tài khoản       | ✅         | `controllers/userAccount.controller.test.js`                                                                                  |         |
| TC_UC01_11   | Lỗi lưu DB khi tạo tài khoản          | ✅         | `controllers/userAccount.controller.test.js`                                                                                  |         |

### UC02 - Đăng nhập

| Mã Test Case | Tên Test Case                                   | Trạng thái | File Test                                                                                                                   | Ghi chú                                         |
| ------------ | ----------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| TC_UC02_01   | Đăng nhập thành công (Thông tin hợp lệ)         | ✅         | `controllers/login.controller.test.js`                                                                                      |                                                 |
| TC_UC02_02   | Đăng nhập thất bại - Bỏ trống thông tin         | ✅         | `controllers/login.controller.test.js`                                                                                      |                                                 |
| TC_UC02_03   | Đăng nhập thất bại (Sai Username hoặc Password) | ✅         | `controllers/login.controller.test.js`, `services/userAccount.service.test.js`, `middleware/comparePass.middleware.test.js` |                                                 |
| TC_UC02_04   | Đăng nhập thất bại - Tài khoản bị vô hiệu hóa   | ✅         | `controllers/login.controller.test.js`                                                                                      |                                                 |
| TC_UC02_05   | Khóa đăng nhập tạm thời (Sai quá 5 lần)         | ❌         | N/A                                                                                                                         | **Integration Test** - Cần test qua UI/Frontend |
| TC_UC02_06   | Kiểm tra tính năng Ẩn/Hiện mật khẩu             | ❌         | N/A                                                                                                                         | **UI Test** - Frontend test case                |
| TC_UC02_07   | Kiểm tra bảo mật mật khẩu (Database)            | ✅         | `controllers/login.controller.test.js`                                                                                      |                                                 |
| TC_UC02_08   | Session hết hạn                                 | ✅         | `middleware/auth.middleware.test.js`                                                                                        | Token expiration test                           |
| TC_UC02_09   | Truy cập URL không đủ quyền                     | ✅         | `middleware/auth.middleware.test.js`                                                                                        | Access control test                             |

### UC03 - Quên mật khẩu

| Mã Test Case | Tên Test Case                 | Trạng thái | File Test                                                                                                                                   | Ghi chú                              |
| ------------ | ----------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| TC_UC03_01   | Quên mật khẩu thành công      | ✅         | `controllers/forgotPassword.controller.test.js`, `controllers/verifyOTP.controller.test.js`, `controllers/resetPassword.controller.test.js` |                                      |
| TC_UC03_02   | Lỗi Email không tồn tại       | ✅         | `controllers/forgotPassword.controller.test.js`                                                                                             |                                      |
| TC_UC03_03   | Lỗi mã OTP sai                | ✅         | `controllers/verifyOTP.controller.test.js`                                                                                                  |                                      |
| TC_UC03_04   | Lỗi mã OTP hết hạn            | ✅         | `controllers/verifyOTP.controller.test.js`                                                                                                  |                                      |
| TC_UC03_05   | Lỗi mật khẩu không khớp       | ❌         | N/A                                                                                                                                         | **UI Test** - Frontend validation    |
| TC_UC03_06   | Lỗi mật khẩu yếu              | ✅         | `controllers/resetPassword.controller.test.js`                                                                                              |                                      |
| TC_UC03_07   | Khóa xác thực (Sai quá 5 lần) | ❌         | N/A                                                                                                                                         | **Integration Test** - Rate limiting |
| TC_UC03_08   | Chức năng Gửi lại mã          | ❌         | N/A                                                                                                                                         | **UI Test** - Frontend feature       |
| TC_UC03_09   | Kiểm tra nút Ẩn/Hiện mật khẩu | ❌         | N/A                                                                                                                                         | **UI Test** - Frontend feature       |
| TC_UC03_10   | OTP hết hạn                   | ✅         | `controllers/verifyOTP.controller.test.js`                                                                                                  | Same as TC_UC03_04                   |
| TC_UC03_11   | Mật khẩu mới quá yếu          | ✅         | `controllers/resetPassword.controller.test.js`                                                                                              | Same as TC_UC03_06                   |
| TC_UC03_12   | Lỗi DB khi lưu mật khẩu mới   | ✅         | `controllers/resetPassword.controller.test.js`                                                                                              |                                      |

### UC04 - Xem thông tin cá nhân

| Mã Test Case | Tên Test Case               | Trạng thái | File Test                                                                                                                      | Ghi chú                               |
| ------------ | --------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| TC_UC04_01   | Xem thông tin thành công    | ✅         | `controllers/profile.controller.test.js`<br>`controllers/userAccount.controller.test.js`                                       | Đã bổ sung test cho controller mới    |
| TC_UC04_02   | Lỗi kết nối CSDL            | ✅         | `controllers/profile.controller.test.js`<br>`controllers/userAccount.controller.test.js`                                       | Đã bổ sung test cho controller mới    |
| TC_UC04_03   | Kiểm tra tính chỉ đọc       | ❌         | N/A                                                                                                                            | **UI Test** - Frontend readonly check |
| TC_UC04_04   | Ẩn thông tin nhạy cảm       | ✅         | `controllers/profile.controller.test.js`<br>`controllers/userAccount.controller.test.js`                                       | Đã bổ sung test cho controller mới    |
| TC_UC04_05   | Kiểm soát truy cập          | ✅         | `controllers/userAccount.controller.test.js`, `services/userAccount.service.test.js`, `controllers/profile.controller.test.js` |                                       |
| TC_UC04_06   | Thời gian tải trang Profile | ❌         | N/A                                                                                                                            | **Performance Test** - Load testing   |

### UC05 - Mở sổ tiết kiệm

| Mã Test Case | Tên Test Case                   | Trạng thái | File Test                                                                          | Ghi chú |
| ------------ | ------------------------------- | ---------- | ---------------------------------------------------------------------------------- | ------- |
| TC_UC05_01   | Mở sổ thành công (Không kỳ hạn) | ✅         | `controllers/savingBook.controller.test.js`                                        |         |
| TC_UC05_03   | Lỗi số tiền dưới tối thiểu      | ✅         | `services/savingBook.service.test.js`                                              |         |
| TC_UC05_05   | Lỗi loại sổ - kỳ hạn không khớp | ✅         | `services/savingBook.service.test.js`                                              |         |
| TC_UC05_06   | Chọn thẻ loại sổ và tính toán   | ✅         | `controllers/savingBook.controller.test.js`, `services/savingBook.service.test.js` |         |
| TC_UC05_08   | Rollback khi lỗi DB (mở sổ)     | ✅         | `services/savingBook.service.test.js`                                              |         |

### UC06 - Giao dịch gửi tiền

| Mã Test Case | Tên Test Case                    | Trạng thái | File Test                                                                            | Ghi chú |
| ------------ | -------------------------------- | ---------- | ------------------------------------------------------------------------------------ | ------- |
| TC_UC06_02   | Gửi tiền thất bại - Sổ Có kỳ hạn | ✅         | `services/transaction.service.test.js`                                               |         |
| TC_UC06_04   | Lỗi số tiền dưới tối thiểu       | ✅         | `services/transaction.service.test.js`                                               |         |
| TC_UC06_08   | Rollback khi DB lỗi (Gửi tiền)   | ✅         | `services/transaction.service.test.js`, `controllers/transaction.controller.test.js` |         |
| TC_UC06_09   | Ghi Audit Log giao dịch gửi      | ✅         | `controllers/transaction.controller.audit.test.js`                                   |         |

### UC07 - Giao dịch rút tiền

| Mã Test Case | Tên Test Case                      | Trạng thái | File Test                                                                            | Ghi chú |
| ------------ | ---------------------------------- | ---------- | ------------------------------------------------------------------------------------ | ------- |
| TC_UC07_02   | Tất toán thành công (Sổ Có kỳ hạn) | ✅         | `services/transaction.service.test.js`                                               |         |
| TC_UC07_05   | Lỗi rút một phần (Sổ Có kỳ hạn)    | ✅         | `services/transaction.service.test.js`                                               |         |
| TC_UC07_08   | Kiểm tra tính lãi tự động          | ✅         | `services/transaction.service.test.js`, `controllers/transaction.controller.test.js` |         |
| TC_UC07_11   | Rollback khi DB lỗi (rút tiền)     | ✅         | `services/transaction.service.test.js`                                               |         |
| TC_UC07_12   | Ghi Audit Log giao dịch rút        | ✅         | `controllers/transaction.controller.audit.test.js`                                   |         |

### UC08 - Tra cứu sổ tiết kiệm

| Mã Test Case | Tên Test Case                  | Trạng thái | File Test                                                                          | Ghi chú |
| ------------ | ------------------------------ | ---------- | ---------------------------------------------------------------------------------- | ------- |
| TC_UC08_04   | Lỗi không nhập tiêu chí        | ✅         | `controllers/savingBook.controller.test.js`                                        |         |
| TC_UC08_05   | Không tìm thấy kết quả tra cứu | ✅         | `controllers/savingBook.controller.test.js`, `services/savingBook.service.test.js` |         |

### UC09 - Báo cáo ngày

| Mã Test Case | Tên Test Case                           | Trạng thái | File Test                                                                  | Ghi chú |
| ------------ | --------------------------------------- | ---------- | -------------------------------------------------------------------------- | ------- |
| TC_UC09_05   | Kiểm tra tính chính xác số liệu báo cáo | ✅         | `controllers/report.controller.test.js`, `services/report.service.test.js` |         |
| TC_UC09_07   | Kiểm tra phân quyền truy cập (Report)   | ✅         | `controllers/report.controller.rbac.test.js`                               |         |
| TC_UC09_08   | Ghi Audit Log xem báo cáo               | ✅         | `controllers/report.controller.rbac.test.js`                               |         |

### UC10 - Báo cáo tháng

| Mã Test Case | Tên Test Case                   | Trạng thái | File Test                                                                  | Ghi chú |
| ------------ | ------------------------------- | ---------- | -------------------------------------------------------------------------- | ------- |
| TC_UC10_06   | Chức năng Xuất báo cáo          | ✅         | `controllers/report.controller.test.js`, `services/report.service.test.js` |         |
| TC_UC10_07   | Thay đổi Tháng/Năm              | ✅         | `controllers/report.controller.rbac.test.js`                               |         |
| TC_UC10_09   | Kiểm tra quyền Accountant/Admin | ✅         | `controllers/report.controller.rbac.test.js`                               |         |

### UC11 - Quy định hệ thống

| Mã Test Case | Tên Test Case                                | Trạng thái | File Test                                                                                                                                                                              | Ghi chú |
| ------------ | -------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| TC_UC11_04   | Lỗi bỏ trống thông tin                       | ✅         | `services/regulation.service.additional.test.js`                                                                                                                                       |         |
| TC_UC11_06   | Kiểm tra Nhật ký thay đổi (Audit Log)        | ✅         | `controllers/regulation.controller.rbac.test.js`                                                                                                                                       |         |
| TC_UC11_07   | Kiểm tra phân quyền truy cập (Admin-only)    | ✅         | `controllers/regulation.controller.rbac.test.js`                                                                                                                                       |         |
| TC_UC11_08   | Áp dụng lãi suất mới không ảnh hưởng lịch sử | ✅         | `controllers/regulation.controller.test.js`, `controllers/regulation.controller.rbac.test.js`, `services/regulation.service.test.js`, `services/regulation.service.additional.test.js` |         |
| TC_UC11_09   | Rollback khi lưu thất bại                    | ✅         | `services/regulation.service.additional.test.js`                                                                                                                                       |         |

---

**Ghi chú:**
- Các test UI/Frontend hoặc Integration chưa có unit test sẽ được đánh dấu ❌.
