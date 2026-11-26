import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
const source = await readFile(new URL('../_worker.js', import.meta.url), 'utf8');
const { default: worker } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const api = createRequire(import.meta.url)('../api/gemini.js');
const originalFetch = globalThis.fetch;
const saved = { ...process.env };
const env = { SUPABASE_URL: 'https://auth.example.test', SUPABASE_ANON_KEY: 'public-test-key', OPENROUTER_API_KEY: 'placeholder', GEMINI_API_KEY: 'placeholder' };
try {
  Object.assign(process.env, env);
  for (const target of ['worker', 'api']) {
    const call = async (authorization) => {
      if (target === 'worker') return worker.fetch(new Request('https://app.example.test/api/gemini', { method: 'POST', headers: authorization ? { Authorization: authorization } : {}, body: '{"prompt":"hello"}' }), env);
      const result = { statusCode: 200, status(code) { this.statusCode=code;return this; }, json(body) { this.body=body;return this; } };
      await api({ method: 'POST', headers: { authorization }, body: { prompt: 'hello' } }, result);
      return { status: result.statusCode };
    };
    let calls = 0;
    globalThis.fetch = async () => { calls++;return new Response('{}', { status: 401 }); };
    assert.equal((await call('')).status, 401);assert.equal(calls, 0);
    assert.equal((await call('Bearer test-token')).status, 401);assert.equal(calls, 1);
    calls=0;
    globalThis.fetch = async () => new Response(JSON.stringify(++calls === 1 ? { id: 'test-user' } : { choices: [{ message: { content: 'hello' } }], candidates: [{ content: { parts: [{ text: 'hello' }] } }] }));
    assert.equal((await call('Bearer test-token')).status, 200);assert.equal(calls, 2);
    console.log(`PASS ${target} requires a verified session`);
  }
} finally {
  globalThis.fetch=originalFetch;
  for (const key of Object.keys(env)) { if (saved[key] === undefined) delete process.env[key];else process.env[key]=saved[key]; }
}
