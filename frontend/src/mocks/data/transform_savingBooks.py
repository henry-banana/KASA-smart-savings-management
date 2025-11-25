import json
import re

# Customer data mapping (CUST001-CUST043)
customers = {
    "CUST001": {"citizenid": "079012345678", "fullname": "Nguyễn Văn A"},
    "CUST002": {"citizenid": "079087654321", "fullname": "Trần Thị B"},
    "CUST003": {"citizenid": "079011111111", "fullname": "Lê Văn C"},
    "CUST004": {"citizenid": "079022222222", "fullname": "Phạm Thị D"},
    "CUST005": {"citizenid": "079033333333", "fullname": "Hoàng Văn E"},
    "CUST006": {"citizenid": "079044444444", "fullname": "Nguyễn Thị F"},
    "CUST007": {"citizenid": "079055555555", "fullname": "Vũ Văn G"},
    "CUST008": {"citizenid": "079066666666", "fullname": "Đỗ Thị H"},
    "CUST009": {"citizenid": "079077777777", "fullname": "Nguyễn Thị I"},
    "CUST010": {"citizenid": "079088888888", "fullname": "Lê Văn J"},
    "CUST011": {"citizenid": "079099999999", "fullname": "Phạm Văn K"},
    "CUST012": {"citizenid": "079010101010", "fullname": "Trần Thị L"},
    "CUST013": {"citizenid": "079020202020", "fullname": "Hoàng Văn M"},
    "CUST014": {"citizenid": "079030303030", "fullname": "Vũ Thị N"},
    "CUST015": {"citizenid": "079040404040", "fullname": "Đỗ Văn O"},
    "CUST016": {"citizenid": "079050505050", "fullname": "Nguyễn Văn P"},
    "CUST017": {"citizenid": "079060606060", "fullname": "Lê Thị Q"},
    "CUST018": {"citizenid": "079070707070", "fullname": "Phạm Văn R"},
    "CUST019": {"citizenid": "079080808080", "fullname": "Trần Văn S"},
    "CUST020": {"citizenid": "079090909090", "fullname": "Hoàng Thị T"},
    "CUST021": {"citizenid": "079011112222", "fullname": "Vũ Văn U"},
    "CUST022": {"citizenid": "079022223333", "fullname": "Đỗ Thị V"},
    "CUST023": {"citizenid": "079033334444", "fullname": "Nguyễn Văn W"},
    "CUST024": {"citizenid": "079044445555", "fullname": "Lê Văn X"},
    "CUST025": {"citizenid": "079055556666", "fullname": "Phạm Thị Y"},
    "CUST026": {"citizenid": "079066667777", "fullname": "Trần Văn Z"},
    "CUST027": {"citizenid": "079077778888", "fullname": "Hoàng Văn AA"},
    "CUST028": {"citizenid": "079088889999", "fullname": "Vũ Thị AB"},
    "CUST029": {"citizenid": "079099990000", "fullname": "Đỗ Văn AC"},
    "CUST030": {"citizenid": "079010203040", "fullname": "Nguyễn Thị AD"},
    "CUST031": {"citizenid": "079020304050", "fullname": "Lê Văn AE"},
    "CUST032": {"citizenid": "079030405060", "fullname": "Phạm Văn AF"},
    "CUST033": {"citizenid": "079040506070", "fullname": "Trần Thị AG"},
    "CUST034": {"citizenid": "079050607080", "fullname": "Hoàng Văn AH"},
    "CUST035": {"citizenid": "079060708090", "fullname": "Vũ Văn AI"},
    "CUST036": {"citizenid": "079070809000", "fullname": "Đỗ Thị AJ"},
    "CUST037": {"citizenid": "079080900010", "fullname": "Nguyễn Văn AK"},
    "CUST038": {"citizenid": "079090001020", "fullname": "Lê Thị AL"},
    "CUST039": {"citizenid": "079000102030", "fullname": "Phạm Văn AM"},
    "CUST040": {"citizenid": "079001020304", "fullname": "Trần Văn AN"},
    "CUST041": {"citizenid": "079002030405", "fullname": "Hoàng Thị AO"},
    "CUST042": {"citizenid": "079003040506", "fullname": "Vũ Văn AP"},
    "CUST043": {"citizenid": "079004050607", "fullname": "Đỗ Văn AQ"},
}

