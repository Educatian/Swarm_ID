import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

let checks = 0;
const check = (condition, label) => { assert.ok(condition, label); checks++; };
for (const slug of ['student-ko','student-en','instructor-ko','instructor-en','index']) {
  const file = path.resolve('guides', slug + '.html');
  const html = readFileSync(file,'utf8');
  check(html.includes('2026.09'), slug + ': version');
  check(!/<video|<audio|swarmid\.vercel/.test(html), slug + ': no obsolete media/host');
  for (const [,target] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:)/.test(target)) continue;
    if (target.startsWith('#')) check(html.includes(`id="${target.slice(1)}"`), slug + ': anchor ' + target);
    else check(existsSync(path.resolve(path.dirname(file),target.split(/[?#]/)[0])), slug + ': file ' + target);
  }
}
const source = readFileSync('app.js','utf8');
const code = source.slice(source.indexOf('function getTutorialSteps() {'),source.indexOf('function positionTutorialCard('));
for (const locale of ['ko','en']) for (const role of ['user','admin']) for (const hasCase of [true,false]) for (const restricted of [true,false]) {
  const context = {state:{locale,activeRole:role},window:{__DTS_PREVIEW__:true},hasActiveCase:()=>hasCase,isViewAllowed:v=>!restricted||v==='home'||v==='visualizer'};
  vm.createContext(context); vm.runInContext(code,context);
  const steps=vm.runInContext('getTutorialSteps()',context);
  check(steps.length>0, 'nonempty tour');
  check(steps.every(s=>s.title&&s.body&&s.selector&&s.view), 'complete steps');
  check(!restricted||steps.every(s=>s.view!=='report'&&s.view!=='manage'), 'restricted views excluded');
  if(role==='user'&&hasCase&&!restricted)check(steps.length===6,'six beginner steps');
}
console.log(`PASS ${checks} tutorial content/link/role checks`);
