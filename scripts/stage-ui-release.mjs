// Create a fresh, allowlisted KO release without touching the dirty source tree.
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const output=fs.mkdtempSync(path.join(root,'ui-release-ko-'));
const files=['index.html','preview.html','preview-demo.js','app.min.js','i18n.min.js','styles.min.css','ui-shared.css','ui-shared.js','cloudflare-client.js','cloudflare-backend.js','_worker.js','_headers','favicon.svg','manifest.webmanifest','sw.js','assets','developer','guides','tutorials','cat100.html','cat531.html','cat531-guide.html','cat531-tutorial.mp4'];
if(fs.existsSync('og-preview.png'))files.push('og-preview.png');
for(const file of files)fs.cpSync(path.join(root,file),path.join(output,file),{recursive:true});
console.log(output);
