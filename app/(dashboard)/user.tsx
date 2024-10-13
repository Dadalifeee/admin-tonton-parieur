"use client"; // Assurez-vous que ce composant est bien client-side
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { getCookie } from '@/lib/cookies/cookies';

export function User() {
  const [user, setUser] = useState<any>(null);

  // Utiliser useEffect pour récupérer l'état de connexion côté client
  useEffect(() => {
    const userId = getCookie("user_id");
    if (userId) {
      // Vous pouvez ajouter ici une requête à l'API pour récupérer d'autres infos utilisateur si nécessaire
      setUser({ id: userId, image: '/placeholder-user.jpg' }); // Mettre à jour avec les données utilisateur réelles
    }
  }, []);

  // Fonction pour gérer la déconnexion via l'API
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        // Réinitialiser l'état de l'utilisateur après la déconnexion
        setUser(null);
        // Rediriger vers la page de connexion ou d'accueil après déconnexion
        window.location.href = '/login';
      } else {
        console.error('Failed to log out');
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full relative ml-auto md:grow-1"
        >
          <Image
            src={user?.image ?? '/placeholder-user.jpg'}
            width={36}
            height={36}
            alt="Avatar"
            className="overflow-hidden rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        {user ? (
          <DropdownMenuItem>
            <button type="button" onClick={handleLogout}>
              Sign Out
            </button>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>
            <Link href="/login">Sign In</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
