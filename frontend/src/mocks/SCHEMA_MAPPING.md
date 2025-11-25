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
