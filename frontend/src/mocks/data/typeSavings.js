/**
 * Mock data for TypeSaving (Loại tiết kiệm)
 * Based on database schema: typesaving table
 */

export const mockTypeSavings = [
  {
    typesavingid: "TS001",
    typename: "no-term",
    term: 0,
    interestrate: 0.02,
    minimumdeposit: 100000,
    description: "Không kỳ hạn - rút tiền bất kỳ lúc nào"
  },
  {
    typesavingid: "TS002",
    typename: "3-months",
    term: 3,
    interestrate: 0.045,
    minimumdeposit: 1000000,
    description: "Kỳ hạn 3 tháng với lãi suất 4.5%/năm"
  },
  {
    typesavingid: "TS003",
    typename: "6-months",
    term: 6,
    interestrate: 0.055,
    minimumdeposit: 5000000,
    description: "Kỳ hạn 6 tháng với lãi suất 5.5%/năm"
  },
  {
    typesavingid: "TS004",
    typename: "12-months",
    term: 12,
    interestrate: 0.065,
    minimumdeposit: 10000000,
    description: "Kỳ hạn 12 tháng với lãi suất 6.5%/năm"
  }
];

/**
 * Helper functions for typesaving data
 */
export const findTypeSavingById = (typesavingid) => {
  return mockTypeSavings.find(ts => ts.typesavingid === typesavingid);
};

export const findTypeSavingByName = (typename) => {
  return mockTypeSavings.find(ts => ts.typename === typename);
};

export const addTypeSaving = (typeSaving) => {
  mockTypeSavings.push(typeSaving);
  return typeSaving;
};

export const updateTypeSaving = (typesavingid, updates) => {
  const index = mockTypeSavings.findIndex(ts => ts.typesavingid === typesavingid);
  if (index !== -1) {
    mockTypeSavings[index] = { ...mockTypeSavings[index], ...updates };
    return mockTypeSavings[index];
  }
  return null;
};

export const deleteTypeSaving = (typesavingid) => {
  const index = mockTypeSavings.findIndex(ts => ts.typesavingid === typesavingid);
  if (index !== -1) {
    const deleted = mockTypeSavings.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

export default mockTypeSavings;
