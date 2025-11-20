// src/components/RoleGuard.jsx
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AccessRestrictedCard } from './ui/AccessRestrictedCard';

export function RoleGuard({ allow, disallow, children, fallback }) {
  const { user } = useAuth();

  if (!user) return children;

  const role = user.role;

  // Nếu có allow → chỉ những role trong allow mới được vào
  if (allow && !allow.includes(role)) {
    return fallback || (
      <AccessRestrictedCard
        message="You don't have permission to access this page."
      />
    );
  }

  // Nếu có disallow → các role trong disallow bị chặn
  if (disallow && disallow.includes(role)) {
    return fallback || (
      <AccessRestrictedCard
        message="Your role is not allowed to access this page."
      />
    );
  }

  return children;
}
