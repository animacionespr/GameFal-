import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

interface RouteParams {
  params: { id: string };
}

// ─── GET /api/projects/[id] ───────────────────────────────────────────────────

export async function GET(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 },
      );
    }

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

    // Fetch project and validate ownership in one query
    const admin = createAdminClient();
    const { data: project, error } = await admin
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
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      // PostgREST returns PGRST116 when no rows found
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { success: false, error: "Project not found" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { success: false, error: "Failed to fetch project" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
