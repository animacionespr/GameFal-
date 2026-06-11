import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import type { SubscriptionPlan } from "@/types";

// ─── Stripe webhook must receive the raw body (not parsed JSON) ───────────────

export const dynamic = "force-dynamic";

// ─── Plan mapping: Stripe price ID → internal plan name ──────────────────────

function resolvePlanFromPriceId(priceId: string): SubscriptionPlan {
  const map: Record<string, SubscriptionPlan> = {
    [process.env.STRIPE_PRICE_STARTER ?? ""]: "starter",
    [process.env.STRIPE_PRICE_PRO ?? ""]: "pro",
    [process.env.STRIPE_PRICE_ENTERPRISE ?? ""]: "enterprise",
  };
  return map[priceId] ?? "free";
}

// ─── Handlers for individual event types ─────────────────────────────────────

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const userId = session.metadata?.userId;
  if (!userId) return;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  const plan = (session.metadata?.plan as SubscriptionPlan | undefined) ?? "free";

  // Determine analyses limit from plan
  const limitsMap: Record<SubscriptionPlan, number> = {
    free: 3,
    starter: 20,
    pro: 100,
    enterprise: -1,
  };

  const admin = createAdminClient();

  // Upsert subscription record
  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscriptionId ?? null,
      stripe_customer_id:
        typeof session.customer === "string" ? session.customer : session.customer?.id ?? null,
      plan,
      status: "active",
      current_period_start: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  // Update profile with new plan and reset limit
  await admin
    .from("profiles")
    .update({
      plan,
      analyses_limit: limitsMap[plan],
      analyses_used: 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
): Promise<void> {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  const priceId = subscription.items.data[0]?.price?.id ?? "";
  const plan = resolvePlanFromPriceId(priceId);

  const limitsMap: Record<SubscriptionPlan, number> = {
    free: 3,
    starter: 20,
    pro: 100,
    enterprise: -1,
  };

  const admin = createAdminClient();

  await admin.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      plan,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  await admin
    .from("profiles")
    .update({
      plan,
      analyses_limit: limitsMap[plan],
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
): Promise<void> {
  const userId = subscription.metadata?.userId;
  if (!userId) return;

  const admin = createAdminClient();

  await admin
    .from("subscriptions")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  await admin
    .from("profiles")
    .update({
      plan: "free" as SubscriptionPlan,
      analyses_limit: 3,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);
}

// ─── POST /api/stripe/webhook ─────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // Read raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signature verification failed";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  // Handle supported event types
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        // Unhandled event types are silently ignored — return 200 so Stripe doesn't retry
        break;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Handler error";
    console.error(`Error handling Stripe event ${event.type}:`, message);
    // Return 500 so Stripe will retry the event
    return NextResponse.json({ error: "Event handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
