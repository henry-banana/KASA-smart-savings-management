# Mock Schema Mapping — Final (Post P1 & P2)

Status: Updated after completing all P1 and P2 refactors. In sync with `docs/OPENAPI.docx.md` and current mock code (seeds, adapters, responses).

Notes:


## Auth (Login)

  - `data`: `{ userId: string, username: string, roleName: string, lastLogin?: string }`
  - Envelope: `{ message: "Login successfully", success: true, data }`
  - Legacy: `employeeid` → `userId`, `role` → `roleName`, `lastlogin` → `lastLogin`, `createdDate` → `createdAt` (not returned in login)


## User — List & Detail

  - List `data.items`: `[{ id: string, username: string, fullName: string, roleName: string, email?: string, status?: string, createdAt?: string, lastLogin?: string }]`
  - Detail `data`: `{ id: string, username: string, fullName: string, roleName: string, email?: string, status?: string, createdAt?: string, lastLogin?: string }`
  - Legacy: `userid` → `username`, `employeeid` → `id`, `fullname` → `fullName`, `role` → `roleName`, `createdDate` → `createdAt`, `lastlogin` → `lastLogin`


## Profile

  - `data`: `{ id: string, username: string, fullName: string, roleName: string, email?: string, createdAt?: string, lastLogin?: string }`
  - Legacy mapping as in User section


## TypeSaving

  - List `data.items`: `[{ typeSavingId: string, typeName: string, term: number, interestRate: number }]`
  - Detail `data`: `{ typeSavingId: string, typeName: string, term: number, interestRate: number }`
  - Legacy: `typesavingid`/`typeid` → `typeSavingId`, `name`/`typename` → `typeName`, `rate` → `interestRate`


## SavingBook — Search & Detail

  - Search `data.items`: `[{ accountCode: string, bookId: string, citizenId: string, customerName: string, accountTypeName: string, balance: number, openDate: string, maturityDate?: string, status: string }]`
  - Detail `data`: `{ bookId: string, citizenId: string, customerName: string, typeSavingId: string, balance: number, openDate: string, maturityDate?: string, status: string, typeSaving?: { typeSavingId: string, typeName: string, term: number, interestRate: number } }`
  - Legacy: `bookid` → `bookId`, `customerid` → `citizenId` (via customer join), `typesavingid`/`typeid` → `typeSavingId`, `opendate` → `openDate`, `registertime` → `openDate`, `maturitydate` → `maturityDate`, `balance`/`currentbalance` → `balance`, `fullname` → `customerName`


## Transaction

  - Create/Update `data`: `{ transactionId: string, bookId: string, type: 'deposit'|'withdraw', amount: number, balanceBefore: number, balanceAfter: number, transactionDate: string, savingBook: { bookId: string, citizenId: string, customerName: string, typeSavingId: string, balance: number, openDate: string, maturityDate?: string, status: string }, employee: { employeeId: string, fullName: string, roleName: string } }`
  - Legacy: `transactionid` → `transactionId`, `bookid` → `bookId`, `transactiondate` → `transactionDate`, `employeeid` → `employeeId`, `fullname` → `fullName`


## Dashboard — Recent Transactions

  - `data.items`: `[{ id: string, date: string, time: string, customerName: string, type: 'deposit'|'withdraw', amount: number, accountCode: string }]`
  - Legacy: `transactionid`/`id` normalized to `id` (adapter may alias to transactionId internally), `accountcode` → `accountCode`


## Regulations

  - Base `data`: `{ minInitialDeposit: number, minTermMonths: number }`
  - Interest rates `data.items`: `[{ typeSavingId: string, term: number, rate: number }]`
  - Legacy: `interestRate` in TypeSaving seed → `rate` in Regulations interest-rates responses; `typeid` → `typeSavingId`


## Reports — Daily & Monthly

  - Daily `data.items`: `[{ date: string, totalDeposits: number, totalWithdrawals: number, newSavingBooks: number, closedSavingBooks: number }]`
  - Daily `data.total`: `{ transactions: number, deposits: number, withdrawals: number, newSavingBooks: number, closedSavingBooks: number }`
  - Daily `data.meta?`: `{ byTypeSaving?: [{ typeSavingId: string, typeName: string, count: number }], ui?: object }`
  - Monthly `data.items`: `[{ day: number, deposits: number, withdrawals: number, newSavingBooks: number, closedSavingBooks: number }]`
  - Monthly `data.total`: `{ days: number, deposits: number, withdrawals: number, newSavingBooks: number, closedSavingBooks: number }`
  - Monthly `data.meta?`: `{ ui?: object }`
  - Legacy: `dailyBreakdown`/`byTypeSaving` → `items`, `summary` → `total`


## Envelope & Messaging Consistency

  - "Get/Create/Update/Delete [resource] successfully"
  - Auth uses: "Login successfully"
