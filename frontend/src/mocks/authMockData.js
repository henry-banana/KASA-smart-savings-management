export const authMockData = {
  loginSuccess: {
    success: true,
    message: 'Đăng nhập thành công',
    roleName: 'Teller',
    username: 'mock_user'
  },
  
  loginFailed: {
    success: false,
    message: 'Tên đăng nhập hoặc mật khẩu không đúng'
  }
};

export default authMockData;
