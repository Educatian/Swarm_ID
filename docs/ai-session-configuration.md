# AI session configuration

The Pages Worker and Vercel API verify the signed-in Supabase user before processing AI requests. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in the server runtime environment, matching the project used by `supabase-config.js`. Use the public/anon key, never a service-role key. Keep the existing provider key server-side.

Configure these settings before deploying this change. Missing runtime settings return 503; absent or invalid bearer sessions return 401. Local preview and the tutorial remain available without an AI request.
