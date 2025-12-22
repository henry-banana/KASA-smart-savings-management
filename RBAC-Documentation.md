# Role-Based Access Control (RBAC) Documentation

## Tổng quan
Hệ thống KASA Smart Savings Management áp dụng kiểm soát truy cập dựa trên vai trò (RBAC) với 3 role chính:
- **Teller (Giao dịch viên)**: Xử lý giao dịch trực tiếp với khách hàng
- **Accountant (Kế toán)**: Quản lý báo cáo, quy định tài chính
- **Admin (Quản trị viên)**: Toàn quyền quản lý hệ thống

---

## Phân quyền chi tiết theo Module

### 1. Customer Management (`/api/customer`)

| HTTP Method | Route | Chức năng | Teller | Accountant | Admin |
|------------|-------|-----------|:------:|:----------:|:-----:|
| GET | `/search` | Tìm kiếm khách hàng | Yes | Yes | Yes |
| POST | `/` | Thêm khách hàng mới | Yes | No | Yes |
| GET | `/` | Lấy danh sách khách hàng | Yes | Yes | Yes |
| GET | `/:id` | Lấy thông tin khách hàng | Yes | Yes | Yes |
| PUT | `/:id` | Cập nhật khách hàng | Yes | No | Yes |
| DELETE | `/:id` | Xóa khách hàng | Yes | No | Yes |

**Ghi chú:**
- Teller và Admin có toàn quyền quản lý khách hàng
- Accountant chỉ có quyền xem và tìm kiếm

---

### 2. Saving Book Management (`/api/savingbook`)

| HTTP Method | Route | Chức năng | Teller | Accountant | Admin |
|------------|-------|-----------|:------:|:----------:|:-----:|
| POST | `/` | Mở sổ tiết kiệm mới | Yes | No | Yes |
| PUT | `/:id` | Cập nhật sổ tiết kiệm | Yes | No | Yes |
| DELETE | `/:id` | Xóa sổ tiết kiệm | Yes | No | Yes |
| GET | `/search` | Tìm kiếm sổ tiết kiệm | Yes | Yes | Yes |
| GET | `/:id` | Lấy thông tin sổ | Yes | Yes | Yes |
| POST | `/:id/close` | Tất toán sổ | Yes | No | Yes |

**Ghi chú:**
- Teller và Admin xử lý mở/đóng sổ tiết kiệm
- Accountant chỉ xem thông tin để kiểm tra

---

### 3. Transaction Management (`/api/transaction`)

| HTTP Method | Route | Chức năng | Teller | Accountant | Admin |
|------------|-------|-----------|:------:|:----------:|:-----:|
| GET | `/` | Lấy danh sách giao dịch | Yes | No | No |
| GET | `/:id` | Lấy thông tin giao dịch | Yes | No | No |
| POST | `/add` | Thêm giao dịch mới | Yes | No | No |
| PUT | `/:id` | Cập nhật giao dịch | Yes | No | No |
| DELETE | `/:id` | Xóa giao dịch | Yes | No | No |
| POST | `/deposit` | Gửi tiền | Yes | No | No |
| POST | `/withdraw` | Rút tiền | Yes | No | No |

**Ghi chú:**
- **CHỈ TELLER** được phép thực hiện giao dịch
- Đây là nghiệp vụ quan trọng nhất của Teller

---

### 4. Employee Management (`/api/employee`)

| HTTP Method | Route | Chức năng | Teller | Accountant | Admin |
|------------|-------|-----------|:------:|:----------:|:-----:|
| POST | `/add` hoặc `/` | Thêm nhân viên | No | No | Yes |
| GET | `/` | Lấy danh sách nhân viên | No | No | Yes |
| GET | `/:id` | Lấy thông tin nhân viên | No | No | Yes |
| PUT | `/:id` | Cập nhật nhân viên | No | No | Yes |
| DELETE | `/:id` | Xóa nhân viên | No | No | Yes |

**Ghi chú:**
- **CHỈ ADMIN** có quyền quản lý nhân viên
- Bảo mật cao vì liên quan đến quản lý nhân sự

---

### 5. Regulation Management (`/api/regulation`)

| HTTP Method | Route | Chức năng | Teller | Accountant | Admin |
|------------|-------|-----------|:------:|:----------:|:-----:|
| GET | `/` | Lấy tất cả quy định | No | Yes | Yes |
| PUT | `/` | Cập nhật quy định | No | Yes | Yes |
| GET | `/interest-rates` | Lấy lãi suất | No | Yes | Yes |
| PUT | `/interest-rates` | Cập nhật lãi suất | No | Yes | Yes |
| GET | `/history` | Lịch sử quy định | No | Yes | Yes |

**Ghi chú:**
- Accountant và Admin quản lý quy định tài chính
- Teller không cần truy cập vào thay đổi quy định

---

### 6. Type Saving Management (`/api/typesaving`)

| HTTP Method | Route | Chức năng | Teller | Accountant | Admin |
|------------|-------|-----------|:------:|:----------:|:-----:|
| POST | `/` | Thêm loại tiết kiệm | No | Yes | Yes |
| GET | `/` | Lấy danh sách loại TK | Yes | Yes | Yes |
| GET | `/:id` | Lấy thông tin loại TK | Yes | Yes | Yes |
| PUT | `/:id` | Cập nhật loại TK | No | Yes | Yes |
| DELETE | `/:id` | Xóa loại TK | No | Yes | Yes |

**Ghi chú:**
- Teller chỉ xem để biết các loại tiết kiệm khi tư vấn khách
- Accountant và Admin quản lý lãi suất, kỳ hạn

