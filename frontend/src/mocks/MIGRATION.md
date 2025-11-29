# 🔄 Migration Status - Mock System

## ✅ HOÀN THÀNH (20/11/2025)

### 1. **Adapters** - Tất cả đã migrate xong!
- ✅ `authAdapter.js` - Sử dụng `data/users.js`
- ✅ `transactionAdapter.js` - Migrate `transactionMockData` → `data/savingBooks.js` + `data/transactions.js`
- ✅ `accountAdapter.js` - Migrate `data/accounts.js` → `data/savingBooks.js`
- ✅ `savingBookAdapter.js` - Migrate `searchMockData` + `data/accounts.js` → `data/savingBooks.js` + `data/customers.js` + `data/typeSavings.js`
- ✅ `reportAdapter.js` - Migrate `reportMockData` → `responses/dailyReport.responses.js` + `responses/monthlyReport.responses.js` + data entities

### 2. **Data Entities** - Đang hoạt động
- ✅ `data/customers.js` - 8 customers
- ✅ `data/savingBooks.js` - 8 saving books
- ✅ `data/transactions.js` - 13 transactions
- ✅ `data/typeSavings.js` - 4 types
- ✅ `data/employees.js` - 4 employees + 3 roles
- ✅ `data/users.js` - 4 user accounts

### 3. **Response Builders** - Mới
- ✅ `responses/auth.responses.js` - Builder functions
- ✅ `responses/customer.responses.js` - Builder functions
- ✅ `responses/savingBook.responses.js` - Builder functions
- ✅ `responses/transaction.responses.js` - Builder functions
- ✅ `responses/typeSaving.responses.js` - Builder functions
- ✅ `responses/dailyReport.responses.js` - Builder (đề xuất backend)
- ✅ `responses/monthlyReport.responses.js` - Builder (đề xuất backend)
- ✅ `responses/customerReport.responses.js` - Builder (đề xuất backend)
- ✅ `responses/interestReport.responses.js` - Builder (đề xuất backend)
- ✅ `responses/transactionRangeReport.responses.js` - Builder (đề xuất backend)

## ⚠️ DEPRECATED - Giữ lại cho backward compatibility

Các file sau **KHÔNG được sử dụng nữa** nhưng vẫn export trong `index.js` để tránh break code cũ:

### Old Mock Data Files (Root level)
- ⚠️ `authMockData.js` - Thay bằng `buildLoginSuccessResponse()` + `data/users.js`
- ⚠️ `transactionMockData.js` - Thay bằng `data/transactions.js` + `data/savingBooks.js`
- ⚠️ `savingBookMockData.js` - Thay bằng `buildAddSavingBookResponse()` + `data/savingBooks.js`
- ⚠️ `reportMockData.js` - Thay bằng `responses/dailyReport.responses.js` + `responses/monthlyReport.responses.js`
- ⚠️ `searchMockData.js` - Thay bằng query functions từ `data/` entities

### Deprecated Data File
- ⚠️ `data/accounts.js` - **KHÔNG DÙNG** - Thay bằng `data/savingBooks.js`

## 🗑️ AN TOÀN ĐỂ XÓA

✅ **Đã kiểm tra** (20/11/2025) - Không còn import ở đâu nữa!

Các file sau **KHÔNG được sử dụng** ngoài `index.js` (backward compatibility):

```bash
# Verified: No imports found in pages/components/services
✅ authMockData.js - NO USAGE
✅ transactionMockData.js - NO USAGE  
✅ savingBookMockData.js - NO USAGE
✅ reportMockData.js - NO USAGE
✅ searchMockData.js - NO USAGE
✅ data/accounts.js - NO USAGE
```

### Cách xóa an toàn:

1. **Bước 1**: Comment exports trong `index.js`:
```javascript
// export { authMockData } from './authMockData.js';
// export { transactionMockData } from './transactionMockData.js';
// export { savingBookMockData } from './savingBookMockData.js';
// export { searchMockData } from './searchMockData.js';
// export { reportMockData } from './reportMockData.js';
```

2. **Bước 2**: Test app - nếu không lỗi → xóa files:
```bash
rm authMockData.js transactionMockData.js savingBookMockData.js reportMockData.js searchMockData.js
rm data/accounts.js
```

3. **Bước 3**: Xóa comment trong `index.js`

## 📝 Adapter Status

### authAdapter.js
- ✅ **Status**: Đang hoạt động
- **Used by**: `services/authService.js`
- **Data source**: `data/users.js`
- **Methods**: `login()`, `logout()`

### transactionAdapter.js
- ✅ **Status**: Đã migrate xong
- **Used by**: `services/transactionService.js`
- **Data source**: 
  - `data/savingBooks.js` (account info)
  - `data/customers.js` (customer info)
  - `data/typeSavings.js` (type info)
  - `data/transactions.js` (transaction records)
