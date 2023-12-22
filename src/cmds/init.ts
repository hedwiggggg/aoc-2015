import * as dotenv from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import * as path from "https://deno.land/std@0.210.0/path/mod.ts";
import * as fs from "https://deno.land/std@0.210.0/fs/mod.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

await dotenv.load({ export: true });

const __filename = path.fromFileUrl(import.meta.url);
const __dirname = path.dirname(__filename);

const aocYear = Deno.env.get('AOC_YEAR');
const aocSession = Deno.env.get('AOC_SESSION');

if (!aocYear) {
  throw new Error('Missing AOC_YEAR env variable');
}

if (!aocSession) {
  throw new Error('Missing AOC_SESSION env variable');
}

const ARGS = z
  .tuple([
    z
      .string()
      .regex(/^\d{1,2}$/),
  ])
  .transform(([day]) => ({
    day,
    dayPadded: day.padStart(2, '0'),
  }));

const args = ARGS.parse(Deno.args);
const basePath = path.join(__dirname, `../days/${args.dayPadded}`);

await fs.exists(basePath) && Deno.exit(1);
await fs.ensureDir(basePath);

const skeletonPath = path.join(__dirname, `../skeleton/day.ts`);
const dayPath = path.join(basePath, `solution.ts`);

const inputPath = path.join(basePath, `_input.txt`);
const examplePath = path.join(basePath, `_example.txt`);

await fs.copy(skeletonPath, dayPath);
await fs.ensureFile(examplePath);

const inputUrl = `https://adventofcode.com/${aocYear}/day/${args.day}/input`;
const inputRes = await fetch(inputUrl, {
  headers: {
    cookie: `session=${aocSession}`,
  },
});

const inputTextRaw = await inputRes.text();
const inputText = inputTextRaw.trim();

await Deno.writeTextFile(inputPath, inputText);
