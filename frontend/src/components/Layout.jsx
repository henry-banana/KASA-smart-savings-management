import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
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
  LogOut,
  Bell,
  Sparkles
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
import { BackgroundDecor } from './CuteComponents';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['teller', 'accountant', 'admin'] },
    { path: '/savings/open', label: 'Mở Sổ', icon: UserPlus, roles: ['teller', 'admin'] },
    { path: '/savings/deposit', label: 'Gửi Tiền', icon: ArrowDownToLine, roles: ['teller', 'admin'] },
    { path: '/savings/withdraw', label: 'Rút Tiền', icon: ArrowUpFromLine, roles: ['teller', 'admin'] },
    { path: '/search', label: 'Tra Cứu', icon: Search, roles: ['teller', 'accountant', 'admin'] },
    { path: '/reports/daily', label: 'Báo Cáo Ngày', icon: FileText, roles: ['accountant', 'admin'] },
    { path: '/reports/monthly', label: 'Báo Cáo Tháng', icon: FileText, roles: ['accountant', 'admin'] },
    { path: '/regulations', label: 'Quy Định', icon: Settings, roles: ['admin'] },
    { path: '/users', label: 'Người Dùng', icon: Users, roles: ['admin'] },
    { path: '/profile', label: 'Hồ Sơ', icon: UserCircle, roles: ['teller', 'accountant', 'admin'] },
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleColors = {
    teller: { bg: '#DFF9F4', text: '#059669', border: '#6EE7B7' },
    accountant: { bg: '#E8F6FF', text: '#0369A1', border: '#7DD3FC' },
    admin: { bg: '#FFE8F0', text: '#BE185D', border: '#FBCFE8' }
  };

  const currentRole = roleColors[user?.role] || roleColors.teller;

  return (
    <div className="min-h-screen bg-[#F5F6FA] cute-bg-pattern relative">
      <BackgroundDecor />
      
      {/* 🎨 Cute Sidebar - Navy Dark */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[#1A4D8F] to-[#154171] flex flex-col shadow-xl z-20">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10 relative">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <span className="text-white text-xl font-bold relative z-10">K</span>
              <Sparkles className="absolute -top-1 -right-1 text-cyan-300 opacity-50" size={16} />
            </div>
            <div>
              <h1 className="text-white text-xl font-semibold tracking-tight">KASA</h1>
              <p className="text-xs text-white/60">Quản Lý Sổ Tiết Kiệm</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={`transition-colors ${isActive ? 'text-cyan-300' : 'group-hover:text-cyan-300'}`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/40 text-center font-medium">
            © KASA 2025 ✨
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 relative z-10">
        {/* 🎨 Cute Header - Cyan Accent */}
        <header 
          className="bg-gradient-to-r from-[#00AEEF] to-[#33BFF3] px-8 py-4 sticky top-0 z-10 shadow-md"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-xl font-semibold">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-white/80 mt-0.5">Xin chào, {user?.fullName} 👋</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
                <Bell size={20} className="text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full text-white text-xs flex items-center justify-center font-medium shadow-lg">
                  3
                </span>
              </button>

              {/* User Info */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/20">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-lg"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)'
                  }}
                >
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="text-right">
                  <p className="text-sm text-white font-medium">{user?.fullName || 'User'}</p>
                  <span 
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1"
                    style={{
                      backgroundColor: currentRole.bg,
                      color: currentRole.text,
                      border: `1px solid ${currentRole.border}`
                    }}
                  >
                    {user?.role?.toUpperCase() || 'USER'}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
                  >
                    <LogOut size={16} className="mr-2" />
                    Đăng Xuất
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận đăng xuất?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Bạn sẽ quay lại màn hình đăng nhập.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleLogout}
                      className="rounded-xl bg-[#00AEEF] hover:bg-[#0098D4]"
                    >
                      Xác Nhận
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
