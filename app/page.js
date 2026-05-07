import Link from "next/link";
import { FaCheck, FaTimes, FaRocket, FaComments, FaStore, FaWhatsapp } from "react-icons/fa";

export const metadata = {
  title: "Alpha Sites — Tu tienda online, hecha con vos",
  description: "Creá tu tienda online personalizada con soporte humano, cero comisión y diseño exclusivo.",
};

function SeccionTitulo({ etiqueta, titulo, subtitulo }) {
  return (
    <div className="text-center mb-12 md:mb-16">
      {etiqueta && (
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FFD500] mb-3">
          {etiqueta}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">{titulo}</h2>
      {subtitulo && <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitulo}</p>}
    </div>
  );
}

const problemas = [
  {
    titulo: "Diseño idéntico al de todos",
    texto: "Tiendanube te da el mismo template que otras 100.000 tiendas. Tu marca queda invisible entre la multitud.",
  },
  {
    titulo: "Te cobran por cada venta",
    texto: "Comisiones del 2 al 10% en cada transacción. Si vendés bien, les das una parte. Siempre.",
  },
  {
    titulo: "Soporte por ticket y días de espera",
    texto: "Cuando tenés un problema urgente, mandás un ticket y esperás. Sin cara, sin nombre, sin urgencia.",
  },
];

const soluciones = [
  {
    titulo: "Tu diseño, tu identidad",
    texto: "Construimos una tienda 100% personalizada para tu marca. Colores, tipografía, fotos, voz. Todo tuyo.",
  },
  {
    titulo: "Cero comisión, siempre",
    texto: "Todo lo que vendés es tuyo. No importa si vendés $10.000 o $10.000.000: te quedás con el 100%.",
  },
  {
    titulo: "Un humano real del otro lado",
    texto: "Tenés acceso directo a nosotros por WhatsApp. Respondemos rápido, sin tickets, sin bots.",
  },
];

