import React from 'react';
import { Skeleton } from './skeleton';

// 📊 Table Skeleton - For loading states in tables
export function TableSkeleton({ rows = 5, columns = 6 }) {
  return (
    <div className="space-y-3">
      {/* Header Row */}
      <div className="flex gap-4 pb-3 border-b border-gray-200">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 flex-1" />
        ))}
      </div>
      
      {/* Data Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex gap-4 py-3 border-b border-gray-100">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={`cell-${rowIndex}-${colIndex}`} 
              className="h-4 flex-1"
              style={{ opacity: 1 - (rowIndex * 0.1) }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// 💳 Account Info Skeleton - For loading account details
export function AccountInfoSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-cyan-200 bg-linear-to-br from-cyan-50 to-blue-50 p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="w-5 h-5 rounded-full" />
        <Skeleton className="h-5 w-40" />
      </div>

      {/* Account Details */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      ))}

      {/* Balance Row - Larger */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-6 w-48" />
      </div>
    </div>
  );
}

// 📋 Card Skeleton - For loading card layouts
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="w-14 h-14 rounded-2xl" />
      </div>
    </div>
  );
}

// 📝 Form Skeleton - For loading forms
export function FormSkeleton({ fields = 3 }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      ))}
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

// 📊 Stat Card Skeleton - For dashboard stats
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="w-14 h-14 rounded-2xl" />
      </div>
    </div>
  );
}
