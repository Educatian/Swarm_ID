module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const model = String(body.model || "gemini-2.5-flash").trim() || "gemini-2.5-flash";
    const prompt = String(body.prompt || "").trim();
    const systemInstruction = String(body.systemInstruction || "").trim();
    const responseMimeType = String(body.responseMimeType || "text/plain").trim() || "text/plain";
    const temperature = Number(body.temperature ?? 0.7);

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          ...(systemInstruction
            ? {
                system_instruction: {
                  parts: [{ text: systemInstruction }],
                },
              }
            : {}),
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature,
            responseMimeType,
          },
        }),
      }
    );

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      return res.status(response.status).json({ error: detail || "Gemini request failed." });
    }

    const payload = await response.json();
    const text = (payload?.candidates || [])
      .flatMap((candidate) => candidate?.content?.parts || [])
      .map((part) => String(part?.text || "").trim())
      .filter(Boolean)
      .join("\n")
      .trim();

    return res.status(200).json({ text, payload });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Gemini proxy failed." });
  }
};
