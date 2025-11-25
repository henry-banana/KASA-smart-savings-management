customers_data = [
    ("CUST001", "Nguyễn Văn A", "079012345678", "123 Nguyễn Huệ, Q1, TP.HCM", "0901234567", "nguyenvana@email.com", "1990-01-15"),
    ("CUST002", "Trần Thị B", "079087654321", "456 Lê Lợi, Q1, TP.HCM", "0907654321", "tranthib@email.com", "1985-05-20"),
    ("CUST003", "Lê Văn C", "079011111111", "789 Hai Bà Trưng, Q3, TP.HCM", "0901111111", "levanc@email.com", "1992-03-10"),
    ("CUST004", "Phạm Thị D", "079022222222", "321 Pasteur, Q3, TP.HCM", "0902222222", "phamthid@email.com", "1988-07-25"),
    ("CUST005", "Hoàng Văn E", "079033333333", "654 Điện Biên Phủ, Q10, TP.HCM", "0903333333", "hoangvane@email.com", "1995-11-30"),
    ("CUST006", "Nguyễn Thị F", "079044444444", "987 Cách Mạng Tháng 8, Q10, TP.HCM", "0904444444", "nguyenthif@email.com", "1991-09-12"),
    ("CUST007", "Vũ Văn G", "079055555555", "147 Nguyễn Trãi, Q5, TP.HCM", "0905555555", "vuvang@email.com", "1987-02-28"),
    ("CUST008", "Đỗ Thị H", "079066666666", "258 Lý Thường Kiệt, Q5, TP.HCM", "0906666666", "dothih@email.com", "1993-06-18"),
    ("CUST009", "Nguyễn Thị I", "079077777777", "369 Võ Văn Tần, Q3, TP.HCM", "0907777777", "nguyenthii@email.com", "1989-04-22"),
    ("CUST010", "Lê Văn J", "079088888888", "741 Trần Hưng Đạo, Q1, TP.HCM", "0908888888", "levanj@email.com", "1994-08-14"),
    ("CUST011", "Phạm Văn K", "079099999999", "852 Nguyễn Văn Cừ, Q5, TP.HCM", "0909999999", "phamvank@email.com", "1986-12-05"),
    ("CUST012", "Trần Thị L", "079010101010", "963 Bà Huyện Thanh Quan, Q3, TP.HCM", "0901010101", "tranthil@email.com", "1996-01-27"),
    ("CUST013", "Hoàng Văn M", "079020202020", "159 Phạm Ngũ Lão, Q1, TP.HCM", "0902020202", "hoangvanm@email.com", "1990-10-09"),
    ("CUST014", "Vũ Thị N", "079030303030", "357 Lê Duẩn, Q1, TP.HCM", "0903030303", "vuthin@email.com", "1992-05-16"),
    ("CUST015", "Đỗ Văn O", "079040404040", "456 Cộng Hòa, Tân Bình, TP.HCM", "0904040404", "dovano@email.com", "1988-03-31"),
    ("CUST016", "Nguyễn Văn P", "079050505050", "789 Hoàng Văn Thụ, Tân Bình, TP.HCM", "0905050505", "nguyenvanp@email.com", "1995-07-19"),
    ("CUST017", "Lê Thị Q", "079060606060", "321 Lý Chính Thắng, Q3, TP.HCM", "0906060606", "lethiq@email.com", "1991-11-23"),
    ("CUST018", "Phạm Văn R", "079070707070", "654 Nguyễn Thị Minh Khai, Q1, TP.HCM", "0907070707", "phamvanr@email.com", "1987-02-14"),
    ("CUST019", "Trần Văn S", "079080808080", "987 Đinh Tiên Hoàng, Q1, TP.HCM", "0908080808", "tranvans@email.com", "1993-08-06"),
    ("CUST020", "Hoàng Thị T", "079090909090", "147 Võ Thị Sáu, Q3, TP.HCM", "0909090909", "hoangthit@email.com", "1989-12-28"),
    ("CUST021", "Vũ Văn U", "079011112222", "258 Nam Kỳ Khởi Nghĩa, Q3, TP.HCM", "0901111222", "vuvanu@email.com", "1994-04-11"),
    ("CUST022", "Đỗ Thị V", "079022223333", "369 Trường Sơn, Tân Bình, TP.HCM", "0902222333", "dothiv@email.com", "1986-06-25"),
    ("CUST023", "Nguyễn Văn W", "079033334444", "741 Bạch Đằng, Tân Bình, TP.HCM", "0903333444", "nguyenvanw@email.com", "1996-09-17"),
    ("CUST024", "Lê Văn X", "079044445555", "852 Âu Cơ, Tân Phú, TP.HCM", "0904444555", "levanx@email.com", "1990-01-08"),
    ("CUST025", "Phạm Thị Y", "079055556666", "963 Lũy Bán Bích, Tân Phú, TP.HCM", "0905555666", "phamthiy@email.com", "1992-03-29"),
    ("CUST026", "Trần Văn Z", "079066667777", "159 Hòa Bình, Tân Phú, TP.HCM", "0906666777", "tranvanz@email.com", "1988-05-13"),
    ("CUST027", "Hoàng Văn AA", "079077778888", "357 Phạm Văn Hai, Tân Bình, TP.HCM", "0907777888", "hoangvanaa@email.com", "1995-07-04"),
    ("CUST028", "Vũ Thị AB", "079088889999", "456 Trần Quang Khải, Q1, TP.HCM", "0908888999", "vuthiab@email.com", "1991-10-21"),
    ("CUST029", "Đỗ Văn AC", "079099990000", "789 Võ Văn Kiệt, Q5, TP.HCM", "0909999000", "dovanac@email.com", "1987-12-15"),
    ("CUST030", "Nguyễn Thị AD", "079010203040", "321 An Dương Vương, Q5, TP.HCM", "0901020304", "nguyenthiad@email.com", "1993-02-07"),
    ("CUST031", "Lê Văn AE", "079020304050", "654 Nguyễn Chí Thanh, Q5, TP.HCM", "0902030405", "levanae@email.com", "1989-04-26"),
    ("CUST032", "Phạm Văn AF", "079030405060", "987 Hùng Vương, Q5, TP.HCM", "0903040506", "phamvanaf@email.com", "1994-06-18"),
    ("CUST033", "Trần Thị AG", "079040506070", "147 Trần Bình Trọng, Q5, TP.HCM", "0904050607", "tranthiag@email.com", "1986-08-09"),
    ("CUST034", "Hoàng Văn AH", "079050607080", "258 Lê Hồng Phong, Q10, TP.HCM", "0905060708", "hoangvanah@email.com", "1996-10-31"),
    ("CUST035", "Vũ Văn AI", "079060708090", "369 3 Tháng 2, Q10, TP.HCM", "0906070809", "vuvanai@email.com", "1990-12-22"),
    ("CUST036", "Đỗ Thị AJ", "079070809000", "741 Nguyễn Tri Phương, Q10, TP.HCM", "0907080900", "dothiaj@email.com", "1992-01-14"),
    ("CUST037", "Nguyễn Văn AK", "079080900010", "852 Sư Vạn Hạnh, Q10, TP.HCM", "0908090001", "nguyenvanak@email.com", "1988-03-05"),
    ("CUST038", "Lê Thị AL", "079090001020", "963 Lạc Long Quân, Q11, TP.HCM", "0909000102", "lethial@email.com", "1995-05-27"),
    ("CUST039", "Phạm Văn AM", "079000102030", "159 Đề Thám, Q1, TP.HCM", "0900010203", "phamvanam@email.com", "1991-07-19"),
    ("CUST040", "Trần Văn AN", "079001020304", "357 Tôn Đức Thắng, Q1, TP.HCM", "0900102030", "tranvanan@email.com", "1987-09-10"),
    ("CUST041", "Hoàng Thị AO", "079002030405", "456 Ký Con, Q1, TP.HCM", "0900203040", "hoangthiao@email.com", "1993-11-02"),
    ("CUST042", "Vũ Văn AP", "079003040506", "789 Trần Quý Khoách, Q1, TP.HCM", "0900304050", "vuvanap@email.com", "1989-01-24"),
    ("CUST043", "Đỗ Văn AQ", "079004050607", "321 Tôn Thất Đạm, Q1, TP.HCM", "0900405060", "dovanaq@email.com", "1994-03-16"),
]

