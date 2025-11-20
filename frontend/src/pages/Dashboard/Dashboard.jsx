import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
  Receipt
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CuteStatCard, StarDecor } from '../../components/CuteComponents';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const stats = [
    {
      title: 'Active Accounts',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: <Wallet size={28} />,
      gradient: 'linear-gradient(135deg, #1A4D8F 0%, #2563A8 100%)',
      iconColor: '#ffffff'
    },
    {
      title: 'Deposits Today',
      value: '₫45.28M',
      change: '+8.2%',
      trend: 'up',
      icon: <ArrowDownIcon size={28} />,
      gradient: 'linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)',
      iconColor: '#ffffff'
    },
    {
      title: 'Withdrawals Today',
      value: '₫23.15M',
      change: '-3.1%',
      trend: 'down',
      icon: <ArrowUpIcon size={28} />,
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      iconColor: '#ffffff'
    },
    {
      title: 'Active Customers',
      value: '892',
      change: '+5.4%',
      trend: 'up',
      icon: <Users size={28} />,
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      iconColor: '#ffffff'
    }
  ];

  const depositWithdrawalData = [
    { name: 'T2', deposits: 12, withdrawals: 8 },
    { name: 'T3', deposits: 15, withdrawals: 9.5 },
    { name: 'T4', deposits: 18, withdrawals: 12 },
    { name: 'T5', deposits: 14, withdrawals: 11 },
    { name: 'T6', deposits: 20, withdrawals: 15 },
    { name: 'T7', deposits: 16, withdrawals: 10 },
    { name: 'CN', deposits: 10, withdrawals: 6 }
  ];

  const accountTypeData = [
    { name: 'No Term', value: 45, color: '#1A4D8F' },
    { name: '3 Months', value: 30, color: '#00AEEF' },
    { name: '6 Months', value: 25, color: '#60A5FA' }
  ];

  const quickActions = [
    { 
      label: 'Open Account', 
      path: '/savings/open', 
      gradient: 'linear-gradient(135deg, #1A4D8F 0%, #2563A8 100%)',
      icon: <PiggyBank size={32} />,
      emoji: '🏦',
      roles: ['teller', 'admin'] 
    },
    { 
      label: 'Make Deposit', 
      path: '/savings/deposit', 
      gradient: 'linear-gradient(135deg, #00AEEF 0%, #33BFF3 100%)',
      icon: <Coins size={32} />,
      emoji: '💰',
      roles: ['teller', 'admin'] 
    },
    { 
      label: 'Make Withdrawal', 
      path: '/savings/withdraw', 
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
      icon: <Receipt size={32} />,
      emoji: '💵',
      roles: ['teller', 'admin'] 
    },
    { 
      label: 'Search Accounts', 
      path: '/search', 
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
      icon: <Search size={32} />,
      emoji: '🔍',
      roles: ['teller', 'accountant', 'admin'] 
    },
    { 
      label: 'Daily Report', 
      path: '/reports/daily', 
      gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
      icon: <FileText size={32} />,
      emoji: '📊',
      roles: ['accountant', 'admin'] 
    },
    { 
      label: 'Monthly Report', 
      path: '/reports/monthly', 
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
      icon: <FileText size={32} />,
      emoji: '📈',
      roles: ['accountant', 'admin'] 
    }
  ];

  const visibleActions = quickActions.filter(action => action.roles.includes(user.role));

  return (
    <div className="space-y-8">
      {/* 📊 Stats Grid - Cute Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <CuteStatCard key={index} {...stat} />
        ))}
      </div>

      {/* 🎯 Quick Actions - Cute Menu Cards */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#E8F6FF] to-[#DFF9F4] border-b border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/50 rounded-full -mr-20 -mt-20" />
          <StarDecor className="top-4 right-8" />
          <CardTitle className="flex items-center gap-2 relative z-10">
            <Sparkles size={20} className="text-cyan-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl border-2 border-transparent hover:border-white"
                style={{ background: action.gradient }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
                <StarDecor className="top-2 right-2" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="text-white">
                        {action.icon}
                      </div>
                    </div>
                    <span className="text-3xl">{action.emoji}</span>
                  </div>
                  <h4 className="text-white font-semibold text-lg">{action.label}</h4>
                  <p className="text-white/80 text-sm mt-1">Click to access</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 📈 Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <Card className="lg:col-span-2 border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#F8F9FC] to-white border-b border-gray-100">
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
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[#F8F9FC] to-white border-b border-gray-100">
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
                  label={({ name, value }) => `${value}%`}
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
                  <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔔 Recent Transactions */}
      <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#E8F6FF] to-[#DFF9F4] border-b border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/50 rounded-full -mr-20 -mt-20" />
          <CardTitle className="flex items-center gap-2 relative z-10">
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
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 bg-white"
              >
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
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
  );
}