// Synthetic responsive regression gate; no real accounts or course writes.
import {chromium} from 'playwright';
import fs from 'node:fs';
const base=process.env.UI_BASE||'http://127.0.0.1:8152';
const lang=process.env.UI_LANG||'ko';
const results=[];const errors=[];
const browser=await chromium.launch();const page=await browser.newPage({reducedMotion:'reduce'});
page.on('pageerror',e=>errors.push(e.message));
for(const role of ['user','admin']){
 await page.goto(`${base}/preview.html?lang=${lang}&role=${role}`,{waitUntil:'networkidle'});
 await page.waitForFunction(()=>typeof state!=='undefined'&&state.activeCourseId);
 for(const width of [360,390,768,1024,1440]){
  await page.setViewportSize({width,height:900});
  for(const density of ['simple','advanced'])for(const view of ['home','visualizer','perspectives','matrix','sandbox','report',...(role==='admin'?['manage']:[])]){
   await page.evaluate(({view,density})=>{state.density=density;setView(view);renderAll();},{view,density});
   await page.evaluate(()=>document.fonts.ready);
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const finding=await page.evaluate(()=>{
    const visible=e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[hidden],.is-hidden');
    const clipped=[...document.querySelectorAll('h1,h2,h3,h4,p,button,summary,label,legend')].filter(visible).filter(e=>!e.closest('svg')).filter(e=>{
     if(e.clientWidth<=0||e.scrollWidth<=e.clientWidth+3)return false;
     // Hidden absolute score tooltips contribute to scrollWidth. Measure actual
     // rendered text fragments so these do not masquerade as clipped prose.
     if(e.querySelector('.score-chip')){
      const box=e.getBoundingClientRect();const walk=document.createTreeWalker(e,NodeFilter.SHOW_TEXT);let out=false;
      while(walk.nextNode()){const r=document.createRange();r.selectNodeContents(walk.currentNode);for(const q of r.getClientRects())if(q.right>box.right+3||q.left<box.left-3)out=true;}
      return out;
     }
     return true;
    }).map(e=>({selector:e.id?'#'+e.id:e.tagName.toLowerCase()+'.'+[...e.classList].join('.'),text:e.innerText.slice(0,75),width:e.clientWidth,scroll:e.scrollWidth}));
    const overflow=document.documentElement.scrollWidth>innerWidth+2;
    const outside=overflow?[...document.querySelectorAll('body *')].filter(visible).filter(e=>!e.closest('svg')).filter(e=>e.getBoundingClientRect().right>innerWidth+2).slice(-12).map(e=>({class:e.className,id:e.id,right:e.getBoundingClientRect().right,text:(e.innerText||'').slice(0,35)})):[];
    return {overflow,clipped,...(overflow?{outside,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth}:{})};
   });
   results.push({role,width,density,view,...finding});
  }
 }
}
await page.setViewportSize({width:390,height:844});
await page.evaluate(()=>{state.density='simple';setView('visualizer');renderAll();});
const lens=page.locator('#stakeholder-pills button').first();
await lens.focus();
const tooltipCheck=await page.evaluate(()=>{
 const tip=document.getElementById('dts-ui-tooltip');const rect=tip.getBoundingClientRect();
 return !tip.hidden&&rect.left>=0&&rect.right<=innerWidth&&rect.top>=0&&rect.bottom<=innerHeight&&document.activeElement.getAttribute('aria-describedby')?.includes(tip.id);
});
if(!tooltipCheck)errors.push('Keyboard tooltip missing, inaccessible, or outside viewport');
await page.keyboard.press('Escape');
if(await page.locator('#dts-ui-tooltip').isVisible())errors.push('Escape did not dismiss tooltip');
await lens.hover();
if(!await page.locator('#dts-ui-tooltip').isVisible())errors.push('Hover tooltip missing');
if(process.env.UI_SCREENSHOT)await page.screenshot({path:process.env.UI_SCREENSHOT});
await page.goto(`${base}/preview.html?lang=${lang}&role=user`,{waitUntil:'networkidle'});
await page.waitForFunction(()=>typeof state!=='undefined'&&state.activeCourseId);
for(const [view,key] of [['visualizer','map'],['report','evidence'],['report','metrics']]) {
 await page.evaluate(view=>{setView(view);renderAll();},view);
 if(key==='metrics')await page.locator('.ux-rubric-details > summary').click();
 const help=page.locator(`details[data-context-help="${key}"]`).first();
 const summary=help.locator(':scope > summary');
 await summary.focus();await page.keyboard.press('Enter');
 if(!await help.evaluate(e=>e.open))errors.push(`${key}: keyboard did not open help`);
 const copy=await help.locator(':scope > p').innerText();
 if(!copy || (lang==='en'&&/[가-힣]/.test(copy)))errors.push(`${key}: help translation missing`);
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))errors.push(`${key}: expanded help overflows`);
 if(key==='map'&&process.env.UI_HELP_SCREENSHOT)await page.screenshot({path:process.env.UI_HELP_SCREENSHOT});
 await page.keyboard.press('Escape');
 if(await help.evaluate(e=>e.open))errors.push(`${key}: Escape did not close help`);
 await summary.click();
 if(!await help.evaluate(e=>e.open))errors.push(`${key}: click did not open help`);
}
await browser.close();
const summary={lang,states:results.length,errors,failures:results.filter(x=>x.overflow||x.clipped.length)};
if(process.env.UI_REPORT)fs.writeFileSync(process.env.UI_REPORT,JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
if(summary.failures.length||errors.length)process.exitCode=1;
