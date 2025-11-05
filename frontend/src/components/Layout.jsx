import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Search, 
  FileText, 
  Settings, 
  Users, 
  UserCircle,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export default function Layout({ user, currentScreen, onNavigate, onLogout, children }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['teller', 'accountant'] },
    { id: 'open-account', label: 'Open Account', icon: UserPlus, roles: ['teller'] },
    { id: 'deposit', label: 'Deposit', icon: ArrowDownToLine, roles: ['teller'] },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUpFromLine, roles: ['teller'] },
    { id: 'search', label: 'Search', icon: Search, roles: ['teller', 'accountant'] },
    { id: 'daily-report', label: 'Daily Report', icon: FileText, roles: ['accountant'] },
    { id: 'monthly-report', label: 'Monthly Report', icon: FileText, roles: ['accountant'] },
    { id: 'regulations', label: 'Regulations', icon: Settings, roles: ['admin'] },
    { id: 'users', label: 'Users', icon: Users, roles: ['admin'] },
    { id: 'profile', label: 'Profile', icon: UserCircle, roles: ['teller', 'accountant', 'admin'] },
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 flex flex-col w-64 h-screen bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: '#1A4D8F' }}>
              <span className="text-white">K</span>
            </div>
            <div>
              <h1 className="text-[#1A4D8F]">KASA</h1>
              <p className="text-xs text-gray-500">Savings Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={isActive ? { backgroundColor: '#1A4D8F' } : {}}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 text-xs text-center text-gray-500 border-t border-gray-200">
          © KASA 2025
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 px-8 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[#1E293B] capitalize">
                {menuItems.find(item => item.id === currentScreen)?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500">Welcome back, {user.fullName}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-[#1E293B]">{user.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                    Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be returned to the login screen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                    Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onLogout}>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
