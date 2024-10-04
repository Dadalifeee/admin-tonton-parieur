import { db } from 'lib/db';
import { users, teams, matches } from 'lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, res: NextResponse) {
  try {

    // Insertion des équipes de Ligue 1
    const ligue1Teams = [
      { name: 'Paris Saint-Germain', trigram: 'PSG', logo_path: '/images/teams/psg.png' },
      { name: 'Olympique de Marseille', trigram: 'OM', logo_path: '/images/teams/om.png' },
      { name: 'Olympique Lyonnais', trigram: 'LYN', logo_path: '/images/teams/ol.png' },
      { name: 'AS Monaco', trigram: 'MON', logo_path: '/images/teams/monaco.png' },
      { name: 'Lille OSC', trigram: 'LIL', logo_path: '/images/teams/lille.png' },
      { name: 'Stade Rennais', trigram: 'REN', logo_path: '/images/teams/rennes.png' },
      { name: 'OGC Nice', trigram: 'NCE', logo_path: '/images/teams/nice.png' },
      { name: 'FC Nantes', trigram: 'NAN', logo_path: '/images/teams/nantes.png' },
      { name: 'RC Strasbourg', trigram: 'STR', logo_path: '/images/teams/strasbourg.png' },
      { name: 'Montpellier HSC', trigram: 'MPL', logo_path: '/images/teams/montpellier.png' },
      { name: 'Stade Brestois 29', trigram: 'BRE', logo_path: '/images/teams/brest.png' },
      { name: 'FC Lorient', trigram: 'LOR', logo_path: '/images/teams/lorient.png' },
      { name: 'Angers SCO', trigram: 'ANG', logo_path: '/images/teams/angers.png' },
      { name: 'Toulouse FC', trigram: 'TOU', logo_path: '/images/teams/toulouse.png' },
      { name: 'RC Lens', trigram: 'LEN', logo_path: '/images/teams/lens.png' },
      { name: 'Stade de Reims', trigram: 'REI', logo_path: '/images/teams/reims.png' },
      { name: 'AJ Auxerre', trigram: 'AUX', logo_path: '/images/teams/auxerre.png' },
    ];

    await db.insert(teams).values(ligue1Teams.map((team) => ({
      name: team.name,
      trigram: team.trigram,
      logo_path: team.logo_path,
      createdAt: new Date(),
    })));

    // Récupération des IDs des équipes
    const teamsData = await db.select().from(teams);
    const teamsMap = teamsData.reduce((map, team) => {
      map[team.trigram] = team.id;
      return map;
    }, {} as Record<string, number>);

    // Insertion des matchs pour un jour donné
    const matchday = 10;
    await db.insert(matches).values([
      {
        teamHomeId: teamsMap['PSG'],
        teamAwayId: teamsMap['OM'],
        matchday: matchday,
        matchDate: new Date('2024-10-20T21:00:00'),
        status: 'upcoming',
        oddsHomeTeam: '1.50',
        oddsAwayTeam: '2.75',
        oddsDraw: '3.25',
        createdAt: new Date(),
      },
      {
        teamHomeId: teamsMap['LYN'],
        teamAwayId: teamsMap['MON'],
        matchday: matchday,
        matchDate: new Date('2024-10-20T18:00:00'),
        status: 'upcoming',
        oddsHomeTeam: '2.10',
        oddsAwayTeam: '1.90',
        oddsDraw: '3.10',
        createdAt: new Date(),
      },
      {
        teamHomeId: teamsMap['LIL'],
        teamAwayId: teamsMap['REN'],
        matchday: matchday,
        matchDate: new Date('2024-10-21T20:00:00'),
        status: 'upcoming',
        oddsHomeTeam: '1.80',
        oddsAwayTeam: '2.20',
        oddsDraw: '3.00',
        createdAt: new Date(),
      },
      {
        teamHomeId: teamsMap['NCE'],
        teamAwayId: teamsMap['NAN'],
        matchday: matchday,
        matchDate: new Date('2024-10-21T18:00:00'),
        status: 'upcoming',
        oddsHomeTeam: '1.95',
        oddsAwayTeam: '2.05',
        oddsDraw: '3.20',
        createdAt: new Date(),
      },
      {
        teamHomeId: teamsMap['STR'],
        teamAwayId: teamsMap['MPL'],
        matchday: matchday,
        matchDate: new Date('2024-10-22T21:00:00'),
        status: 'upcoming',
        oddsHomeTeam: '2.00',
        oddsAwayTeam: '2.00',
        oddsDraw: '3.15',
        createdAt: new Date(),
      },
    ]);

    return new Response('Les équipes et matchs ont été créés avec succès.', { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la création des données :', error);
    return new Response('Erreur lors de la création des données.', { status: 500 });
  }
}
