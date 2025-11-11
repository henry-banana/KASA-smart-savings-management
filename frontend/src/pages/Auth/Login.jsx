import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

// NEW: Spinner thuần CSS/Tailwind, không cần cài thêm lib
function Spinner({ size = 16, light = true }) {
  // light=true: spinner màu trắng (hợp nền nút xanh); false: spinner màu xám (dùng trên nền sáng)
  const borderColor = light ? 'border-white' : 'border-gray-400';
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 ${borderColor} border-t-transparent align-middle`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // đã có

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      if (data.role) {
        onLogin(data.role, username);
      } else {
        throw new Error('Login successful, but role was not provided by the API response.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role) => {
    onLogin(role, `${role}_user`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#F5F6FA' }}>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl" style={{ backgroundColor: '#1A4D8F' }}>
            <span className="text-2xl text-white">K</span>
          </div>
          <CardTitle className="text-2xl" style={{ color: '#1A4D8F' }}>KASA</CardTitle>
          <CardDescription>Savings Account Management System</CardDescription>
          <h3 className="text-[#1E293B] pt-2">Sign in to KASA</h3>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" aria-busy={loading}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                disabled={loading}
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              className="flex items-center justify-center w-full gap-2 text-white"
              style={{ backgroundColor: '#1A4D8F' }}
              disabled={loading}
            >
              {/* NEW: Hiện spinner khi loading */}
              {loading && <Spinner size={16} light />}
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            <button
              type="button"
              className="w-full text-sm text-center text-gray-500 hover:text-gray-700"
              disabled={loading}
            >
              Forgot password?
            </button>
          </form>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-gray-500 bg-white">or select a role (dev mode)</span>
            </div>
          </div>

          {/* Role Selection Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => handleRoleSelect('teller')}
              className="text-white"
              style={{ backgroundColor: '#1A4D8F' }}
              disabled={loading}
            >
              Teller
            </Button>
            <Button
              onClick={() => handleRoleSelect('accountant')}
              variant="outline"
              style={{ borderColor: '#1A4D8F', color: '#1A4D8F' }}
              disabled={loading}
            >
              Accountant
            </Button>
            <Button
              onClick={() => handleRoleSelect('admin')}
              className="text-[#1A4D8F]"
              style={{ backgroundColor: '#E0F2FE' }}
              disabled={loading}
            >
              Admin
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">⚙ Dev Mode Enabled — Role buttons visible for testing</p>
          </div>
        </CardContent>
        {/* OPTIONAL Overlay khi loading */}
        {/* {loading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-sm">
          <span className="inline-block animate-spin rounded-full border-4 border-[#1A4D8F] border-t-transparent" style={{ width: 40, height: 40 }} />
          </div>
          )} */}
      </Card>
    </div>
  );
}
