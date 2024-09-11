"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function DashboardPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour tester la route protégée
  const testProtectedRoute = async () => {
    try {
      const res = await fetch('/api/protected-route', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setError(null);
      } else {
        setError(data.error);
        setMessage(null);
      }
    } catch (err) {
      setError('An error occurred while fetching the protected route.');
      setMessage(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Dashboard page.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={testProtectedRoute}>Test Protected Route</Button>
        {message && <p className="text-green-500 mt-4">{message}</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </CardContent>
    </Card>
  );
}
