/**
 * Mock data for Transactions (Giao dịch)
 * Structure matches API contract: transactionId, bookId, type, amount, transactionDate, savingBook, employee
 */

import { mockSavingBooks } from "./savingBooks";
import { mockEmployees } from "./employees";

/**
 * Helper to build transaction response with full contract
 */
const buildTransactionPayload = (transaction) => {
  const savingBook = mockSavingBooks.find(
    (sb) => sb.bookId === transaction.bookId
  );
  // Note: employees.js uses lowercase 'employeeid', not 'employeeId'
  const employee = mockEmployees.find(
    (emp) => emp.employeeid === (transaction.employeeId || "EMP001")
  );

  return {
    transactionId: transaction.transactionId,
    bookId: transaction.bookId,
    type: transaction.type,
    amount: transaction.amount,
    transactionDate: transaction.transactionDate,
    savingBook: savingBook
      ? {
          bookId: savingBook.bookId,
          customer: {
            customerId: savingBook.citizenId, // Using citizenId as customerId
            fullName: savingBook.customerName,
          },
        }
      : null,
    employee: employee
      ? {
          employeeId: employee.employeeid, // Return lowercase as per API contract
          fullName: employee.fullname, // employees.js uses 'fullname', not 'fullName'
          roleName: "teller",
        }
      : null,
  };
};

