import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Assurez-vous que votre connexion à la base de données est correcte
import { matches } from '@/lib/db';

// Fonction pour gérer la requête GET
export async function GET(req: NextRequest) {
  try {
    const matchData = await db
      .select({
        id: matches.id,
        matchday: matches.matchday,
        matchDate: matches.matchDate,
        teamHomeId: matches.teamHomeId,
        teamAwayId: matches.teamAwayId,
        oddsHomeTeam: matches.oddsHomeTeam,
        oddsAwayTeam: matches.oddsAwayTeam,
        oddsDraw: matches.oddsDraw,
      })
      .from(matches)
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