- **Methods**: `getAccountInfo()`, `depositMoney()`, `withdrawMoney()`

### accountAdapter.js
- ✅ **Status**: Đã migrate xong
- **Used by**: `services/savingsService.js`, `services/savingBookService.js`
- **Data source**:
  - `data/savingBooks.js` (main data)
  - `data/customers.js` (customer info)
  - `data/typeSavings.js` (type info)
- **Methods**: `getAccount()`, `createAccount()`, `deposit()`, `withdraw()`, etc.

### reportAdapter.js
- ✅ **Status**: Đã migrate xong (20/11/2025)
- **Used by**: `services/reportService.js`
- **Data source**: 
  - `responses/dailyReport.responses.js` (builder)
  - `responses/monthlyReport.responses.js` (builder)
  - `data/transactions.js` (data)
  - `data/savingBooks.js` (data)
- **Methods**: `getDailyReport()`, `getMonthlyReport()`

### savingBookAdapter.js
- ✅ **Status**: Đã migrate xong (20/11/2025)
- **Used by**: `services/savingBookService.js`
- **Data source**:
  - `data/savingBooks.js` (main data)
  - `data/customers.js` (customer info)
  - `data/typeSavings.js` (type info)
- **Methods**: `searchSavingBooks()`, `getSavingBookById()`

## 🎯 Migration Path

### OLD Way (Deprecated)
```javascript
// ❌ KHÔNG DÙNG NỮA
import { transactionMockData } from '@/mocks';
const account = transactionMockData.accounts['SA12345'];
```

### NEW Way (Recommended)
```javascript
// ✅ DÙNG CÁI NÀY
import { 
  findSavingBookById,
  findCustomerById,
  buildGetSavingBookByIdResponse 
} from '@/mocks';

const savingBook = findSavingBookById('SB00123');
const customer = findCustomerById(savingBook.customerid);
const response = buildGetSavingBookByIdResponse(savingBook, customer);
```

## 🔍 Quick Check Commands

```bash
# Check if old mock files are still imported anywhere
cd frontend/src
grep -r "import.*authMockData" --include="*.js" --include="*.jsx"
grep -r "import.*transactionMockData" --include="*.js" --include="*.jsx"
grep -r "import.*savingBookMockData" --include="*.js" --include="*.jsx"
grep -r "import.*reportMockData" --include="*.js" --include="*.jsx"
grep -r "import.*searchMockData" --include="*.js" --include="*.jsx"

# Check adapter usage
grep -r "mockAuthAdapter\|mockTransactionAdapter\|mockAccountAdapter" --include="*.js" --include="*.jsx"
```

## 📦 Summary

