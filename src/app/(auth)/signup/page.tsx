"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const PASSWORD_REQS = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan") || "free";
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordStrength = PASSWORD_REQS.filter((r) => r.test(password)).length;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, plan },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  }

  async function handleGoogleSignup() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
    if (error) setError(error.message);
  }

  if (success) {
    return (
      <div className="relative glass rounded-2xl p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-7 h-7 text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
        <p className="text-white/50 mb-6">
          We sent a confirmation link to <strong className="text-white">{email}</strong>.
          Click it to activate your account.
        </p>
        <Link
          href="/login"
          className="inline-block bg-evolve-600 hover:bg-evolve-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-evolve-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-xl">App Evolution</span>
        </Link>
        <h1 className="text-2xl font-bold text-white">
          {plan !== "free" ? `Start ${plan} plan` : "Create your account"}
        </h1>
        <p className="text-white/50 mt-1">
          {plan === "free" ? "3 free analyses included" : `${plan.charAt(0).toUpperCase() + plan.slice(1)} plan selected`}
        </p>
      </div>

      <div className="glass rounded-2xl p-8 space-y-5">
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 text-sm font-medium text-white transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-xs text-white/30">or</span>
          <div className="flex-1 h-px bg-white/5" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/70">Full name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="John Doe"
              className="w-full bg-white/5 border border-white/10 focus:border-evolve-500/50 rounded-xl px-4 py-3 text-white placeholder:text-white/25 outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/70">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full bg-white/5 border border-white/10 focus:border-evolve-500/50 rounded-xl px-4 py-3 text-white placeholder:text-white/25 outline-none transition-all text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-white/70">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Create a strong password"
                className="w-full bg-white/5 border border-white/10 focus:border-evolve-500/50 rounded-xl px-4 py-3 pr-11 text-white placeholder:text-white/25 outline-none transition-all text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {password.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength >= level
                          ? level === 1 ? "bg-red-500" : level === 2 ? "bg-yellow-500" : "bg-green-500"
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                {PASSWORD_REQS.map((req) => (
                  <div
                    key={req.label}
                    className={`flex items-center gap-1.5 text-xs ${
                      req.test(password) ? "text-green-400" : "text-white/30"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {req.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-2.5 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || passwordStrength < 2}
            className="w-full bg-evolve-600 hover:bg-evolve-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create account
          </button>
        </form>

        <p className="text-center text-xs text-white/30">
          By signing up you agree to our{" "}
          <Link href="/terms" className="text-evolve-400 hover:underline">Terms</Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-evolve-400 hover:underline">Privacy Policy</Link>
        </p>

        <p className="text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link href="/login" className="text-evolve-400 hover:text-evolve-300 transition-colors font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-100 pointer-events-none" />
      <Suspense fallback={
        <div className="glass rounded-2xl p-10 w-full max-w-md text-center">
          <div className="w-8 h-8 rounded-full border-2 border-evolve-500 border-t-transparent animate-spin mx-auto" />
        </div>
      }>
        <SignupForm />
      </Suspense>
    </div>
  );
}