output = ['/**',
          ' * Mock data for Customers (Khách hàng)',
          ' */',
          '',
          'export const mockCustomers = [']

for idx, (custid, name, citizenid, address, phone, email, dob) in enumerate(customers_data):
    customer = f'''  {{
    customerid: "{custid}",
    fullname: "{name}",
    citizenid: "{citizenid}",
    address: "{address}",
    phone: "{phone}",
    email: "{email}",
    dateofbirth: "{dob}"
  }}'''
    if idx < len(customers_data) - 1:
        customer += ','
    output.append(customer)

output.append('];')
output.append('')
output.append('/**')
output.append(' * Helper functions for customer data')
output.append(' */')
output.append('export const findCustomerById = (customerid) => {')
output.append('  return mockCustomers.find(c => c.customerid === customerid);')
output.append('};')
output.append('')
output.append('export const findCustomerByCitizenId = (citizenid) => {')
output.append('  return mockCustomers.find(c => c.citizenid === citizenid);')
output.append('};')
output.append('')
output.append('export const addCustomer = (customer) => {')
output.append('  mockCustomers.push(customer);')
output.append('  return customer;')
output.append('};')
output.append('')
output.append('export const updateCustomer = (customerid, updates) => {')
output.append('  const index = mockCustomers.findIndex(c => c.customerid === customerid);')
output.append('  if (index !== -1) {')
output.append('    mockCustomers[index] = { ...mockCustomers[index], ...updates };')
output.append('    return mockCustomers[index];')
output.append('  }')
output.append('  return null;')
output.append('};')
output.append('')
output.append('export const deleteCustomer = (customerid) => {')
output.append('  const index = mockCustomers.findIndex(c => c.customerid === customerid);')
output.append('  if (index !== -1) {')
output.append('    const deleted = mockCustomers.splice(index, 1)[0];')
output.append('    return deleted;')
output.append('  }')
output.append('  return null;')
output.append('};')
output.append('')
output.append('export default mockCustomers;')

with open('customers.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

print("✅ Generated customers.js with 43 customers")
