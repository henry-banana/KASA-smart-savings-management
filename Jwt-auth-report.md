# Báo Cáo Phân Tích JWT/Authentication - Hệ Thống SE_Web

**Ngày:** 18/12/2025  
**Mục đích:** Phân tích hiện trạng cơ chế xác thực JWT và đề xuất cho API `GET /userAccount/me`

---

## 📋 TÓM TẮT TỔNG QUAN

Hệ thống hiện tại đã **triển khai cơ bản JWT authentication** với:
- ✅ Login endpoint tạo JWT token
- ✅ Auth middleware để verify token
- ✅ Password reset flow với OTP
- ⚠️ **Middleware chưa được áp dụng rộng rãi trên các routes**
- ⚠️ **Không lưu token vào database** (stateless JWT)

---

## 🔐 1. CƠ CHẾ JWT HIỆN TẠI

### 1.1. Thư Viện & Cấu Hình

**Package sử dụng:**
```json
"jsonwebtoken": "^9.0.2"
```

**Cấu hình (.env):**
```env
JWT_SECRET=hausieucap
JWT_EXPIRES=1d
```

⚠️ **Lưu ý bảo mật:**
- `JWT_SECRET` hiện tại đơn giản, nên dùng chuỗi phức tạp hơn (min 32 ký tự)
- Thời gian hết hạn: 1 ngày (phù hợp cho ứng dụng banking)

---

### 1.2. Luồng Tạo Token (Login)

**File:** `backend/src/controllers/UserAccount/login.controller.js`

**Quy trình:**

1. **Nhận thông tin đăng nhập:**
   ```javascript
   const { username, password } = req.body;
   ```
   - Input: `username` (là email của employee)

2. **Truy vấn database:**
   ```javascript
   const { data: userData } = await supabase
     .from("employee")
     .select(`
       employeeid,
       fullname,
       email,
       roleid,
       role:roleid(rolename),
       useraccount!inner(userid, password, accountstatus)
     `)
     .eq("email", username)
     .single();
   ```
   - Join 3 bảng: `employee` → `role` → `useraccount`
   - Lấy: employeeid, fullname, email, rolename, accountstatus

3. **Xác thực mật khẩu:**
   ```javascript
   const isMatch = await comparePassword(password, userData.useraccount.password);
   ```
   - Sử dụng bcrypt để so sánh

4. **Kiểm tra trạng thái tài khoản:**
   ```javascript
   if (status === "Rejected") {
     return res.status(403).json({ message: "Account disabled" });
   }
   ```

5. **Tạo JWT Token:**
   ```javascript
   const token = jwt.sign(
     {
       userId: userData.useraccount.userid,
       username: userData.useraccount.userid,
       role: roleName
     },
     process.env.JWT_SECRET,
     { expiresIn: process.env.JWT_EXPIRES || "1d" }
   );
   ```

**Payload trong token:**
- `userId`: ID của user
- `username`: Username (hiện là userid)
- `role`: Vai trò (admin, teller...)
- `exp`: Thời gian hết hạn (tự động thêm bởi jwt.sign)

6. **Trả về response:**
   ```javascript
   {
     message: "Login successful",
     success: true,
     data: {
       userId,
       username,
       fullName,
       roleName,
       status,
       token  // ← Token gửi về frontend
     }
   }
   ```

---

### 1.3. Luồng Xác Thực Token (Middleware)

**File:** `backend/src/middleware/auth.middleware.js`

**Quy trình:**

1. **Kiểm tra header Authorization:**
   ```javascript
   const authHeader = req.headers["authorization"];
   if (!authHeader) {
     return res.status(401).json({ message: "Missing Authorization header" });
   }
   ```

2. **Parse Bearer Token:**
   ```javascript
   const parts = authHeader.split(" ");
   if (parts.length !== 2 || parts[0] !== "Bearer") {
     return res.status(401).json({ message: "Invalid token format" });
   }
   const token = parts[1];
   ```
   - Định dạng: `Authorization: Bearer <token>`

