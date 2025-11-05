import React, { useState } from 'react';
import Login from './pages/Auth/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import OpenAccount from './pages/Savings/OpenAccount';
import Deposit from './pages/Savings/Deposit';
import Withdraw from './pages/Savings/Withdraw';
import SearchAccounts from './pages/Search/SearchAccounts';
import DailyReport from './pages/Reports/DailyReport';
import MonthlyReport from './pages/Reports/MonthlyReport';
import RegulationSettings from './pages/Regulations/RegulationSettings';
import UserManagement from './pages/Users/UserManagement';
import UserProfile from './pages/Profile/UserProfile';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  const handleLogin = (role, username = 'user') => {
    const roleNames = {
      teller: 'Teller User',
      accountant: 'Accountant User',
      admin: 'Admin User'
    };
    
    setCurrentUser({
      username,
      role: role,
      fullName: roleNames[role]
    });
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('dashboard');
  };

  const handleNavigate = (screen) => {
    setCurrentScreen(screen);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard user={currentUser} onNavigate={handleNavigate} />;
      case 'open-account':
        return <OpenAccount user={currentUser} />;
      case 'deposit':
        return <Deposit user={currentUser} />;
      case 'withdraw':
        return <Withdraw user={currentUser} />;
      case 'search':
        return <SearchAccounts user={currentUser} />;
      case 'daily-report':
        return <DailyReport user={currentUser} />;
      case 'monthly-report':
        return <MonthlyReport user={currentUser} />;
      case 'regulations':
        return <RegulationSettings user={currentUser} />;
      case 'users':
        return <UserManagement user={currentUser} />;
      case 'profile':
        return <UserProfile user={currentUser} />;
      default:
        return <Dashboard user={currentUser} onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout
      user={currentUser}
      currentScreen={currentScreen}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderScreen()}
    </Layout>
  );
}
