# Mock Data - KASA Smart Savings Management

## 📋 Tổng quan

Hệ thống mock được tổ chức với **phân tách rõ ràng giữa Response Structure và Data**:

- **`responses/`**: Response TEMPLATES + Builder functions (KHÔNG chứa data cụ thể)
- **`data/`**: Mock data entities (data thực tế)

## 🎯 Concept quan trọng

### ❌ SAI - Data bị duplicate
```javascript
// KHÔNG LÀM NHƯ NÀY
export const customerResponses = {
  getAllSuccess: {
    data: [
      { customerid: "CUST001", name: "..." }, // ❌ Hardcoded data
      { customerid: "CUST002", name: "..." }
    ]
  }
};
```

### ✅ ĐÚNG - Tách biệt Response và Data
```javascript
// responses/customer.responses.js - CHỈ structure
export const buildGetAllCustomersResponse = (customers) => ({
  message: "Customers retrieved successfully",
  success: true,
  data: customers, // ✅ Data được inject
  total: customers.length
});

// data/customers.js - Data thực tế
export const mockCustomers = [
  { customerid: "CUST001", name: "..." },
  { customerid: "CUST002", name: "..." }
];

// Usage - Kết hợp cả hai
import { mockCustomers, buildGetAllCustomersResponse } from '@/mocks';
const response = buildGetAllCustomersResponse(mockCustomers);
```

## 📁 Cấu trúc thư mục

```
mocks/
├── responses/              # Response templates + builders
│   ├── auth.responses.js
│   ├── customer.responses.js
│   ├── savingBook.responses.js
│   ├── transaction.responses.js
│   ├── typeSaving.responses.js
│   ├── dailyReport.responses.js        # ✨ Tách nhỏ
│   ├── monthlyReport.responses.js      # ✨ Tách nhỏ
│   ├── customerReport.responses.js     # ✨ Tách nhỏ
│   ├── interestReport.responses.js     # ✨ Tách nhỏ
│   ├── transactionRangeReport.responses.js  # ✨ Tách nhỏ
│   └── builders.js         # Utility builders
│
├── data/                   # Mock data entities
│   ├── customers.js
│   ├── savingBooks.js
│   ├── transactions.js
│   ├── typeSavings.js
│   ├── employees.js
│   └── users.js
│
├── adapters/              # Data transformers
│   └── ...
│
└── index.js              # Export tổng hợp
```

## 🚀 Cách sử dụng

### 1. Response Builders (responses/)

#### Auth API
```javascript
import { buildLoginSuccessResponse, authResponses } from '@/mocks';

// Success case - inject data
const response = buildLoginSuccessResponse("Teller");
// { message: "Login successful", success: true, roleName: "Teller" }

// Error cases - no data needed
const errorResponse = authResponses.loginFailed;
// { message: "Invalid username or password", success: false }
```

#### Customer API
```javascript
import { 
  mockCustomers, 
  findCustomerById,
  buildGetAllCustomersResponse,
  buildGetCustomerByIdResponse,
  customerResponses 
} from '@/mocks';

// Get all - inject array
const allResponse = buildGetAllCustomersResponse(mockCustomers);

// Get by ID - inject single customer
const customer = findCustomerById('CUST001');
const response = buildGetCustomerByIdResponse(customer);

// Error - use template
const errorResponse = customerResponses.getByIdNotFound;
```

#### SavingBook API
```javascript
import { 
  mockSavingBooks,
  mockCustomers,
  mockTypeSavings,
  findSavingBookById,
  findCustomerById,
  findTypeSavingById,
  findTransactionsByBookId,
  buildGetSavingBookByIdResponse 
} from '@/mocks';

// Build response với related data
const book = findSavingBookById('SB00123');
const customer = findCustomerById(book.customerid);
const typeSaving = findTypeSavingById(book.typesavingid);
const transactions = findTransactionsByBookId(book.bookid);

const response = buildGetSavingBookByIdResponse(
  book,
  customer,
  typeSaving,
  transactions
);
```

#### Daily/Monthly Reports (Tách riêng)
```javascript
import { 
  buildDailyReportResponse,
  buildMonthlyReportResponse,
  mockTransactions 
} from '@/mocks';

// Daily report - tự tính toán summary từ transactions
const dailyData = {
  date: '2025-11-20',
  summary: calculateDailySummary(mockTransactions),
  transactions: mockTransactions.filter(/* today */),
  newSavingBooks: []
};
const dailyResponse = buildDailyReportResponse(dailyData);

// Monthly report
const monthlyData = {
  month: 11,
  year: 2025,
  summary: calculateMonthlySummary(mockTransactions),
  byTypeSaving: groupByTypeSaving(mockSavingBooks),
  dailyBreakdown: []
};
const monthlyResponse = buildMonthlyReportResponse(monthlyData);
```

### 2. Mock Data Entities (data/)

#### Customers
```javascript
import { 
  mockCustomers,
  findCustomerById,
  findCustomerByIdCard,
  addCustomer,
  updateCustomer,
  deleteCustomer 
} from '@/mocks';

// Get data
const allCustomers = mockCustomers; // 8 customers
const customer = findCustomerById('CUST001');
const byIdCard = findCustomerByIdCard('079012345678');

// Mutate data (for stateful mocks)
const newCustomer = addCustomer({ customerid: 'CUST009', ... });
const updated = updateCustomer('CUST001', { address: 'New address' });
const deleted = deleteCustomer('CUST001');
```

