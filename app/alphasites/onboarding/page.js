"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaArrowRight, FaSpinner, FaStore } from "react-icons/fa";

const PREGUNTAS = [
  { key: "brand_name",           texto: "¿Cómo se llama tu marca?" },
  { key: "products_description", texto: "¿Qué vendés? Contame un poco de tus productos." },
  { key: "style",                texto: "¿Qué estilo tiene tu marca? Por ejemplo: minimal, bold, retro, elegante…" },
  { key: "colors",               texto: "¿Qué colores identifican tu marca? Podés decirme nombres o códigos hex." },
  { key: "instagram",            texto: "¿Cuál es tu Instagram?" },
  { key: "whatsapp",             texto: "¿Tu número de WhatsApp para que te contacten tus clientes?" },
];

const TOTAL = PREGUNTAS.length;

const BIENVENIDA =
  "¡Hola! 👋 Soy el asistente de Alpha Sites. Voy a hacerte unas preguntas rápidas para que podamos armar tu tienda perfecta. ¡Empecemos!\n\n" +
  PREGUNTAS[0].texto;

const ETIQUETAS = {
  brand_name:           "Nombre de la marca",
  products_description: "Productos",
  style:                "Estilo",
  colors:               "Colores",
  instagram:            "Instagram",
  whatsapp:             "WhatsApp",
};

function Burbuja({ role, content }) {
  const esBot = role === "assistant";
  return (
    <div className={`flex ${esBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
          esBot
            ? "bg-zinc-800 text-gray-100 rounded-tl-sm"
            : "bg-[#FFD500] text-black font-medium rounded-tr-sm"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();

  const [mensajes, setMensajes]         = useState([{ role: "assistant", content: BIENVENIDA }]);
  const [input, setInput]               = useState("");
  const [enviando, setEnviando]         = useState(false);
  const [respuestas, setRespuestas]     = useState([]);
  const [listo, setListo]               = useState(false);
  const [finalizando, setFinalizando]   = useState(false);
  const [errorFinal, setErrorFinal]     = useState("");

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, listo]);

  useEffect(() => {
    if (!enviando && !listo) inputRef.current?.focus();
  }, [enviando, listo]);

  async function getUserId() {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) return data.user.id;
    } catch {}
    try { return sessionStorage.getItem("alphasites_uid"); } catch {}
    return null;
  }

  const preguntaActual = respuestas.length;

  async function enviar() {
    const texto = input.trim();
    if (!texto || enviando || listo) return;

    const answerIndex    = preguntaActual;
    const preguntaInfo   = PREGUNTAS[answerIndex];
    const nuevosMensajes = [...mensajes, { role: "user", content: texto }];
    const nuevasRespuestas = [...respuestas, texto];

    setMensajes(nuevosMensajes);
    setRespuestas(nuevasRespuestas);
    setInput("");
    setEnviando(true);

    const esUltima      = nuevasRespuestas.length === TOTAL;
    const nextQuestion  = esUltima ? null : PREGUNTAS[nuevasRespuestas.length].texto;

    const userId = await getUserId();

    try {
      const res = await fetch("/api/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages:      nuevosMensajes,
          userAnswer:    texto,
          answerKey:     preguntaInfo.key,
          userId:        userId ?? "",
          nextQuestion,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error del servidor");

      setMensajes([...nuevosMensajes, { role: "assistant", content: data.content }]);
    } catch {
      // Fallback: show next question directly without AI acknowledgment
      const fallback = esUltima
        ? "¡Perfecto, eso es todo lo que necesito! 🎉 Revisá el resumen y generá tu tienda."
        : nextQuestion;
      setMensajes([...nuevosMensajes, { role: "assistant", content: fallback }]);
    } finally {
      setEnviando(false);
      if (esUltima) setListo(true);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  }

  function buildAnswers() {
    return PREGUNTAS.reduce((acc, p, i) => {
      acc[p.key] = respuestas[i] ?? "";
      return acc;
    }, {});
  }

  async function generarTienda() {
    setFinalizando(true);
    setErrorFinal("");

    const userId = await getUserId();

    try {
      const res = await fetch("/api/onboarding/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al guardar.");

      router.push("/alphasites/dashboard");
    } catch (err) {
      setErrorFinal(err.message);
      setFinalizando(false);
    }
  }

  const answers = buildAnswers();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col" style={{ minHeight: "calc(100vh - 80px)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
        <div className="w-10 h-10 bg-[#FFD500] rounded-xl flex items-center justify-center shrink-0">
          <FaStore className="text-black text-lg" />
        </div>
        <div>
          <p className="font-semibold text-white text-sm">Asistente Alpha Sites</p>
          <p className="text-xs text-gray-500">
            {listo ? "Listo ✓" : `Pregunta ${Math.min(preguntaActual + 1, TOTAL)} de ${TOTAL}`}
          </p>
        </div>
        <div className="ml-auto w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FFD500] rounded-full transition-all duration-500"
            style={{ width: `${(respuestas.length / TOTAL) * 100}%` }}
          />
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-4">
        {mensajes.map((m, i) => (
          <Burbuja key={i} role={m.role} content={m.content} />
        ))}

        {enviando && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <FaSpinner className="text-[#FFD500] animate-spin text-sm" />
              <span className="text-gray-400 text-sm">Escribiendo…</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Summary + finalize CTA */}
      {listo && (
        <div className="mt-6 border-t border-zinc-800 pt-6">
          <h2 className="text-lg font-bold text-white mb-4">Resumen de tu marca</h2>
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 flex flex-col gap-3 mb-5">
            {PREGUNTAS.map((p) => (
              <div key={p.key} className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-[#FFD500] uppercase tracking-wider">
                  {ETIQUETAS[p.key]}
                </span>
                <span className="text-white text-sm">{answers[p.key] || "—"}</span>
              </div>
            ))}
          </div>

          {errorFinal && (
            <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-xl px-4 py-3 mb-4">
              {errorFinal}
            </p>
          )}

          <button
            onClick={generarTienda}
            disabled={finalizando}
            className="w-full flex items-center justify-center gap-2 bg-[#FFD500] text-black font-bold py-4 rounded-2xl text-lg hover:bg-[#FFE033] transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {finalizando ? (
              <><FaSpinner className="animate-spin" /> Guardando…</>
            ) : (
              <><FaArrowRight /> Generar mi tienda</>
            )}
          </button>
        </div>
      )}

      {/* Input */}
      {!listo && (
        <div className="mt-4 flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={enviando}
            rows={1}
            placeholder="Escribí tu respuesta…"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFD500] transition-colors text-sm resize-none disabled:opacity-50"
            style={{ maxHeight: "120px", overflowY: "auto" }}
          />
          <button
            onClick={enviar}
            disabled={!input.trim() || enviando}
            className="shrink-0 w-12 h-12 bg-[#FFD500] rounded-2xl flex items-center justify-center hover:bg-[#FFE033] transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            <FaArrowRight className="text-black" />
          </button>
        </div>
      )}
    </div>
  );
}
