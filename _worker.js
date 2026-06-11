/* Cloudflare Pages worker: serve static assets + handle POST /api/gemini.
   If a GEMINI_API_KEY secret is bound to the Pages project, call Google
   directly. Otherwise fall back to proxying the legacy Vercel function.
   Add the secret with:
     npx wrangler pages secret put GEMINI_API_KEY --project-name <project> */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/gemini" && request.method === "POST") {
      try {
        const bodyText = await request.text();
        if (env.GEMINI_API_KEY) {
          return await callGeminiDirect(bodyText, env.GEMINI_API_KEY);
        }
        const upstream = await fetch("https://swarmid.vercel.app/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: bodyText,
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

async function callGeminiDirect(bodyText, apiKey) {
  let body = {};
  try {
    body = JSON.parse(bodyText || "{}");
  } catch (_) {}
  const model = String(body.model || "gemini-2.5-flash").trim() || "gemini-2.5-flash";
  const prompt = String(body.prompt || "").trim();
  const systemInstruction = String(body.systemInstruction || "").trim();
  const responseMimeType = String(body.responseMimeType || "text/plain").trim() || "text/plain";
  const temperature = Number(body.temperature ?? 0.7);
  if (!prompt) {
    return json({ error: "Prompt is required." }, 400);
  }
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        ...(systemInstruction ? { system_instruction: { parts: [{ text: systemInstruction }] } } : {}),
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature, responseMimeType },
      }),
    }
  );
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return json({ error: detail || "Gemini request failed." }, response.status);
  }
  const payload = await response.json();
  const text = (payload?.candidates || [])
    .flatMap((candidate) => candidate?.content?.parts || [])
    .map((part) => part?.text || "")
    .join("")
    .trim();
  if (!text) {
    return json({ error: "Gemini returned an empty response." }, 502);
  }
  return json({ text }, 200);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
