export const savingBookMockData = {
  createSuccess: {
    success: true,
    message: 'Mở sổ tiết kiệm thành công',
    data: {
      accountCode: 'SA00123',
      customerName: 'Trần Thị B',
      savingsType: '3-months',
      initialDeposit: 5000000,
      openDate: new Date().toISOString().split('T')[0]
    }
  }
};

export default savingBookMockData;
