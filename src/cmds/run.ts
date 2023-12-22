import * as path from "https://deno.land/std@0.210.0/path/mod.ts";

import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { isDay } from "~/utils/day.ts";

const ARGS_TYPE = z.enum(['input', 'example']);
const ARGS_DAY = z.string().regex(/^\d{1,2}$/).transform((day) => day.padStart(2, '0'));
const ARGS_PART = z.enum(['1', '2']);

const ARGS_2 = z.tuple([ARGS_TYPE, ARGS_DAY]);
const ARGS_3 = z.tuple([ARGS_TYPE, ARGS_DAY, ARGS_PART]);

const ARGS = z
  .union([
    ARGS_3,
    ARGS_2,
  ])

  .transform(([type, day, part]) => ({
    type,
    day,
    part,
  }));

const args = ARGS.parse(Deno.args);

const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.join(__dirname, `../days/${args.day}`);

const dayPath = path.join(basePath, `solution.ts`);
const dayModule = await import(dayPath);
const dayClass = dayModule.Day;

const dataPath = path.join(basePath, `_${args.type}.txt`);
const data = await Deno.readTextFile(dataPath);

if (!isDay(dayClass)) {
  throw new Error(`Invalid day module: ${dayPath}`);
}

const runningWhat = args.part ? `part ${args.part}` : 'both parts';
console.log(`Running day ${args.day}, ${runningWhat} on ${args.type}...`);

new dayClass().execute(data, args.part);
