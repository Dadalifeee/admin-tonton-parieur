import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth'; // Fonction pour hasher le mot de passe
import { createUser, findUserByEmail } from '@/lib/queries/userQueries'; // Fonctions pour la DB
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; // Utilisation des cookies

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  const { email, password, name, username } = await request.json();

  // Vérifie si l'utilisateur existe déjà
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // Hash du mot de passe
  const hashedPassword = await hashPassword(password);

  // Crée un nouvel utilisateur et récupère l'utilisateur créé
  const user = await createUser({
    email,
    name,
    username,
    password: hashedPassword,
  });

  // Vérifie si l'utilisateur a bien été créé
  if (!user) {
    return NextResponse.json({ error: 'User could not be created' }, { status: 500 });
  }

  // Crée un token JWT
  const token = jwt.sign(
    {
      userId: user.id, // Assure-toi que l'utilisateur contient bien un ID
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Stocke le token JWT dans les cookies
  const response = NextResponse.json({ success: true });
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60,
  });

  return response;
}
