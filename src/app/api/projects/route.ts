import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// ─── GET /api/projects ────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  try {
    // Authenticate user
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Fetch all projects for this user, newest first
    const admin = createAdminClient();
    const { data: projects, error } = await admin
      .from("analyses")
      .select(
        `
        id,
        user_id,
        input_url,
        input_description,
        target_audience,
        goals,
        status,
        current_phase,
        analysis_document,
        wireframes,
        generated_code,
        roadmap,
        error_message,
        created_at,
        updated_at
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch projects" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: projects ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
