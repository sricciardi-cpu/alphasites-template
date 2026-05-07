import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ProgressBar from "@/components/ProgressBar";
import MetaPixel from "@/components/MetaPixel";
import { CartProvider } from "@/context/CartContext";
import { ConditionalShell } from "@/app/ConditionalShell";
import tenant from "@/tenant.config.json";

export const metadata = {
  title: tenant.seo.titulo,
  description: tenant.seo.descripcion,
  manifest: "/manifest.json",
  icons: {
    icon: tenant.logo,
    apple: tenant.logo,
  },
};

export const viewport = {
  themeColor: tenant.color_primario_hex,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-black text-white antialiased">
        <MetaPixel />
        <CartProvider>
          <ProgressBar />
          <ConditionalShell>{children}</ConditionalShell>
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
