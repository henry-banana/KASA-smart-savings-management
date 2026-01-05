# Tài liệu API

## 1. Giới thiệu

- Hệ thống có 10 nhóm API chính, chia theo nghiệp vụ và router tương ứng.
- Tất cả API (trừ login/forgot-password/reset-password/verify-otp) yêu cầu JWT qua `Authorization: Bearer <token>` và role phù hợp.

## 2. API Groups (tổng 10)

1. `/api/auth` – Auth & User Account (login, forgot/reset/change password, OTP, create/read/update user)
2. `/api/users` – Cùng router với `/api/auth`
3. `/api/savingbook` – Sổ tiết kiệm (CRUD, tất toán)
4. `/api/transactions` – Giao dịch (CRUD, nộp/rút)
5. `/api/customer` – Khách hàng (CRUD, search, tra cứu CCCD)
6. `/api/typesaving` – Loại sổ tiết kiệm (CRUD)
7. `/api/report` – Báo cáo (đọc-only)
8. `/api/branch` – Chi nhánh (đọc tên chi nhánh)
9. `/api/regulations` – Quy định & lãi suất (đọc + cập nhật)
10. `/api/dashboard` – Dashboard (đọc số liệu, giao dịch gần đây)

---

## 3. Nhóm Auth & User Account (`/api/auth`, `/api/users`)

### 3.1. Luồng nghiệp vụ

- Người dùng đăng nhập với email/username + password → hệ thống xác thực và trả về token + role.
- Quên mật khẩu: gửi OTP qua email, xác thực OTP, đặt mật khẩu mới.
- Người dùng có thể xem/cập nhật hồ sơ cá nhân; admin có thể tạo/cập nhật/vô hiệu hóa tài khoản nhân viên.

### 3.2. Endpoints

#### **POST /api/auth/login** – Đăng nhập

**Request body:**

```json
{
  "username": "NV001",
  "password": "123456"
}
```

**Response thành công:**

```json
{
  "message": "Login successful",
  "success": true,
  "data": {
    "userId": "NV001",
    "username": "NV001",
    "fullName": "Nguyễn Văn A",
    "roleName": "teller",
    "status": "active",
    "token": "jwt_or_mock_token_here"
  }
}
```

**Response lỗi:**

Sai tài khoản/mật khẩu:

```json
{
  "message": "Incorrect username or password",
  "success": false
}
```

Thiếu trường:

```json
{
  "message": "Username and password are required",
  "success": false
}
```

Tài khoản bị vô hiệu hóa:

```json
{
  "message": "Account disabled. Contact administrator.",
  "success": false
}
```

---

#### **POST /api/auth/forgot-password** – Gửi OTP quên mật khẩu

**Request body:**

```json
{
  "email": "nguyenvana@example.com"
}
```

**Response thành công:**

```json
{
  "message": "OTP sent to your email",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "Email not found",
  "success": false
}
```

---

#### **POST /api/auth/verify-otp** – Xác thực OTP

**Request body:**

```json
{
  "email": "nguyenvana@example.com",
  "otp": "123456"
}
```

**Response thành công:**

```json
{
  "message": "OTP verified successfully",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "Invalid or expired OTP",
  "success": false
}
```

---

#### **POST /api/auth/reset-password** – Đặt mật khẩu mới

**Request body:**

```json
{
  "email": "nguyenvana@example.com",
  "otp": "123456",
  "newPassword": "newPass123"
}
```

**Response thành công:**

```json
{
  "message": "Password reset successfully",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "Invalid OTP or email",
  "success": false
}
```

---

#### **POST /api/auth/change-password** – Đổi mật khẩu (yêu cầu token)

**Request body:**

```json
{
  "oldPassword": "123456",
  "newPassword": "newPass123"
}
```

**Response thành công:**

```json
{
  "message": "Password changed successfully",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "Old password is incorrect",
  "success": false
}
```

---

#### **GET /api/auth/me** – Xem hồ sơ cá nhân (yêu cầu token)

**Response thành công:**

```json
{
  "success": true,
  "data": {
    "employeeid": 1,
    "fullName": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "roleID": 2,
    "roleName": "teller",
    "branchID": 1,
    "branchName": "Chi nhánh 1"
  }
}
```

---

#### **PUT /api/auth/me** – Cập nhật hồ sơ cá nhân (yêu cầu token)

**Request body:**

