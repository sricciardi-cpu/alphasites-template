import Link from "next/link";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import tenant from "@/tenant.config.json";

const enlaces = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/stock", label: "Stock" },
  { href: "/mystery-futbox", label: "Mystery Rugbox" },
  { href: "/griptec-spray", label: "Griptec Spray" },
  { href: "/guia-de-talles", label: "Guía de Talles" },
  { href: "/contacto", label: "Contacto" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-16">
      <div className="max-w-5xl mx-auto px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-left">

          {/* Left column: brand */}
          <div className="flex flex-col gap-3 items-start">
            <div className="flex items-center gap-2 mb-1">
              <img src={tenant.logo} alt={tenant.nombre} className="h-6 w-auto" />
              <span className="text-sm font-semibold uppercase tracking-widest text-gray-400">
                {tenant.nombre}
              </span>
            </div>
            <a
              href={tenant.ubicacion_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-gray-400 hover:text-orange-400 transition-colors"
            >
              {tenant.ubicacion}
            </a>
            <p className="text-sm text-gray-400">{tenant.footer.envios_texto}</p>
            <p className="text-sm text-gray-400">{tenant.footer.metodos_pago_texto}</p>
          </div>

          {/* Middle column: links */}
          <div className="flex flex-col gap-3 items-start md:items-center">
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-1">
              Enlaces
            </p>
            {enlaces.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="inline-block text-sm text-gray-400 hover:text-orange-400 transition-colors"
              >
                {e.label}
              </Link>
            ))}
          </div>

          {/* Right column: social */}
          <div className="flex flex-col gap-3 items-start md:items-end">
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-1">
              Seguinos
            </p>
            <a
              href={tenant.contacto.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
            >
              <span className="w-5 flex justify-center shrink-0"><FaInstagram className="text-xl" /></span>
              {tenant.contacto.instagram_handle}
            </a>
            <a
              href={tenant.contacto.tiktok_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
            >
              <span className="w-5 flex justify-center shrink-0"><FaTiktok className="text-xl" /></span>
              {tenant.contacto.tiktok_handle}
            </a>
            <a
              href={`https://wa.me/${tenant.contacto.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
            >
              <span className="w-5 flex justify-center shrink-0"><FaWhatsapp className="text-xl" /></span>
              WhatsApp
            </a>
          </div>

        </div>

        {/* Orange divider + bottom bar */}
        <div className="border-t border-orange-500 mt-12 pt-6 flex flex-col items-center gap-1 text-center">
          <p className="text-sm text-gray-400">© {tenant.anio_fundacion} {tenant.nombre}</p>
          <a
            href="https://instagram.com/alphasitess"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-gray-600 hover:text-orange-400 transition-colors"
          >
            Sitio web desarrollado por AlphaSites
          </a>
        </div>

      </div>
    </footer>
  );
}
