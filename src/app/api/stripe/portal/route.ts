import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { createCustomerPortalSession } from "@/lib/stripe";

// ─── POST /api/stripe/portal ──────────────────────────────────────────────────

export async function POST(_request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Authenticate user
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

    // 2. Fetch the stored Stripe customer ID
    const admin = createAdminClient();
    const { data: subscription, error: subError } = await admin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (subError || !subscription?.stripe_customer_id) {
      return NextResponse.json(
        { success: false, error: "No active subscription found" },
        { status: 404 },
      );
    }

    // 3. Build return URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const returnUrl = `${appUrl}/dashboard/settings`;

    // 4. Create billing portal session
    const portalUrl = await createCustomerPortalSession(
      subscription.stripe_customer_id as string,
      returnUrl,
    );

    return NextResponse.json({ success: true, url: portalUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
