// Đơn giản hóa - chỉ lấy từ env hiện tại
export const APP_CONFIG = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  devMode: import.meta.env.VITE_DEV_MODE === 'true',
  enableLogger: import.meta.env.VITE_ENABLE_LOGGER === 'true'
};

// Export shortcuts
export const USE_MOCK = APP_CONFIG.devMode; // Dùng DEV_MODE để switch mock
export const IS_DEV = APP_CONFIG.devMode;