export const mockTransactions = [
  {
    transactionId: "TXN001",
    bookId: "123",
    type: "deposit",
    amount: 5000000,
    transactionDate: "2025-08-20T09:00:00.000Z",
    employeeId: "EMP001",
  },
  {
    transactionId: "TXN002",
    bookId: "123",
    type: "deposit",
    amount: 1000000,
    transactionDate: "2025-09-15T10:30:00.000Z",
    employeeId: "EMP001",
  },
  {
    transactionId: "TXN003",
    bookId: "124",
    type: "deposit",
    amount: 10000000,
    transactionDate: "2025-05-15T14:00:00.000Z",
    employeeId: "EMP002",
  },
  {
    transactionId: "TXN004",
    bookId: "125",
    type: "deposit",
    amount: 7500000,
    transactionDate: "2025-03-10T11:15:00.000Z",
    employeeId: "EMP001",
  },
  {
    transactionId: "TXN005",
    bookId: "125",
    type: "deposit",
    amount: 500000,
    transactionDate: "2025-04-20T09:30:00.000Z",
    employeeId: "EMP002",
  },
  {
    transactionId: "TXN006",
    bookId: "126",
    type: "deposit",
    amount: 15000000,
    transactionDate: "2025-03-20T10:00:00.000Z",
    employeeId: "EMP001",
  },
  {
    transactionId: "TXN007",
    bookId: "127",
    type: "deposit",
    amount: 3500000,
    transactionDate: "2025-02-10T15:45:00.000Z",
    employeeId: "EMP003",
  },
  {
    transactionId: "TXN008",
    bookId: "127",
    type: "deposit",
    amount: 300000,
    transactionDate: "2025-05-15T11:20:00.000Z",
    employeeId: "EMP001",
  },
  {
    transactionId: "TXN009",
    bookId: "128",
    type: "deposit",
    amount: 7500000,
    transactionDate: "2024-09-01T09:00:00.000Z",
  },
  {
    transactionId: "TXN010",
    bookId: "128",
    type: "withdraw",
    amount: 7500000,
    transactionDate: "2024-12-01T14:30:00.000Z",
  },
  {
    transactionId: "TXN011",
    bookId: "129",
    type: "deposit",
    amount: 20000000,
    transactionDate: "2024-11-15T10:00:00.000Z",
  },
  {
    transactionId: "TXN012",
    bookId: "130",
    type: "deposit",
    amount: 4200000,
    transactionDate: "2025-03-20T13:15:00.000Z",
  },
  {
    transactionId: "TXN013",
    bookId: "130",
    type: "deposit",
    amount: 300000,
    transactionDate: "2025-06-10T10:45:00.000Z",
  },
  // Transactions for today (2025-12-13)
  {
    transactionId: "TXN014",
    bookId: "123",
    type: "deposit",
    amount: 5000000,
    transactionDate: "2025-12-13T08:30:00.000Z",
  },
  {
    transactionId: "TXN015",
    bookId: "124",
    type: "withdraw",
    amount: 3000000,
    transactionDate: "2025-12-13T09:15:00.000Z",
  },
  {
    transactionId: "TXN016",
    bookId: "125",
    type: "deposit",
    amount: 8000000,
    transactionDate: "2025-12-13T10:00:00.000Z",
  },
  {
    transactionId: "TXN017",
    bookId: "126",
    type: "withdraw",
    amount: 5000000,
    transactionDate: "2025-12-13T10:45:00.000Z",
  },
  {
    transactionId: "TXN018",
    bookId: "127",
    type: "deposit",
    amount: 12000000,
    transactionDate: "2025-12-12T11:30:00.000Z",
  },
  {
    transactionId: "TXN019",
    bookId: "129",
    type: "deposit",
    amount: 15000000,
    transactionDate: "2025-12-12T13:00:00.000Z",
  },
  {
    transactionId: "TXN020",
    bookId: "130",
    type: "withdraw",
    amount: 2000000,
    transactionDate: "2025-12-12T14:20:00.000Z",
  },
  // This week transactions (Dec 7-13, 2025)
  {
    transactionId: "TXN021",
    bookId: "123",
    type: "deposit",
    amount: 6000000,
    transactionDate: "2025-12-11T09:00:00.000Z",
  },
  {
    transactionId: "TXN022",
    bookId: "124",
    type: "withdraw",
    amount: 4000000,
    transactionDate: "2025-12-11T10:30:00.000Z",
  },
  {
    transactionId: "TXN023",
    bookId: "125",
    type: "deposit",
    amount: 7000000,
    transactionDate: "2025-12-10T11:00:00.000Z",
  },
  {
    transactionId: "TXN024",
    bookId: "126",
    type: "deposit",
    amount: 10000000,
    transactionDate: "2025-12-09T08:30:00.000Z",
  },
  {
    transactionId: "TXN025",
    bookId: "127",
    type: "withdraw",
    amount: 3500000,
    transactionDate: "2025-12-09T14:00:00.000Z",
  },
  {
    transactionId: "TXN026",
    bookId: "129",
    type: "deposit",
    amount: 18000000,
    transactionDate: "2025-12-08T09:30:00.000Z",
  },
  {
    transactionId: "TXN027",
    bookId: "130",
    type: "deposit",
    amount: 5000000,
    transactionDate: "2025-12-08T11:00:00.000Z",
  },
  {
    transactionId: "TXN027B",
    bookId: "123",
    type: "withdraw",
    amount: 4500000,
    transactionDate: "2025-12-07T10:00:00.000Z",
  },
  {
    transactionId: "TXN027C",
    bookId: "124",
    type: "deposit",
    amount: 9000000,
    transactionDate: "2025-12-07T13:30:00.000Z",
  },
  {
    transactionId: "TXN028",
    bookId: "123",
    type: "withdraw",
    amount: 2000000,
    transactionDate: "2025-11-20T10:00:00.000Z",
  },
  {
    transactionId: "TXN029",
    bookId: "124",
    type: "deposit",
    amount: 8000000,
    transactionDate: "2025-11-20T13:30:00.000Z",
  },
  {
    transactionId: "TXN030",
    bookId: "125",
    type: "deposit",
    amount: 4000000,
    transactionDate: "2025-11-19T09:00:00.000Z",
  },
  {
    transactionId: "TXN031",
    bookId: "126",
    type: "withdraw",
    amount: 6000000,
    transactionDate: "2025-11-19T11:30:00.000Z",
  },
  // Additional transactions for October 2025 (for testing monthly reports)
  {
    transactionId: "TXN032",
    bookId: "123",
    type: "deposit",
    amount: 3000000,
    transactionDate: "2025-10-05T09:00:00.000Z",
  },
  {
    transactionId: "TXN033",
    bookId: "124",
    type: "deposit",
    amount: 5000000,
    transactionDate: "2025-10-08T10:30:00.000Z",
  },
  {
    transactionId: "TXN034",
    bookId: "125",
    type: "withdraw",
    amount: 2000000,
    transactionDate: "2025-10-12T14:00:00.000Z",
  },
  {
    transactionId: "TXN035",
    bookId: "131",
    type: "deposit",
    amount: 7000000,
    transactionDate: "2025-10-15T11:00:00.000Z",
  },
  {
    transactionId: "TXN036",
    bookId: "132",
    type: "deposit",
    amount: 4500000,
    transactionDate: "2025-10-18T09:30:00.000Z",
  },
  {
    transactionId: "TXN037",
    bookId: "126",
    type: "withdraw",
    amount: 3000000,
    transactionDate: "2025-10-20T13:00:00.000Z",
  },
  {
    transactionId: "TXN038",
    bookId: "133",
    type: "deposit",
    amount: 6000000,
    transactionDate: "2025-10-22T10:00:00.000Z",
  },
  {
    transactionId: "TXN039",
    bookId: "134",
    type: "deposit",
    amount: 8500000,
    transactionDate: "2025-10-25T14:30:00.000Z",
  },
  {
    transactionId: "TXN040",
    bookId: "135",
    type: "withdraw",
    amount: 2500000,
    transactionDate: "2025-10-28T11:30:00.000Z",
  },
  // More transactions for October 2025 to increase data volume
  {
    transactionId: "TXN041",
    bookId: "136",
    type: "deposit",
    amount: 9500000,
    transactionDate: "2025-10-02T08:15:00.000Z",
  },
  {
    transactionId: "TXN042",
    bookId: "137",
    type: "deposit",
    amount: 12000000,
    transactionDate: "2025-10-03T10:45:00.000Z",
  },
  {
    transactionId: "TXN043",
    bookId: "138",
    type: "withdraw",
    amount: 3500000,
    transactionDate: "2025-10-06T14:20:00.000Z",
  },
  {
    transactionId: "TXN044",
    bookId: "139",
    type: "deposit",
    amount: 7800000,
    transactionDate: "2025-10-09T09:10:00.000Z",
  },
  {
    transactionId: "TXN045",
    bookId: "140",
    type: "deposit",
    amount: 5600000,
    transactionDate: "2025-10-11T11:30:00.000Z",
  },
  {
    transactionId: "TXN046",
    bookId: "141",
    type: "withdraw",
    amount: 4200000,
    transactionDate: "2025-10-14T15:45:00.000Z",
  },
  {
    transactionId: "TXN047",
    bookId: "142",
    type: "deposit",
    amount: 10500000,
    transactionDate: "2025-10-16T08:30:00.000Z",
  },
  {
    transactionId: "TXN048",
    bookId: "123",
    type: "deposit",
    amount: 6700000,
    transactionDate: "2025-10-17T10:00:00.000Z",
  },
  {
    transactionId: "TXN049",
    bookId: "124",
    type: "withdraw",
    amount: 2800000,
    transactionDate: "2025-10-19T13:15:00.000Z",
  },
  {
    transactionId: "TXN050",
    bookId: "125",
    type: "deposit",
    amount: 8900000,
    transactionDate: "2025-10-23T09:40:00.000Z",
  },
  {
    transactionId: "TXN051",
    bookId: "131",
    type: "deposit",
    amount: 11200000,
    transactionDate: "2025-10-26T11:20:00.000Z",
  },
  {
    transactionId: "TXN052",
    bookId: "132",
    type: "withdraw",
    amount: 3900000,
    transactionDate: "2025-10-29T14:50:00.000Z",
  },
  {
    transactionId: "TXN053",
    bookId: "133",
    type: "deposit",
    amount: 9300000,
    transactionDate: "2025-10-30T10:15:00.000Z",
  },
  // Additional transactions for November 2025
  {
    transactionId: "TXN054",
    bookId: "134",
    type: "deposit",
    amount: 7500000,
    transactionDate: "2025-11-01T09:00:00.000Z",
  },
  {
    transactionId: "TXN055",
    bookId: "135",
    type: "deposit",
    amount: 5800000,
    transactionDate: "2025-11-02T10:30:00.000Z",
  },
  {
    transactionId: "TXN056",
    bookId: "136",
    type: "withdraw",
    amount: 4500000,
    transactionDate: "2025-11-03T13:45:00.000Z",
  },
  {
    transactionId: "TXN057",
    bookId: "137",
    type: "deposit",
    amount: 10200000,
    transactionDate: "2025-11-04T08:20:00.000Z",
  },
  {
    transactionId: "TXN058",
    bookId: "138",
    type: "deposit",
    amount: 6400000,
    transactionDate: "2025-11-05T11:00:00.000Z",
  },
  {
    transactionId: "TXN059",
    bookId: "139",
    type: "withdraw",
    amount: 5100000,
    transactionDate: "2025-11-06T14:30:00.000Z",
  },
  {
    transactionId: "TXN060",
    bookId: "140",
    type: "deposit",
    amount: 8700000,
    transactionDate: "2025-11-07T09:15:00.000Z",
  },
  {
    transactionId: "TXN061",
    bookId: "141",
    type: "deposit",
    amount: 7200000,
    transactionDate: "2025-11-08T10:45:00.000Z",
  },
  {
    transactionId: "TXN062",
    bookId: "142",
    type: "withdraw",
    amount: 3600000,
    transactionDate: "2025-11-09T13:20:00.000Z",
  },
  {
    transactionId: "TXN063",
    bookId: "123",
    type: "deposit",
    amount: 9800000,
    transactionDate: "2025-11-10T08:50:00.000Z",
  },
  {
    transactionId: "TXN064",
    bookId: "124",
    type: "deposit",
    amount: 11500000,
    transactionDate: "2025-11-11T11:30:00.000Z",
  },
  {
    transactionId: "TXN065",
    bookId: "125",
    type: "withdraw",
    amount: 4800000,
    transactionDate: "2025-11-12T14:10:00.000Z",
  },
  // Additional transactions to ensure all types have data in October & November
  // TS01 (No Term) - SB00125, SB00127, SB00130, SB00134, SB00135
  {
    transactionId: "TXN066",
    bookId: "127",
    type: "deposit",
    amount: 2500000,
    transactionDate: "2025-10-07T09:30:00.000Z",
  },
  {
    transactionId: "TXN067",
    bookId: "130",
    type: "deposit",
    amount: 3200000,
    transactionDate: "2025-10-10T11:00:00.000Z",
  },
  {
    transactionId: "TXN068",
    bookId: "134",
    type: "withdraw",
    amount: 1800000,
    transactionDate: "2025-10-13T14:20:00.000Z",
  },
  {
    transactionId: "TXN069",
    bookId: "135",
    type: "deposit",
    amount: 4100000,
    transactionDate: "2025-10-21T10:45:00.000Z",
  },
  {
    transactionId: "TXN070",
    bookId: "127",
    type: "withdraw",
    amount: 1500000,
    transactionDate: "2025-10-24T13:15:00.000Z",
  },
  {
    transactionId: "TXN071",
    bookId: "130",
    type: "deposit",
    amount: 2800000,
    transactionDate: "2025-10-27T09:00:00.000Z",
  },
  {
    transactionId: "TXN072",
    bookId: "134",
    type: "deposit",
    amount: 3600000,
    transactionDate: "2025-10-31T15:30:00.000Z",
  },
  // TS02 (3 Months) - SB00131, SB00132
  {
    transactionId: "TXN073",
    bookId: "131",
    type: "withdraw",
    amount: 2200000,
    transactionDate: "2025-10-04T10:30:00.000Z",
  },
  {
    transactionId: "TXN074",
    bookId: "132",
    type: "withdraw",
    amount: 1900000,
    transactionDate: "2025-10-15T11:45:00.000Z",
  },
  {
    transactionId: "TXN075",
    bookId: "131",
    type: "deposit",
    amount: 5500000,
    transactionDate: "2025-10-21T08:20:00.000Z",
  },
  // TS03 (6 Months) - SB00124, SB00126, SB00133
  {
    transactionId: "TXN076",
    bookId: "126",
    type: "deposit",
    amount: 8200000,
    transactionDate: "2025-10-08T09:15:00.000Z",
  },
  {
    transactionId: "TXN077",
    bookId: "133",
    type: "withdraw",
    amount: 3400000,
    transactionDate: "2025-10-14T14:00:00.000Z",
  },
  {
    transactionId: "TXN078",
    bookId: "124",
    type: "deposit",
    amount: 6900000,
    transactionDate: "2025-10-18T10:30:00.000Z",
  },
  {
    transactionId: "TXN079",
    bookId: "133",
    type: "deposit",
    amount: 7800000,
    transactionDate: "2025-10-25T11:20:00.000Z",
  },
  // November transactions for all types
  // TS01 (No Term)
  {
    transactionId: "TXN080",
    bookId: "127",
    type: "deposit",
    amount: 3100000,
    transactionDate: "2025-11-03T09:40:00.000Z",
  },
  {
    transactionId: "TXN081",
    bookId: "130",
    type: "withdraw",
    amount: 1700000,
    transactionDate: "2025-11-06T13:50:00.000Z",
  },
  {
    transactionId: "TXN082",
    bookId: "134",
    type: "deposit",
    amount: 2900000,
    transactionDate: "2025-11-09T10:15:00.000Z",
  },
  {
    transactionId: "TXN083",
    bookId: "135",
    type: "withdraw",
    amount: 2300000,
    transactionDate: "2025-11-11T14:30:00.000Z",
  },
  // TS02 (3 Months)
  {
    transactionId: "TXN084",
    bookId: "131",
    type: "deposit",
    amount: 6400000,
    transactionDate: "2025-11-04T08:25:00.000Z",
  },
  {
    transactionId: "TXN085",
    bookId: "132",
    type: "withdraw",
    amount: 2600000,
    transactionDate: "2025-11-07T11:40:00.000Z",
  },
  {
    transactionId: "TXN086",
    bookId: "131",
    type: "withdraw",
    amount: 1900000,
    transactionDate: "2025-11-10T15:20:00.000Z",
  },
  // TS03 (6 Months)
  {
    transactionId: "TXN087",
    bookId: "126",
    type: "withdraw",
    amount: 3800000,
    transactionDate: "2025-11-05T09:50:00.000Z",
  },
  {
    transactionId: "TXN088",
    bookId: "133",
    type: "deposit",
    amount: 8600000,
    transactionDate: "2025-11-08T10:35:00.000Z",
  },
  {
    transactionId: "TXN089",
    bookId: "124",
    type: "withdraw",
    amount: 2700000,
    transactionDate: "2025-11-11T13:45:00.000Z",
  },
  // More transactions for November to cover all days 13-21
  {
    transactionId: "TXN090",
    bookId: "125",
    type: "deposit",
    amount: 5200000,
    transactionDate: "2025-11-13T09:20:00.000Z",
  },
  {
    transactionId: "TXN091",
    bookId: "131",
    type: "deposit",
    amount: 7300000,
    transactionDate: "2025-11-13T14:15:00.000Z",
  },
  {
    transactionId: "TXN092",
    bookId: "126",
    type: "deposit",
    amount: 9400000,
    transactionDate: "2025-11-14T10:30:00.000Z",
  },
  {
    transactionId: "TXN093",
    bookId: "127",
    type: "withdraw",
    amount: 1600000,
    transactionDate: "2025-11-14T13:40:00.000Z",
  },
  {
    transactionId: "TXN094",
    bookId: "132",
    type: "deposit",
    amount: 6800000,
    transactionDate: "2025-11-15T08:50:00.000Z",
  },
  {
    transactionId: "TXN095",
    bookId: "133",
    type: "withdraw",
    amount: 3100000,
    transactionDate: "2025-11-15T11:25:00.000Z",
  },
  {
    transactionId: "TXN096",
    bookId: "130",
    type: "deposit",
    amount: 4200000,
    transactionDate: "2025-11-16T09:45:00.000Z",
  },
  {
    transactionId: "TXN097",
    bookId: "134",
    type: "withdraw",
    amount: 2400000,
    transactionDate: "2025-11-16T14:10:00.000Z",
  },
  {
    transactionId: "TXN098",
    bookId: "123",
    type: "deposit",
    amount: 8900000,
    transactionDate: "2025-11-17T10:15:00.000Z",
  },
  {
    transactionId: "TXN099",
    bookId: "135",
    type: "deposit",
    amount: 5700000,
    transactionDate: "2025-11-17T13:30:00.000Z",
  },
  {
    transactionId: "TXN100",
    bookId: "124",
    type: "withdraw",
    amount: 3500000,
    transactionDate: "2025-11-18T09:00:00.000Z",
  },
  {
    transactionId: "TXN101",
    bookId: "131",
    type: "withdraw",
    amount: 2800000,
    transactionDate: "2025-11-18T11:40:00.000Z",
  },
  {
    transactionId: "TXN102",
    bookId: "126",
    type: "deposit",
    amount: 10200000,
    transactionDate: "2025-11-19T08:30:00.000Z",
  },
  {
    transactionId: "TXN103",
    bookId: "127",
    type: "deposit",
    amount: 3900000,
    transactionDate: "2025-11-19T14:20:00.000Z",
  },
  {
    transactionId: "TXN104",
    bookId: "132",
    type: "withdraw",
    amount: 2100000,
    transactionDate: "2025-11-20T10:50:00.000Z",
  },
  {
    transactionId: "TXN105",
    bookId: "133",
    type: "deposit",
    amount: 12500000,
    transactionDate: "2025-11-20T13:15:00.000Z",
  },
  {
    transactionId: "TXN106",
    bookId: "125",
    type: "withdraw",
    amount: 3200000,
    transactionDate: "2025-11-21T09:25:00.000Z",
  },
  {
    transactionId: "TXN107",
    bookId: "130",
    type: "deposit",
    amount: 4800000,
    transactionDate: "2025-11-21T11:55:00.000Z",
  },
  // Transactions for November 22-24 (all types, deposits and withdrawals)
  // November 22, 2025
  {
    transactionId: "TXN108",
    bookId: "125",
    type: "deposit",
    amount: 6500000,
    transactionDate: "2025-11-22T08:15:00.000Z",
  },
  {
    transactionId: "TXN109",
    bookId: "127",
    type: "deposit",
    amount: 4300000,
    transactionDate: "2025-11-22T09:30:00.000Z",
  },
  {
    transactionId: "TXN110",
    bookId: "130",
    type: "withdraw",
    amount: 2200000,
    transactionDate: "2025-11-22T10:45:00.000Z",
  },
  {
    transactionId: "TXN111",
    bookId: "134",
    type: "deposit",
    amount: 5800000,
    transactionDate: "2025-11-22T11:20:00.000Z",
  },
  {
    transactionId: "TXN112",
    bookId: "135",
    type: "withdraw",
    amount: 3100000,
    transactionDate: "2025-11-22T13:40:00.000Z",
  },
  {
    transactionId: "TXN113",
    bookId: "123",
    type: "deposit",
    amount: 9200000,
    transactionDate: "2025-11-22T14:25:00.000Z",
  },
  {
    transactionId: "TXN114",
    bookId: "131",
    type: "deposit",
    amount: 7600000,
    transactionDate: "2025-11-22T15:10:00.000Z",
  },
  {
    transactionId: "TXN115",
    bookId: "132",
    type: "withdraw",
    amount: 2900000,
    transactionDate: "2025-11-22T16:00:00.000Z",
  },
  {
    transactionId: "TXN116",
    bookId: "124",
    type: "deposit",
    amount: 11300000,
    transactionDate: "2025-11-22T08:50:00.000Z",
  },
  {
    transactionId: "TXN117",
    bookId: "126",
    type: "withdraw",
    amount: 4200000,
    transactionDate: "2025-11-22T12:15:00.000Z",
  },
  {
    transactionId: "TXN118",
    bookId: "133",
    type: "deposit",
    amount: 8700000,
    transactionDate: "2025-11-22T14:50:00.000Z",
  },
  // November 23, 2025
  {
    transactionId: "TXN119",
    bookId: "125",
    type: "withdraw",
    amount: 2800000,
    transactionDate: "2025-11-23T08:30:00.000Z",
  },
  {
    transactionId: "TXN120",
    bookId: "127",
    type: "deposit",
    amount: 5100000,
    transactionDate: "2025-11-23T09:45:00.000Z",
  },
  {
    transactionId: "TXN121",
    bookId: "130",
    type: "deposit",
    amount: 3700000,
    transactionDate: "2025-11-23T10:20:00.000Z",
  },
  {
    transactionId: "TXN122",
    bookId: "134",
    type: "withdraw",
    amount: 1900000,
    transactionDate: "2025-11-23T11:35:00.000Z",
  },
  {
    transactionId: "TXN123",
    bookId: "135",
    type: "deposit",
    amount: 6400000,
    transactionDate: "2025-11-23T13:00:00.000Z",
  },
  {
    transactionId: "TXN124",
    bookId: "123",
    type: "withdraw",
    amount: 3600000,
    transactionDate: "2025-11-23T14:15:00.000Z",
  },
  {
    transactionId: "TXN125",
    bookId: "131",
    type: "deposit",
    amount: 8900000,
    transactionDate: "2025-11-23T15:30:00.000Z",
  },
  {
    transactionId: "TXN126",
    bookId: "132",
    type: "deposit",
    amount: 7200000,
    transactionDate: "2025-11-23T08:00:00.000Z",
  },
  {
    transactionId: "TXN127",
    bookId: "124",
    type: "withdraw",
    amount: 4500000,
    transactionDate: "2025-11-23T12:40:00.000Z",
  },
  {
    transactionId: "TXN128",
    bookId: "126",
    type: "deposit",
    amount: 10800000,
    transactionDate: "2025-11-23T14:55:00.000Z",
  },
  {
    transactionId: "TXN129",
    bookId: "133",
    type: "withdraw",
    amount: 3300000,
    transactionDate: "2025-11-23T16:10:00.000Z",
  },
  // November 24, 2025
  {
    transactionId: "TXN130",
    bookId: "125",
    type: "deposit",
    amount: 7100000,
    transactionDate: "2025-11-24T08:20:00.000Z",
  },
  {
    transactionId: "TXN131",
    bookId: "127",
    type: "withdraw",
    amount: 2500000,
    transactionDate: "2025-11-24T09:35:00.000Z",
  },
  {
    transactionId: "TXN132",
    bookId: "130",
    type: "deposit",
    amount: 4900000,
    transactionDate: "2025-11-24T10:50:00.000Z",
  },
  {
    transactionId: "TXN133",
    bookId: "134",
    type: "deposit",
    amount: 6200000,
    transactionDate: "2025-11-24T11:25:00.000Z",
  },
  {
    transactionId: "TXN134",
    bookId: "135",
    type: "withdraw",
    amount: 2700000,
    transactionDate: "2025-11-24T13:15:00.000Z",
  },
  {
    transactionId: "TXN135",
    bookId: "123",
    type: "deposit",
    amount: 9800000,
    transactionDate: "2025-11-24T14:30:00.000Z",
  },
  {
    transactionId: "TXN136",
    bookId: "131",
    type: "withdraw",
    amount: 3400000,
    transactionDate: "2025-11-24T15:45:00.000Z",
  },
  {
    transactionId: "TXN137",
    bookId: "132",
    type: "deposit",
    amount: 8100000,
    transactionDate: "2025-11-24T08:10:00.000Z",
  },
  {
    transactionId: "TXN138",
    bookId: "124",
    type: "deposit",
    amount: 12200000,
    transactionDate: "2025-11-24T12:00:00.000Z",
  },
  {
    transactionId: "TXN139",
    bookId: "126",
    type: "withdraw",
    amount: 4800000,
    transactionDate: "2025-11-24T13:50:00.000Z",
  },
  {
    transactionId: "TXN140",
    bookId: "133",
    type: "deposit",
    amount: 9600000,
    transactionDate: "2025-11-24T15:20:00.000Z",
  },
  // Account opening transactions (initial deposits for new accounts in November)
  {
    transactionId: "TXN141",
    bookId: "158",
    type: "deposit",
    amount: 5000000,
    transactionDate: "2025-11-02T09:15:00.000Z",
  },
  {
    transactionId: "TXN142",
    bookId: "159",
    type: "deposit",
    amount: 15000000,
    transactionDate: "2025-11-05T10:30:00.000Z",
  },
  {
    transactionId: "TXN143",
    bookId: "160",
    type: "deposit",
    amount: 8000000,
    transactionDate: "2025-11-08T11:20:00.000Z",
  },
  {
    transactionId: "TXN144",
    bookId: "161",
    type: "deposit",
    amount: 3500000,
    transactionDate: "2025-11-12T08:45:00.000Z",
  },
  {
    transactionId: "TXN145",
    bookId: "162",
    type: "deposit",
    amount: 20000000,
    transactionDate: "2025-11-16T14:00:00.000Z",
  },
  {
    transactionId: "TXN146",
    bookId: "163",
    type: "deposit",
    amount: 12000000,
    transactionDate: "2025-11-19T09:30:00.000Z",
  },
  {
    transactionId: "TXN147",
    bookId: "164",
    type: "deposit",
    amount: 4500000,
    transactionDate: "2025-11-25T10:15:00.000Z",
  },
  {
    transactionId: "TXN148",
    bookId: "165",
    type: "deposit",
    amount: 18000000,
    transactionDate: "2025-11-28T13:40:00.000Z",
  },
  // Account closing transactions (final withdrawals for matured/closed accounts)
  {
    transactionId: "TXN149",
    bookId: "145",
    type: "withdraw",
    amount: 15200000,
    transactionDate: "2025-11-06T14:30:00.000Z",
  },
  {
    transactionId: "TXN150",
    bookId: "146",
    type: "withdraw",
    amount: 8700000,
    transactionDate: "2025-11-10T11:15:00.000Z",
  },
  {
    transactionId: "TXN151",
    bookId: "147",
    type: "withdraw",
    amount: 21500000,
    transactionDate: "2025-11-17T15:20:00.000Z",
  },
  {
    transactionId: "TXN152",
    bookId: "148",
    type: "withdraw",
    amount: 10300000,
    transactionDate: "2025-11-23T10:45:00.000Z",
  },
  {
    transactionId: "TXN153",
    bookId: "149",
    type: "withdraw",
    amount: 6200000,
    transactionDate: "2025-11-27T09:00:00.000Z",
  },
];

