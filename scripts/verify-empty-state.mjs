import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const base = process.env.SMOKE_BASE || 'http://127.0.0.1:8137';
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`${base}/preview.html?view=visualizer`);
  await page.waitForFunction(() => typeof state !== 'undefined' && state.activeCaseId === 'ca');
  await page.evaluate(() => { window.savedEmptyStateCase = getActiveCourse().cases[0]; getActiveCourse().cases = []; state.activeCaseId = ''; });
  for (const locale of ['en', 'ko']) {
    await page.evaluate(locale => { state.locale = locale; applyStaticTranslations(); renderAll(); }, locale);
    const button = page.locator('#empty-case-tutorial');
    await button.waitFor({ state: 'visible' });
    assert.match(await page.locator('#network-empty-preview').innerText(), locale === 'en' ? /Your instructor hasn't published/ : /아직 케이스를 공개하지/);
    await button.click();
    await page.waitForFunction(() => tutorialState.active);
    await page.evaluate(() => endTutorial(false));
    await page.evaluate(() => setMapViewMode('list'));
    await button.waitFor({ state: 'visible' });
    await page.evaluate(() => setMapViewMode('map'));
  }
  await page.evaluate(() => { getActiveCourse().cases = [window.savedEmptyStateCase]; state.activeCaseId = window.savedEmptyStateCase.id; renderAll(); });
  await page.locator('#network-empty-preview').waitFor({ state: 'hidden' });
  console.log('PASS unpublished case state, bilingual tutorial, published-case recovery');
} finally { await browser.close(); }
