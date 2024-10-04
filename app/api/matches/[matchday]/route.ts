import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { matches, teams } from '@/lib/db';
import { alias } from 'drizzle-orm/pg-core';
import { eq } from 'drizzle-orm';


export async function GET(
  req: NextRequest,
  { params }: { params: { matchday: string } }
) {
  const { matchday } = params;

  if (!matchday) {
    return NextResponse.json({ error: 'Matchday is required' }, { status: 400 });
  }

  try {
    // Créer des alias pour les tables des équipes
    const homeTeam = alias(teams, 'homeTeam');
    const awayTeam = alias(teams, 'awayTeam');

    // Requête avec jointures en utilisant les tables aliasées
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
      .where(eq(matches.matchday, Number(matchday)))
      .orderBy(matches.matchday);

    if (matchData.length === 0) {
      return NextResponse.json(
        { error: `No matches found for matchday ${matchday}` },
        { status: 404 }
      );
    }

    return NextResponse.json(matchData, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