```json
{
  "fullName": "Nguyễn Văn A Updated",
  "email": "newemail@example.com"
}
```

**Response thành công:**

```json
{
  "message": "Profile updated successfully",
  "success": true,
  "data": {
    "employeeid": 1,
    "fullName": "Nguyễn Văn A Updated",
    "email": "newemail@example.com"
  }
}
```

---

#### **POST /api/auth** – Tạo tài khoản nhân viên (admin only)

**Request body:**

```json
{
  "fullName": "Nguyễn Văn B",
  "roleID": 2,
  "branchID": 1,
  "email": "nguyenvanb@example.com",
  "password": "123456"
}
```

**Response thành công:**

```json
{
  "message": "Employee and account created successfully",
  "success": true,
  "data": {
    "employeeid": 5,
    "fullName": "Nguyễn Văn B",
    "email": "nguyenvanb@example.com",
    "roleID": 2,
    "branchID": 1
  }
}
```

---

#### **GET /api/auth** – Danh sách tài khoản/nhân viên (admin only)

**Response thành công:**

```json
{
  "success": true,
  "data": [
    {
      "employeeid": 1,
      "fullName": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "roleName": "teller",
      "branchName": "Chi nhánh 1",
      "status": "active"
    }
  ]
}
```

---

#### **PUT /api/auth/:id** – Cập nhật tài khoản (admin only)

**Request body:**

```json
{
  "fullName": "Nguyễn Văn A Updated",
  "roleID": 3,
  "branchID": 2,
  "email": "updated@example.com"
}
```

**Response thành công:**

```json
{
  "message": "Employee updated successfully",
  "success": true
}
```

---

#### **PATCH /api/auth/:id/status** – Bật/tắt tài khoản (admin only)

**Request body:**

```json
{
  "status": "inactive"
}
```

**Response thành công:**

```json
{
  "message": "Account status updated",
  "success": true
}
```

---

## 4. Nhóm Saving Book (`/api/savingbook`)

### 4.1. Luồng nghiệp vụ

- Teller tạo sổ tiết kiệm cho khách hàng với loại sổ và số tiền gửi ban đầu.
- Teller có thể cập nhật thông tin sổ, xóa sổ (nếu chưa có giao dịch), hoặc tất toán sổ.
- Kế toán/teller có thể tra cứu sổ theo mã sổ, tên khách hàng, hoặc CCCD.

### 4.2. Endpoints

#### **POST /api/savingbook** – Tạo sổ tiết kiệm mới (teller)

**Request body:**

```json
{
  "customerID": 10,
  "typeSavingID": 2,
  "depositAmount": 10000000,
  "openDate": "2026-01-02"
}
```

**Response thành công:**

```json
{
  "message": "Saving book created successfully",
  "success": true,
  "data": {
    "savingBookID": 123,
    "savingBookCode": "STK20260102001",
    "customerID": 10,
    "typeSavingID": 2,
    "depositAmount": 10000000,
    "openDate": "2026-01-02",
    "status": "active"
  }
}
```

**Response lỗi:**

```json
{
  "message": "Customer not found",
  "success": false
}
```

---

#### **GET /api/savingbook/:id** – Xem chi tiết sổ (teller/kế toán)

**Response thành công:**

```json
{
  "success": true,
  "data": {
    "savingBookID": 123,
    "savingBookCode": "STK20260102001",
    "customerName": "Nguyễn Văn A",
    "citizenId": "079012345678",
    "typeSavingName": "Kỳ hạn 6 tháng",
    "interestRate": 5.5,
    "depositAmount": 10000000,
    "currentBalance": 10275000,
    "openDate": "2026-01-02",
    "maturityDate": "2026-07-02",
    "status": "active"
  }
}
```

**Response lỗi:**

```json
{
  "message": "Saving book not found",
  "success": false
}
```

---

#### **GET /api/savingbook/search?keyword=** – Tìm kiếm sổ (teller/kế toán)

**Query params:** `keyword` (mã sổ, tên KH, hoặc CCCD)

**Response thành công:**

```json
{
  "success": true,
  "data": [
    {
      "savingBookID": 123,
      "savingBookCode": "STK20260102001",
      "customerName": "Nguyễn Văn A",
      "citizenId": "079012345678",
      "typeSavingName": "Kỳ hạn 6 tháng",
      "depositAmount": 10000000,
      "openDate": "2026-01-02",
      "status": "active"
    }
  ]
}
```

