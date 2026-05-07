"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { FaArrowRight, FaSpinner } from "react-icons/fa";

const TIPOS_NEGOCIO = [
  { value: "", label: "Seleccioná tu rubro" },
  { value: "ropa", label: "Ropa y Indumentaria" },
  { value: "accesorios", label: "Accesorios y Bijou" },
  { value: "calzado", label: "Calzado" },
  { value: "comida", label: "Comida y Bebidas" },
  { value: "deco", label: "Decoración y Hogar" },
  { value: "otro", label: "Otro" },
];

const inputClass =
  "w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFD500] transition-colors text-sm";

const inputErrorClass =
  "w-full bg-zinc-900 border border-red-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-400 transition-colors text-sm";

function Campo({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

export default function RegistroPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    brand_name: "",
    business_type: "",
  });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: "" }));
  }

  function validar() {
    const e = {};
    if (!form.nombre.trim())       e.nombre        = "Ingresá tu nombre completo.";
    if (!form.email.includes("@")) e.email         = "Ingresá un email válido.";
    if (form.password.length < 8)  e.password      = "La contraseña debe tener al menos 8 caracteres.";
    if (!form.brand_name.trim())   e.brand_name    = "Ingresá el nombre de tu negocio.";
    if (!form.business_type)       e.business_type = "Seleccioná el rubro de tu negocio.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const e2 = validar();
    if (Object.keys(e2).length > 0) { setErrores(e2); return; }

    setCargando(true);
    setErrorServidor("");

    try {
      // 1. Create Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { nombre: form.nombre } },
      });

      if (authError) throw new Error(authError.message);

      const userId = authData.user?.id;
      if (!userId) throw new Error("No se pudo crear la cuenta. Intentá de nuevo.");

      // 2. Save extra fields to tenants table via API route (uses admin client)
      const res = await fetch("/api/alphasites/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id:       userId,
          brand_name:    form.brand_name,
          business_type: form.business_type,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Error al guardar los datos.");
      }

      // 3. Persist user_id so onboarding page can use it
      try { sessionStorage.setItem("alphasites_uid", userId); } catch {}

      router.push("/alphasites/onboarding");
    } catch (err) {
      setErrorServidor(err.message);
      setCargando(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white mb-2">Creá tu cuenta</h1>
          <p className="text-gray-400 text-sm">
            En 2 minutos tenés tu tienda en camino.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col gap-5"
        >
          <Campo label="Nombre completo" error={errores.nombre}>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="María García"
              autoComplete="name"
              className={errores.nombre ? inputErrorClass : inputClass}
            />
          </Campo>

          <Campo label="Email" error={errores.email}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="maria@ejemplo.com"
              autoComplete="email"
              className={errores.email ? inputErrorClass : inputClass}
            />
          </Campo>

          <Campo label="Contraseña" error={errores.password}>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              className={errores.password ? inputErrorClass : inputClass}
            />
          </Campo>

          <Campo label="Nombre de tu negocio" error={errores.brand_name}>
            <input
              type="text"
              name="brand_name"
              value={form.brand_name}
              onChange={handleChange}
              placeholder="Ej: Alma Indumentaria"
              className={errores.brand_name ? inputErrorClass : inputClass}
            />
          </Campo>

          <Campo label="Rubro" error={errores.business_type}>
            <select
              name="business_type"
              value={form.business_type}
              onChange={handleChange}
              className={`${errores.business_type ? inputErrorClass : inputClass} appearance-none cursor-pointer`}
            >
              {TIPOS_NEGOCIO.map((t) => (
                <option key={t.value} value={t.value} disabled={!t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Campo>

          {errorServidor && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
              {errorServidor}
            </div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="w-full flex items-center justify-center gap-2 bg-[#FFD500] text-black font-bold py-4 rounded-2xl text-base hover:bg-[#FFE033] transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 mt-1"
          >
            {cargando ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <>
                Continuar <FaArrowRight />
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-600">
            Al registrarte aceptás nuestros términos de uso.
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tenés cuenta?{" "}
          <Link href="/alphasites" className="text-[#FFE033] hover:text-[#FFE033] transition-colors">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
