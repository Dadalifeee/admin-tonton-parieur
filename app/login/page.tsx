"use client"; // Ajoute cette directive pour marquer ce composant comme client

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardContent,
  CardTitle
} from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const res = await fetch('/api/auth/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok) {
        // Redirige l'utilisateur ou fais autre chose
        window.location.href = '/';
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            You can login with your credentials or GitHub.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='w-full'>
            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full"
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <Button type="submit" className="w-full">Sign in with Email</Button>
            </form>
          </div>
          
        </CardContent>
        <CardFooter>
        {/* <form
            action={async () => {
              await signIn('github', {
                redirectTo: '/'
              });
            }}
            className="w-full mt-4"
          >
            <Button className="w-full">Sign in with GitHub</Button>
          </form> */}
          <CardFooter>
          <p className="text-sm mt-4">
            Pas de compte ? <Link href="/register" className="text-blue-500 underline">Inscription</Link>
          </p>
        </CardFooter>
        </CardFooter>
        
      </Card>
    </div>
  );
}