---

#### **PUT /api/savingbook/:id** – Cập nhật sổ (teller)

**Request body:**

```json
{
  "typeSavingID": 3,
  "depositAmount": 15000000
}
```

**Response thành công:**

```json
{
  "message": "Saving book updated successfully",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "Cannot update closed saving book",
  "success": false
}
```

---

#### **DELETE /api/savingbook/:id** – Xóa sổ (teller)

**Response thành công:**

```json
{
  "message": "Saving book deleted successfully",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "Cannot delete saving book with transactions",
  "success": false
}
```

---

#### **POST /api/savingbook/:id/close** – Tất toán sổ (teller)

**Request body:**

```json
{
  "closeDate": "2026-06-30"
}
```

**Response thành công:**

```json
{
  "message": "Saving book closed successfully",
  "success": true,
  "data": {
    "savingBookID": 123,
    "totalAmount": 10550000,
    "principalAmount": 10000000,
    "interestAmount": 550000,
    "status": "closed"
  }
}
```

**Response lỗi:**

```json
{
  "message": "Saving book already closed",
  "success": false
}
```

---

## 5. Nhóm Transactions (`/api/transactions`)

### 5.1. Luồng nghiệp vụ

- Teller quản lý giao dịch: tạo, xem danh sách, xem chi tiết, cập nhật, xóa.
- Teller thực hiện giao dịch nộp tiền (deposit) và rút tiền (withdraw) cho sổ tiết kiệm.
- Hệ thống tự động cập nhật số dư sổ và tính lãi suất khi giao dịch.

### 5.2. Endpoints

#### **POST /api/transactions/add** – Tạo giao dịch (teller)

**Request body:**

```json
{
  "savingBookID": 123,
  "transactionType": "deposit",
  "amount": 5000000,
  "transactionDate": "2026-01-05"
}
```

**Response thành công:**

```json
{
  "message": "Transaction created successfully",
  "success": true,
  "data": {
    "transactionID": 456,
    "savingBookID": 123,
    "transactionType": "deposit",
    "amount": 5000000,
    "transactionDate": "2026-01-05",
    "newBalance": 15275000
  }
}
```

**Response lỗi:**

```json
{
  "message": "Saving book not found or closed",
  "success": false
}
```

---

#### **GET /api/transactions** – Danh sách giao dịch (teller)

**Query params (optional):** `savingBookID`, `startDate`, `endDate`, `type`

**Response thành công:**

```json
{
  "success": true,
  "data": [
    {
      "transactionID": 456,
      "savingBookCode": "STK20260102001",
      "customerName": "Nguyễn Văn A",
      "transactionType": "deposit",
      "amount": 5000000,
      "transactionDate": "2026-01-05",
      "employeeName": "Trần Thị B"
    }
  ]
}
```

---

#### **GET /api/transactions/:id** – Chi tiết giao dịch (teller)

**Response thành công:**

```json
{
  "success": true,
  "data": {
    "transactionID": 456,
    "savingBookID": 123,
    "savingBookCode": "STK20260102001",
    "customerName": "Nguyễn Văn A",
    "citizenId": "079012345678",
    "transactionType": "deposit",
    "amount": 5000000,
    "transactionDate": "2026-01-05",
    "balanceBefore": 10275000,
    "balanceAfter": 15275000,
    "employeeName": "Trần Thị B",
    "note": "Nộp tiền định kỳ"
  }
}
```

**Response lỗi:**

```json
{
  "message": "Transaction not found",
  "success": false
}
```

---

#### **PUT /api/transactions/:id** – Cập nhật giao dịch (teller)

**Request body:**

```json
{
  "amount": 6000000,
  "note": "Điều chỉnh số tiền"
}
```

**Response thành công:**

```json
{
  "message": "Transaction updated successfully",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "Cannot update completed transaction",
  "success": false
}
```

---

#### **DELETE /api/transactions/:id** – Xóa giao dịch (teller)

**Response thành công:**

```json
{
  "message": "Transaction deleted successfully",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "Cannot delete transaction older than 24 hours",
  "success": false
}
```

---

#### **POST /api/transactions/deposit** – Gửi tiền (teller)

**Request body:**

```json
{
  "savingBookID": 123,
  "amount": 5000000,
  "transactionDate": "2026-01-05",
  "note": "Nộp tiền định kỳ"
}
```

