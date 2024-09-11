// /app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth'; // Fonction pour hasher le mot de passe
import { createUser, findUserByEmail } from '@/lib/db'; // Fonctions pour la DB
import jwt from 'jsonwebtoken'; // Import JWT
import { cookies } from 'next/headers'; // Utilise les cookies de Next.js

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Assure-toi d'avoir une clé secrète

export async function POST(request: Request) {
  const { email, password, name, username } = await request.json();

  // Vérifie si l'utilisateur existe déjà
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // Hash du mot de passe
  const hashedPassword = await hashPassword(password);

  // Crée un nouvel utilisateur
  const user = await createUser({
    email,
    name,
    username,
    password: hashedPassword,
  });

  // Crée un token JWT
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '1h' } // Le token expire dans 1 heure
  );

  // Stocke le token JWT dans les cookies
  const response = NextResponse.json({ success: true });
  response.cookies.set('token', token, {
    httpOnly: true, // Assure que le cookie n'est pas accessible par JavaScript côté client
    secure: process.env.NODE_ENV === 'production', // Utilise secure seulement en production
    path: '/', // Le cookie est disponible pour tout le site
    maxAge: 60 * 60, // Le cookie expire dans 1 heure
  });

  return response;
}
