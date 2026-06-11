import Stripe from "stripe";
import type { PlanFeatures } from "@/types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const PLANS: Record<string, PlanFeatures> = {
  free: {
    name: "Free",
    price: 0,
    priceId: "",
    analysesPerMonth: 3,
    features: [
      "3 analyses per month",
      "Basic analysis document",
      "Text wireframes",
      "Community support",
    ],
  },
  starter: {
    name: "Starter",
    price: 49,
    priceId: process.env.STRIPE_PRICE_STARTER || "",
    analysesPerMonth: 20,
    features: [
      "20 analyses per month",
      "Full analysis document",
      "Detailed wireframes",
      "Code architecture",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    price: 149,
    priceId: process.env.STRIPE_PRICE_PRO || "",
    analysesPerMonth: 100,
    highlighted: true,
    features: [
      "100 analyses per month",
      "Full analysis document",
      "Production-ready code",
      "12-month roadmap",
      "Priority support",
      "Export to GitHub",
      "Team collaboration (5 seats)",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 499,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE || "",
    analysesPerMonth: -1, // unlimited
    features: [
      "Unlimited analyses",
      "Custom AI models",
      "White-label option",
      "SSO/SAML",
      "Dedicated support",
      "Custom integrations",
      "Unlimited team seats",
      "SLA guarantee",
    ],
  },
};

export async function createCheckoutSession(
  userId: string,
  email: string,
  plan: string,
  successUrl: string,
  cancelUrl: string,
): Promise<string> {
  const planConfig = PLANS[plan];
  if (!planConfig || !planConfig.priceId) {
    throw new Error("Invalid plan");
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId, plan },
    subscription_data: {
      metadata: { userId, plan },
    },
    allow_promotion_codes: true,
    billing_address_collection: "auto",
  });

  return session.url!;
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string,
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session.url;
}
