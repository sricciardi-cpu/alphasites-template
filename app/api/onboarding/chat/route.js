import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const SYSTEM_INSTRUCTION = `Sos el asistente de onboarding de Alpha Sites, una plataforma que ayuda a emprendedoras a crear su tienda online personalizada.

El usuario acaba de responder una pregunta sobre su marca. Tu tarea es:
1. Reconocer su respuesta de manera cálida y específica (1 oración breve).
2. Presentar la siguiente pregunta que se te va a indicar, de forma natural y amigable.

Reglas:
- Respondé siempre en español rioplatense (vos, te, etc.).
- Sé cálido, alentador y profesional. Breve: máximo 3 oraciones en total.
- No agregues preguntas adicionales ni comentarios largos.
- No uses asteriscos, markdown ni emojis en exceso (máximo 1 emoji por mensaje).
- Si nextQuestion es null, solo dá un cierre cálido de 1 oración sin hacer más preguntas.`;

export async function POST(req) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return NextResponse.json({ error: "GOOGLE_AI_API_KEY no configurada." }, { status: 503 });
  }

  try {
    const { messages, userAnswer, answerKey, userId, nextQuestion } = await req.json();

    if (!Array.isArray(messages) || !userAnswer || !answerKey || !userId) {
      return NextResponse.json({ error: "Parámetros inválidos." }, { status: 400 });
    }

    // 1. Progressive save: upsert this answer into onboarding_sessions
    const { error: dbError } = await supabaseAdmin()
      .from("onboarding_sessions")
      .upsert(
        { user_id: userId, [answerKey]: userAnswer },
        { onConflict: "user_id" }
      );

    if (dbError) {
      console.error("[onboarding/chat] DB upsert error:", dbError.message);
      // Don't block the response — DB error is logged but we still call Gemini
    }

    // 2. Build Gemini history from our messages array
    // Our format: { role: "user"|"assistant", content: string }
    // Gemini format: { role: "user"|"model", parts: [{ text }] }
    const history = messages
      .filter((m) => m.role === "assistant" || m.role === "user")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // 3. Build the full instruction including what to ask next
    const systemWithNext = nextQuestion
      ? `${SYSTEM_INSTRUCTION}\n\nLa siguiente pregunta que debés hacer es exactamente: "${nextQuestion}"`
      : `${SYSTEM_INSTRUCTION}\n\nnextQuestion es null — solo dá un cierre cálido.`;

    // 4. Call Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemWithNext,
    });

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userAnswer);
    const content = result.response.text();

    return NextResponse.json({ content });
  } catch (err) {
    console.error("[onboarding/chat]", err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
