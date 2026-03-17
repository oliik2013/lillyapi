#!/usr/bin/env node
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const picsDir = path.join(repoRoot, "pics");
const outputPath = path.join(picsDir, "index.json");

const exts = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);

const entries = await readdir(picsDir, { withFileTypes: true });
const files = entries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => exts.has(path.extname(name).toLowerCase()))
  .sort((a, b) => a.localeCompare(b));

await writeFile(outputPath, `${JSON.stringify(files, null, 2)}\n`, "utf8");
console.log(`Wrote ${files.length} image(s) to pics/index.json`);
