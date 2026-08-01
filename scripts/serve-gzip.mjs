/* Static server that gzips text assets, for measuring performance the way it
   will actually be served.

   This exists because measuring against `py -m http.server` produced a
   throttled LCP of 4,508ms and a conclusion that the app was too heavy. The
   same build over gzip measures 2,656ms. Cloudflare Pages serves brotli, which
   is better still. An uncompressed local server is not a staging environment;
   using one to judge weight overstates it by roughly 4x on this codebase.

   Usage:  node scripts/serve-gzip.mjs [port]      (default 8138)            */
import { createServer } from "node:http";
import { createReadStream, statSync, existsSync } from "node:fs";
import { createGzip } from "node:zlib";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.argv[2]) || 8138;
const MIME = {
  ".html": "text/html", ".js": "application/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".webp": "image/webp",
  ".woff2": "font/woff2", ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml", ".mp4": "video/mp4", ".mp3": "audio/mpeg", ".ico": "image/x-icon",
};
const COMPRESS = new Set([".html", ".js", ".css", ".json", ".svg", ".webmanifest"]);

createServer((req, res) => {
  const path = normalize(join(process.cwd(), decodeURIComponent(req.url.split("?")[0])));
  if (!path.startsWith(process.cwd()) || !existsSync(path) || statSync(path).isDirectory()) {
    res.writeHead(404); res.end("not found"); return;
  }
  const ext = extname(path);
  const headers = { "content-type": MIME[ext] || "application/octet-stream" };
  if (COMPRESS.has(ext) && /gzip/.test(req.headers["accept-encoding"] || "")) {
    headers["content-encoding"] = "gzip";
    res.writeHead(200, headers);
    createReadStream(path).pipe(createGzip({ level: 9 })).pipe(res);
  } else {
    headers["content-length"] = statSync(path).size;
    res.writeHead(200, headers);
    createReadStream(path).pipe(res);
  }
}).listen(PORT, () => console.log(`gzip static server on http://127.0.0.1:${PORT}`));
