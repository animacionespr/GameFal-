import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession, PLANS } from "@/lib/stripe";

// ─── Validation Schema ────────────────────────────────────────────────────────

const checkoutSchema = z.object({
  plan: z.enum(["starter", "pro", "enterprise"], {
    errorMap: () => ({ message: "Plan must be one of: starter, pro, enterprise" }),
  }),
});

// ─── POST /api/stripe/checkout ────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parse and validate request body
    const body: unknown = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 },
      );
    }
    const { plan } = parsed.data;

    // 2. Verify plan has a Stripe price ID configured
    const planConfig = PLANS[plan];
    if (!planConfig?.priceId) {
      return NextResponse.json(
        { success: false, error: `Plan "${plan}" is not configured with a Stripe price ID` },
        { status: 400 },
      );
    }

    // 3. Authenticate user
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

    // 4. Build absolute success/cancel URLs
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const successUrl = `${appUrl}/dashboard?checkout=success&plan=${plan}`;
    const cancelUrl = `${appUrl}/pricing?checkout=cancelled`;

    // 5. Create Stripe checkout session
    const sessionUrl = await createCheckoutSession(
      user.id,
      user.email ?? "",
      plan,
      successUrl,
      cancelUrl,
    );

    return NextResponse.json({ success: true, url: sessionUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
