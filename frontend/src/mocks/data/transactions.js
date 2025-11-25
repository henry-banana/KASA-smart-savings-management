/**
 * Mock data for Transactions (Giao dịch)
 * Based on database schema: transaction table
 */

export const mockTransactions = [
  {
    transactionId: "TXN001",
    bookId: "SB00123",
    type: "deposit",
    amount: 5000000,
    transactionDate: "2025-08-20T09:00:00.000Z",
  },
  {
    transactionId: "TXN002",
    bookId: "SB00123",
    type: "deposit",
    amount: 1000000,
    transactionDate: "2025-09-15T10:30:00.000Z",
  },
  {
    transactionId: "TXN003",
    bookId: "SB00124",
    type: "deposit",
    amount: 10000000,
    transactionDate: "2025-05-15T14:00:00.000Z",
  },
  {
    transactionId: "TXN004",
    bookId: "SB00125",
    type: "deposit",
    amount: 7500000,
    transactionDate: "2025-03-10T11:15:00.000Z",
  },
  {
    transactionId: "TXN005",
    bookId: "SB00125",
    type: "deposit",
    amount: 500000,
    transactionDate: "2025-04-20T09:30:00.000Z",
  },
  {
    transactionId: "TXN006",
    bookId: "SB00126",
    type: "deposit",
    amount: 15000000,
    transactionDate: "2025-03-20T10:00:00.000Z",
  },
  {
    transactionId: "TXN007",
    bookId: "SB00127",
    type: "deposit",
    amount: 3500000,
    transactionDate: "2025-02-10T15:45:00.000Z",
  },
  {
    transactionId: "TXN008",
    bookId: "SB00127",
    type: "deposit",
    amount: 300000,
    transactionDate: "2025-05-15T11:20:00.000Z",
  },
  {
    transactionId: "TXN009",
    bookId: "SB00128",
    type: "deposit",
    amount: 7500000,
    transactionDate: "2024-09-01T09:00:00.000Z",
  },
  {
    transactionId: "TXN010",
    bookId: "SB00128",
    type: "withdraw",
    amount: 7500000,
    transactionDate: "2024-12-01T14:30:00.000Z",
  },
  {
    transactionId: "TXN011",
    bookId: "SB00129",
    type: "deposit",
    amount: 20000000,
    transactionDate: "2024-11-15T10:00:00.000Z",
  },
  {
    transactionId: "TXN012",
    bookId: "SB00130",
    type: "deposit",
    amount: 4200000,
    transactionDate: "2025-03-20T13:15:00.000Z",
  },
  {
    transactionId: "TXN013",
    bookId: "SB00130",
    type: "deposit",
    amount: 300000,
    transactionDate: "2025-06-10T10:45:00.000Z",
  },
  // Transactions for today (2025-11-25)
  {
    transactionId: "TXN014",
    bookId: "SB00123",
    type: "deposit",
    amount: 5000000,
    transactionDate: "2025-11-25T08:30:00.000Z",
  },
  {
    transactionId: "TXN015",
    bookId: "SB00124",
    type: "withdraw",
    amount: 3000000,
    transactionDate: "2025-11-25T09:15:00.000Z",
  },
  {
    transactionId: "TXN016",
    bookId: "SB00125",
    type: "deposit",
    amount: 8000000,
    transactionDate: "2025-11-25T10:00:00.000Z",
  },
  {
    transactionId: "TXN017",
    bookId: "SB00126",
    type: "withdraw",
    amount: 5000000,
    transactionDate: "2025-11-25T10:45:00.000Z",
  },
  {
    transactionId: "TXN018",
    bookId: "SB00127",
    type: "deposit",
    amount: 12000000,
    transactionDate: "2025-11-25T11:30:00.000Z",
  },
  {
    transactionId: "TXN019",
    bookId: "SB00129",
    type: "deposit",
    amount: 15000000,
    transactionDate: "2025-11-25T13:00:00.000Z",
  },
  {
    transactionId: "TXN020",
    bookId: "SB00130",
    type: "withdraw",
    amount: 2000000,
    transactionDate: "2025-11-25T14:20:00.000Z",
  },
  // This week transactions
  {
    transactionId: "TXN021",
    bookId: "SB00123",
    type: "deposit",
    amount: 6000000,
    transactionDate: "2025-11-24T09:00:00.000Z",
  },
  {
    transactionId: "TXN022",
    bookId: "SB00124",
    type: "withdraw",
    amount: 4000000,
    transactionDate: "2025-11-24T10:30:00.000Z",
  },
  {
    transactionId: "TXN023",
    bookId: "SB00125",
    type: "deposit",
    amount: 7000000,
    transactionDate: "2025-11-23T11:00:00.000Z",
  },
  {
    transactionId: "TXN024",
    bookId: "SB00126",
    type: "deposit",
    amount: 10000000,
    transactionDate: "2025-11-22T08:30:00.000Z",
  },
  {
    transactionId: "TXN025",
    bookId: "SB00127",
    type: "withdraw",
    amount: 3500000,
    transactionDate: "2025-11-22T14:00:00.000Z",
  },
  {
    transactionId: "TXN026",
    bookId: "SB00129",
    type: "deposit",
    amount: 18000000,
    transactionDate: "2025-11-21T09:30:00.000Z",
  },
  {
    transactionId: "TXN027",
    bookId: "SB00130",
    type: "deposit",
    amount: 5000000,
    transactionDate: "2025-11-21T11:00:00.000Z",
  },
  {
    transactionId: "TXN028",
    bookId: "SB00123",
    type: "withdraw",
    amount: 2000000,
    transactionDate: "2025-11-20T10:00:00.000Z",
  },
  {
    transactionId: "TXN029",
    bookId: "SB00124",
    type: "deposit",
    amount: 8000000,
    transactionDate: "2025-11-20T13:30:00.000Z",
  },
  {
    transactionId: "TXN030",
    bookId: "SB00125",
    type: "deposit",
    amount: 4000000,
    transactionDate: "2025-11-19T09:00:00.000Z",
  },
  {
    transactionId: "TXN031",
    bookId: "SB00126",
    type: "withdraw",
    amount: 6000000,
    transactionDate: "2025-11-19T11:30:00.000Z",
  },
  // Additional transactions for October 2025 (for testing monthly reports)
  {
    transactionId: "TXN032",
    bookId: "SB00123",
    type: "deposit",
    amount: 3000000,
    transactionDate: "2025-10-05T09:00:00.000Z",
  },
  {
    transactionId: "TXN033",
    bookId: "SB00124",
    type: "deposit",
    amount: 5000000,
    transactionDate: "2025-10-08T10:30:00.000Z",
  },
  {
    transactionId: "TXN034",
    bookId: "SB00125",
    type: "withdraw",
    amount: 2000000,
    transactionDate: "2025-10-12T14:00:00.000Z",
  },
  {
    transactionId: "TXN035",
    bookId: "SB00131",
    type: "deposit",
    amount: 7000000,
    transactionDate: "2025-10-15T11:00:00.000Z",
  },
  {
    transactionId: "TXN036",
    bookId: "SB00132",
    type: "deposit",
    amount: 4500000,
    transactionDate: "2025-10-18T09:30:00.000Z",
  },
  {
    transactionId: "TXN037",
    bookId: "SB00126",
    type: "withdraw",
    amount: 3000000,
    transactionDate: "2025-10-20T13:00:00.000Z",
  },
  {
    transactionId: "TXN038",
    bookId: "SB00133",
    type: "deposit",
    amount: 6000000,
    transactionDate: "2025-10-22T10:00:00.000Z",
  },
  {
    transactionId: "TXN039",
    bookId: "SB00134",
    type: "deposit",
    amount: 8500000,
    transactionDate: "2025-10-25T14:30:00.000Z",
  },
  {
    transactionId: "TXN040",
    bookId: "SB00135",
    type: "withdraw",
    amount: 2500000,
    transactionDate: "2025-10-28T11:30:00.000Z",
  },
  // More transactions for October 2025 to increase data volume
  {
    transactionId: "TXN041",
    bookId: "SB00136",
    type: "deposit",
    amount: 9500000,
    transactionDate: "2025-10-02T08:15:00.000Z",
  },
  {
    transactionId: "TXN042",
    bookId: "SB00137",
    type: "deposit",
    amount: 12000000,
    transactionDate: "2025-10-03T10:45:00.000Z",
  },
  {
    transactionId: "TXN043",
    bookId: "SB00138",
    type: "withdraw",
    amount: 3500000,
    transactionDate: "2025-10-06T14:20:00.000Z",
  },
  {
    transactionId: "TXN044",
    bookId: "SB00139",
    type: "deposit",
    amount: 7800000,
    transactionDate: "2025-10-09T09:10:00.000Z",
  },
  {
    transactionId: "TXN045",
    bookId: "SB00140",
    type: "deposit",
    amount: 5600000,
    transactionDate: "2025-10-11T11:30:00.000Z",
  },
  {
    transactionId: "TXN046",
    bookId: "SB00141",
    type: "withdraw",
    amount: 4200000,
    transactionDate: "2025-10-14T15:45:00.000Z",
  },
  {
    transactionId: "TXN047",
    bookId: "SB00142",
    type: "deposit",
    amount: 10500000,
    transactionDate: "2025-10-16T08:30:00.000Z",
  },
  {
    transactionId: "TXN048",
    bookId: "SB00123",
    type: "deposit",
    amount: 6700000,
    transactionDate: "2025-10-17T10:00:00.000Z",
  },
  {
    transactionId: "TXN049",
    bookId: "SB00124",
    type: "withdraw",
    amount: 2800000,
    transactionDate: "2025-10-19T13:15:00.000Z",
  },
  {
    transactionId: "TXN050",
    bookId: "SB00125",
    type: "deposit",
    amount: 8900000,
    transactionDate: "2025-10-23T09:40:00.000Z",
  },
  {
    transactionId: "TXN051",
    bookId: "SB00131",
    type: "deposit",
    amount: 11200000,
    transactionDate: "2025-10-26T11:20:00.000Z",
  },
  {
    transactionId: "TXN052",
    bookId: "SB00132",
    type: "withdraw",
    amount: 3900000,
    transactionDate: "2025-10-29T14:50:00.000Z",
  },
  {
    transactionId: "TXN053",
    bookId: "SB00133",
    type: "deposit",
    amount: 9300000,
    transactionDate: "2025-10-30T10:15:00.000Z",
  },
  // Additional transactions for November 2025
  {
    transactionId: "TXN054",
    bookId: "SB00134",
    type: "deposit",
    amount: 7500000,
    transactionDate: "2025-11-01T09:00:00.000Z",
  },
  {
    transactionId: "TXN055",
    bookId: "SB00135",
    type: "deposit",
    amount: 5800000,
    transactionDate: "2025-11-02T10:30:00.000Z",
  },
  {
    transactionId: "TXN056",
    bookId: "SB00136",
    type: "withdraw",
    amount: 4500000,
    transactionDate: "2025-11-03T13:45:00.000Z",
  },
  {
    transactionId: "TXN057",
    bookId: "SB00137",
    type: "deposit",
    amount: 10200000,
    transactionDate: "2025-11-04T08:20:00.000Z",
  },
  {
    transactionId: "TXN058",
    bookId: "SB00138",
    type: "deposit",
    amount: 6400000,
    transactionDate: "2025-11-05T11:00:00.000Z",
  },
  {
    transactionId: "TXN059",
    bookId: "SB00139",
    type: "withdraw",
    amount: 5100000,
    transactionDate: "2025-11-06T14:30:00.000Z",
  },
  {
    transactionId: "TXN060",
    bookId: "SB00140",
    type: "deposit",
    amount: 8700000,
    transactionDate: "2025-11-07T09:15:00.000Z",
  },
  {
    transactionId: "TXN061",
    bookId: "SB00141",
    type: "deposit",
    amount: 7200000,
    transactionDate: "2025-11-08T10:45:00.000Z",
  },
  {
    transactionId: "TXN062",
    bookId: "SB00142",
    type: "withdraw",
    amount: 3600000,
    transactionDate: "2025-11-09T13:20:00.000Z",
  },
  {
    transactionId: "TXN063",
    bookId: "SB00123",
    type: "deposit",
    amount: 9800000,
    transactionDate: "2025-11-10T08:50:00.000Z",
  },
  {
    transactionId: "TXN064",
    bookId: "SB00124",
    type: "deposit",
    amount: 11500000,
    transactionDate: "2025-11-11T11:30:00.000Z",
  },
  {
    transactionId: "TXN065",
    bookId: "SB00125",
    type: "withdraw",
    amount: 4800000,
    transactionDate: "2025-11-12T14:10:00.000Z",
  },
  // Additional transactions to ensure all types have data in October & November
  // TS01 (No Term) - SB00125, SB00127, SB00130, SB00134, SB00135
  {
    transactionId: "TXN066",
    bookId: "SB00127",
    type: "deposit",
    amount: 2500000,
    transactionDate: "2025-10-07T09:30:00.000Z",
  },
  {
    transactionId: "TXN067",
    bookId: "SB00130",
    type: "deposit",
    amount: 3200000,
    transactionDate: "2025-10-10T11:00:00.000Z",
  },
  {
    transactionId: "TXN068",
    bookId: "SB00134",
    type: "withdraw",
    amount: 1800000,
    transactionDate: "2025-10-13T14:20:00.000Z",
  },
  {
    transactionId: "TXN069",
    bookId: "SB00135",
    type: "deposit",
    amount: 4100000,
    transactionDate: "2025-10-21T10:45:00.000Z",
  },
  {
    transactionId: "TXN070",
    bookId: "SB00127",
    type: "withdraw",
    amount: 1500000,
    transactionDate: "2025-10-24T13:15:00.000Z",
  },
  {
    transactionId: "TXN071",
    bookId: "SB00130",
    type: "deposit",
    amount: 2800000,
    transactionDate: "2025-10-27T09:00:00.000Z",
  },
  {
    transactionId: "TXN072",
    bookId: "SB00134",
    type: "deposit",
    amount: 3600000,
    transactionDate: "2025-10-31T15:30:00.000Z",
  },
  // TS02 (3 Months) - SB00131, SB00132
  {
    transactionId: "TXN073",
    bookId: "SB00131",
    type: "withdraw",
    amount: 2200000,
    transactionDate: "2025-10-04T10:30:00.000Z",
  },
  {
    transactionId: "TXN074",
    bookId: "SB00132",
    type: "withdraw",
    amount: 1900000,
    transactionDate: "2025-10-15T11:45:00.000Z",
  },
  {
    transactionId: "TXN075",
    bookId: "SB00131",
    type: "deposit",
    amount: 5500000,
    transactionDate: "2025-10-21T08:20:00.000Z",
  },
  // TS03 (6 Months) - SB00124, SB00126, SB00133
  {
    transactionId: "TXN076",
    bookId: "SB00126",
    type: "deposit",
    amount: 8200000,
    transactionDate: "2025-10-08T09:15:00.000Z",
  },
  {
    transactionId: "TXN077",
    bookId: "SB00133",
    type: "withdraw",
    amount: 3400000,
    transactionDate: "2025-10-14T14:00:00.000Z",
  },
  {
    transactionId: "TXN078",
    bookId: "SB00124",
    type: "deposit",
    amount: 6900000,
    transactionDate: "2025-10-18T10:30:00.000Z",
  },
  {
    transactionId: "TXN079",
    bookId: "SB00133",
    type: "deposit",
    amount: 7800000,
    transactionDate: "2025-10-25T11:20:00.000Z",
  },
  // November transactions for all types
  // TS01 (No Term)
  {
    transactionId: "TXN080",
    bookId: "SB00127",
    type: "deposit",
    amount: 3100000,
    transactionDate: "2025-11-03T09:40:00.000Z",
  },
  {
    transactionId: "TXN081",
    bookId: "SB00130",
    type: "withdraw",
    amount: 1700000,
    transactionDate: "2025-11-06T13:50:00.000Z",
  },
  {
    transactionId: "TXN082",
    bookId: "SB00134",
    type: "deposit",
    amount: 2900000,
    transactionDate: "2025-11-09T10:15:00.000Z",
  },
  {
    transactionId: "TXN083",
    bookId: "SB00135",
    type: "withdraw",
    amount: 2300000,
    transactionDate: "2025-11-11T14:30:00.000Z",
  },
  // TS02 (3 Months)
  {
    transactionId: "TXN084",
    bookId: "SB00131",
    type: "deposit",
    amount: 6400000,
    transactionDate: "2025-11-04T08:25:00.000Z",
  },
  {
    transactionId: "TXN085",
    bookId: "SB00132",
    type: "withdraw",
    amount: 2600000,
    transactionDate: "2025-11-07T11:40:00.000Z",
  },
  {
    transactionId: "TXN086",
    bookId: "SB00131",
    type: "withdraw",
    amount: 1900000,
    transactionDate: "2025-11-10T15:20:00.000Z",
  },
  // TS03 (6 Months)
  {
    transactionId: "TXN087",
    bookId: "SB00126",
    type: "withdraw",
    amount: 3800000,
    transactionDate: "2025-11-05T09:50:00.000Z",
  },
  {
    transactionId: "TXN088",
    bookId: "SB00133",
    type: "deposit",
    amount: 8600000,
    transactionDate: "2025-11-08T10:35:00.000Z",
  },
  {
    transactionId: "TXN089",
    bookId: "SB00124",
    type: "withdraw",
    amount: 2700000,
    transactionDate: "2025-11-11T13:45:00.000Z",
  },
  // More transactions for November to cover all days 13-21
  {
    transactionId: "TXN090",
    bookId: "SB00125",
    type: "deposit",
    amount: 5200000,
    transactionDate: "2025-11-13T09:20:00.000Z",
  },
  {
    transactionId: "TXN091",
    bookId: "SB00131",
    type: "deposit",
    amount: 7300000,
    transactionDate: "2025-11-13T14:15:00.000Z",
  },
  {
    transactionId: "TXN092",
    bookId: "SB00126",
    type: "deposit",
    amount: 9400000,
    transactionDate: "2025-11-14T10:30:00.000Z",
  },
  {
    transactionId: "TXN093",
    bookId: "SB00127",
    type: "withdraw",
    amount: 1600000,
    transactionDate: "2025-11-14T13:40:00.000Z",
  },
  {
    transactionId: "TXN094",
    bookId: "SB00132",
    type: "deposit",
    amount: 6800000,
    transactionDate: "2025-11-15T08:50:00.000Z",
  },
  {
    transactionId: "TXN095",
    bookId: "SB00133",
    type: "withdraw",
    amount: 3100000,
    transactionDate: "2025-11-15T11:25:00.000Z",
  },
  {
    transactionId: "TXN096",
    bookId: "SB00130",
    type: "deposit",
    amount: 4200000,
    transactionDate: "2025-11-16T09:45:00.000Z",
  },
  {
    transactionId: "TXN097",
    bookId: "SB00134",
    type: "withdraw",
    amount: 2400000,
    transactionDate: "2025-11-16T14:10:00.000Z",
  },
  {
    transactionId: "TXN098",
    bookId: "SB00123",
    type: "deposit",
    amount: 8900000,
    transactionDate: "2025-11-17T10:15:00.000Z",
  },
  {
    transactionId: "TXN099",
    bookId: "SB00135",
    type: "deposit",
    amount: 5700000,
    transactionDate: "2025-11-17T13:30:00.000Z",
  },
  {
    transactionId: "TXN100",
    bookId: "SB00124",
    type: "withdraw",
    amount: 3500000,
    transactionDate: "2025-11-18T09:00:00.000Z",
  },
  {
    transactionId: "TXN101",
    bookId: "SB00131",
    type: "withdraw",
    amount: 2800000,
    transactionDate: "2025-11-18T11:40:00.000Z",
  },
  {
    transactionId: "TXN102",
    bookId: "SB00126",
    type: "deposit",
    amount: 10200000,
    transactionDate: "2025-11-19T08:30:00.000Z",
  },
  {
    transactionId: "TXN103",
    bookId: "SB00127",
    type: "deposit",
    amount: 3900000,
    transactionDate: "2025-11-19T14:20:00.000Z",
  },
  {
    transactionId: "TXN104",
    bookId: "SB00132",
    type: "withdraw",
    amount: 2100000,
    transactionDate: "2025-11-20T10:50:00.000Z",
  },
  {
    transactionId: "TXN105",
    bookId: "SB00133",
    type: "deposit",
    amount: 12500000,
    transactionDate: "2025-11-20T13:15:00.000Z",
  },
  {
    transactionId: "TXN106",
    bookId: "SB00125",
    type: "withdraw",
    amount: 3200000,
    transactionDate: "2025-11-21T09:25:00.000Z",
  },
  {
    transactionId: "TXN107",
    bookId: "SB00130",
    type: "deposit",
    amount: 4800000,
    transactionDate: "2025-11-21T11:55:00.000Z",
  },
  // Transactions for November 22-24 (all types, deposits and withdrawals)
  // November 22, 2025
  {
    transactionId: "TXN108",
    bookId: "SB00125",
    type: "deposit",
    amount: 6500000,
    transactionDate: "2025-11-22T08:15:00.000Z",
  },
  {
    transactionId: "TXN109",
    bookId: "SB00127",
    type: "deposit",
    amount: 4300000,
    transactionDate: "2025-11-22T09:30:00.000Z",
  },
  {
    transactionId: "TXN110",
    bookId: "SB00130",
    type: "withdraw",
    amount: 2200000,
    transactionDate: "2025-11-22T10:45:00.000Z",
  },
  {
    transactionId: "TXN111",
    bookId: "SB00134",
    type: "deposit",
    amount: 5800000,
    transactionDate: "2025-11-22T11:20:00.000Z",
  },
  {
    transactionId: "TXN112",
    bookId: "SB00135",
    type: "withdraw",
    amount: 3100000,
    transactionDate: "2025-11-22T13:40:00.000Z",
  },
  {
    transactionId: "TXN113",
    bookId: "SB00123",
    type: "deposit",
    amount: 9200000,
    transactionDate: "2025-11-22T14:25:00.000Z",
  },
  {
    transactionId: "TXN114",
    bookId: "SB00131",
    type: "deposit",
    amount: 7600000,
    transactionDate: "2025-11-22T15:10:00.000Z",
  },
  {
    transactionId: "TXN115",
    bookId: "SB00132",
    type: "withdraw",
    amount: 2900000,
    transactionDate: "2025-11-22T16:00:00.000Z",
  },
  {
    transactionId: "TXN116",
    bookId: "SB00124",
    type: "deposit",
    amount: 11300000,
    transactionDate: "2025-11-22T08:50:00.000Z",
  },
  {
    transactionId: "TXN117",
    bookId: "SB00126",
    type: "withdraw",
    amount: 4200000,
    transactionDate: "2025-11-22T12:15:00.000Z",
  },
  {
    transactionId: "TXN118",
    bookId: "SB00133",
    type: "deposit",
    amount: 8700000,
    transactionDate: "2025-11-22T14:50:00.000Z",
  },
  // November 23, 2025
  {
    transactionId: "TXN119",
    bookId: "SB00125",
    type: "withdraw",
    amount: 2800000,
    transactionDate: "2025-11-23T08:30:00.000Z",
  },
  {
    transactionId: "TXN120",
    bookId: "SB00127",
    type: "deposit",
    amount: 5100000,
    transactionDate: "2025-11-23T09:45:00.000Z",
  },
  {
    transactionId: "TXN121",
    bookId: "SB00130",
    type: "deposit",
    amount: 3700000,
    transactionDate: "2025-11-23T10:20:00.000Z",
  },
  {
    transactionId: "TXN122",
    bookId: "SB00134",
    type: "withdraw",
    amount: 1900000,
    transactionDate: "2025-11-23T11:35:00.000Z",
  },
  {
    transactionId: "TXN123",
    bookId: "SB00135",
    type: "deposit",
    amount: 6400000,
    transactionDate: "2025-11-23T13:00:00.000Z",
  },
  {
    transactionId: "TXN124",
    bookId: "SB00123",
    type: "withdraw",
    amount: 3600000,
    transactionDate: "2025-11-23T14:15:00.000Z",
  },
  {
    transactionId: "TXN125",
    bookId: "SB00131",
    type: "deposit",
    amount: 8900000,
    transactionDate: "2025-11-23T15:30:00.000Z",
  },
  {
    transactionId: "TXN126",
    bookId: "SB00132",
    type: "deposit",
    amount: 7200000,
    transactionDate: "2025-11-23T08:00:00.000Z",
  },
  {
    transactionId: "TXN127",
    bookId: "SB00124",
    type: "withdraw",
    amount: 4500000,
    transactionDate: "2025-11-23T12:40:00.000Z",
  },
  {
    transactionId: "TXN128",
    bookId: "SB00126",
    type: "deposit",
    amount: 10800000,
    transactionDate: "2025-11-23T14:55:00.000Z",
  },
  {
    transactionId: "TXN129",
    bookId: "SB00133",
    type: "withdraw",
    amount: 3300000,
    transactionDate: "2025-11-23T16:10:00.000Z",
  },
  // November 24, 2025
  {
    transactionId: "TXN130",
    bookId: "SB00125",
    type: "deposit",
    amount: 7100000,
    transactionDate: "2025-11-24T08:20:00.000Z",
  },
  {
    transactionId: "TXN131",
    bookId: "SB00127",
    type: "withdraw",
    amount: 2500000,
    transactionDate: "2025-11-24T09:35:00.000Z",
  },
  {
    transactionId: "TXN132",
    bookId: "SB00130",
    type: "deposit",
    amount: 4900000,
    transactionDate: "2025-11-24T10:50:00.000Z",
  },
  {
    transactionId: "TXN133",
    bookId: "SB00134",
    type: "deposit",
    amount: 6200000,
    transactionDate: "2025-11-24T11:25:00.000Z",
  },
  {
    transactionId: "TXN134",
    bookId: "SB00135",
    type: "withdraw",
    amount: 2700000,
    transactionDate: "2025-11-24T13:15:00.000Z",
  },
  {
    transactionId: "TXN135",
    bookId: "SB00123",
    type: "deposit",
    amount: 9800000,
    transactionDate: "2025-11-24T14:30:00.000Z",
  },
  {
    transactionId: "TXN136",
    bookId: "SB00131",
    type: "withdraw",
    amount: 3400000,
    transactionDate: "2025-11-24T15:45:00.000Z",
  },
  {
    transactionId: "TXN137",
    bookId: "SB00132",
    type: "deposit",
    amount: 8100000,
    transactionDate: "2025-11-24T08:10:00.000Z",
  },
  {
    transactionId: "TXN138",
    bookId: "SB00124",
    type: "deposit",
    amount: 12200000,
    transactionDate: "2025-11-24T12:00:00.000Z",
  },
  {
    transactionId: "TXN139",
    bookId: "SB00126",
    type: "withdraw",
    amount: 4800000,
    transactionDate: "2025-11-24T13:50:00.000Z",
  },
  {
    transactionId: "TXN140",
    bookId: "SB00133",
    type: "deposit",
    amount: 9600000,
    transactionDate: "2025-11-24T15:20:00.000Z",
  },
  // Account opening transactions (initial deposits for new accounts in November)
  {
    transactionId: "TXN141",
    bookId: "SB00158",
    type: "deposit",
    amount: 5000000,
    transactionDate: "2025-11-02T09:15:00.000Z",
  },
  {
    transactionId: "TXN142",
    bookId: "SB00159",
    type: "deposit",
    amount: 15000000,
    transactionDate: "2025-11-05T10:30:00.000Z",
  },
  {
    transactionId: "TXN143",
    bookId: "SB00160",
    type: "deposit",
    amount: 8000000,
    transactionDate: "2025-11-08T11:20:00.000Z",
  },
  {
    transactionId: "TXN144",
    bookId: "SB00161",
    type: "deposit",
    amount: 3500000,
    transactionDate: "2025-11-12T08:45:00.000Z",
  },
  {
    transactionId: "TXN145",
    bookId: "SB00162",
    type: "deposit",
    amount: 20000000,
    transactionDate: "2025-11-16T14:00:00.000Z",
  },
  {
    transactionId: "TXN146",
    bookId: "SB00163",
    type: "deposit",
    amount: 12000000,
    transactionDate: "2025-11-19T09:30:00.000Z",
  },
  {
    transactionId: "TXN147",
    bookId: "SB00164",
    type: "deposit",
    amount: 4500000,
    transactionDate: "2025-11-25T10:15:00.000Z",
  },
  {
    transactionId: "TXN148",
    bookId: "SB00165",
    type: "deposit",
    amount: 18000000,
    transactionDate: "2025-11-28T13:40:00.000Z",
  },
  // Account closing transactions (final withdrawals for matured/closed accounts)
  {
    transactionId: "TXN149",
    bookId: "SB00145",
    type: "withdraw",
    amount: 15200000,
    transactionDate: "2025-11-06T14:30:00.000Z",
  },
  {
    transactionId: "TXN150",
    bookId: "SB00146",
    type: "withdraw",
    amount: 8700000,
    transactionDate: "2025-11-10T11:15:00.000Z",
  },
  {
    transactionId: "TXN151",
    bookId: "SB00147",
    type: "withdraw",
    amount: 21500000,
    transactionDate: "2025-11-17T15:20:00.000Z",
  },
  {
    transactionId: "TXN152",
    bookId: "SB00148",
    type: "withdraw",
    amount: 10300000,
    transactionDate: "2025-11-23T10:45:00.000Z",
  },
  {
    transactionId: "TXN153",
    bookId: "SB00149",
    type: "withdraw",
    amount: 6200000,
    transactionDate: "2025-11-27T09:00:00.000Z",
  }
];

