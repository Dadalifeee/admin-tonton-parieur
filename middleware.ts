import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Utilisation de la clé secrète pour HMAC-SHA256
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

// Fonction pour décoder Base64URL
function base64UrlDecode(input: string) {
  // Remplace les caractères spécifiques à Base64URL par les caractères standard Base64
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  
  // Ajouter le padding "=" si nécessaire
  const pad = input.length % 4;
  if (pad) {
    input += '='.repeat(4 - pad);
  }
  
  return atob(input);
}

// Fonction pour vérifier le JWT avec Web Crypto API (HMAC-SHA256)
async function verifyJWT(token: string) {
  const [header, payload, signature] = token.split('.');
  const data = `${header}.${payload}`;
  const signatureBuffer = Uint8Array.from(base64UrlDecode(signature), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    'raw',
    JWT_SECRET,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    signatureBuffer,
    new TextEncoder().encode(data)
  );

  if (!valid) {
    throw new Error('Invalid JWT signature');
  }

  // Décoder le payload
  return JSON.parse(base64UrlDecode(payload));
}

export async function middleware(req: Request) {
  // Récupérer les cookies
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  // Si pas de token, renvoyer un 401 Unauthorized
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Vérifier le token JWT avec Web Crypto API
    const decoded = await verifyJWT(token);

    // Utilisateur authentifié, laisser la requête continuer
    return NextResponse.next();
  } catch (err) {
    console.error('Invalid token:', err);
    // Si la vérification échoue, renvoyer un 401 Unauthorized
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

// Configuration pour matcher certaines routes
export const config = {
  matcher: ['/api/matches/:path*'], // Spécifie les routes à protéger
};