3. **Verify Token:**
   ```javascript
   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
     if (err) {
       return res.status(403).json({ message: "Token is invalid or expired" });
     }
     
     // Gán thông tin user vào request
     req.user = {
       userId: decoded.userId,
       username: decoded.username,
       role: decoded.role,
       fullName: decoded.fullName
     };
     
     next();
   });
   ```

4. **Kiểm tra thêm (nếu có :userId trong params):**
   ```javascript
   if (req.params.userId && req.params.userId !== decoded.userId) {
     return res.status(403).json({ message: "User ID mismatch" });
   }
   ```

**Kết quả:** Sau khi qua middleware, `req.user` chứa thông tin user từ token.

---

## 🛣️ 2. TÌNH TRẠNG ROUTES HIỆN TẠI

### 2.1. Các Routes ĐÃ SỬ DỤNG Auth

**File:** `backend/src/routers/employee.router.js`
```javascript
import { verifyToken } from "../middleware/auth.middleware.js";

// Commented out - chưa áp dụng
// router.post("/add", verifyToken, addEmployee);
```

⚠️ **Middleware được import nhưng chưa sử dụng!**

---

### 2.2. Các Routes CHƯA BẢO VỆ

Tất cả routes sau **KHÔNG** có middleware xác thực:

**UserAccount Router** (`/api/auth`, `/api/users`):
```javascript
router.post("/login", login);                    // ✅ Public (cần thiết)
router.post("/", createUserAccount);             // ⚠️ Cần bảo vệ
router.post("/forgot-password", forgotPassword); // ✅ Public (cần thiết)
router.post("/verify-otp", verifyOTPController); // ✅ Public (cần thiết)
router.post("/reset-password", resetPassword);   // ✅ Public (cần thiết)
router.get("/", getAllEmployees);                // ⚠️ Cần bảo vệ
router.put("/:id", updateUserAccount);           // ⚠️ Cần bảo vệ
router.patch("/:id", updateUserAccount);         // ⚠️ Cần bảo vệ
router.patch("/:id/status", updateStatusAccount); // ⚠️ Cần bảo vệ
```

**Các Router Khác:**
- `/api/customer` - ⚠️ Không có auth
- `/api/savingbook` - ⚠️ Không có auth
- `/api/transactions` - ⚠️ Không có auth
- `/api/typesaving` - ⚠️ Không có auth
- `/api/report` - ⚠️ Không có auth
- `/api/branch` - ⚠️ Không có auth
- `/api/regulations` - ⚠️ Không có auth
- `/api/dashboard` - ⚠️ Không có auth

---

## 🗄️ 3. KIẾN TRÚC DATABASE

### 3.1. Các Bảng Liên Quan

**employee:**
- `employeeid` (PK)
- `fullname`
- `email` ← Dùng làm username khi login
- `roleid` (FK → role)

**useraccount:**
- `userid` (PK, FK → employee.employeeid)
- `password` (bcrypt hash)
- `accountstatus` (Pending/Active/Rejected)

**role:**
- `roleid` (PK)
- `rolename` (admin, teller...)

### 3.2. Quan Hệ

```
employee (1) ←→ (1) useraccount
employee (N) ←→ (1) role
```

### 3.3. Token Storage

**⚠️ QUAN TRỌNG:**
- Hệ thống **KHÔNG lưu token vào database**
- Token được lưu **phía client** (localStorage/sessionStorage)
- Đây là cơ chế **stateless JWT**

**Ưu điểm:**
- Không cần query DB mỗi request
- Scalable, phù hợp microservices
- Giảm tải database

**Nhược điểm:**
- Không thể revoke token trước khi expire
- Cần cơ chế refresh token để logout
- Khó tracking user sessions

---

## 🔒 4. CƠ CHẾ BẢO MẬT KHÁC

### 4.1. Password Hashing

