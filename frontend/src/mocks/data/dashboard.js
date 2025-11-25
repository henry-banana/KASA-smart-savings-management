/**
 * Mock data for Dashboard statistics
 * Aggregated data from various sources
 */

import { mockSavingBooks } from './savingBooks';
import { mockTransactions } from './transactions';
// import { mockCustomers } from './customers'; // Not used yet, for future enhancements

/**
 * Calculate dashboard statistics from mock data
 */
export const calculateDashboardStats = () => {
  const today = new Date().toISOString().split('T')[0];
  
  // Active accounts
  const activeAccounts = mockSavingBooks.filter(sb => sb.status === 'active').length;
  
  // Today's transactions
  const todayTransactions = mockTransactions.filter(t => 
    t.transactionDate?.startsWith(today)
  );
  
  const depositsToday = todayTransactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const withdrawalsToday = todayTransactions
    .filter(t => t.type === 'withdraw')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Active customers (customers with active saving books)
  const activeCustomerIds = new Set(
    mockSavingBooks
      .filter(sb => sb.status === 'active')
      .map(sb => sb.citizenId)
  );
  const activeCustomers = activeCustomerIds.size;
  
  return {
    activeAccounts,
    depositsToday,
    withdrawalsToday,
    activeCustomers
  };
};

/**
 * Calculate weekly transaction trends
 */
export const calculateWeeklyTransactions = () => {
  const today = new Date();
  const weekData = [];
  
  // Get last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTransactions = mockTransactions.filter(t =>
      t.transactionDate?.startsWith(dateStr)
    );
    
    const deposits = dayTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const withdrawals = dayTransactions
      .filter(t => t.type === 'withdraw')
      .reduce((sum, t) => sum + t.amount, 0);
    
    // Day names in Vietnamese
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dayName = dayNames[date.getDay()];
    
    weekData.push({
      name: dayName,
      deposits: Math.round(deposits / 1000000), // Convert to millions
      withdrawals: Math.round(withdrawals / 1000000)
    });
  }
  
  return weekData;
};

/**
 * Calculate account type distribution
 */
export const calculateAccountTypeDistribution = () => {
  const typeCounts = {};
  
  mockSavingBooks
    .filter(sb => sb.status === 'active')
    .forEach(sb => {
      // Map type IDs to readable names
      let typeName;
      switch(sb.typeSavingId) {
        case 'TS01':
          typeName = 'No Term';
          break;
        case 'TS02':
          typeName = '3 Months';
          break;
        case 'TS03':
          typeName = '6 Months';
          break;
        default:
          typeName = 'Other';
      }
      
      typeCounts[typeName] = (typeCounts[typeName] || 0) + 1;
    });
  
  return [
    { name: 'No Term', value: typeCounts['No Term'] || 0, color: '#1A4D8F' },
    { name: '3 Months', value: typeCounts['3 Months'] || 0, color: '#00AEEF' },
    { name: '6 Months', value: typeCounts['6 Months'] || 0, color: '#60A5FA' }
  ];
};

/**
 * Mock data for changes/trends (percentage changes)
 * In real app, this would be calculated from historical data
 */
export const mockChanges = {
  activeAccounts: '+12.5%',
  depositsToday: '+8.2%',
  withdrawalsToday: '-3.1%',
  activeCustomers: '+5.4%'
};

/**
 * Get complete dashboard data
 */
export const getDashboardData = () => {
  const stats = calculateDashboardStats();
  const weeklyTransactions = calculateWeeklyTransactions();
  const accountTypeDistribution = calculateAccountTypeDistribution();
  
  return {
    stats: {
      ...stats,
      changes: mockChanges
    },
    weeklyTransactions,
    accountTypeDistribution
  };
};
