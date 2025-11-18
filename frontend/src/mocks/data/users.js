export const mockUsers = [
  {
    id: 1,
    username: 'teller1',
    password: '123456',
    role: 'Teller',
    fullName: 'Nguyễn Văn Teller'
  },
  {
    id: 2,
    username: 'accountant1',
    password: '123456',
    role: 'Auditor',
    fullName: 'Trần Thị Kế Toán'
  },
  {
    id: 3,
    username: 'admin',
    password: 'admin123',
    role: 'Administrator',
    fullName: 'Admin User'
  }
];

export const findUserByCredentials = (username, password) => {
  return mockUsers.find(u => 
    u.username === username && u.password === password
  );
};
