import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    // Default login
    onLogin('teller', username);
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full text-white"
              style={{ backgroundColor: '#1A4D8F' }}
            >
              Login
            </Button>

            <button
              type="button"
              className="w-full text-sm text-center text-gray-500 hover:text-gray-700"
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
            >
              Teller
            </Button>
            <Button
              onClick={() => handleRoleSelect('accountant')}
              variant="outline"
              style={{ borderColor: '#1A4D8F', color: '#1A4D8F' }}
            >
              Accountant
            </Button>
            <Button
              onClick={() => handleRoleSelect('admin')}
              className="text-[#1A4D8F]"
              style={{ backgroundColor: '#E0F2FE' }}
            >
              Admin
            </Button>
          </div>

          {/* Dev Mode Indicator */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              ⚙ Dev Mode Enabled — Role buttons visible for testing
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
