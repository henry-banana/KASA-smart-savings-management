/**
 * Mock data for UserAccounts (Tài khoản đăng nhập)
 * Based on database schema: useraccount table
 */

export const mockUserAccounts = [
  {
    userid: "teller1",
    password: "$2b$10$abcdefghijklmnopqrstuv", // hashed password for '123456'
    employeeid: "EMP001",
    role: "teller",
    fullName: "Nguyễn Văn A",
    email: "teller1@kasa.com",
    status: "active",
    createdDate: "2025-01-15",
    lastlogin: "2025-11-20T08:30:00.000Z"
  },
  {
    userid: "accountant1",
    password: "$2b$10$abcdefghijklmnopqrstuv", // hashed password for '123456'
    employeeid: "EMP002",
    role: "accountant",
    fullName: "Trần Thị B",
    email: "accountant1@kasa.com",
    status: "active",
    createdDate: "2025-02-01",
    lastlogin: "2025-11-19T09:15:00.000Z"
  },
  {
    userid: "admin1",
    password: "$2b$10$xyz123adminpasswordhash", // hashed password for 'admin123'
    employeeid: "EMP003",
    role: "admin",
    fullName: "Lê Văn C",
    email: "admin@kasa.com",
    status: "active",
    createdDate: "2025-01-01",
    lastlogin: "2025-11-20T07:45:00.000Z"
  },
  {
    userid: "teller2",
    password: "$2b$10$abcdefghijklmnopqrstuv", // hashed password for '123456'
    employeeid: "EMP004",
    role: "teller",
    fullName: "Phạm Thị D",
    email: "teller2@kasa.com",
    status: "disabled",
    createdDate: "2025-03-10",
    lastlogin: "2025-11-20T08:00:00.000Z"
  }
];

/**
 * Helper functions for useraccount data
 */
export const findUserByUsername = (userid) => {
  return mockUserAccounts.find(u => u.userid === userid);
};

export const getAllUsers = () => {
  return [...mockUserAccounts];
};

export const findUserByCredentials = (userid, password) => {
  // In real app, password would be hashed and compared
  // For mock purposes, we'll use plain text comparison
  const plainPasswords = {
    'teller1': '123456',
    'teller2': '123456',
    'accountant1': '123456',
    'admin': 'admin123'
  };
  
  const user = mockUserAccounts.find(u => u.userid === userid);
  if (user && plainPasswords[userid] === password) {
    return user;
  }
  return null;
};

export const updateLastLogin = (userid) => {
  const user = findUserByUsername(userid);
  if (user) {
    user.lastlogin = new Date().toISOString();
    return user;
  }
  return null;
};

export const addUserAccount = (userAccount) => {
  const newUser = {
    ...userAccount,
    status: userAccount.status || 'active',
    createdDate: new Date().toISOString().split('T')[0],
    lastlogin: null
  };
  mockUserAccounts.push(newUser);
  return newUser;
};

export const updateUserAccount = (userid, updates) => {
  const user = findUserByUsername(userid);
  if (user) {
    Object.assign(user, updates);
    return user;
  }
  return null;
};

export const updateUserPassword = (userid, newPassword) => {
  const user = findUserByUsername(userid);
  if (user) {
    user.password = newPassword; // In real app, this would be hashed
    return user;
  }
  return null;
};

export const deleteUserAccount = (userid) => {
  const index = mockUserAccounts.findIndex(u => u.userid === userid);
  if (index !== -1) {
    const deleted = mockUserAccounts.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

// Backward compatibility
export const mockUsers = mockUserAccounts;

export default mockUserAccounts;
