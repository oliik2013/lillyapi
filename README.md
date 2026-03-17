# Cat Pics API for GitHub Pages

This repo is a **static random cat image endpoint** for GitHub Pages.

## How it works

- `https://<your-user>.github.io/<repo>/random/` loads a tiny page.
- The page reads `pics/index.json`.
- It picks a random filename and redirects directly to that image file in `pics/`.
- Final result is a raw image URL (good for direct viewing and many embeds).

## Add your own cat images

1. Put images in `pics/` (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.avif`).
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
