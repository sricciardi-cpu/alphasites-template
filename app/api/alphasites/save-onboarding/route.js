import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const {
      user_id,
      brand_name,
      products_description,
      style,
      colors,
      instagram,
      whatsapp,
    } = await req.json();

    if (!user_id) {
      return NextResponse.json({ error: "user_id requerido." }, { status: 400 });
    }

    const { error } = await supabaseAdmin()
      .from("tenants")
      .update({
        brand_name,
        products_description,
        style,
        colors,
        instagram,
        whatsapp,
        status: "onboarding_complete",
      })
      .eq("user_id", user_id);

    if (error) {
      console.error("[alphasites/save-onboarding] Supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[alphasites/save-onboarding]", err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
