import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `Sos el asistente de onboarding de Alpha Sites, una plataforma que ayuda a emprendedoras a crear su tienda online personalizada.

El usuario acaba de responder una pregunta sobre su marca. Tu tarea es:
1. Reconocer su respuesta de manera cálida y específica (1 oración breve).
2. Presentar la siguiente pregunta que se te va a indicar, de forma natural y amigable.

Reglas:
- Respondé siempre en español rioplatense (vos, te, etc.).
- Sé cálido, alentador y profesional. Breve: máximo 3 oraciones en total.
- No agregues preguntas adicionales ni comentarios largos.
- No uses asteriscos, markdown ni emojis en exceso (máximo 1 emoji por mensaje).`;

export async function POST(req) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY no configurada." }, { status: 503 });
  }

  try {
    const { messages, preguntaSiguiente } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Mensajes inválidos." }, { status: 400 });
    }

    // Inject the next question at the end of the system instructions
    const systemWithNextQ = `${SYSTEM_PROMPT}\n\nLa siguiente pregunta que debés hacer es exactamente: "${preguntaSiguiente}"`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key":         process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type":      "application/json",
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system:     systemWithNextQ,
        messages,
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.text();
      console.error("[alphasites/chat] Anthropic error:", err);
      return NextResponse.json({ error: "Error al contactar la IA." }, { status: 502 });
    }

    const data = await anthropicRes.json();
    const content = data?.content?.[0]?.text ?? "";

    return NextResponse.json({ content });
  } catch (err) {
    console.error("[alphasites/chat]", err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
