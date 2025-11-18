export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Không thể kết nối đến server',
  AUTH_ERROR: 'Phiên đăng nhập đã hết hạn',
  PERMISSION_ERROR: 'Bạn không có quyền truy cập',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  SERVER_ERROR: 'Lỗi server',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ'
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  ACCOUNT_CREATED: 'Mở sổ tiết kiệm thành công',
  DEPOSIT_SUCCESS: 'Gửi tiền thành công',
  WITHDRAW_SUCCESS: 'Rút tiền thành công'
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'Trường này bắt buộc',
  MIN_AMOUNT: (min) => `Tối thiểu ${min.toLocaleString('vi-VN')} VND`,
  INVALID_ID_CARD: 'Số CMND/CCCD không hợp lệ'
};
