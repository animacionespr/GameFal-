import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ─── GET /api/auth/callback ───────────────────────────────────────────────────
// Handles the OAuth / magic-link redirect from Supabase Auth.
// Supabase appends a `code` query parameter that must be exchanged for a session.

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");
  // `next` is an optional redirect target passed through the OAuth flow
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Ensure the redirect target is a relative path to prevent open-redirect attacks
      const redirectTo = next.startsWith("/") ? next : "/dashboard";
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }

    console.error("Auth callback error:", error.message);
  }

  // Code missing or exchange failed — redirect to error page
  return NextResponse.redirect(`${origin}/auth/error?reason=callback_failed`);
}