**Middleware:** `backend/src/middleware/hashing.middleware.js`
- Sử dụng bcrypt
- Salt rounds: (cần kiểm tra file để biết chính xác)

### 4.2. Password Reset Flow

**3 bước:**

1. **Forgot Password** (`forgotPassword.controller.js`):
   - Input: email hoặc username
   - Generate OTP (6 số, lưu in-memory)
   - Gửi OTP qua email (nodemailer)
   - OTP expire sau 5 phút

2. **Verify OTP** (`verifyOTP.controller.js`):
   - Kiểm tra OTP có hợp lệ không
   - Không xóa OTP (cần cho bước 3)

3. **Reset Password** (`resetPassword.controller.js`):
   - Verify OTP lần nữa
   - Hash password mới
   - Update vào database
   - Xóa OTP

**OTP Storage:**
```javascript
// In-memory Map (otpStore.js)
const otpStore = new Map();
// Structure: { 
//   email: { 
//     otp: '123456', 
//     expiresAt: timestamp, 
//     userId: 'user1' 
//   } 
// }
```

⚠️ **Lưu ý:**
- OTP lưu in-memory → mất khi restart server
- Phù hợp cho môi trường dev/nhỏ
- Production nên dùng Redis

### 4.3. Email Service

**File:** `backend/src/services/UserAccount/email.service.js`
- Service: Gmail SMTP
- Credentials trong `.env`:
  ```env
  EMAIL_USER=nphuchoang.itus@gmail.com
  EMAIL_PASSWORD=yccukkjgyjnltijd
  ```

---

## 🎯 5. ĐÁNH GIÁ THỰC TRẠNG

### 5.1. Điểm Mạnh ✅

1. **JWT được cấu hình đúng chuẩn:**
   - Sử dụng thư viện chính thống
   - Có expiration time
   - Payload chứa đủ thông tin cần thiết

2. **Middleware được thiết kế tốt:**
   - Kiểm tra format token chuẩn
   - Verify signature
   - Gán `req.user` để controller sử dụng

3. **Password security tốt:**
   - Bcrypt hashing
   - Password reset với OTP
   - OTP có thời gian hết hạn

4. **Separation of concerns:**
   - Controller, service, middleware tách biệt
   - Code dễ maintain

### 5.2. Điểm Yếu ⚠️

1. **Middleware chưa được áp dụng:**
   - Hầu hết routes không có authentication
   - Dữ liệu nhạy cảm bị lộ (customers, transactions...)

2. **Thiếu cơ chế refresh token:**
   - Không thể logout trước khi token expire
   - User phải đợi 1 ngày token hết hạn

3. **Thiếu role-based authorization:**
   - Middleware chỉ verify token
   - Không kiểm tra quyền theo role (admin, teller...)

4. **OTP lưu in-memory:**
   - Mất khi restart server
   - Không phù hợp production

5. **JWT_SECRET yếu:**
   - Chuỗi đơn giản, dễ bị brute force
   - Nên dùng 256-bit random string

6. **Thiếu logging & monitoring:**
   - Không track login attempts
   - Không detect suspicious activities

---

## 🚀 6. YÊU CẦU CHO API `GET /userAccount/me`

### 6.1. Mục Đích API

Lấy thông tin user hiện tại **dựa vào token**, không cần truyền ID trong params.

### 6.2. Các Yêu Cầu Kỹ Thuật

✅ **ĐÃ CÓ SẴN:**

1. **Middleware `verifyToken`:**
   - Đã có sẵn, hoạt động tốt
   - Extract user info từ token vào `req.user`

2. **Thông tin trong token payload:**
   ```javascript
   {
     userId: "EMP001",
     username: "EMP001",
     role: "admin"
   }
   ```

3. **Database schema:**
   - Bảng employee, useraccount đã có
   - Relationship đã thiết lập

⚠️ **CẦN BỔ SUNG:**

