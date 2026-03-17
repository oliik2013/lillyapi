#!/usr/bin/env node
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();
const picsDir = path.join(repoRoot, "pics");
const jsonOutputPath = path.join(picsDir, "index.json");
const workerOutputPath = path.join(repoRoot, "worker", "image-list.mjs");
const outputPath = path.join(picsDir, "index.json");
const randomPagePath = path.join(repoRoot, "random", "index.html");

const exts = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif"]);

const entries = await readdir(picsDir, { withFileTypes: true });
const files = entries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => exts.has(path.extname(name).toLowerCase()))
  .sort((a, b) => a.localeCompare(b));

await writeFile(jsonOutputPath, `${JSON.stringify(files, null, 2)}\n`, "utf8");
await writeFile(workerOutputPath, `export default ${JSON.stringify(files, null, 2)};\n`, "utf8");

console.log(`Wrote ${files.length} image(s) to pics/index.json`);
console.log(`Wrote ${files.length} image(s) to worker/image-list.mjs`);
await writeFile(outputPath, `${JSON.stringify(files, null, 2)}\n`, "utf8");

const fallback = "https://cataas.com/cat";
const picked = files.length > 0
  ? `../pics/${files[Math.floor(Math.random() * files.length)].split("/").map(encodeURIComponent).join("/")}`
  : fallback;

const randomPage = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Random Cat</title>
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Random Cat" />
    <meta property="og:image" content="${picked}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Random Cat" />
    <meta name="twitter:image" content="${picked}" />
    <style>
      html, body { margin: 0; background: #000; }
      img { display: block; width: 100vw; height: 100vh; object-fit: contain; }
    </style>
  </head>
  <body><img src="${picked}" alt="Random cat" /></body>
</html>
`;

await writeFile(randomPagePath, randomPage, "utf8");
console.log(`Wrote ${files.length} image(s) to pics/index.json`);
console.log(`Wrote random embed page to random/index.html using: ${picked}`);
console.log(`Wrote ${files.length} image(s) to pics/index.json`);
