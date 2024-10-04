import { users, db } from '../db';
import { eq } from 'drizzle-orm';

export type SelectUser = typeof users.$inferSelect;

// Crée un utilisateur dans la base de données
export async function createUser({
  email,
  name,
  username,
  password,
}: {
  email: string;
  name: string;
  username: string;
  password: string;
}) {
  const [user] = await db.insert(users).values({
    email,
    name,
    username,
    password,
  }).returning(); // Utiliser .returning() pour retourner l'utilisateur créé

  return user; // Renvoie l'utilisateur créé
}

// Trouver un utilisateur par email
export async function findUserByEmail(email: string): Promise<SelectUser | null> {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user.length > 0 ? user[0] : null;
}