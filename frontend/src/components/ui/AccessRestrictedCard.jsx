import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { AlertTriangle } from 'lucide-react';

export function AccessRestrictedCard({
  title = 'Access Restricted',
  message = 'You do not have permission to access this page.',
  note,
}) {
  return (
    <Card className="border-0 shadow-xl rounded-3xl">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-semibold text-center">
        <AlertTriangle size={64} className="mx-auto mb-4 text-yellow-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 pt-4 space-y-3 text-center">
        <p className="text-gray-600">{message}</p>
        {note && (
          <p className="text-xs text-gray-400">
            {note}
          </p>
        )}
      </CardContent>
    </Card>
  );
}