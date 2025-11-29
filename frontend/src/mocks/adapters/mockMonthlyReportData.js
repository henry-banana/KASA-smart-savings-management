// mockMonthlyReportData.js
// Mock data generator for MonthlyReport daily table
// Returns data matching OpenAPI contract: { day, newSavingBooks, closedSavingBooks, difference }

export function getMockMonthlyReportData(daysInMonth) {
  const mockData = [];
  for (let i = 1; i <= daysInMonth; i++) {
    const opened = Math.floor(Math.random() * 10) + 1;
    const closed = Math.floor(Math.random() * 5);
    mockData.push({
      day: i,
      newSavingBooks: opened,
      closedSavingBooks: closed,
      difference: opened - closed,
    });
  }
  return mockData;
}