/**
 * Helper functions for transaction data
 */
export const findTransactionById = (transactionid) => {
  return mockTransactions.find(t => t.transactionid === transactionid);
};

export const findTransactionsByBookId = (bookid) => {
  return mockTransactions.filter(t => t.bookid === bookid);
};

export const findTransactionsByType = (transactiontype) => {
  return mockTransactions.filter(t => t.transactiontype === transactiontype);
};

export const findTransactionsByDateRange = (startDate, endDate) => {
  return mockTransactions.filter(t => {
    const transDate = new Date(t.transactiondate);
    return transDate >= new Date(startDate) && transDate <= new Date(endDate);
  });
};

export const addTransaction = (transaction) => {
  mockTransactions.push(transaction);
  return transaction;
};

export const updateTransaction = (transactionid, updates) => {
  const index = mockTransactions.findIndex(t => t.transactionid === transactionid);
  if (index !== -1) {
    mockTransactions[index] = { ...mockTransactions[index], ...updates };
    return mockTransactions[index];
  }
  return null;
};

export const deleteTransaction = (transactionid) => {
  const index = mockTransactions.findIndex(t => t.transactionid === transactionid);
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
  const lastId = mockTransactions[mockTransactions.length - 1]?.transactionid || "TXN000";
  const num = parseInt(lastId.substring(3)) + 1;
  return `TXN${String(num).padStart(3, '0')}`;
};

export default mockTransactions;