/**
 * Helper functions for transaction data
 */

// Canonical helper: find by transactionId
export const findTransactionById = (transactionId) => {
  return mockTransactions.find((t) => t.transactionId === transactionId);
};

export const findTransactionsByBookId = (bookId) => {
  return mockTransactions.filter((t) => t.bookId === bookId);
};

export const findTransactionsByType = (type) => {
  return mockTransactions.filter((t) => t.type === type);
};

export const findTransactionsByDateRange = (startDate, endDate) => {
  return mockTransactions.filter((t) => {
    const transDate = new Date(t.transactionDate);
    return transDate >= new Date(startDate) && transDate <= new Date(endDate);
  });
};

export const addTransaction = (transaction) => {
  mockTransactions.push(transaction);
  return transaction;
};

export const updateTransaction = (transactionId, updates) => {
  const index = mockTransactions.findIndex(
    (t) => t.transactionId === transactionId
  );
  if (index !== -1) {
    mockTransactions[index] = { ...mockTransactions[index], ...updates };
    return mockTransactions[index];
  }
  return null;
};

export const deleteTransaction = (transactionId) => {
  const index = mockTransactions.findIndex(
    (t) => t.transactionId === transactionId
  );
  if (index !== -1) {
    const deleted = mockTransactions.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

/**
 * Generate next transaction ID
 */

export const generateTransactionId = () => {
  const lastId =
    mockTransactions[mockTransactions.length - 1]?.transactionId || "TXN000";
  const num = parseInt(lastId.substring(3)) + 1;
  return `TXN${String(num).padStart(3, "0")}`;
};

export { buildTransactionPayload };

export default mockTransactions;
