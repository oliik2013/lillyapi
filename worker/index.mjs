import images from "./image-list.mjs";

const FALLBACK_IMAGE = "https://cataas.com/cat";

function pickRandomImage() {
  if (!Array.isArray(images) || images.length === 0) return null;
  return images[Math.floor(Math.random() * images.length)];
}

function imageHtml(imageUrl) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Random Cat" />
    <meta property="og:image" content="${imageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Random Cat" />
    <meta name="twitter:image" content="${imageUrl}" />
    <title>Random Cat</title>
    <style>
      html, body { margin: 0; background: #000; }
      img { width: 100vw; height: 100vh; object-fit: contain; display: block; }
    </style>
  </head>
  <body><img src="${imageUrl}" alt="Random cat" /></body>
</html>`;
}

async function serveAsset(env, request, fileName) {
  const cleanName = fileName.replace(/^\/+/, "");
  if (!cleanName || cleanName.includes("..")) {
    return new Response("Invalid file", { status: 400 });
  }

  const assetUrl = new URL(`/${cleanName}`, request.url);
  const response = await env.ASSETS.fetch(new Request(assetUrl.toString()));

  if (response.status === 404) {
    return Response.redirect(FALLBACK_IMAGE, 302);
  }

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
      "Cache-Control": "no-store"
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/" || url.pathname === "") {
      return new Response(
        JSON.stringify({
          endpoints: ["/random", "/raw", "/img/:name"],
          totalImages: images.length
        }),
        { headers: { "Content-Type": "application/json; charset=utf-8" } }
      );
    }

    if (url.pathname === "/raw") {
      const randomImage = pickRandomImage();
      if (!randomImage) return Response.redirect(FALLBACK_IMAGE, 302);
      return serveAsset(env, request, randomImage);
    }

    if (url.pathname === "/random" || url.pathname === "/random/") {
      const randomImage = pickRandomImage();
      const imageUrl = randomImage
        ? new URL(`/img/${encodeURIComponent(randomImage)}`, url.origin).toString()
        : FALLBACK_IMAGE;

      return new Response(imageHtml(imageUrl), {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    }

    if (url.pathname.startsWith("/img/")) {
      const fileName = decodeURIComponent(url.pathname.slice(5));
      return serveAsset(env, request, fileName);
    }

    return new Response("Not found", { status: 404 });
  }
};
