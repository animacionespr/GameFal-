import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const responseCache = new Map<string, string>();

export async function POST(req: Request) {
  const { message } = (await req.json()) as { message: string };

  const cacheKey = message.toLowerCase().trim();
  if (responseCache.has(cacheKey)) {
    return Response.json({ reply: responseCache.get(cacheKey) });
  }

  const response = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 512,
    system: `You are the Sheikah Stone AI guide from The Legend of Zelda universe. You speak with mystical wisdom but are helpful and friendly. You only answer questions about The Legend of Zelda games, lore, characters, items, and timeline. If asked about something unrelated to Zelda, politely redirect to Zelda topics. Keep answers concise (2-4 paragraphs max). Use occasional Zelda references in your speech.`,
    messages: [{ role: "user", content: message }],
  });

  const reply =
    response.content[0].type === "text"
      ? response.content[0].text
      : "The Sheikah Stone cannot answer that right now.";

  responseCache.set(cacheKey, reply);

  return Response.json({ reply });
}
