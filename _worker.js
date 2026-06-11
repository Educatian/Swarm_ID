/* Cloudflare Pages worker: serve static assets + handle POST /api/gemini.
   The client speaks the legacy shape {systemInstruction, prompt,
   responseMimeType, temperature, model} and expects {text}. We translate it
   to an OpenRouter chat completion (OPENROUTER_API_KEY secret required).
   Bind the secret with:
     npx wrangler pages secret put OPENROUTER_API_KEY --project-name <project> */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/gemini" && request.method === "POST") {
      try {
        if (!env.OPENROUTER_API_KEY) {
          return json({ error: "OPENROUTER_API_KEY is not configured." }, 500);
        }
        return await callOpenRouter(await request.text(), env.OPENROUTER_API_KEY, url.origin);
      } catch (error) {
        return json({ error: String(error) }, 502);
      }
    }
    return env.ASSETS.fetch(request);
  },
};

function mapModel(requested) {
  const model = String(requested || "").trim();
  if (!model) return "google/gemini-2.5-flash";
  // Already an OpenRouter id (vendor/model) — pass through.
  if (model.includes("/")) return model;
  // Legacy Gemini ids from the client.
  if (model.startsWith("gemini")) return `google/${model}`;
  return model;
}

async function callOpenRouter(bodyText, apiKey, origin) {
  let body = {};
  try {
    body = JSON.parse(bodyText || "{}");
  } catch (_) {}
  const prompt = String(body.prompt || "").trim();
  const systemInstruction = String(body.systemInstruction || "").trim();
  const responseMimeType = String(body.responseMimeType || "text/plain").trim();
  const temperature = Number(body.temperature ?? 0.7);
  if (!prompt) {
    return json({ error: "Prompt is required." }, 400);
  }

  const messages = [];
  if (systemInstruction) messages.push({ role: "system", content: systemInstruction });
  messages.push({ role: "user", content: prompt });

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": origin,
      "X-Title": "Design Tension Studio",
    },
    body: JSON.stringify({
      model: mapModel(body.model),
      messages,
      temperature,
      ...(responseMimeType === "application/json"
        ? { response_format: { type: "json_object" } }
        : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return json({ error: detail || "OpenRouter request failed." }, response.status);
  }

  const payload = await response.json();
  const text = String(payload?.choices?.[0]?.message?.content || "").trim();
  if (!text) {
    return json({ error: "Model returned an empty response." }, 502);
  }
  return json({ text }, 200);
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
