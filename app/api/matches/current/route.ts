import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assurez-vous que cette importation correspond à votre configuration
import { matches } from '@/lib/db'; // Le modèle pour vos matchs
import { sql } from 'drizzle-orm';
import { asc, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Obtenir la date actuelle
    const today = new Date();

    // Récupérer la journée la plus proche (matchs futurs ou en cours)
    const upcomingMatch = await db
      .select({
        matchday: matches.matchday,
      })
      .from(matches)
      .where(sql`${matches.matchDate} >= ${today.toISOString()}`)
      .orderBy(asc(matches.matchDate))
      .limit(1); // Récupérer le match le plus proche dans le futur

    if (upcomingMatch.length === 0) {
      // Si aucun match à venir, récupérer la dernière journée
      const lastMatch = await db
        .select({
          matchday: matches.matchday,
        })
        .from(matches)
        .orderBy(desc(matches.matchDate))
        .limit(1); // Dernier match passé

      if (lastMatch.length > 0) {
        return NextResponse.json({ matchday: lastMatch[0].matchday });
      }

      return NextResponse.json({ matchday: null }); // Si aucun match trouvé
    }

    return NextResponse.json({ matchday: upcomingMatch[0].matchday });
  } catch (error) {
    console.error('Erreur lors de la récupération de la journée de match :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la journée de match.' },
      { status: 500 }
    );
  }
}
