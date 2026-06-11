import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
  analyzeApplication,
  generateWireframes,
  generateCode,
  generateRoadmap,
} from "@/lib/ai/analyzer";
import type {
  AnalysisStatus,
  AnalysisDocument,
  WireframeSet,
  GeneratedCode,
  SubscriptionPlan,
} from "@/types";

// ─── Validation Schema ────────────────────────────────────────────────────────

const analyzeSchema = z
  .object({
    url: z.string().url("Must be a valid URL").optional(),
    description: z.string().min(10, "Description must be at least 10 characters").optional(),
    targetAudience: z.string().optional(),
    goals: z.array(z.string()).optional(),
    competitors: z.array(z.string()).optional(),
  })
  .refine((data) => data.url !== undefined || data.description !== undefined, {
    message: "Either url or description is required",
    path: ["url"],
  });

// ─── Analysis Limits by Plan ──────────────────────────────────────────────────

const PLAN_LIMITS: Record<SubscriptionPlan, number> = {
  free: 3,
  starter: 20,
  pro: 100,
  enterprise: -1, // unlimited
};

// ─── Helper: Update Analysis Status ──────────────────────────────────────────

async function updateAnalysisStatus(
  projectId: string,
  status: AnalysisStatus,
  phase: number,
  extra?: Record<string, unknown>,
): Promise<void> {
  const admin = createAdminClient();
  await admin
    .from("analyses")
    .update({
      status,
      current_phase: phase,
      updated_at: new Date().toISOString(),
      ...extra,
    })
    .eq("id", projectId);
}

// ─── Background Analysis Runner ───────────────────────────────────────────────

async function runAnalysisBackground(
  projectId: string,
  input: z.infer<typeof analyzeSchema>,
): Promise<void> {
  try {
    // Phase 1–2: Analyze the application
    await updateAnalysisStatus(projectId, "analyzing", 1);
    const document: AnalysisDocument = await analyzeApplication({
      url: input.url,
      description: input.description,
      targetAudience: input.targetAudience,
      goals: input.goals,
      competitors: input.competitors,
    });

    // Phase 2: Save document
    await updateAnalysisStatus(projectId, "generating_document", 2, {
      analysis_document: document,
    });

    // Phase 3–4: Generate wireframes
    await updateAnalysisStatus(projectId, "generating_wireframes", 3);
    const wireframes: WireframeSet = await generateWireframes(document);
    await updateAnalysisStatus(projectId, "generating_wireframes", 4, {
      wireframes,
    });

    // Phase 5–6: Generate code
    await updateAnalysisStatus(projectId, "generating_code", 5);
    const generatedCode: GeneratedCode = await generateCode(document, wireframes);
    await updateAnalysisStatus(projectId, "generating_code", 6, {
      generated_code: generatedCode,
    });

    // Phase 7: Generate roadmap
    await updateAnalysisStatus(projectId, "generating_roadmap", 7);
    const roadmap = await generateRoadmap(document, generatedCode);
    await updateAnalysisStatus(projectId, "completed", 7, {
      roadmap,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    const admin = createAdminClient();
    await admin
      .from("analyses")
      .update({
        status: "failed" as AnalysisStatus,
        error_message: message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);
  }
}

// ─── POST /api/analyze ────────────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parse and validate body
    const body: unknown = await request.json();
    const parsed = analyzeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }
    const input = parsed.data;

    // 2. Authenticate user
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

    // 3. Fetch user profile to check subscription limits
    const admin = createAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("plan, analyses_used, analyses_limit")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: "User profile not found" },
        { status: 404 },
      );
    }

    const plan = (profile.plan as SubscriptionPlan) ?? "free";
    const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
    const used: number = profile.analyses_used ?? 0;

    if (limit !== -1 && used >= limit) {
      return NextResponse.json(
        {
          success: false,
          error: `Analysis limit reached for your ${plan} plan (${used}/${limit}). Please upgrade to continue.`,
        },
        { status: 429 },
      );
    }

    // 4. Create analysis record with status "pending"
    const { data: analysis, error: insertError } = await admin
      .from("analyses")
      .insert({
        user_id: user.id,
        input_url: input.url ?? null,
        input_description: input.description ?? null,
        target_audience: input.targetAudience ?? null,
        goals: input.goals ?? null,
        status: "pending" as AnalysisStatus,
        current_phase: 0,
      })
      .select("id")
      .single();

    if (insertError || !analysis) {
      return NextResponse.json(
        { success: false, error: "Failed to create analysis record" },
        { status: 500 },
      );
    }

    // 5. Increment analyses_used count
    await admin
      .from("profiles")
      .update({ analyses_used: used + 1 })
      .eq("id", user.id);

    // 6. Start background process (non-blocking)
    void runAnalysisBackground(analysis.id as string, input);

    // 7. Return immediately
    return NextResponse.json(
      { success: true, projectId: analysis.id },
      { status: 202 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
