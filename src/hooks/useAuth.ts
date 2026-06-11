"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

// ─── Return Type ──────────────────────────────────────────────────────────────

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to auth state changes on mount
  useEffect(() => {
    const supabase = createClient();

    // Get the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ── signIn ─────────────────────────────────────────────────────────────
  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error: string | null }> => {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    },
    [],
  );

  // ── signUp ─────────────────────────────────────────────────────────────
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
    ): Promise<{ error: string | null }> => {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    },
    [],
  );

  // ── signOut ────────────────────────────────────────────────────────────
  const signOut = useCallback(async (): Promise<void> => {
    const supabase = createClient();
    await supabase.auth.signOut();
  }, []);

  // ── signInWithGoogle ───────────────────────────────────────────────────
  const signInWithGoogle = useCallback(
    async (): Promise<{ error: string | null }> => {
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    },
    [],
  );

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  };
}
