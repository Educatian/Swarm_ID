import { createServer } from "node:http";
import { createReadStream, statSync, existsSync } from "node:fs";
import { createGzip } from "node:zlib";
import { extname, join, normalize } from "node:path";
const MIME = { ".html":"text/html", ".js":"application/javascript", ".css":"text/css",
  ".json":"application/json", ".png":"image/png", ".webp":"image/webp", ".woff2":"font/woff2",
  ".webmanifest":"application/manifest+json", ".svg":"image/svg+xml", ".mp4":"video/mp4", ".mp3":"audio/mpeg" };
const COMPRESS = new Set([".html",".js",".css",".json",".svg",".webmanifest"]);
createServer((req, res) => {
  const p = normalize(join(process.cwd(), decodeURIComponent(req.url.split("?")[0])));
  if (!p.startsWith(process.cwd()) || !existsSync(p) || statSync(p).isDirectory()) {
    res.writeHead(404); res.end("nf"); return;
  }
  const ext = extname(p);
  const head = { "content-type": MIME[ext] || "application/octet-stream" };
  if (COMPRESS.has(ext) && /gzip/.test(req.headers["accept-encoding"] || "")) {
    head["content-encoding"] = "gzip";
    res.writeHead(200, head);
    createReadStream(p).pipe(createGzip({ level: 9 })).pipe(res);
  } else {
    head["content-length"] = statSync(p).size;
    res.writeHead(200, head);
    createReadStream(p).pipe(res);
  }
}).listen(8138, () => console.log("gzip server on 8138"));
