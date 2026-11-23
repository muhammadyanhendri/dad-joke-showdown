import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One original dad joke about a dog and the morning paper: the fetch
// lesson keeps failing because the dog only ever returns the same old news.
const line =
  "I tried to teach my dog to fetch the newspaper, but he keeps bringing me the same old news.";

// The gate requires one line of 1-200 UTF-8 characters, not only whitespace.
// A single sentence: exactly one terminal period, no newline or carriage
// return, and the UTF-8 byte length must stay within the same 200 limit.
// Tightness is enforced too: no leading or trailing space, no doubled
// spaces, and the punchline must sit in the final clause (after the last
// comma), so every word earns its place and the turn lands at the end.
const byteLength = Buffer.byteLength(line, "utf8");
const lastComma = line.lastIndexOf(",");
if (
  line.length < 1 ||
  line.length > 200 ||
  byteLength > 200 ||
  line.includes("\n") ||
  line.includes("\r") ||
  line.trim().length === 0 ||
  line !== line.trim() ||
  line.includes("  ") ||
  lastComma === -1 ||
  !line.slice(lastComma + 1).includes("news") ||
  (line.match(/\./g) ?? []).length !== 1 ||
  !line.endsWith(".")
) {
  throw new Error(
    `line violates the entry gate: must be one tight sentence of 1-200 characters (got ${line.length} chars, ${byteLength} bytes)`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), line, "utf8");
