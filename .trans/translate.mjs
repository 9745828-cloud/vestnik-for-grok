const KEY = process.env.LOVABLE_API_KEY;
const MODEL = "google/gemini-2.5-flash";

export async function chat(system, user) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (res.status === 429 || res.status >= 500) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    const j = await res.json();
    return j.choices[0].message.content;
  }
  throw new Error("rate limited repeatedly");
}
