# Cat Pics API for GitHub Pages

This repo is a **static cat image endpoint** for GitHub Pages.

## How it works

- Put cat images in `pics/`.
- Deploy workflow runs `node scripts/generate-image-list.mjs`.
- Script updates:
  - `pics/index.json` (all available images)
  - `random/index.html` (single image-only page with OpenGraph tags)

So `https://<your-user>.github.io/<repo>/random/` can unfurl/embed on platforms like Discord **without redirecting**.
This repo is a **static random cat image endpoint** for GitHub Pages.

## How it works

- `https://<your-user>.github.io/<repo>/random/` loads a tiny page.
- The page reads `pics/index.json`.
- It picks a random filename and redirects directly to that image file in `pics/`.
- Final result is a raw image URL (good for direct viewing and many embeds).

## Add your own cat images

1. Put images in `pics/` (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`).
2. Commit + push your images to `main`.
3. GitHub Pages deploy will regenerate the random embed page automatically.

(Optional local preview)

```bash
node scripts/generate-image-list.mjs
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/random/`.

## Important limitation

Because GitHub Pages is static, true per-request randomness (different result each time the same URL is fetched by Discord bot) is not possible without a backend. This setup chooses a random image at deploy time and serves it directly in image-only HTML for embeds.
2. (Optional local preview) Regenerate the manifest:

   ```bash
   node scripts/generate-image-list.mjs
   ```

3. Commit + push your images.
4. Enable GitHub Pages for the repository.

> The GitHub Pages deploy workflow also runs the manifest generator automatically, so `pics/index.json` stays in sync during deploys to `main`.

## Endpoints

- `/` – quick usage page.
- `/random/` – random cat image redirect endpoint.