**Response thành công:**

```json
{
  "message": "Deposit successful",
  "success": true,
  "data": {
    "transactionID": 457,
    "savingBookID": 123,
    "amount": 5000000,
    "newBalance": 20275000,
    "transactionDate": "2026-01-05"
  }
}
```

**Response lỗi:**

```json
{
  "message": "Deposit amount must be positive",
  "success": false
}
```

---

#### **POST /api/transactions/withdraw** – Rút tiền (teller)

**Request body:**

```json
{
  "savingBookID": 123,
  "amount": 3000000,
  "transactionDate": "2026-01-10",
  "note": "Rút tiền trước hạn"
}
```

**Response thành công:**

```json
{
  "message": "Withdrawal successful",
  "success": true,
  "data": {
    "transactionID": 458,
    "savingBookID": 123,
    "amount": 3000000,
    "newBalance": 17275000,
    "penaltyAmount": 50000,
    "transactionDate": "2026-01-10"
  }
}
```

**Response lỗi:**

```json
{
  "message": "Insufficient balance",
  "success": false
}
```

---

## 6. Nhóm Customer (`/api/customer`)

### 6.1. Luồng nghiệp vụ

- Teller tạo hồ sơ khách hàng mới khi mở sổ tiết kiệm.
- Teller/kế toán có thể tra cứu khách hàng theo tên, CCCD, hoặc mã KH.
- Teller có thể cập nhật thông tin khách hàng (địa chỉ, SĐT, v.v.) hoặc xóa khách hàng chưa có sổ.

### 6.2. Endpoints

#### **POST /api/customer** – Tạo khách hàng (teller)

**Request body:**

```json
{
  "fullName": "Nguyễn Văn C",
  "citizenId": "079087654321",
  "street": "123 Lê Lợi",
  "district": "Quận 1",
  "province": "TP.HCM",
  "phoneNumber": "0901234567"
}
```

**Response thành công:**

```json
{
  "message": "Customer created successfully",
  "success": true,
  "data": {
    "customerID": 25,
    "fullName": "Nguyễn Văn C",
    "citizenId": "079087654321",
    "street": "123 Lê Lợi",
    "district": "Quận 1",
    "province": "TP.HCM",
    "phoneNumber": "0901234567"
  }
}
```

**Response lỗi:**

```json
{
  "message": "Citizen ID already exists",
  "success": false
}
```

---

#### **GET /api/customer** – Danh sách khách hàng (teller/kế toán)

**Query params (optional):** `citizenId` (nếu có thì trả về khách hàng theo CCCD)

**Response thành công:**

```json
{
  "success": true,
  "data": [
    {
      "customerID": 25,
      "fullName": "Nguyễn Văn C",
      "citizenId": "079087654321",
      "address": "123 Lê Lợi, Quận 1, TP.HCM",
      "phoneNumber": "0901234567",
      "totalSavingBooks": 2,
      "totalBalance": 50000000
    }
  ]
}
```

---

#### **GET /api/customer/search?keyword=** – Tìm kiếm khách hàng (teller/kế toán)

**Query params:** `keyword` (tên, CCCD, mã KH)

**Response thành công:**

```json
{
  "success": true,
  "data": [
    {
      "customerID": 25,
      "fullName": "Nguyễn Văn C",
      "citizenId": "079087654321",
      "address": "123 Lê Lợi, Quận 1, TP.HCM",
      "phoneNumber": "0901234567"
    }
  ]
}
```

---

#### **GET /api/customer/:id** – Chi tiết khách hàng (teller/kế toán)

**Response thành công:**

```json
{
  "success": true,
  "data": {
    "customerID": 25,
    "fullName": "Nguyễn Văn C",
    "citizenId": "079087654321",
    "street": "123 Lê Lợi",
    "district": "Quận 1",
    "province": "TP.HCM",
    "phoneNumber": "0901234567",
    "savingBooks": [
      {
        "savingBookID": 101,
        "savingBookCode": "STK20260101001",
        "typeSavingName": "Kỳ hạn 6 tháng",
        "currentBalance": 20000000,
        "status": "active"
      }
    ]
  }
}
```

**Response lỗi:**

```json
{
  "message": "Customer not found",
  "success": false
}
```

---

#### **PUT /api/customer/:id** – Cập nhật khách hàng (teller)

