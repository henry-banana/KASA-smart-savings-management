const { mockReportRepository, resetAllMocks } = require("./__mocks__/serviceDependencies.js");

jest.mock("../../src/repositories/Report/ReportRepository.js", () => ({
  reportRepository: mockReportRepository
}));

const { reportService } = require("../../src/services/Report/report.service.js");

describe("ReportService", () => {
  beforeEach(() => {
    resetAllMocks();
  });

  it("handles types without transactions", async () => {
    mockReportRepository.getDailyData.mockResolvedValue({
      types: [{ typeid: 2, typename: "Empty" }],
      transactions: []
    });

    const result = await reportService.getDailyReport("2025-02-02");

    expect(result.byTypeSaving[0]).toMatchObject({
      totalDeposits: 0,
      totalWithdrawals: 0,
      difference: 0
    });
  });

  it("aggregates daily report", async () => {
    mockReportRepository.getDailyData.mockResolvedValue({
      types: [
        { typeid: 1, typename: "Standard" },
        { typeid: 2, typename: "Premium" }
      ],
      transactions: [
        { savingbook: { typeid: 1 }, transactiontype: "Deposit", amount: 100 },
        { savingbook: { typeid: 1 }, transactiontype: "WithDraw", amount: 30 },
        { savingbook: { typeid: 1 }, transactiontype: "Deposit", amount: null },
        { savingbook: { typeid: 1 }, transactiontype: "WithDraw", amount: undefined },
        { savingbook: null, transactiontype: "Deposit", amount: 99 },
        { savingbook: { typeid: 2 }, transactiontype: "Deposit", amount: 50 },
        { savingbook: { typeid: 2 }, transactiontype: "WithDraw", amount: 10 }
      ]
    });

    const result = await reportService.getDailyReport("2025-01-01");

    expect(result.summary.totalDeposits).toBe(150);
    expect(result.summary.totalWithdrawals).toBe(40);
  });

  it("builds monthly report by day", async () => {
    const monthData = {
      typeInfo: { typename: "Flex" },
      newBooks: [{ registertime: "2025-02-01T00:00:00Z" }],
      closedBooks: [{ closeddate: "2025-02-02T00:00:00Z" }]
    };
    mockReportRepository.getMonthlyData.mockResolvedValue(monthData);

    const result = await reportService.getMonthlyReport(1, 2, 2025);

    expect(result.typeName).toBe("Flex");
    expect(result.summary.newSavingBooks).toBe(1);
    expect(result.summary.closedSavingBooks).toBe(1);
  });

  it("ignores closed books without closeddate", async () => {
    const monthData = {
      typeInfo: null,
      newBooks: [],
      closedBooks: [{ closeddate: null }]
    };
    mockReportRepository.getMonthlyData.mockResolvedValue(monthData);

    const result = await reportService.getMonthlyReport(2, 3, 2024);

    expect(result.summary.closedSavingBooks).toBe(0);
    expect(result.typeName).toBe("Unknown");
  });
});