# Read savingBooks.js
with open('savingBooks.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract all book entries using regex
pattern = r'\{[^}]*bookid:\s*"([^"]+)"[^}]*customerid:\s*"([^"]+)"[^}]*typeid:\s*"([^"]+)"[^}]*registertime:\s*"([^"]+)"[^}]*maturitydate:\s*(null|"[^"]*")[^}]*initialdeposit:\s*(\d+)[^}]*currentbalance:\s*(\d+)[^}]*interestrate:\s*([\d.]+)[^}]*status:\s*"([^"]+)"[^}]*\}'

matches = re.findall(pattern, content, re.DOTALL)

print(f"Found {len(matches)} saving books")

# Generate new format
output = ['/**',
          ' * Mock data for SavingBooks (Sổ tiết kiệm)',
          ' * New structure with embedded customer data',
          ' */',
          '',
          'export const mockSavingBooks = [']

for idx, match in enumerate(matches):
    bookid, customerid, typeid, registertime, maturitydate, initialdeposit, currentbalance, interestrate, status = match
    
    # Get customer info
    cust_info = customers.get(customerid, {"citizenid": "000000000000", "fullname": "Unknown Customer"})
    
    # Clean maturitydate
    maturitydate = maturitydate.strip('"') if maturitydate != 'null' else 'null'
    
    # Build new structure
    book = f'''  {{
    bookId: "{bookid}",
    citizenId: "{cust_info['citizenid']}",
    customerName: "{cust_info['fullname']}",
    typeSavingId: "{typeid}",
    openDate: "{registertime}",
    maturityDate: {maturitydate if maturitydate == 'null' else f'"{maturitydate}"'},
    balance: {currentbalance},
    status: "{status}"
  }}'''
    
    if idx < len(matches) - 1:
        book += ','
    output.append(book)

output.append('];')
output.append('')
output.append('/**')
output.append(' * Helper functions for savingbook data')
output.append(' */')
output.append('export const findSavingBookById = (bookId) => {')
output.append('  return mockSavingBooks.find(sb => sb.bookId === bookId);')
output.append('};')
output.append('')
output.append('export const findSavingBooksByCitizenId = (citizenId) => {')
output.append('  return mockSavingBooks.filter(sb => sb.citizenId === citizenId);')
output.append('};')
output.append('')
output.append('export const findSavingBooksByType = (typeSavingId) => {')
output.append('  return mockSavingBooks.filter(sb => sb.typeSavingId === typeSavingId);')
output.append('};')
output.append('')
output.append('export const findActiveSavingBooks = () => {')
output.append('  return mockSavingBooks.filter(sb => sb.status === "active");')
output.append('};')
output.append('')
output.append('export const addSavingBook = (savingBook) => {')
output.append('  mockSavingBooks.push(savingBook);')
output.append('  return savingBook;')
output.append('};')
output.append('')
output.append('export const updateSavingBook = (bookId, updates) => {')
output.append('  const index = mockSavingBooks.findIndex(sb => sb.bookId === bookId);')
output.append('  if (index !== -1) {')
output.append('    mockSavingBooks[index] = { ...mockSavingBooks[index], ...updates };')
output.append('    return mockSavingBooks[index];')
output.append('  }')
output.append('  return null;')
output.append('};')
output.append('')
output.append('export const updateSavingBookBalance = (bookId, amount) => {')
output.append('  const savingBook = findSavingBookById(bookId);')
output.append('  if (savingBook) {')
output.append('    const oldBalance = savingBook.balance;')
output.append('    savingBook.balance += amount;')
output.append('    return {')
output.append('      savingBook,')
output.append('      balanceBefore: oldBalance,')
output.append('      balanceAfter: savingBook.balance')
output.append('    };')
output.append('  }')
output.append('  return null;')
output.append('};')
output.append('')
output.append('export const closeSavingBook = (bookId) => {')
output.append('  const savingBook = findSavingBookById(bookId);')
output.append('  if (savingBook) {')
output.append('    savingBook.status = "closed";')
output.append('    const finalBalance = savingBook.balance;')
output.append('    savingBook.balance = 0;')
output.append('    return {')
output.append('      ...savingBook,')
output.append('      finalBalance')
output.append('    };')
output.append('  }')
output.append('  return null;')
output.append('};')
output.append('')
output.append('export const deleteSavingBook = (bookId) => {')
output.append('  const index = mockSavingBooks.findIndex(sb => sb.bookId === bookId);')
output.append('  if (index !== -1) {')
output.append('    const deleted = mockSavingBooks.splice(index, 1)[0];')
output.append('    return deleted;')
output.append('  }')
output.append('  return null;')
output.append('};')
output.append('')
output.append('export default mockSavingBooks;')

# Write new file
with open('savingBooks_new.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(output))

print("✅ Generated savingBooks_new.js")
print(f"Total books transformed: {len(matches)}")