**Request body:**

```json
{
  "fullName": "Nguyễn Văn C Updated",
  "street": "456 Nguyễn Huệ",
  "district": "Quận 1",
  "province": "TP.HCM",
  "phoneNumber": "0907654321"
}
```

**Response thành công:**

```json
{
  "message": "Customer updated successfully",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "Cannot update citizen ID",
  "success": false
}
```

---

#### **DELETE /api/customer/:id** – Xóa khách hàng (teller/kế toán)

**Response thành công:**

```json
{
  "message": "Customer deleted successfully",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "Cannot delete customer with active saving books",
  "success": false
}
```

---

## 7. Nhóm Type Saving (`/api/typesaving`)

### 7.1. Luồng nghiệp vụ

- Kế toán/admin quản lý danh mục loại sổ tiết kiệm (kỳ hạn, lãi suất, số tiền gửi tối thiểu).
- Mọi role có thể xem danh sách loại sổ khi tạo sổ hoặc tra cứu.

### 7.2. Endpoints

#### **POST /api/typesaving** – Tạo loại sổ (kế toán/admin)

**Request body:**

```json
{
  "typeSavingName": "Kỳ hạn 12 tháng",
  "termMonths": 12,
  "interestRate": 6.5,
  "minDeposit": 5000000
}
```

**Response thành công:**

```json
{
  "message": "Type saving created successfully",
  "success": true,
  "data": {
    "typeSavingID": 5,
    "typeSavingName": "Kỳ hạn 12 tháng",
    "termMonths": 12,
    "interestRate": 6.5,
    "minDeposit": 5000000,
    "status": "active"
  }
}
```

**Response lỗi:**

```json
{
  "message": "Type saving name already exists",
  "success": false
}
```

---

#### **GET /api/typesaving** – Danh sách loại sổ (mọi role)

**Response thành công:**

```json
{
  "success": true,
  "data": [
    {
      "typeSavingID": 1,
      "typeSavingName": "Không kỳ hạn",
      "termMonths": 0,
      "interestRate": 0.5,
      "minDeposit": 100000,
      "status": "active"
    },
    {
      "typeSavingID": 2,
      "typeSavingName": "Kỳ hạn 6 tháng",
      "termMonths": 6,
      "interestRate": 5.5,
      "minDeposit": 5000000,
      "status": "active"
    }
  ]
}
```

---

#### **GET /api/typesaving/:id** – Chi tiết loại sổ (mọi role)

**Response thành công:**

```json
{
  "success": true,
  "data": {
    "typeSavingID": 2,
    "typeSavingName": "Kỳ hạn 6 tháng",
    "termMonths": 6,
    "interestRate": 5.5,
    "minDeposit": 5000000,
    "withdrawalPolicy": "Rút trước hạn tính lãi suất không kỳ hạn",
    "status": "active"
  }
}
```

**Response lỗi:**

```json
{
  "message": "Type saving not found",
  "success": false
}
```

---

#### **PUT /api/typesaving/:id** – Cập nhật loại sổ (kế toán/admin)

**Request body:**

```json
{
  "typeSavingName": "Kỳ hạn 6 tháng (Khuyến mãi)",
  "interestRate": 6.0,
  "minDeposit": 3000000
}
```

**Response thành công:**

```json
{
  "message": "Type saving updated successfully",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "Cannot update type saving with active saving books",
  "success": false
}
```

---

#### **DELETE /api/typesaving/:id** – Xóa loại sổ (kế toán/admin)

**Response thành công:**

```json
{
  "message": "Type saving deleted successfully",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "Cannot delete type saving with existing saving books",
  "success": false
}
```

---

## 8. Nhóm Report (`/api/report`)

### 8.1. Luồng nghiệp vụ

- Kế toán xem báo cáo hoạt động theo ngày/tháng.
- Báo cáo bao gồm: số sổ mở/đóng, tổng tiền gửi/rút, số lượng giao dịch, doanh thu lãi.

### 8.2. Endpoints

#### **GET /api/report/daily** – Báo cáo ngày (kế toán)

**Query params:** `date` (format: YYYY-MM-DD)

**Response thành công:**

```json
{
  "success": true,
  "data": {
    "reportDate": "2026-01-02",
    "totalSavingBooksOpened": 15,
    "totalSavingBooksClosed": 8,
    "totalDeposits": 250000000,
    "totalWithdrawals": 120000000,
    "netCashFlow": 130000000,
    "totalTransactions": 45,
    "interestPaid": 5500000
  }
}
```

