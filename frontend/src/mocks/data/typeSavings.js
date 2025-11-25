/**
 * Mock data for TypeSaving (Loại tiết kiệm)
 * Based on database schema: typesaving table
 */

export const mockTypeSavings = [
  {
    typeSavingId: "TS01",
    typeName: "No Term",
    term: 0,              // 0 = không kỳ hạn
    interestRate: 0.2,    // %/tháng
    minimumDeposit: 1000000
  },
  {
    typeSavingId: "TS02",
    typeName: "3 Months",
    term: 3,
    interestRate: 0.5,    // %/tháng
    minimumDeposit: 5000000
  },
  {
    typeSavingId: "TS03",
    typeName: "6 Months",
    term: 6,
    interestRate: 0.55,   // %/tháng
    minimumDeposit: 10000000
  },
  {
    typeSavingId: "TS04",
    typeName: "12 Months",
    term: 12,
    interestRate: 0.65,   // %/tháng
    minimumDeposit: 20000000
  }
];

/**
 * Helper functions for typesaving data
 */
export const findTypeSavingById = (typeSavingId) => {
  return mockTypeSavings.find(ts => ts.typeSavingId === typeSavingId);
};

export const findTypeSavingByName = (typeName) => {
  return mockTypeSavings.find(ts => ts.typeName === typeName);
};

export const addTypeSaving = (typeSaving) => {
  mockTypeSavings.push(typeSaving);
  return typeSaving;
};

export const updateTypeSaving = (typeSavingId, updates) => {
  const index = mockTypeSavings.findIndex(ts => ts.typeSavingId === typeSavingId);
  if (index !== -1) {
    mockTypeSavings[index] = { ...mockTypeSavings[index], ...updates };
    return mockTypeSavings[index];
  }
  return null;
};

export const deleteTypeSaving = (typeSavingId) => {
  const index = mockTypeSavings.findIndex(ts => ts.typeSavingId === typeSavingId);
  if (index !== -1) {
    const deleted = mockTypeSavings.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

export default mockTypeSavings;