const pasos = [
  {
    numero: "01",
    icon: FaStore,
    titulo: "Registrate",
    texto: "Creá tu cuenta en 2 minutos. Solo necesitás tu mail y el nombre de tu negocio.",
  },
  {
    numero: "02",
    icon: FaComments,
    titulo: "Hablá con nuestra IA",
    texto: "Un chat inteligente te hace unas preguntas sobre tu marca, productos y estilo.",
  },
  {
    numero: "03",
    icon: FaRocket,
    titulo: "Tu tienda, live",
    texto: "Con tus respuestas armamos y lanzamos tu tienda. Vos solo tenés que cargar los productos.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* ── AlphaSites Platform Header ── */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-extrabold text-xl tracking-tight hover:text-[#FFE033] transition-colors"
          >
            <span className="text-[#FFD500]">⚡</span>
            Alpha Sites
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link href="/#como-funciona" className="text-gray-400 hover:text-white transition-colors">
              Cómo funciona
            </Link>
            <Link href="/#precios" className="text-gray-400 hover:text-white transition-colors">
              Precios
            </Link>
            <Link
              href="/alphasites/registro"
              className="bg-[#FFD500] text-black font-semibold px-4 py-2 rounded-full hover:bg-[#FFE033] transition-colors"
            >
              Empezá gratis
            </Link>
          </nav>

          {/* Mobile CTA */}
          <Link
            href="/alphasites/registro"
            className="sm:hidden bg-[#FFD500] text-black font-semibold px-4 py-2 rounded-full text-sm hover:bg-[#FFE033] transition-colors"
          >
            Empezá
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-black">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#FFD500]/10 blur-3xl rounded-full" />
          </div>

          <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-28 md:pt-32 md:pb-36 text-center">
            <span className="inline-block bg-[#FFD500]/10 border border-[#FFD500]/30 text-[#FFE033] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
              Alpha Sites · Plataforma para emprendedoras
            </span>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Tu tienda online,
              <br />
              <span className="text-[#FFD500]">hecha con vos</span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Diseño exclusivo, cero comisión y soporte humano real. No más templates genéricos ni
              comisiones que se comen tus ganancias.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/alphasites/registro"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFD500] text-black font-bold px-8 py-4 rounded-full text-lg hover:bg-[#FFE033] transition-colors active:scale-95 shadow-lg shadow-[#FFD500]/30"
              >
                Crear mi tienda gratis
              </Link>
              <a
                href="https://wa.me/5492216220145"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-zinc-700 text-white font-semibold px-8 py-4 rounded-full text-lg hover:border-[#FFD500] hover:text-[#FFE033] transition-colors"
              >
                <FaWhatsapp />
                Hablar con el equipo
              </a>
            </div>

            <p className="mt-6 text-sm text-gray-600">
              Setup en 48 hs · Sin costo de suscripción el primer mes
            </p>
          </div>
        </section>

        {/* ── PROBLEMA ── */}
        <section className="bg-zinc-950 py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <SeccionTitulo
              etiqueta="El problema"
              titulo="¿Por qué Tiendanube no alcanza?"
              subtitulo="Emprendés con ganas, pero la plataforma te pone límites que frenán tu crecimiento."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {problemas.map((p) => (
                <div
                  key={p.titulo}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-red-900/40 border border-red-800 flex items-center justify-center mb-4">
                    <FaTimes className="text-red-400 text-sm" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{p.titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{p.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOLUCIÓN ── */}
        <section className="bg-black py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <SeccionTitulo
              etiqueta="La solución"
              titulo="Alpha Sites es diferente"
              subtitulo="Construimos tu tienda como si fuera la nuestra. Porque queremos que te vaya bien."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {soluciones.map((s) => (
                <div
                  key={s.titulo}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 group hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-green-900/40 border border-green-700 flex items-center justify-center mb-4">
                    <FaCheck className="text-green-400 text-sm" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{s.titulo}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CÓMO FUNCIONA ── */}
        <section id="como-funciona" className="bg-zinc-950 py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <SeccionTitulo
              etiqueta="El proceso"
              titulo="3 pasos para tener tu tienda"
              subtitulo="Sin conocimientos técnicos, sin complicaciones. Solo contanos sobre tu marca."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-zinc-700" />

              {pasos.map((paso) => {
                const Icon = paso.icon;
                return (
                  <div key={paso.numero} className="flex flex-col items-center text-center relative">
                    <div className="w-20 h-20 rounded-2xl bg-[#FFD500] flex items-center justify-center mb-6 shadow-lg shadow-[#FFD500]/30 z-10">
                      <Icon className="text-black text-3xl" />
                    </div>
                    <span className="text-xs font-bold text-[#FFD500] tracking-widest mb-2">{paso.numero}</span>
                    <h3 className="font-bold text-white text-xl mb-3">{paso.titulo}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{paso.texto}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── PRECIOS ── */}
        <section id="precios" className="bg-black py-20 md:py-28">
          <div className="max-w-6xl mx-auto px-6">
            <SeccionTitulo
              etiqueta="Precios"
              titulo="Transparente desde el día uno"
              subtitulo="Sin sorpresas, sin letra chica, sin comisiones ocultas."
            />

            <div className="max-w-lg mx-auto">
              <div className="bg-zinc-900 border border-[#FFD500]/40 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD500]/10 blur-3xl rounded-full pointer-events-none" />

                <span className="inline-block bg-[#FFD500] text-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                  Plan Único
                </span>

                <div className="mb-8">
                  <p className="text-sm text-gray-400 mb-1">Setup (pago único)</p>
                  <p className="text-4xl font-extrabold text-white">
                    $80.000 <span className="text-2xl text-gray-500">– $120.000</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">ARS · según complejidad del proyecto</p>
                </div>

                <div className="mb-8">
                  <p className="text-sm text-gray-400 mb-1">Mantenimiento mensual</p>
                  <p className="text-4xl font-extrabold text-white">
                    $15.000 <span className="text-2xl text-gray-500">– $25.000</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">ARS/mes · hosting, soporte y actualizaciones incluidas</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    "Diseño 100% personalizado para tu marca",
                    "Cero comisión por venta, siempre",
                    "Integración con MercadoPago",
                    "Panel de admin para gestionar productos y pedidos",
                    "Soporte directo por WhatsApp",
                    "Dominio propio incluido el primer año",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                      <FaCheck className="text-[#FFD500] shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/alphasites/registro"
                  className="block w-full text-center bg-[#FFD500] text-black font-bold py-4 rounded-2xl text-lg hover:bg-[#FFE033] transition-colors active:scale-95"
                >
                  Empezar ahora
                </Link>

                <p className="text-center text-xs text-gray-600 mt-4">Sin costo el primer mes de mantenimiento</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="bg-zinc-950 py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              Tu marca merece una tienda
              <br />
              <span className="text-[#FFD500]">que la represente</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Registrate hoy. En 48 horas tu tienda está lista para vender.
            </p>
            <Link
              href="/alphasites/registro"
              className="inline-flex items-center gap-2 bg-[#FFD500] text-black font-bold px-10 py-5 rounded-full text-xl hover:bg-[#FFE033] transition-colors active:scale-95 shadow-xl shadow-[#FFD500]/30"
            >
              Crear mi tienda gratis →
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Alpha Sites · Desarrollado en La Plata, Argentina</p>
      </footer>
    </div>
  );
}
