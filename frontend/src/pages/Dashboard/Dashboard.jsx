import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowUpIcon, ArrowDownIcon, Users, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard({ user, onNavigate }) {
  const stats = [
    {
      title: 'Total Accounts',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: '#1A4D8F'
    },
    {
      title: 'Total Deposits',
      value: '₫2,280,000',
      change: '+8.2%',
      trend: 'up',
      icon: ArrowDownIcon,
      color: '#00AEEF'
    },
    {
      title: 'Total Withdrawals',
      value: '₫1,150,000',
      change: '-3.1%',
      trend: 'down',
      icon: ArrowUpIcon,
      color: '#F59E0B'
    },
    {
      title: 'Active Savings',
      value: '892',
      change: '+5.4%',
      trend: 'up',
      icon: Wallet,
      color: '#10B981'
    }
  ];

  const depositWithdrawalData = [
    { name: 'Mon', deposits: 5000000, withdrawals: 3000000 },
    { name: 'Tue', deposits: 7000000, withdrawals: 4000000 },
    { name: 'Wed', deposits: 6000000, withdrawals: 5000000 },
    { name: 'Thu', deposits: 8000000, withdrawals: 3500000 },
    { name: 'Fri', deposits: 9000000, withdrawals: 4500000 },
    { name: 'Sat', deposits: 4000000, withdrawals: 2000000 },
    { name: 'Sun', deposits: 3000000, withdrawals: 6000000 }
  ];

  const accountTypeData = [
    { name: 'Regular Savings', value: 45, color: '#1A4D8F' },
    { name: 'Fixed Term', value: 35, color: '#00AEEF' },
    { name: 'Flexible Savings', value: 20, color: '#60A5FA' }
  ];

  const quickActions = [
    { label: 'Open Account', screen: 'open-account', color: '#1A4D8F', roles: ['teller', 'admin'] },
    { label: 'Deposit', screen: 'deposit', color: '#00AEEF', roles: ['teller', 'admin'] },
    { label: 'Withdraw', screen: 'withdraw', color: '#F59E0B', roles: ['teller', 'admin'] },
    { label: 'Search', screen: 'search', color: '#10B981', roles: ['teller', 'accountant', 'admin'] }
  ];

  const visibleActions = quickActions.filter(action => action.roles.includes(user.role));

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="mb-1 text-sm text-gray-600">{stat.title}</p>
                    <h3 className="mb-2 text-2xl">{stat.value}</h3>
                    <div className="flex items-center gap-1">
                      {stat.trend === 'up' ? (
                        <ArrowUpIcon size={14} className="text-green-600" />
                      ) : (
                        <ArrowDownIcon size={14} className="text-red-600" />
                      )}
                      <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500">vs last week</span>
                    </div>
                  </div>
                  <div 
                    className="flex items-center justify-center w-12 h-12 rounded-lg"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Deposits vs Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={depositWithdrawalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₫${Number(value).toLocaleString()}`} />
                <Legend />
                <Bar dataKey="deposits" fill="#1A4D8F" name="Deposits" />
                <Bar dataKey="withdrawals" fill="#00AEEF" name="Withdrawals" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Types Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={accountTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accountTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {visibleActions.map((action, index) => (
              <Button
                key={index}
                onClick={() => onNavigate(action.screen)}
                className="h-24 text-white"
                style={{ backgroundColor: action.color }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: 'SA12345', customer: 'Nguyen Van A', type: 'Deposit', amount: '₫5,000,000', time: '10:30 AM' },
              { id: 'SA12346', customer: 'Tran Thi B', type: 'Withdraw', amount: '₫2,000,000', time: '11:15 AM' },
              { id: 'SA12347', customer: 'Le Van C', type: 'Deposit', amount: '₫10,000,000', time: '02:20 PM' },
              { id: 'SA12348', customer: 'Pham Thi D', type: 'New Account', amount: '₫3,000,000', time: '03:45 PM' }
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div 
                    className="flex items-center justify-center w-10 h-10 rounded-lg"
                    style={{ backgroundColor: transaction.type === 'Deposit' ? '#00AEEF15' : transaction.type === 'Withdraw' ? '#F59E0B15' : '#1A4D8F15' }}
                  >
                    {transaction.type === 'Deposit' ? (
                      <ArrowDownIcon size={18} style={{ color: '#00AEEF' }} />
                    ) : transaction.type === 'Withdraw' ? (
                      <ArrowUpIcon size={18} style={{ color: '#F59E0B' }} />
                    ) : (
                      <Wallet size={18} style={{ color: '#1A4D8F' }} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-[#1E293B]">{transaction.customer}</p>
                    <p className="text-xs text-gray-500">{transaction.id} • {transaction.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${transaction.type === 'Deposit' ? 'text-green-600' : transaction.type === 'Withdraw' ? 'text-red-600' : 'text-[#1E293B]'}`}>
                    {transaction.amount}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
