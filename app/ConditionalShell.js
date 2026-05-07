"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export function ConditionalShell({ children }) {
  const pathname = usePathname();
  const isAlphaSites = pathname?.startsWith("/alphasites");
  const isRoot = pathname === "/";

  if (isAlphaSites || isRoot) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