**Response lỗi:**

```json
{
  "message": "Invalid date format",
  "success": false
}
```

---

#### **GET /api/report/monthly** – Báo cáo tháng (kế toán)

**Query params:** `month` (format: YYYY-MM)

**Response thành công:**

```json
{
  "success": true,
  "data": {
    "reportMonth": "2026-01",
    "totalSavingBooksOpened": 450,
    "totalSavingBooksClosed": 280,
    "totalDeposits": 7500000000,
    "totalWithdrawals": 3200000000,
    "netCashFlow": 4300000000,
    "totalTransactions": 1250,
    "interestPaid": 185000000,
    "averageDepositPerBook": 16666667
  }
}
```

**Response lỗi:**

```json
{
  "message": "Month not found",
  "success": false
}
```

---

#### **GET /api/report/daily/transactions** – Thống kê giao dịch ngày (kế toán)

**Query params:** `date` (format: YYYY-MM-DD)

**Response thành công:**

```json
{
  "success": true,
  "data": {
    "reportDate": "2026-01-02",
    "depositTransactions": {
      "count": 28,
      "totalAmount": 250000000,
      "averageAmount": 8928571
    },
    "withdrawalTransactions": {
      "count": 17,
      "totalAmount": 120000000,
      "averageAmount": 7058824
    },
    "transactionsByType": [
      {
        "typeSavingName": "Kỳ hạn 6 tháng",
        "depositCount": 15,
        "withdrawalCount": 8
      }
    ]
  }
}
```

**Response lỗi:**

```json
{
  "message": "No transactions found for this date",
  "success": false
}
```

---

## 9. Nhóm Branch (`/api/branch`)

### 9.1. Luồng nghiệp vụ

- Admin xem danh sách tên chi nhánh để cấu hình phân quyền nhân viên hoặc báo cáo theo chi nhánh.

### 9.2. Endpoint

#### **GET /api/branch/name** – Danh sách tên chi nhánh (admin)

**Response thành công:**

```json
{
  "success": true,
  "data": [
    {
      "branchID": 1,
      "branchName": "Chi nhánh Quận 1",
      "address": "123 Nguyễn Huệ, Q1, TP.HCM",
      "phoneNumber": "0281234567"
    },
    {
      "branchID": 2,
      "branchName": "Chi nhánh Quận 3",
      "address": "456 Võ Văn Tần, Q3, TP.HCM",
      "phoneNumber": "0287654321"
    }
  ]
}
```

**Response lỗi:**

```json
{
  "message": "No branches found",
  "success": false
}
```

---

## 10. Nhóm Regulations (`/api/regulations`)

### 10.1. Luồng nghiệp vụ

- Kế toán/admin quản lý các quy định hệ thống: lãi suất cơ bản, số tiền gửi tối thiểu, phí rút trước hạn, v.v.
- Hệ thống lưu lịch sử thay đổi quy định để kiểm toán.

### 10.2. Endpoints

#### **GET /api/regulations** – Lấy toàn bộ quy định (kế toán/admin)

**Response thành công:**

```json
{
  "success": true,
  "data": {
    "minDepositAmount": 100000,
    "maxWithdrawalPerDay": 500000000,
    "earlyWithdrawalPenaltyRate": 0.5,
    "defaultInterestRate": 0.5,
    "maxSavingBooksPerCustomer": 10,
    "gracePeriodDays": 15
  }
}
```

---

#### **PUT /api/regulations** – Cập nhật toàn bộ quy định (kế toán/admin)

**Request body:**

```json
{
  "minDepositAmount": 200000,
  "maxWithdrawalPerDay": 1000000000,
  "earlyWithdrawalPenaltyRate": 1.0,
  "defaultInterestRate": 0.8
}
```

**Response thành công:**

```json
{
  "message": "Regulations updated successfully",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "All values must be positive numbers",
  "success": false
}
```

---

#### **GET /api/regulations/interest-rates** – Lấy lãi suất (kế toán/admin)

**Response thành công:**

