/**
 * Mock data for Customers
 * Based on database schema: customer table
 */

export const mockCustomers = [
  {
    customerid: "CUST001",
    fullname: "Nguyễn Văn A",
    idcard: "079012345678",
    address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
    phone: "0901234567",
    email: "nguyenvana@email.com",
    dateofbirth: "1990-01-15"
  },
  {
    customerid: "CUST002",
    fullname: "Trần Thị B",
    idcard: "079087654321",
    address: "456 Lê Lợi, Quận 1, TP.HCM",
    phone: "0907654321",
    email: "tranthib@email.com",
    dateofbirth: "1992-05-20"
  },
  {
    customerid: "CUST003",
    fullname: "Lê Văn C",
    idcard: "079011111111",
    address: "789 Điện Biên Phủ, Quận 3, TP.HCM",
    phone: "0909876543",
    email: "levanc@email.com",
    dateofbirth: "1988-11-30"
  },
  {
    customerid: "CUST004",
    fullname: "Phạm Thị D",
    idcard: "079022222222",
    address: "321 Hai Bà Trưng, Quận 3, TP.HCM",
    phone: "0908765432",
    email: "phamthid@email.com",
    dateofbirth: "1995-07-12"
  },
  {
    customerid: "CUST005",
    fullname: "Hoàng Văn E",
    idcard: "079033333333",
    address: "654 Lý Thường Kiệt, Quận 10, TP.HCM",
    phone: "0906543210",
    email: "hoangvane@email.com",
    dateofbirth: "1985-03-25"
  },
  {
    customerid: "CUST006",
    fullname: "Nguyễn Thị F",
    idcard: "079044444444",
    address: "987 Võ Văn Tần, Quận 3, TP.HCM",
    phone: "0905432109",
    email: "nguyenthif@email.com",
    dateofbirth: "1993-09-08"
  },
  {
    customerid: "CUST007",
    fullname: "Vũ Văn G",
    idcard: "079055555555",
    address: "147 Phan Xích Long, Phú Nhuận, TP.HCM",
    phone: "0904321098",
    email: "vuvang@email.com",
    dateofbirth: "1987-12-18"
  },
  {
    customerid: "CUST008",
    fullname: "Đỗ Thị H",
    idcard: "079066666666",
    address: "258 Cách Mạng Tháng Tám, Quận 10, TP.HCM",
    phone: "0903210987",
    email: "dothih@email.com",
    dateofbirth: "1991-06-22"
  }
];

/**
 * Helper functions for customer data
 */
export const findCustomerById = (customerid) => {
  return mockCustomers.find(c => c.customerid === customerid);
};

export const findCustomerByIdCard = (idcard) => {
  return mockCustomers.find(c => c.idcard === idcard);
};

export const addCustomer = (customer) => {
  mockCustomers.push(customer);
  return customer;
};

export const updateCustomer = (customerid, updates) => {
  const index = mockCustomers.findIndex(c => c.customerid === customerid);
  if (index !== -1) {
    mockCustomers[index] = { ...mockCustomers[index], ...updates };
    return mockCustomers[index];
  }
  return null;
};

export const deleteCustomer = (customerid) => {
  const index = mockCustomers.findIndex(c => c.customerid === customerid);
  if (index !== -1) {
    const deleted = mockCustomers.splice(index, 1)[0];
    return deleted;
  }
  return null;
};

export default mockCustomers;
