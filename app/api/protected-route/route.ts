import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value; // Utilise .value pour récupérer la chaîne de caractères du token

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Vérifie le token JWT avec la clé secrète
    const decoded = jwt.verify(token, JWT_SECRET);
    // Utilisateur authentifié, retourne les données
    return NextResponse.json({ message: 'Welcome!', user: decoded });
  } catch (err) {
    console.error(err); // Log l'erreur pour déboguer
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
