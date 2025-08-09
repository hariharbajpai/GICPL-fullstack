import { z } from "zod";

export const PlayerCreateSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(8),         // E.164 recommended, e.g. +91...
  jerseyNumber: z.number().int().min(0).max(999).optional(),

  // batting
  batting: z.object({
    matches: z.number().int().min(0).default(0),
    runs: z.number().int().min(0).default(0),
    balls: z.number().int().min(0).default(0),
    highest: z.number().int().min(0).default(0),
    fifties: z.number().int().min(0).default(0),
    hundreds: z.number().int().min(0).default(0),
    average: z.number().min(0).default(0),      // derived-friendly field
    strikeRate: z.number().min(0).default(0),
  }).default({}),

  // bowling
  bowling: z.object({
    matches: z.number().int().min(0).default(0),
    balls: z.number().int().min(0).default(0),
    runsConceded: z.number().int().min(0).default(0),
    wickets: z.number().int().min(0).default(0),
    best: z.string().default("0/0"),            // e.g. "5/12"
    average: z.number().min(0).default(0),
    economy: z.number().min(0).default(0),
    fiveFors: z.number().int().min(0).default(0),
  }).default({}),

  // fielding
  fielding: z.object({
    catches: z.number().int().min(0).default(0),
    stumpings: z.number().int().min(0).default(0),
    runouts: z.number().int().min(0).default(0),
  }).default({}),

  photoUrl: z.string().url().optional(),
  dob: z.string().optional(),
  batStyle: z.string().optional(), // e.g. RHB, LHB
  bowlStyle: z.string().optional() // e.g. Right-arm offbreak
});

export const PlayerUpdateSchema = PlayerCreateSchema.partial();
