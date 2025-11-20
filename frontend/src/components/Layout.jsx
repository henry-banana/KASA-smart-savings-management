import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Menu,
  X
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile overlay
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop collapse
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['teller', 'accountant', 'admin'] },
    { path: '/savings/open', label: 'Open Account', icon: UserPlus, roles: ['teller', 'admin'] },
    { path: '/savings/deposit', label: 'Deposit', icon: ArrowDownToLine, roles: ['teller', 'admin'] },
    { path: '/savings/withdraw', label: 'Withdraw', icon: ArrowUpFromLine, roles: ['teller', 'admin'] },
    { path: '/search', label: 'Search', icon: Search, roles: ['teller', 'accountant', 'admin'] },
    { path: '/reports/daily', label: 'Daily Report', icon: FileText, roles: ['accountant', 'admin'] },
    { path: '/reports/monthly', label: 'Monthly Report', icon: FileText, roles: ['accountant', 'admin'] },
    { path: '/regulations', label: 'Regulations', icon: Settings, roles: ['admin'] },
    { path: '/users', label: 'Users', icon: Users, roles: ['admin'] },
    { path: '/profile', label: 'Profile', icon: UserCircle, roles: ['teller', 'accountant', 'admin'] },
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
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
      
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 🎨 Enhanced Sidebar - Navy Dark with Collapse & Mobile Support */}
      <aside 
        className={`
          fixed left-0 top-0 h-screen bg-gradient-to-b from-[#1A4D8F] to-[#154171] 
          flex flex-col shadow-xl z-40
          ${isMobile 
            ? 'w-64 transition-transform duration-300 ease-out' + (isSidebarOpen ? ' translate-x-0' : ' -translate-x-full')
            : 'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]'
          }
        `}
        style={
          !isMobile ? {
            width: isSidebarCollapsed ? '80px' : '256px',
            willChange: 'width'
          } : undefined
        }
      >
        {/* Logo Section with Collapse Support - Enhanced */}
        <div className="p-6 border-b border-white/10 relative">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => handleNavigate('/dashboard')}
              className={`flex items-center gap-3 hover:opacity-80 transition-all duration-300 ${
                !isMobile && isSidebarCollapsed ? 'justify-center w-full' : ''
              }`}
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-lg relative overflow-hidden flex-shrink-0 transition-all duration-300 hover:scale-110"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <span className="text-white text-xl font-bold relative z-10 transition-all duration-300">K</span>
                <Sparkles className="absolute -top-1 -right-1 text-cyan-300 opacity-50 animate-pulse" size={16} />
              </div>
              {(!isSidebarCollapsed || isMobile) && (
                <div className="transition-all duration-300 overflow-hidden" style={{
                  maxWidth: (!isSidebarCollapsed || isMobile) ? '200px' : '0px',
                  opacity: (!isSidebarCollapsed || isMobile) ? 1 : 0
                }}>
                  <h1 className="text-white text-xl font-semibold tracking-tight whitespace-nowrap">KASA</h1>
                  <p className="text-xs text-white/60 whitespace-nowrap">Savings Management</p>
                </div>
              )}
            </button>
            {/* Toggle buttons - Improved Design */}
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="group p-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X size={24} className="text-white transition-transform duration-200 group-hover:rotate-90" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation - Enhanced with better animations */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {visibleMenuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-white/15 text-white shadow-lg backdrop-blur-sm scale-[1.02]' 
                      : 'text-white/80 hover:bg-white/10 hover:text-white hover:scale-[1.01]'
                  } ${
                    !isMobile && isSidebarCollapsed ? 'justify-center' : ''
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                  title={!isMobile && isSidebarCollapsed ? item.label : undefined}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-300 rounded-r-full animate-pulse" />
                  )}
                  
                  <Icon 
                    size={20} 
                    className={`flex-shrink-0 transition-all duration-200 ${
                      isActive 
                        ? 'text-cyan-300 scale-110' 
                        : 'group-hover:text-cyan-300 group-hover:scale-110'
                    }`}
                  />
                  {(!isSidebarCollapsed || isMobile) && (
                    <>
                      <span className="font-medium transition-all duration-200">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                          <div className="w-1 h-1 rounded-full bg-cyan-300/60 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer - Enhanced */}
        <div className="p-4 border-t border-white/10">
          <div className={`text-xs text-white/40 text-center font-medium transition-opacity duration-200 ${
            !isMobile && isSidebarCollapsed ? 'opacity-0' : 'opacity-100'
          }`}>
            © KASA 2025 ✨
          </div>
        </div>
      </aside>

      {/* Main Content with Dynamic Margin */}
      <div 
        className="relative z-10 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          marginLeft: isMobile ? 0 : (isSidebarCollapsed ? '80px' : '256px')
        }}
      >
        {/* 🎨 Cute Header - Solid Gradient Background */}
        <header 
          className="bg-gradient-to-r from-[#00AEEF] to-[#33BFF3] px-4 sm:px-6 lg:px-8 py-4 sticky top-0 z-20 shadow-md"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {/* Menu Toggle Button */}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <Menu size={20} className="text-white" />
              </button>
              
              {/* Logo - Click to Home */}
              <button
                onClick={() => handleNavigate('/dashboard')}
                className="flex items-center gap-2 hover:opacity-90 transition-opacity group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                  <span className="text-white font-bold text-lg relative z-10">K</span>
                  <Sparkles className="absolute -top-0.5 -right-0.5 text-white opacity-60" size={12} />
                </div>
                <div className="hidden sm:block">
                  <div className="text-white font-bold text-lg tracking-tight">KASA</div>
                  <div className="text-xs text-white/80 -mt-0.5">Savings</div>
                </div>
              </button>
              
              <div className="h-8 w-px bg-white/20 hidden sm:block" />
              
              <div className="min-w-0">
                <h2 className="text-white text-lg sm:text-xl font-semibold truncate">
                  {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-white/80 mt-0.5 hidden md:block">Welcome, {user?.fullName} 👋</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
              {/* Notification Bell - Enhanced with Animation */}
              <button className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 backdrop-blur-sm flex-shrink-0 group">
                <Bell size={18} className="sm:w-5 sm:h-5 text-white transition-transform duration-200 group-hover:rotate-12 group-active:scale-90" />
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full text-white text-[10px] sm:text-xs flex items-center justify-center font-medium shadow-lg animate-pulse">
                  3
                </span>
              </button>

              {/* User Info - Enhanced with hover effect */}
              <div className="hidden sm:flex items-center gap-2 lg:gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-3 lg:px-4 py-2 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-200 group">
                <div 
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-white text-sm lg:text-base font-semibold shadow-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)'
                  }}
                >
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-xs lg:text-sm text-white font-medium truncate max-w-[120px] transition-all duration-200">{user?.fullName || 'User'}</p>
                  <span 
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] lg:text-xs font-medium mt-1 transition-all duration-200 group-hover:scale-105"
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

              {/* Logout Button - Enhanced */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-xl bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm px-3 lg:px-4"
                  >
                    <LogOut size={16} className="sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be returned to the login screen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleLogout}
                      className="rounded-xl bg-red-600 hover:bg-red-700"
                    >
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
