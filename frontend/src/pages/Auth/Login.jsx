import './Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Lock, User, Sparkles, Star, Heart } from 'lucide-react';
import eyeOpenIcon from '../../assets/eyeopen.png';
import eyeCloseIcon from '../../assets/eyeclose.png';
import { useConfig } from '@/contexts/ConfigContext';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/utils/logger';

// Spinner thuần CSS/Tailwind (giữ size động)
function Spinner({ size = 16, light = true }) {
  const borderColor = light ? 'border-white' : 'border-gray-400';
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 ${borderColor} border-t-transparent align-middle`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // ✅ Use new hooks
  const { devMode } = useConfig();
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // ✅ Use new authService through context
      const userData = await authLogin({ username, password });

      // userData.role đã là: 'admin' | 'teller' | 'accountant'
      if (userData?.role === 'admin') {
        navigate('/regulations');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      logger.error('Login failed', err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (role) => {
    const roleCredentials = {
      teller: { username: 'teller1', password: '123456' },
      accountant: { username: 'accountant1', password: '123456' },
      admin: { username: 'admin1', password: 'admin123' }
    };
    
    const creds = roleCredentials[role];
    setLoading(true);
  setError('');
  try {
    const userData = await authLogin(creds);

    if (userData?.role === 'admin') {
      navigate('/regulations');
    } else {
      navigate('/dashboard');
    }
  } catch (err) {
    console.error('Quick role login error:', err);
    setError(err.message || 'Đăng nhập nhanh thất bại');
  } finally {
    setLoading(false);
  }
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  
  return (
    <div 
      className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #E8F6FF 0%, #DFF9F4 50%, #FFF7D6 100%)' }}
    >
      {/* 🎨 Cute Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles className="absolute text-yellow-300 top-20 left-20 opacity-40" size={40} />
        <Star className="absolute text-pink-300 top-40 right-32 opacity-30" size={32} fill="currentColor" />
        <Heart className="absolute text-red-200 opacity-25 bottom-32 left-40" size={28} fill="currentColor" />
        <Sparkles className="absolute bottom-40 right-20 text-cyan-300 opacity-40" size={36} />
        
        {/* Floating circles */}
        <div className="absolute w-32 h-32 bg-blue-200 rounded-full top-1/4 left-1/4 opacity-10 blur-2xl animate-pulse" />
        <div className="absolute w-40 h-40 bg-pink-200 rounded-full bottom-1/3 right-1/3 opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="relative z-10 w-full max-w-md overflow-hidden border-0 shadow-2xl rounded-3xl">
        {/* Gradient Top Bar */}
        <div className="h-2 bg-linear-to-r from-[#1A4D8F] via-[#00AEEF] to-[#1A4D8F]" />
        
        <CardHeader className="relative pt-8 pb-6 space-y-4 text-center">
          {/* Logo with cute design */}
          <div className="relative mx-auto">
            <div 
              className="relative flex items-center justify-center w-20 h-20 overflow-hidden shadow-lg rounded-3xl"
              style={{ background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)' }}
            >
              <span className="text-3xl font-bold text-white">K</span>
              <Sparkles className="absolute text-yellow-300 -top-1 -right-1 opacity-80" size={20} />
              <Star className="absolute text-pink-300 -bottom-1 -left-1 opacity-60" size={16} fill="currentColor" />
            </div>
            
            {/* Decorative elements around logo */}
            <div className="absolute w-6 h-6 bg-pink-200 rounded-full -top-2 -right-2 opacity-60 animate-pulse" />
            <div className="absolute w-4 h-4 rounded-full -bottom-2 -left-2 bg-cyan-200 opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>

          <div>
            <CardTitle 
              className="mb-2 text-3xl"
              style={{ 
                background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              KASA
            </CardTitle>
            <CardDescription className="text-base">
              Savings Management System
            </CardDescription>
            <h3 className="pt-3 font-medium text-gray-700">Log in to KASA ✨</h3>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8 space-y-6">
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Tên đăng nhập</Label>
              <div className="relative">
                <User className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={18} />
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  disabled={loading}
                  className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={18} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  disabled={loading}
                  className="pl-10 pr-10 h-12 rounded-xl border-gray-200 focus:border-[#00AEEF] focus:ring-[#00AEEF] transition-all"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-gray-500 cursor-pointer rounded-r-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showPassword ? "Show password" : "Hide password"}
                >
                  <img
                    src={showPassword ? eyeOpenIcon : eyeCloseIcon}
                    alt="Toggle password visibility"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 border border-red-200 bg-red-50 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #1A4D8F 0%, #00AEEF 100%)' }}
            >
              {loading && <Spinner size={16} light />}
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </Button>

            <button
              type="button"
              disabled={loading}
              className="text-sm text-gray-500 hover:text-[#00AEEF] w-full text-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Forgot password?
            </button>
          </form>

          {/* DEV MODE SECTION - Only show when DEV_MODE is true */}
          {/* DEV MODE SECTION - Only show when devMode is true */}
          {devMode && (
            <>
              {/* Cute Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-3 font-medium text-gray-500 bg-white rounded-full">
                    hoặc chọn vai trò (dev mode) ⚙️
                  </span>
                </div>
              </div>

              {/* Cute Role Selection Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleRoleSelect('teller')}
                  disabled={loading}
                  className="group relative overflow-hidden rounded-2xl p-4 border-2 border-transparent hover:border-[#1A4D8F] transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #E8F6FF 0%, #DFF9F4 100%)' }}
                >
                  <div className="text-center">
                    <div className="mb-1 text-2xl">🏦</div>
                    <p className="text-xs font-semibold text-[#1A4D8F]">Teller</p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleRoleSelect('accountant')}
                  disabled={loading}
                  className="group relative overflow-hidden rounded-2xl p-4 border-2 border-transparent hover:border-[#00AEEF] transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #DFF9F4 0%, #FFF7D6 100%)' }}
                >
                  <div className="text-center">
                    <div className="mb-1 text-2xl">📊</div>
                    <p className="text-xs font-semibold text-[#00AEEF]">Accountant</p>
                  </div>
                </button>
                
                <button
                  onClick={() => handleRoleSelect('admin')}
                  disabled={loading}
                  className="group relative overflow-hidden rounded-2xl p-4 border-2 border-transparent hover:border-[#BE185D] transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #FFE8F0 0%, #F3E8FF 100%)' }}
                >
                  <div className="text-center">
                    <div className="mb-1 text-2xl">👑</div>
                    <p className="text-xs font-semibold text-[#BE185D]">Admin</p>
                  </div>
                </button>
              </div>

              {/* Dev Mode Indicator */}
              <div className="pt-2 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-purple-100 rounded-full bg-linear-to-r from-purple-50 to-pink-50">
                  <Sparkles size={14} className="text-purple-400" />
                  <p className="text-xs font-medium text-purple-600">
                    Dev Mode — Nút vai trò để test
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>

        {/* Overlay khi loading */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/20 backdrop-blur-[1px] animate-fade-in">
            <span className="spinner inline-block animate-spin rounded-full border-4 border-[#1A4D8F] border-t-transparent" />
            <p className="mt-3 text-[#1A4D8F] font-medium text-sm animate-wave">Đang tải...</p>
          </div>
        )}
      </Card>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-r from-[#1A4D8F] via-[#00AEEF] to-[#1A4D8F] opacity-50" />
    </div>
  );
}