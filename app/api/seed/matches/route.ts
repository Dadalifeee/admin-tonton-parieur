import { db } from 'lib/db';
import { teams, matches } from 'lib/db';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

// Types pour les données de match
interface Team {
  name: string;
  tla: string;
  crest: string;
}

interface Score {
  fullTime: {
    home: number;
    away: number;
  };
}

interface Match {
  id: number;
  utcDate: string;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  matchday: number;
  status: string;
}

interface MatchdayData {
  matches: Match[];
}

export async function POST(req: NextRequest, res: Response) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Only POST requests allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const matchdayData = await req.json();

  if (!matchdayData || !matchdayData.matches) {
    return new Response(JSON.stringify({ error: 'Invalid data format. Expected matchday data with matches array.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Récupérer ou créer les équipes et insérer les matchs
    await Promise.all(
      matchdayData.matches.map(async (match: Match) => {
        // Récupérer le matchday directement depuis le JSON
        const { matchday } = match;

        const homeTeamData = {
          name: match.homeTeam.name,
          trigram: match.homeTeam.tla,
          logo_path: match.homeTeam.crest,
        };
        const awayTeamData = {
          name: match.awayTeam.name,
          trigram: match.awayTeam.tla,
          logo_path: match.awayTeam.crest,
        };

        // Insérer ou récupérer les équipes
        const homeTeam = await db.insert(teams).values(homeTeamData).onConflictDoNothing().returning();
        const awayTeam = await db.insert(teams).values(awayTeamData).onConflictDoNothing().returning();

        const homeTeamId = homeTeam[0]?.id || (await db.select().from(teams).where(eq(teams.trigram, homeTeamData.trigram)))[0].id;
        const awayTeamId = awayTeam[0]?.id || (await db.select().from(teams).where(eq(teams.trigram, awayTeamData.trigram)))[0].id;

        // Insertion des matchs avec le matchday récupéré
        await db.insert(matches).values({
          teamHomeId: homeTeamId,
          teamAwayId: awayTeamId,
          matchday: matchday, // Utilisation du matchday récupéré
          matchDate: new Date(match.utcDate),
          scoreHome: match.score.fullTime.home,
          scoreAway: match.score.fullTime.away,
          status: match.status,
          createdAt: new Date(),
        });
      })
    );

    return new Response(JSON.stringify({ message: 'Seed exécuté avec succès !' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données :', error);
    return new Response(JSON.stringify({ error: 'Erreur lors de l\'insertion des données' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
