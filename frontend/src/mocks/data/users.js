/**
 * Mock data for UserAccounts (Tài khoản đăng nhập)
 * Based on database schema: useraccount table
 * 
 * Extended with profile fields (phone, address, dateOfBirth, avatarUrl)
 * to ensure consistency between Topbar and Profile page
 */

export const mockUserAccounts = [
  {
    userid: "teller1",
    password: "123456", // Plain text password (would be hashed in production)
    employeeid: "EMP001",
    role: "teller",
    fullName: "Nguyễn Văn A",
    email: "teller1@kasa.com",
    status: "active",
    createdDate: "2025-01-15",
    lastlogin: "2025-11-20T08:30:00.000Z",
    // Extended profile fields
    phone: "0901234567",
    address: "123 Main Street, District 1, Ho Chi Minh City",
    dateOfBirth: "1990-05-15",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=teller1"
  },
  {
    userid: "accountant1",
    password: "123456", // Plain text password (would be hashed in production)
    employeeid: "EMP002",
    role: "accountant",
    fullName: "Trần Thị B",
    email: "accountant1@kasa.com",
    status: "active",
    createdDate: "2025-02-01",
    lastlogin: "2025-11-19T09:15:00.000Z",
    // Extended profile fields
    phone: "0909876543",
    address: "456 Nguyen Hue, District 1, Ho Chi Minh City",
    dateOfBirth: "1988-03-20",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=accountant1"
  },
  {
    userid: "admin1",
    password: "admin123", // Plain text password (would be hashed in production)
    employeeid: "EMP003",
    role: "admin",
    fullName: "Lê Văn C",
    email: "admin@kasa.com",
    status: "active",
    createdDate: "2025-01-01",
    lastlogin: "2025-11-20T07:45:00.000Z",
    // Extended profile fields
    phone: "0912345678",
    address: "789 Le Loi, District 1, Ho Chi Minh City",
    dateOfBirth: "1985-12-10",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin1"
  },
  {
    userid: "teller2",
    password: "123456", // Plain text password (would be hashed in production)
    employeeid: "EMP004",
    role: "teller",
    fullName: "Phạm Thị D",
    email: "teller2@kasa.com",
    status: "disabled",
    createdDate: "2025-03-10",
    lastlogin: "2025-11-20T08:00:00.000Z",
    // Extended profile fields
    phone: "0987654321",
    address: "321 Hai Ba Trung, District 3, Ho Chi Minh City",
    dateOfBirth: "1992-07-25",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=teller2"
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
  // Note: user.password field stores the actual password (would be hashed in production)
  
  const user = mockUserAccounts.find(u => u.userid === userid);
  if (user && user.password === password) {
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
