import { NextResponse } from 'next/server';
import { verifyCredentials } from '@/lib/auth'; // Ta fonction de vérification

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await verifyCredentials(email, password);
  if (user) {
    // Traite l'authentification réussie
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
}
