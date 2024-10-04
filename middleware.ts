import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Utilise une clé secrète pour JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function middleware(req: NextRequest) {
  // Récupère les cookies depuis la requête
  const token = req.cookies.get('token')?.value; // Utilise .value pour récupérer la chaîne du token

  if (!token) {
    // Si aucun token n'est trouvé, renvoie une réponse non autorisée ou redirige
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    // Vérifie le token avec la clé secrète
    const decoded = jwt.verify(token, JWT_SECRET);

    // Si la vérification réussit, autorise la requête à continuer
    // (Optionnel: tu peux ajouter le token décodé dans les en-têtes ou la requête pour un usage ultérieur)
    (req as any).user = decoded;

    return NextResponse.next();
  } catch (err) {
    console.error('Token error:', err);

    // Si la vérification échoue, renvoie une redirection ou une réponse non autorisée
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Configuration pour matcher certaines routes protégées
export const config = {
  matcher: ['/protected-route/:path*'], // Définis ici les routes que tu veux protéger
};
