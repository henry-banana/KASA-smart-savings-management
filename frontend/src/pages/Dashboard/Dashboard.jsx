import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardStats } from '@/services/dashboardService';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  Users, 
  Wallet, 
  TrendingUp,
  Search,
  FileText,
  Sparkles,
  PiggyBank,
  Coins,
  Receipt,
  AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CuteStatCard, StarDecor } from '../../components/CuteComponents';
import { RoleGuard } from '../../components/RoleGuard';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State for dashboard data
  const [stats, _setStats] = useState([
    {
      title: 'Active Accounts',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: <Wallet size={28} />,
      gradient: 'linear-gradient(135deg, #1A4D8F 0%, #2563A8 100%)',
      iconColor: '#ffffff'
    },
    {
      title: 'Deposits Today',
      value: '₫0',
      change: '+0%',
      trend: 'up',
      icon: <ArrowDownIcon size={28} />,
      gradient: 'linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)',
      iconColor: '#ffffff'
    },
    {
      title: 'Withdrawals Today',
      value: '₫0',
      change: '0%',
      trend: 'down',
      icon: <ArrowUpIcon size={28} />,
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      iconColor: '#ffffff'
    },
    {
      title: 'Active Customers',
      value: '0',
      change: '+0%',
      trend: 'up',
      icon: <Users size={28} />,
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      iconColor: '#ffffff'
    }
  ]);
  
  const [depositWithdrawalData, _setDepositWithdrawalData] = useState([
    { name: 'T2', deposits: 0, withdrawals: 0 },
    { name: 'T3', deposits: 0, withdrawals: 0 },
    { name: 'T4', deposits: 0, withdrawals: 0 },
    { name: 'T5', deposits: 0, withdrawals: 0 },
    { name: 'T6', deposits: 0, withdrawals: 0 },
    { name: 'T7', deposits: 0, withdrawals: 0 },
    { name: 'CN', deposits: 0, withdrawals: 0 }
  ]);

  const [accountTypeData, _setAccountTypeData] = useState([
    { name: 'No Term', value: 0, color: '#1A4D8F' },
    { name: '3 Months', value: 0, color: '#00AEEF' },
    { name: '6 Months', value: 0, color: '#60A5FA' }
  ]);
  
  const [_loading, setLoading] = useState(true);
  
  // Fetch dashboard data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        
        if (response.success && response.data) {
          const { stats: statsData, weeklyTransactions, accountTypeDistribution } = response.data;
          
          // Update stats cards
          _setStats([
            {
              title: 'Active Accounts',
              value: statsData.activeAccounts.toLocaleString(),
              change: statsData.changes.activeAccounts,
              trend: statsData.changes.activeAccounts.startsWith('+') ? 'up' : 'down',
              icon: <Wallet size={28} />,
              gradient: 'linear-gradient(135deg, #1A4D8F 0%, #2563A8 100%)',
              iconColor: '#ffffff'
            },
            {
              title: 'Deposits Today',
              value: `₫${(statsData.depositsToday / 1000000).toFixed(2)}M`,
              change: statsData.changes.depositsToday,
              trend: statsData.changes.depositsToday.startsWith('+') ? 'up' : 'down',
              icon: <ArrowDownIcon size={28} />,
              gradient: 'linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)',
              iconColor: '#ffffff'
            },
            {
              title: 'Withdrawals Today',
              value: `₫${(statsData.withdrawalsToday / 1000000).toFixed(2)}M`,
              change: statsData.changes.withdrawalsToday,
              trend: statsData.changes.withdrawalsToday.startsWith('+') ? 'down' : 'up',
              icon: <ArrowUpIcon size={28} />,
              gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
              iconColor: '#ffffff'
            },
            {
              title: 'Active Customers',
              value: statsData.activeCustomers.toLocaleString(),
              change: statsData.changes.activeCustomers,
              trend: statsData.changes.activeCustomers.startsWith('+') ? 'up' : 'down',
              icon: <Users size={28} />,
              gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
              iconColor: '#ffffff'
            }
          ]);
          
          // Update charts
          _setDepositWithdrawalData(weeklyTransactions);
          _setAccountTypeData(accountTypeDistribution);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const quickActions = [
    { 
      label: 'Open Account', 
      path: '/savings/open', 
      gradient: 'linear-gradient(135deg, #1A4D8F 0%, #2563A8 100%)',
      icon: <PiggyBank size={32} />,
      emoji: '🏦',
      roles: ['teller'] 
    },
    { 
      label: 'Make Deposit', 
      path: '/savings/deposit', 
      gradient: 'linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)',
      icon: <Coins size={32} />,
      emoji: '💰',
      roles: ['teller'] 
    },
    { 
      label: 'Make Withdrawal', 
      path: '/savings/withdraw', 
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      icon: <Receipt size={32} />,
      emoji: '💵',
      roles: ['teller'] 
    },
    { 
      label: 'Search Accounts', 
      path: '/search', 
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      icon: <Search size={32} />,
      emoji: '🔍',
      roles: ['teller', 'accountant'] 
    },
    { 
      label: 'Daily Report', 
      path: '/reports/daily', 
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      icon: <FileText size={32} />,
      emoji: '📊',
      roles: ['accountant'] 
    },
    { 
      label: 'Monthly Report', 
      path: '/reports/monthly', 
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
      icon: <FileText size={32} />,
      emoji: '📈',
      roles: ['accountant'] 
    }
  ];

  
  const visibleActions = quickActions.filter(action => action.roles.includes(user.role));
  
  return (
    <RoleGuard allow={['teller', 'accountant']}>
    <div className="space-y-8">
      {/* 📊 Stats Grid - Cute Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <CuteStatCard key={index} {...stat} />
        ))}
      </div>

      {/* 🎯 Quick Actions - Cute Menu Cards */}
      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
        <CardHeader className="bg-linear-to-r from-[#E8F6FF] to-[#DFF9F4] border-b border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 -mt-20 -mr-20 rounded-full bg-white/50" />
          <StarDecor className="top-4 right-8" />
          <CardTitle className="relative z-10 flex items-center gap-2">
            <Sparkles size={20} className="text-cyan-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="relative p-6 overflow-hidden text-left transition-all duration-300 border-2 border-transparent group rounded-2xl hover:scale-105 hover:shadow-xl hover:border-white"
                style={{ background: action.gradient }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 -mt-12 -mr-12 transition-transform duration-500 rounded-full bg-white/10 group-hover:scale-150" />
                <StarDecor className="top-2 right-2" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center justify-center transition-transform duration-300 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm group-hover:scale-110">
                      <div className="text-white">
                        {action.icon}
                      </div>
                    </div>
                    <span className="text-3xl">{action.emoji}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white">{action.label}</h4>
                  <p className="mt-1 text-sm text-white/80">Click to access</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 📈 Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Bar Chart */}
        <Card className="overflow-hidden border-0 shadow-lg lg:col-span-2 rounded-2xl">
          <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} className="text-[#1A4D8F]" />
              Deposits & Withdrawals This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={depositWithdrawalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  formatter={(value) => `₫${Number(value)}M`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Bar dataKey="deposits" fill="#1A4D8F" name="Deposits" radius={[8, 8, 0, 0]} />
                <Bar dataKey="withdrawals" fill="#00AEEF" name="Withdrawals" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
          <CardHeader className="bg-linear-to-r from-[#F8F9FC] to-white border-b border-gray-100">
            <CardTitle className="flex items-center gap-2">
              <PiggyBank size={20} className="text-[#00AEEF]" />
              Loại Sổ
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accountTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ value }) => `${value}`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accountTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {accountTypeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value} accounts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔔 Recent Transactions */}
      <Card className="overflow-hidden border-0 shadow-lg rounded-2xl">
        <CardHeader className="bg-linear-to-r from-[#E8F6FF] to-[#DFF9F4] border-b border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 -mt-20 -mr-20 rounded-full bg-white/50" />
          <CardTitle className="relative z-10 flex items-center gap-2">
            <Receipt size={20} className="text-[#00AEEF]" />
            Giao Dịch Gần Đây
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[
              { id: 'SA00123', customer: 'Nguyễn Văn A', type: 'Deposit', amount: '+₫5,000,000', time: '10:30 SA', emoji: '💰', color: '#00AEEF' },
              { id: 'SA00124', customer: 'Trần Thị B', type: 'Withdrawal', amount: '-₫2,000,000', time: '10:15 SA', emoji: '💵', color: '#F59E0B' },
              { id: 'SA00125', customer: 'Lê Văn C', type: 'Deposit', amount: '+₫10,000,000', time: '09:45 SA', emoji: '💰', color: '#00AEEF' },
              { id: 'SA00126', customer: 'Phạm Thị D', type: 'Mở sổ mới', amount: '₫1,000,000', time: '09:30 SA', emoji: '🏦', color: '#1A4D8F' }
            ].map((transaction, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 transition-all duration-200 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="flex items-center justify-center w-12 h-12 text-2xl shadow-sm rounded-2xl"
                    style={{ backgroundColor: `${transaction.color}15` }}
                  >
                    {transaction.emoji}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.customer}</p>
                    <p className="text-sm text-gray-500">{transaction.id} • {transaction.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'Deposit' ? 'text-green-600' : 
                    transaction.type === 'Withdrawal' ? 'text-red-600' : 
                    'text-gray-900'
                  }`}>
                    {transaction.amount}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </RoleGuard>
  );
}