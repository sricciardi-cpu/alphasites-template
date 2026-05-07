import Link from "next/link";

export const metadata = {
  title: "Alpha Sites — Tu tienda online, hecha con vos",
  description: "Creá tu tienda online personalizada con soporte humano, cero comisión y diseño exclusivo.",
};

export default function AlphaSitesLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Platform header */}
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

      <main className="flex-1">{children}</main>

      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Alpha Sites · Desarrollado en La Plata, Argentina</p>
      </footer>
    </div>
  );
}
