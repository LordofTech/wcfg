import { NextResponse } from "next/server";
import {
  parseConsultationBody,
  toConsultationLeadRecord,
} from "@/lib/consultation";
import { notifyLeadEmail } from "@/lib/email/notify-lead";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    console.error(
      "Consultation API: Supabase env vars are missing (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)."
    );
    return NextResponse.json(
      {
        success: false,
        error:
          "Consultation intake is temporarily unavailable. Please try again shortly.",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const parsed = parseConsultationBody(body);
  if ("error" in parsed) {
    return NextResponse.json(
      { success: false, error: parsed.error },
      { status: 400 }
    );
  }

  const record = toConsultationLeadRecord(parsed.data);

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("consultation_leads")
      .insert(record)
      .select("id")
      .single();

    if (error || !data?.id) {
      console.error("Consultation lead insert failed:", error?.message);
      return NextResponse.json(
        {
          success: false,
          error:
            "We could not save your request. Please try again in a moment.",
        },
        { status: 500 }
      );
    }

    // Email is best-effort: never fail the request if notification fails.
    await notifyLeadEmail(parsed.data, data.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Consultation API unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "We could not save your request. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
