import fs from "node:fs";
import path from "node:path";
import { runInNewContext } from "node:vm";

const root = process.cwd();
const locale = process.argv.includes("--locale=ko") ? "ko" : "en";
const output = path.resolve(root, `dist-${locale}`);
if (path.dirname(output) !== root || !["dist-en", "dist-ko"].includes(path.basename(output))) throw new Error("Unsafe output path.");
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const directory of ["assets", "developer", "guides", "tutorials"]) {
  fs.cpSync(path.join(root, directory), path.join(output, directory), { recursive: true });
}
for (const name of [
  "_headers", "_worker.js", "cloudflare-backend.js", "cloudflare-client.js", "favicon.svg",
  "manifest.webmanifest", "sw.js", "i18n.min.js", "app.min.js", "styles.min.css", "og-preview.png",
  "app.js", "i18n.js", "styles.css", "preview.html", "preview-demo.js",
  "cat100.html", "cat531.html", "cat531-guide.html", "cat531-tutorial.mp4",
]) fs.copyFileSync(path.join(root, name), path.join(output, name));

let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (locale === "en") html = html
  .replace('<html class="theme-light" lang="ko">', '<html class="theme-light" lang="en">')
  .replace("<title>디자인 텐션 스튜디오</title>", "<title>Design Tension Studio</title>")
  .replace("<head>", '<head>\n  <script>try{localStorage.setItem("swarm-id-locale-v1","en")}catch(_){}</script>');
fs.writeFileSync(path.join(output, "index.html"), html);
if (locale === "en") {
  // Translate first-paint HTML as well as runtime copy. Long phrases first
  // prevent shorter dictionary entries from partially replacing them.
  const scope = { window: {} };
  runInNewContext(fs.readFileSync(path.join(root, "i18n.js"), "utf8"), scope);
  const { ko, en } = scope.window.DTS_TRANSLATIONS;
  const pairs = Object.entries(ko).filter(([key, value]) => typeof value === "string" && value.length > 1 && en[key])
    .sort((a, b) => b[1].length - a[1].length);
  for (const page of ["index.html", "preview.html"]) {
    let source = fs.readFileSync(path.join(output, page), "utf8");
    for (const [key, value] of pairs) source = source.split(value).join(en[key]);
    if (page === "preview.html") source = source.replace('<html class="theme-light" lang="ko">', '<html class="theme-light" lang="en">')
      .replace("<head>", '<head>\n  <script>try{localStorage.setItem("swarm-id-locale-v1","en")}catch(_){}</script>');
    fs.writeFileSync(path.join(output, page), source);
  }
}
console.log(`${locale.toUpperCase()} deployment assembled at ${output}`);