| Component | Status | Action |
|-----------|--------|--------|
| **Adapters** | ✅ Active | Keep - được services sử dụng |
| **data/** entities | ✅ Active | Keep - nguồn data chính |
| **responses/** builders | ✅ Active | Keep - structure mới |
| **Old mock files** | ⚠️ Deprecated | Có thể xóa nếu không còn import |
| **data/accounts.js** | ⚠️ Deprecated | Có thể xóa - đã có savingBooks.js |

## ✨ Key Improvements

1. **Tách biệt rõ ràng**: Response structure vs Data entities
2. **Adapters updated**: Sử dụng data entities thay vì old mock data
3. **Builder pattern**: Inject data dynamically thay vì hardcode
4. **Backward compatible**: Old exports vẫn có trong index.js
5. **Ready to clean**: Có thể xóa old files khi đã migrate hết

---

**Next Steps**:
1. ✅ Adapters đã migrate xong
2. 🔍 Kiểm tra `reportAdapter.js` và `savingBookAdapter.js`
3. 🧹 Xóa old mock files nếu không còn dùng
4. ✅ Test adapters với services

## Legacy Schema Notes (Pre P1/P2 Refactor)

> ⚠ OUTDATED: This section captures the old mock schema before the P1/P2 refactor. It does NOT reflect the current API contract and exists only for historical reference.

# Schema Mapping - Backend vs Frontend Mock

## Vấn đề hiện tại
Có sự không đồng nhất về tên fields giữa Backend (Database) và Frontend (Mock data), gây khó khăn trong việc maintain và testing.

## So sánh Schema

### 1. UserAccount / User

| Frontend Mock | Backend DB | Chuẩn hóa | Ghi chú |
|---------------|-----------|-----------|---------|
| `userid` | `userid` | ✅ `userid` | OK |
| `password` | `password` | ✅ `password` | OK |
| `employeeid` | `employeeid` | ✅ `employeeid` | OK |
| `role` | `roleid` | ⚠️ | Mock dùng string, BE dùng ID |
| `fullName` | N/A | ⚠️ | Mock có, BE không (lấy từ Employee) |
| `email` | `email` | ✅ `email` | OK |
| `status` | `status` | ✅ `status` | OK |
| `createdDate` | `createdat` | ⚠️ | Tên khác nhau |
| `lastlogin` | `lastlogin` | ✅ `lastlogin` | OK |

**Quyết định**: Backend đúng chuẩn database. Mock nên thêm mapping layer.

---

### 2. Customer

| Frontend Mock | Backend DB | Chuẩn hóa | Ghi chú |
|---------------|-----------|-----------|---------|
| `customerid` | `customerid` | ✅ `customerid` | OK |
| `fullname` | `fullname` | ✅ `fullname` | OK |
| **`idcard`** | **`citizenid`** | ❌ **KHÁC BIỆT** | **Cần đổi mock** |
| `address` | `address` | ✅ `address` | OK |
| `phone` | `phone` | ✅ `phone` | OK |
| `email` | `email` | ✅ `email` | OK |
| `dateofbirth` | `dateofbirth` | ✅ `dateofbirth` | OK |

**❗ Action Required**: Đổi `idcard` → `citizenid` trong mock data

---

### 3. SavingBook

| Frontend Mock | Backend DB | Chuẩn hóa | Ghi chú |
|---------------|-----------|-----------|---------|
| `bookid` | `bookid` | ✅ `bookid` | OK |
| `customerid` | `customerid` | ✅ `customerid` | OK |
| `typesavingid` | `typeid` | ⚠️ | Tên khác nhau |
| `opendate` | `registertime` | ⚠️ | Tên khác nhau |
| `maturitydate` | `maturitydate` | ✅ `maturitydate` | OK |
| `initialdeposit` | `initialdeposit` | ✅ `initialdeposit` | OK |
| `balance` | `currentbalance` | ⚠️ | Tên khác nhau |
| `interestrate` | `interestrate` | ✅ `interestrate` | OK |
| `status` | `status` | ✅ `status` | OK |

**❗ Action Required**: 
- `typesavingid` → `typeid`
- `opendate` → `registertime` 
- `balance` → `currentbalance`

---

### 4. Transaction

| Frontend Mock | Backend DB | Chuẩn hóa | Ghi chú |
|---------------|-----------|-----------|---------|
| `transactionid` | `transactionid` | ✅ `transactionid` | OK |
| `bookid` | `bookid` | ✅ `bookid` | OK |
| `transactiontype` | `transactiontype` | ✅ `transactiontype` | OK |
| `amount` | `amount` | ✅ `amount` | OK |
| `transactiondate` | `transactiondate` | ✅ `transactiondate` | OK |
| `employeeid` | `employeeid` | ✅ `employeeid` | OK |

**Status**: ✅ Đã đồng bộ

---

## Giải pháp đề xuất

### Option 1: Đồng bộ Mock với Backend (KHUYẾN NGHỊ) ✅

**Ưu điểm:**
- Mock data giống y hệt DB schema
- Dễ test integration
- Frontend và Backend dùng chung model

**Nhược điểm:**
- Phải sửa nhiều file mock
- Breaking change cho code hiện tại

### Option 2: Tạo Adapter Layer

**Ưu điểm:**
- Không phá vỡ code cũ
- Linh hoạt transform data

**Nhược điểm:**
- Thêm layer complexity
- Phải maintain 2 schemas

---

## Action Plan

### Phase 1: Critical Fields (NGAY)
```javascript
// customers.js
- idcard → citizenid ❌ CRITICAL

// savingBooks.js  
- typesavingid → typeid
- opendate → registertime
- balance → currentbalance
```

### Phase 2: Adapter Updates
```javascript
// Update all adapters to handle field mapping
mockCustomerAdapter: {
  // Transform từ mock → API format
  toApiFormat(mockData) {
    return {
      ...mockData,
      citizenid: mockData.idcard  // Backward compat
    }
  }
}
```

### Phase 3: Response Builders
```javascript
// Đồng nhất response format với Backend
buildCustomerResponse(customer) {
  return {
    customerid: customer.customerid,
    fullname: customer.fullname,
    citizenid: customer.citizenid,  // Chuẩn Backend
    ...
  }
}
```

---

## Checklist

- [ ] Update `customers.js`: `idcard` → `citizenid`
- [ ] Update `savingBooks.js`: 3 fields
- [ ] Update `mockCustomerAdapter.js`
- [ ] Update `mockAccountAdapter.js`
- [ ] Update response builders
- [ ] Test tất cả mock endpoints
- [ ] Verify không break existing code
