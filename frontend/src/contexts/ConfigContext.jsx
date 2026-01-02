import { createContext, useContext } from 'react';
import { APP_CONFIG } from '@/config/app.config';

export const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {
  return (
    <ConfigContext.Provider value={APP_CONFIG}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};
