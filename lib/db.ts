import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const db = drizzle(neon(process.env.POSTGRES_URL!));

export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived']);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  name: text('name').notNull(),
  status: statusEnum('status').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  availableAt: timestamp('available_at').notNull()
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
});

export const userStatistics = pgTable('user_statistics', {
  userId: integer('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  totalBets: integer('total_bets').default(0),
  totalWins: integer('total_wins').default(0),
  totalLosses: integer('total_losses').default(0),
  totalPoints: integer('total_points').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const bets = pgTable('bets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  matchId: integer('match_id').notNull().references(() => matches.id, { onDelete: 'cascade' }),
  predictedScoreHome: integer('predicted_score_home').notNull(),
  predictedScoreAway: integer('predicted_score_away').notNull(),
  betPoints: integer('bet_points').default(0),
  betResult: text('bet_result').default('pending'),
  odds: numeric('odds', { precision: 5, scale: 2 }),  
  potentialWin: numeric('potential_win', { precision: 10, scale: 2 }), 
  betDate: timestamp('bet_date').defaultNow(),
});

export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  teamHomeId: integer('team_home_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  teamAwayId: integer('team_away_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  scoreHome: integer('score_home'),  
  scoreAway: integer('score_away'),  
  matchday: integer('matchday').notNull(),
  matchDate: timestamp('match_date').notNull(),
  status: text('status').default('upcoming'),
  oddsHomeTeam: numeric('odds_home_team', { precision: 5, scale: 2 }),
  oddsAwayTeam: numeric('odds_away_team', { precision: 5, scale: 2 }),
  oddsDraw: numeric('odds_draw', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  trigram: text('trigram').notNull().unique(),
  logo_path: text('logo_path'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type SelectProduct = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products);

export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      products: await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalProducts: 0
    };
  }

  if (offset === null) {
    return { products: [], newOffset: null, totalProducts: 0 };
  }

  let totalProducts = await db.select({ count: count() }).from(products);
  let moreProducts = await db.select().from(products).limit(5).offset(offset);
  let newOffset = moreProducts.length >= 5 ? offset + 5 : null;

  return {
    products: moreProducts,
    newOffset,
    totalProducts: totalProducts[0].count
  };
}

export async function deleteProductById(id: number) {
  await db.delete(products).where(eq(products.id, id));
}