```json
{
  "success": true,
  "data": [
    {
      "typeSavingID": 1,
      "typeSavingName": "Không kỳ hạn",
      "interestRate": 0.5,
      "effectiveDate": "2026-01-01"
    },
    {
      "typeSavingID": 2,
      "typeSavingName": "Kỳ hạn 6 tháng",
      "interestRate": 5.5,
      "effectiveDate": "2026-01-01"
    }
  ]
}
```

---

#### **PUT /api/regulations/interest-rates** – Cập nhật lãi suất (kế toán/admin)

**Request body:**

```json
{
  "interestRates": [
    {
      "typeSavingID": 2,
      "interestRate": 6.0
    },
    {
      "typeSavingID": 3,
      "interestRate": 7.0
    }
  ],
  "effectiveDate": "2026-02-01"
}
```

**Response thành công:**

```json
{
  "message": "Interest rates updated successfully",
  "success": true
}
```

**Response lỗi:**

```json
{
  "message": "Invalid interest rate value",
  "success": false
}
```

---

#### **GET /api/regulations/history** – Lịch sử thay đổi (kế toán/admin)

**Query params (optional):** `startDate`, `endDate`

**Response thành công:**

```json
{
  "success": true,
  "data": [
    {
      "historyID": 15,
      "changeDate": "2026-01-01T10:30:00Z",
      "changedBy": "Nguyễn Thị D (Kế toán)",
      "fieldChanged": "minDepositAmount",
      "oldValue": "100000",
      "newValue": "200000",
      "reason": "Điều chỉnh theo chính sách mới"
    },
    {
      "historyID": 16,
      "changeDate": "2026-01-05T14:15:00Z",
      "changedBy": "Trần Văn E (Admin)",
      "fieldChanged": "interestRate_TypeSaving_2",
      "oldValue": "5.5",
      "newValue": "6.0",
      "reason": "Khuyến mãi tháng 1"
    }
  ]
}
```

---

## 11. Nhóm Dashboard (`/api/dashboard`)

### 11.1. Luồng nghiệp vụ

- Teller/kế toán xem trang chủ với thống kê tổng quan hệ thống và các giao dịch gần nhất.
- Dashboard hiển thị: tổng số sổ đang hoạt động, tổng số dư, giao dịch trong ngày, v.v.

### 11.2. Endpoints

#### **GET /api/dashboard/stats** – Số liệu tổng quan (teller/kế toán)

**Response thành công:**

```json
{
  "success": true,
  "data": {
    "totalActiveSavingBooks": 1250,
    "totalCustomers": 850,
    "totalBalance": 125000000000,
    "todayTransactions": 45,
    "todayDeposits": 28,
    "todayWithdrawals": 17,
    "todayNewSavingBooks": 8,
    "todayClosedSavingBooks": 3,
    "monthlyGrowthRate": 5.2,
    "topTypeSaving": {
      "name": "Kỳ hạn 6 tháng",
      "count": 520,
      "percentage": 41.6
    }
  }
}
```

**Response lỗi:**

```json
{
  "message": "Unable to fetch dashboard statistics",
  "success": false
}
```

---

#### **GET /api/dashboard/recent-transactions** – 5 giao dịch gần đây (teller/kế toán)

**Response thành công:**

```json
{
  "success": true,
  "data": [
    {
      "transactionID": 1245,
      "savingBookCode": "STK20260102050",
      "customerName": "Lê Thị F",
      "transactionType": "deposit",
      "amount": 10000000,
      "transactionDate": "2026-01-02T15:30:00Z",
      "employeeName": "Trần Thị B"
    },
    {
      "transactionID": 1244,
      "savingBookCode": "STK20260102048",
      "customerName": "Phạm Văn G",
      "transactionType": "withdrawal",
      "amount": 5000000,
      "transactionDate": "2026-01-02T15:15:00Z",
      "employeeName": "Nguyễn Văn A"
    },
    {
      "transactionID": 1243,
      "savingBookCode": "STK20260102045",
      "customerName": "Hoàng Thị H",
      "transactionType": "deposit",
      "amount": 20000000,
      "transactionDate": "2026-01-02T14:50:00Z",
      "employeeName": "Trần Thị B"
    }
  ]
}
```

**Response lỗi:**

```json
{
  "message": "No recent transactions found",
  "success": false
}
```

---

## 12. Ghi chú chung

- Tất cả phản hồi lỗi nên trả về `{ "message": "<mô_tả>", "success": false }` để FE thống nhất hiển thị.
- Các mã trạng thái gợi ý: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error).
