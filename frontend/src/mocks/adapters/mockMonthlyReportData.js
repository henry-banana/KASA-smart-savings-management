// mockMonthlyReportData.js
// Mock data for MonthlyReport daily table

export function getMockMonthlyReportData(daysInMonth) {
  const mockData = [];
  for (let i = 1; i <= daysInMonth; i++) {
    mockData.push({
      day: i,
      opened: Math.floor(Math.random() * 10) + 1,
      closed: Math.floor(Math.random() * 5),
      difference: 0,
    });
  }
  mockData.forEach((item) => {
    item.difference = item.opened - item.closed;
  });
  return mockData;
}
