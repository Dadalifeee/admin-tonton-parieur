import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();

  // Supprimer le cookie 'token' en le réinitialisant avec une durée de vie expirée
  const response = NextResponse.json({ message: 'Successfully logged out' });
  
  // Supprimer le cookie JWT en le rendant invalide (maxAge à 0 ou date d'expiration passée)
  cookieStore.delete("token")
  cookieStore.delete("user_id")

  return response;
}
