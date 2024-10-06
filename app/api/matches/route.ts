import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assurez-vous que votre connexion à la base de données est correcte
import { matches, teams } from '@/lib/db';
import { alias } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';

// Fonction pour gérer la requête GET
export async function GET(req: NextRequest) {
  // Créer des alias pour les tables des équipes
  const homeTeam = alias(teams, 'homeTeam');
  const awayTeam = alias(teams, 'awayTeam');
  try {
    const matchData = await db
    .select({
      matchId: matches.id,
      matchday: matches.matchday,
      matchDate: matches.matchDate,
      homeTeamId: matches.teamHomeId,
      awayTeamId: matches.teamAwayId,
      homeTeamName: homeTeam.name,
      homeTeamTrigram: homeTeam.trigram,
      homeTeamLogo: homeTeam.logo_path,
      awayTeamName: awayTeam.name,
      awayTeamTrigram: awayTeam.trigram,
      awayTeamLogo: awayTeam.logo_path,
      oddsHomeTeam: matches.oddsHomeTeam,
      oddsAwayTeam: matches.oddsAwayTeam,
      oddsDraw: matches.oddsDraw,
    })
    .from(matches)
    .leftJoin(homeTeam, eq(matches.teamHomeId, homeTeam.id))
    .leftJoin(awayTeam, eq(matches.teamAwayId, awayTeam.id))
    .orderBy(matches.matchday);

    if (matchData.length === 0) {
      return NextResponse.json({ error: 'No matches found' }, { status: 404 });
    }

    return NextResponse.json(matchData, { status: 200 });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