---

### 7. Report Management (`/api/report`)

| HTTP Method | Route | Chức năng | Teller | Accountant | Admin |
|------------|-------|-----------|:------:|:----------:|:-----:|
| GET | `/daily` | Báo cáo ngày | No | Yes | Yes |
| GET | `/monthly` | Báo cáo tháng | No | Yes | Yes |

**Ghi chú:**
- **CHỈ Accountant và Admin** xem báo cáo
- Báo cáo tài chính là dữ liệu nhạy cảm

---

### 8. Dashboard (`/api/dashboard`)

| HTTP Method | Route | Chức năng | Teller | Accountant | Admin |
|------------|-------|-----------|:------:|:----------:|:-----:|
| GET | `/stats` | Thống kê tổng quan | Yes | Yes | Yes |
| GET | `/recent-transactions` | Giao dịch gần đây | Yes | Yes | Yes |

**Ghi chú:**
- Tất cả role đều xem được dashboard
- Mỗi role có thể thấy dữ liệu phù hợp với quyền hạn

---

### 9. Branch Management (`/api/branch`)

| HTTP Method | Route | Chức năng | Teller | Accountant | Admin |
|------------|-------|-----------|:------:|:----------:|:-----:|
| GET | `/name` | Lấy danh sách chi nhánh | Yes | Yes | Yes |

**Ghi chú:**
- Tất cả role đều xem được danh sách chi nhánh

---

### 10. User Account Management (`/api/useraccount`)

| HTTP Method | Route | Chức năng | Yêu cầu Auth |
|------------|-------|-----------|:------------:|
| POST | `/login` | Đăng nhập | No |
| POST | `/forgot-password` | Quên mật khẩu | No |
| POST | `/verify-otp` | Xác thực OTP | No |
| POST | `/reset-password` | Đặt lại mật khẩu | No |
| GET | `/me` | Lấy thông tin bản thân | Yes |
| PUT | `/me` | Cập nhật thông tin bản thân | Yes |
| POST | `/` | Tạo tài khoản mới | Special |
| GET | `/` | Lấy tất cả nhân viên | Public |
| PUT | `/:id` | Cập nhật tài khoản | Special |
| PATCH | `/:id/status` | Cập nhật trạng thái | Special |

**Ghi chú:**
- Routes `/me` dành cho user tự quản lý profile
- Routes public không yêu cầu role cụ thể
- Cần xem xét thêm phân quyền cho routes đặc biệt

---

## Middleware Stack

Mỗi protected route sử dụng middleware stack:

```javascript
verifyToken → checkRole(['role1', 'role2']) → controller
```

### Ví dụ:
```javascript
// Chỉ teller được phép gửi tiền
router.post("/deposit", verifyToken, checkRole(['teller']), depositTransaction);

// Accountant và Admin xem báo cáo
router.get("/daily", verifyToken, checkRole(['accountant', 'admin']), getDailyReport);

// Tất cả role xem dashboard
router.get("/stats", verifyToken, checkRole(['teller', 'accountant', 'admin']), getDashboardStats);
```

---

## Tóm tắt quyền theo Role

### TELLER (Giao dịch viên)
**Tập trung vào giao dịch trực tiếp với khách hàng:**
- Quản lý khách hàng (CRUD)
- Quản lý sổ tiết kiệm (CRUD)
- Thực hiện giao dịch (Gửi/Rút tiền)
- Xem loại tiết kiệm
- Xem dashboard và chi nhánh
- Không truy cập: Nhân viên, Báo cáo, Quy định

### ACCOUNTANT (Kế toán)
**Tập trung vào báo cáo và quy định tài chính:**
- Xem báo cáo ngày/tháng
- Quản lý quy định và lãi suất
- Quản lý loại tiết kiệm
- Xem khách hàng và sổ tiết kiệm (read-only)
- Xem dashboard
- Không truy cập: Nhân viên, Giao dịch

### ADMIN (Quản trị viên)
**Toàn quyền quản lý hệ thống:**
- Tất cả quyền của Teller
- Tất cả quyền của Accountant
- Quản lý nhân viên (CRUD)
- Quản lý tài khoản người dùng

---

## Security Best Practices

1. **Token-based Authentication**
   - Mọi protected route đều yêu cầu JWT token hợp lệ
   - Token chứa: `userId`, `userName`, `roleName`

2. **Role Verification**
   - Middleware `checkRole` kiểm tra `req.user.roleName`
   - Từ chối truy cập nếu role không phù hợp (403 Forbidden)

3. **Least Privilege Principle**
   - Mỗi role chỉ có quyền tối thiểu cần thiết
   - Teller không thể thay đổi quy định
   - Accountant không thể thực hiện giao dịch

4. **Audit Trail**
   - Mọi thao tác quan trọng nên log với `req.user.userId`
   - Theo dõi ai làm gì, khi nào

---

## Cách kiểm tra quyền

### Test với Postman/cURL:

1. **Đăng nhập để lấy token:**
```bash
POST /api/useraccount/login
Body: { "username": "teller@example.com", "password": "123456" }
```

2. **Sử dụng token trong header:**
```bash
GET /api/transaction/
Headers: { "Authorization": "Bearer <your-token>" }
```

3. **Kiểm tra phản hồi:**
- 200: Thành công
- 401: Token không hợp lệ hoặc thiếu
- 403: Role không đủ quyền
- 500: Lỗi server

---

## Cập nhật cuối cùng
**Ngày:** 22/12/2025  
**Version:** 1.0  
**Người tạo:** Phúc Hậu