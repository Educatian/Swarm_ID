// Explicit one-way sync for language-neutral UI only. Never copies app data or translations.
import fs from 'node:fs';
import path from 'node:path';
const target=process.argv.find(x=>x.startsWith('--target='))?.slice(9);
if(!target)throw new Error('Provide --target=<English repository>');
const source=process.cwd();const destination=path.resolve(target);
if(destination===source||!fs.existsSync(path.join(destination,'app.js')))throw new Error('Invalid target repository');
for(const file of ['ui-shared.css','ui-shared.js','scripts/verify-ui-parity.mjs','scripts/verify-contrast.mjs','scripts/verify-ui-motion.mjs']){
 const from=fs.readFileSync(path.join(source,file));
 if(process.argv.includes('--check')){
  if(!fs.existsSync(path.join(destination,file))||!from.equals(fs.readFileSync(path.join(destination,file))))throw new Error(`UI parity drift: ${file}`);
 }else fs.copyFileSync(path.join(source,file),path.join(destination,file));
}
console.log('Shared UI parity verified');
