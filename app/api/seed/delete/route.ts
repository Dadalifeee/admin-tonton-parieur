import { db } from 'lib/db';
import { users, teams, matches, bets } from 'lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Vider les tables dans l'ordre des dépendances
    await db.delete(bets);    // Supprime les paris (dépend de matches et users)
    await db.delete(matches); // Supprime les matchs (dépend de teams)
    await db.delete(teams);   // Supprime les équipes

    return new Response('Toutes les tables ont été vidées avec succès.', { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suppression des données :', error);
    return new Response('Erreur lors de la suppression des données.', { status: 500 });
  }
}