1. **Controller mới:**
   - File: `backend/src/controllers/UserAccount/me.controller.js`
   - Logic:
     ```javascript
     export async function getMe(req, res) {
       const userId = req.user.userId; // Từ token
       // Query database lấy thông tin đầy đủ
       // Return response
     }
     ```

2. **Service method (tùy chọn):**
   - `userAccountService.getUserProfile(userId)`
   - Tái sử dụng logic từ `getUserAccountById`

3. **Route:**
   ```javascript
   // userAccount.router.js
   router.get("/me", verifyToken, getMe);
   ```

4. **Response format:**
   ```json
   {
     "message": "User profile retrieved successfully",
     "success": true,
     "data": {
       "userId": "EMP001",
       "username": "EMP001",
       "fullName": "Nguyễn Văn A",
       "email": "nguyenvana@example.com",
       "role": {
         "roleId": "R001",
         "roleName": "admin"
       },
       "branch": {
         "branchId": "B001",
         "branchName": "Chi nhánh HCM"
       },
       "accountStatus": "active"
     }
   }
   ```

### 6.3. Implementation Steps

**Bước 1:** Tạo controller
```javascript
// backend/src/controllers/UserAccount/me.controller.js
import { supabase } from "../../config/database.js";

export async function getMe(req, res) {
  try {
    const userId = req.user.userId;

    const { data, error } = await supabase
      .from("employee")
      .select(`
        employeeid,
        fullname,
        email,
        roleid,
        branchid,
        role:roleid(roleid, rolename),
        branch:branchid(branchid, branchname),
        useraccount!inner(userid, accountstatus)
      `)
      .eq("employeeid", userId)
      .single();

    if (error || !data) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }

    return res.status(200).json({
      message: "User profile retrieved successfully",
      success: true,
      data: {
        userId: data.useraccount.userid,
        username: data.useraccount.userid,
        fullName: data.fullname,
        email: data.email,
        role: data.role,
        branch: data.branch,
        accountStatus: data.useraccount.accountstatus
      }
    });
  } catch (err) {
    console.error("Error in getMe:", err);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
}
```

**Bước 2:** Thêm route
```javascript
// backend/src/routers/userAccount.router.js
import { getMe } from "../controllers/UserAccount/me.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

router.get("/me", verifyToken, getMe);
```

**Bước 3:** Test
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/users/me
```

---

## 📝 7. KHUYẾN NGHỊ BẢO MẬT

### 7.1. Ưu Tiên Cao 🔴

1. **Áp dụng verifyToken cho tất cả routes nhạy cảm:**
   ```javascript
   // Ví dụ
   router.get("/", verifyToken, getAllCustomers);
   router.post("/", verifyToken, createCustomer);
   ```

2. **Tạo role-based authorization middleware:**
   ```javascript
   // middleware/authorize.middleware.js
   export function authorize(...roles) {
     return (req, res, next) => {
       if (!roles.includes(req.user.role)) {
         return res.status(403).json({ message: "Forbidden" });
       }
       next();
     };
   }
   
   // Usage
   router.delete("/:id", verifyToken, authorize("admin"), deleteCustomer);
   ```

3. **Thay đổi JWT_SECRET:**
   ```bash
   # Generate secure secret
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### 7.2. Ưu Tiên Trung Bình 🟡

4. **Implement Refresh Token:**
   - Thêm bảng `refresh_tokens` trong DB
   - Short-lived access token (15 phút)
   - Long-lived refresh token (7 ngày)

5. **Rate limiting:**
   ```javascript
   import rateLimit from "express-rate-limit";
   
   const loginLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5, // 5 requests per window
     message: "Too many login attempts"
   });
   
   router.post("/login", loginLimiter, login);
   ```

6. **Chuyển OTP sang Redis:**
   ```javascript
   // Thay vì Map, dùng Redis
   await redis.setex(`otp:${email}`, 300, otp);
   ```

### 7.3. Ưu Tiên Thấp 🟢

