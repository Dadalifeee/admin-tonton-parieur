import { db } from 'lib/db';
import { users, teams, matches } from 'lib/db';
import { eq, alias } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, res: NextResponse) {

  // Insertion des équipes de Ligue 1 (si ce n'est pas déjà fait)
  await db.insert(teams).values([
    {
      name: 'Stade Rennais',
      trigram: 'REN',
      logoUrl: 'https://example.com/logos/rennes.png',
      createdAt: new Date(),
    },
    {
      name: 'OGC Nice',
      trigram: 'NCE',
      logoUrl: 'https://example.com/logos/nice.png',
      createdAt: new Date(),
    },
    {
      name: 'FC Nantes',
      trigram: 'NAN',
      logoUrl: 'https://example.com/logos/nantes.png',
      createdAt: new Date(),
    },
    {
      name: 'RC Strasbourg',
      trigram: 'STR',
      logoUrl: 'https://example.com/logos/strasbourg.png',
      createdAt: new Date(),
    },
    {
      name: 'Montpellier HSC',
      trigram: 'MPL',
      logoUrl: 'https://example.com/logos/montpellier.png',
      createdAt: new Date(),
    },
  ]);

  // Récupérer les IDs des équipes pour les références
  const teamsData = await db.select().from(teams);

  const teamsMap = teamsData.reduce((map, team) => {
    map[team.trigram] = team.id;
    return map;
  }, {} as Record<string, number>);

  // Insertion des matchs du matchday 10
  await db.insert(matches).values([
    {
      teamHomeId: teamsMap['LIL'],
      teamAwayId: teamsMap['REN'],
      matchday: 10,
      matchDate: new Date('2024-10-16T20:00:00'),
      status: 'upcoming',
      oddsHomeTeam: '1.80',
      oddsAwayTeam: '2.20',
      oddsDraw: '3.00',
      createdAt: new Date(),
    },
    {
      teamHomeId: teamsMap['NCE'],
      teamAwayId: teamsMap['NAN'],
      matchday: 10,
      matchDate: new Date('2024-10-16T18:00:00'),
      status: 'upcoming',
      oddsHomeTeam: '1.95',
      oddsAwayTeam: '2.05',
      oddsDraw: '3.20',
      createdAt: new Date(),
    },
    {
      teamHomeId: teamsMap['STR'],
      teamAwayId: teamsMap['MPL'],
      matchday: 10,
      matchDate: new Date('2024-10-17T20:00:00'),
      status: 'upcoming',
      oddsHomeTeam: '2.00',
      oddsAwayTeam: '2.00',
      oddsDraw: '3.15',
      createdAt: new Date(),
    },
    // Ajoutez d'autres matchs si nécessaire
  ]);

  return NextResponse.json({
    message: 'Les données de seed ont été insérées avec succès !',
  });
}
