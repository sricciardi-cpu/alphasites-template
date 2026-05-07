import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { user_id, brand_name, business_type } = await req.json();

    if (!user_id || !brand_name || !business_type) {
      return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
    }

    const { error } = await supabaseAdmin()
      .from("tenants")
      .insert({
        user_id,
        brand_name,
        business_type,
        status: "onboarding",
      });

    if (error) {
      console.error("[alphasites/register] Supabase error:", error.message);
      if (error.code === "23505") {
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[alphasites/register]", err);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