7. **Login audit log:**
   - Lưu lại login attempts
   - Track IP, user agent
   - Alert khi có suspicious activity

8. **Token blacklist (logout):**
   - Lưu revoked tokens vào Redis
   - Check blacklist trong middleware

9. **HTTPS enforcement:**
   ```javascript
   app.use((req, res, next) => {
     if (req.header('x-forwarded-proto') !== 'https') {
       res.redirect(`https://${req.header('host')}${req.url}`);
     } else {
       next();
     }
   });
   ```

---

## 📊 8. SO SÁNH STATELESS VS STATEFUL JWT

### 8.1. Stateless JWT (Hiện tại)

**Đặc điểm:**
- Token không lưu trong DB
- Mỗi request verify bằng secret key

**Ưu điểm:**
- ✅ Hiệu suất cao (không query DB)
- ✅ Scalable
- ✅ Đơn giản

**Nhược điểm:**
- ❌ Không thể logout ngay lập tức
- ❌ Không biết user nào đang online
- ❌ Khó thu hồi quyền truy cập

### 8.2. Stateful JWT (Lưu token trong DB)

**Đặc điểm:**
- Lưu token vào bảng `sessions` hoặc `tokens`
- Mỗi request kiểm tra token có tồn tại trong DB

**Ưu điểm:**
- ✅ Logout ngay lập tức (xóa token)
- ✅ Track sessions
- ✅ Revoke token dễ dàng

**Nhược điểm:**
- ❌ Mỗi request phải query DB
- ❌ Phức tạp hơn
- ❌ Bottleneck khi scale

### 8.3. Hybrid Approach (Khuyến nghị)

**Giải pháp:**
1. Access token: Stateless, short-lived (15 phút)
2. Refresh token: Stateful, long-lived (7 ngày), lưu DB

**Lợi ích:**
- ✅ Hiệu suất cao (access token)
- ✅ Kiểm soát được (refresh token)
- ✅ Logout hiệu quả

---

## 🔍 9. CHECKLIST TRIỂN KHAI API `/me`

- [ ] Tạo file `me.controller.js`
- [ ] Implement logic query database
- [ ] Handle error cases (user not found, token invalid...)
- [ ] Thêm route `GET /api/users/me`
- [ ] Apply middleware `verifyToken`
- [ ] Test với Postman/curl
- [ ] Kiểm tra response format
- [ ] Update Swagger documentation
- [ ] Test edge cases:
  - [ ] Token expired
  - [ ] Invalid token
  - [ ] Missing token
  - [ ] User deleted sau khi login
- [ ] Frontend integration

---

## 📚 10. TÀI LIỆU THAM KHẢO

**JWT Best Practices:**
- https://tools.ietf.org/html/rfc7519
- https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html

**Security:**
- OWASP Top 10
- https://jwt.io/introduction

**Implementation:**
- https://github.com/auth0/node-jsonwebtoken
- https://www.npmjs.com/package/jsonwebtoken

---

## 📞 KẾT LUẬN

### Tóm Tắt

Hệ thống hiện tại đã có **nền tảng JWT vững chắc** nhưng:
1. ⚠️ Chưa áp dụng bảo mật cho hầu hết routes
2. ⚠️ Thiếu authorization (role-based access)
3. ⚠️ Thiếu refresh token mechanism

### Để Triển Khai API `/me`

**Cần làm:** (Ước tính 30 phút)
1. Tạo controller mới (10 phút)
2. Thêm route với middleware (5 phút)
3. Test (15 phút)

**Không cần:**
- ❌ Lưu token vào database
- ❌ Thay đổi login flow
- ❌ Thêm table mới

**Lý do:** Tất cả thông tin cần thiết đã có trong token payload (`req.user.userId`), chỉ cần query database để lấy thông tin chi tiết.

---

**Người Phân Tích:** GitHub Copilot  
**Ngày:** 18/12/2025  
**Version:** 1.0
