import { verifyPassword } from '@/lib/auth';
import { findUserByEmail } from '@/lib/queries/userQueries';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // Utilisation des cookies Next.js

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Assure-toi d'avoir une clé secrète sécurisée

export async function POST(request: Request) {
  const { email, password } = await request.json();
  
  // Récupère l'utilisateur par email
  const user = await findUserByEmail(email);

  if (!user) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
    });
  }

  // Vérifie si le mot de passe est correct
  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
    });
  }

  // Si tout est correct, on génère un token JWT
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '1h' } // Le token expire dans 1 heure
  );

  // Crée une réponse et stocke le token JWT dans les cookies
  const response = NextResponse.json({ success: true });

  response.cookies.set('token', token, {
    httpOnly: true, // Cookie non accessible par JavaScript
    secure: process.env.NODE_ENV === 'production', // Utiliser secure en production
    path: '/', // Le cookie est disponible sur tout le site
    maxAge: 60 * 60, // Le cookie expire dans 1 heure
  });

  // Retourne la réponse avec le cookie JWT
  return response;
}
