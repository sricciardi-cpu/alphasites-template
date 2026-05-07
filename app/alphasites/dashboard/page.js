import Link from "next/link";
import { FaCheck, FaClock, FaWhatsapp } from "react-icons/fa";

export const metadata = {
  title: "Tu tienda está en camino — Alpha Sites",
};

export default function DashboardPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 bg-[#FFD500] rounded-full flex items-center justify-center mx-auto mb-8">
          <FaCheck className="text-black text-3xl" />
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-4">
          ¡Tu tienda está en camino!
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          Recibimos toda la información de tu marca. En las próximas{" "}
          <strong className="text-white">48 horas hábiles</strong> te contactamos por
          WhatsApp para mostrarte el primer avance.
        </p>

        {/* Steps */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 text-left flex flex-col gap-4">
          <Step numero={1} titulo="Información recibida ✓" descripcion="Usamos tus respuestas para diseñar tu tienda a medida." done />
          <Step numero={2} titulo="Diseño y desarrollo" descripcion="Nuestro equipo trabaja en tu tienda — 3 a 5 días hábiles." />
          <Step numero={3} titulo="Revisión y lanzamiento" descripcion="Te mostramos el resultado y publicamos cuando das el OK." />
        </div>

        {/* WhatsApp CTA */}
        <a
          href="https://wa.me/5492216220145?text=Hola%2C%20acabo%20de%20completar%20mi%20onboarding%20en%20Alpha%20Sites%20%F0%9F%9A%80"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#FFD500] text-black font-bold px-8 py-4 rounded-2xl hover:bg-[#FFE033] transition-colors text-lg"
        >
          <FaWhatsapp /> Escribinos por WhatsApp
        </a>

        <p className="mt-6 text-xs text-gray-600">
          ¿Tenés dudas?{" "}
          <Link href="/alphasites" className="text-[#FFE033] hover:text-[#FFE033] transition-colors">
            Volvé al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}

function Step({ numero, titulo, descripcion, done = false }) {
  return (
    <div className="flex gap-4 items-start">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
          done ? "bg-[#FFD500] text-black" : "bg-zinc-800 text-gray-500"
        }`}
      >
        {done ? <FaCheck /> : numero}
      </div>
      <div>
        <p className={`font-semibold text-sm ${done ? "text-white" : "text-gray-400"}`}>{titulo}</p>
        <p className="text-xs text-gray-600 mt-0.5">{descripcion}</p>
      </div>
    </div>
  );
}
