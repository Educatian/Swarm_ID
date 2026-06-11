/* Cloudflare Pages worker: serve static assets + proxy /api/gemini to the
   existing Vercel function (which holds GEMINI_API_KEY). Server-to-server,
   so no CORS and no key stored on the Pages side. */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/gemini" && request.method === "POST") {
      try {
        const upstream = await fetch("https://swarmid.vercel.app/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: await request.text(),
        });
        return new Response(upstream.body, {
          status: upstream.status,
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
          status: 502,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
    return env.ASSETS.fetch(request);
  },
};