#### SavingBooks
```javascript
import { 
  mockSavingBooks,
  findSavingBookById,
  findSavingBooksByCustomer,
  findActiveSavingBooks,
  updateSavingBookBalance 
} from '@/mocks';

// Query data
const allBooks = mockSavingBooks; // 8 books
const book = findSavingBookById('SB00123');
const customerBooks = findSavingBooksByCustomer('CUST001');
const activeBooks = findActiveSavingBooks();

// Update balance
const result = updateSavingBookBalance('SB00123', 1000000);
// { savingBook, balanceBefore, balanceAfter }
```

#### Transactions
```javascript
import { 
  mockTransactions,
  findTransactionsByBookId,
  findTransactionsByDateRange,
  generateTransactionId 
} from '@/mocks';

// Query
const bookTransactions = findTransactionsByBookId('SB00123');
const rangeTransactions = findTransactionsByDateRange(
  '2025-11-01',
  '2025-11-20'
);

// Generate new ID
const newId = generateTransactionId(); // "TXN014"
```

## 📝 Best Practices

### ✅ DO
1. **Dùng builder functions** để tạo responses
2. **Import data từ data/** khi cần
3. **Tách riêng concerns**: Response structure vs Data
4. **Sử dụng helper functions** trong data/ để query

### ❌ DON'T
1. Hardcode data trong response files
2. Duplicate data giữa responses/ và data/
3. Dùng response templates làm data source

## 🎨 Response Format Standard

### Success Response
```javascript
{
  message: "Operation successful",
  success: true,
  data: { ... },
  total?: number  // For list endpoints
}
```

### Error Response
```javascript
{
  message: "Error description",
  success: false
}
```

## ⚠️ Đề xuất cho Backend

### Report APIs (Backend chưa có)

Files đã được tách nhỏ, mỗi report có file riêng:

1. **dailyReport.responses.js**: `GET /api/report/daily?date=YYYY-MM-DD`
   - Tổng giao dịch theo ngày
   - Danh sách giao dịch trong ngày
   - Sổ mới mở

2. **monthlyReport.responses.js**: `GET /api/report/monthly?month=MM&year=YYYY`
   - Tổng hợp theo tháng
   - Phân tích theo loại tiết kiệm
   - Breakdown theo ngày

3. **transactionRangeReport.responses.js**: `GET /api/report/transactions?startDate=...&endDate=...&page=1&limit=50`
   - Báo cáo giao dịch theo khoảng thời gian
   - Có pagination

4. **customerReport.responses.js**: `GET /api/report/customer-summary`
   - Thống kê khách hàng
   - Top customers
   - Phân tích theo độ tuổi

5. **interestReport.responses.js**: `GET /api/report/interest?month=MM&year=YYYY`
   - Báo cáo lãi suất đã trả
   - Sổ đến hạn trong tháng

## 📦 Migration từ code cũ

### OLD (Deprecated)
```javascript
import { authMockData } from '@/mocks';
const response = authMockData.loginSuccess; // ❌ Hardcoded data
```

### NEW (Recommended)
```javascript
import { buildLoginSuccessResponse } from '@/mocks';
const response = buildLoginSuccessResponse("Teller"); // ✅ Inject data
```

## 🔍 Summary

### Key Changes
1. ✅ **Tách biệt Response vs Data**: responses/ chỉ chứa structure, data/ chứa data thực
2. ✅ **Builder functions**: Inject data vào responses thay vì hardcode
3. ✅ **Tách nhỏ reports**: Mỗi loại report 1 file riêng
4. ✅ **Clear separation of concerns**: Dễ maintain và scale

### File Structure
- `responses/*.responses.js` = Templates + Builders (no data)
- `data/*.js` = Actual mock data entities
- `adapters/*.js` = Transform data between formats
- `index.js` = Export tất cả

Giờ dùng mock sẽ clear hơn: **Lấy data từ data/, build response từ responses/**! 🎉
Backend cần implement các endpoints sau:

1. **Daily Report**: `GET /api/report/daily?date=YYYY-MM-DD`
   - Tổng giao dịch theo ngày
   - Danh sách giao dịch trong ngày
   - Sổ mới mở trong ngày

2. **Monthly Report**: `GET /api/report/monthly?month=MM&year=YYYY`
   - Tổng hợp theo tháng
   - Phân tích theo loại tiết kiệm
   - Breakdown theo ngày

3. **Transaction Range Report**: `GET /api/report/transactions?startDate=...&endDate=...`
   - Báo cáo giao dịch theo khoảng thời gian
   - Pagination support

4. **Customer Summary**: `GET /api/report/customer-summary`
   - Thống kê khách hàng
   - Top customers
   - Phân tích theo độ tuổi

5. **Interest Report**: `GET /api/report/interest?month=MM&year=YYYY`
   - Báo cáo lãi suất đã trả
   - Sổ đến hạn trong tháng

Chi tiết response format đã được define trong `responses/report.responses.js`

## 5. Migration Notes

### Files deprecated (giữ lại để backward compatibility)
- `authMockData.js` → Use `responses/auth.responses.js`
- `transactionMockData.js` → Use `responses/transaction.responses.js`
- `savingBookMockData.js` → Use `responses/savingBook.responses.js`
- `searchMockData.js` → Use data entities + adapters
- `reportMockData.js` → Use `responses/report.responses.js`
- `data/accounts.js` → Use `data/savingBooks.js`

## 6. Response Format Standard

Tất cả responses đều follow format:

### Success Response
```javascript
{
  message: "Operation successful",
  success: true,
  data: { ... },
  total?: number  // For list endpoints
}
```

### Error Response
```javascript
{
  message: "Error description",
  success: false
}
```

### Server Error
```javascript
{
  message: "Internal server error",
  success: false,
  error?: string  // Optional error details
}
```
