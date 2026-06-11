"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Plus,
  FolderOpen,
  Settings,
  Sparkles,
  LogOut,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

interface Profile {
  full_name?: string;
  plan?: string;
  analyses_used?: number;
  analyses_limit?: number;
}

interface Props {
  user: User;
  profile: Profile | null;
}

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/analyze", icon: Plus, label: "New Analysis" },
  { href: "/projects", icon: FolderOpen, label: "Projects" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export default function DashboardNav({ user, profile }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const plan = profile?.plan || "free";
  const used = profile?.analyses_used || 0;
  const limit = profile?.analyses_limit || 3;
  const usagePercent = limit === -1 ? 0 : Math.min((used / limit) * 100, 100);
  const displayName = profile?.full_name || user.email?.split("@")[0] || "User";

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <aside className="w-64 shrink-0 border-r border-white/5 bg-white/2 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-evolve-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">App Evolution</span>
        </Link>
      </div>

      {/* New Analysis CTA */}
      <div className="p-3">
        <Link
          href="/analyze"
          className="flex items-center justify-between bg-evolve-600 hover:bg-evolve-500 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors group"
        >
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Analysis
          </span>
          <ChevronRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-evolve-600/20 text-evolve-400 border border-evolve-500/20"
                  : "text-white/50 hover:text-white hover:bg-white/5",
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Usage meter */}
      <div className="p-3 mx-3 mb-2 bg-white/3 rounded-xl border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/50">Monthly usage</span>
          <span className="text-xs text-white/70 font-mono">
            {used}/{limit === -1 ? "∞" : limit}
          </span>
        </div>
        {limit !== -1 && (
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                usagePercent > 80 ? "bg-red-500" : "bg-evolve-500",
              )}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
        )}
        <div className="mt-2.5 flex items-center justify-between">
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium capitalize",
            plan === "pro" ? "bg-evolve-600/20 text-evolve-400" :
            plan === "enterprise" ? "bg-purple-600/20 text-purple-400" :
            plan === "starter" ? "bg-cyan-600/20 text-cyan-400" :
            "bg-white/5 text-white/40"
          )}>
            {plan}
          </span>
          {plan === "free" && (
            <Link
              href="/settings?tab=billing"
              className="text-xs text-evolve-400 hover:text-evolve-300 flex items-center gap-1 transition-colors"
            >
              <CreditCard className="w-3 h-3" />
              Upgrade
            </Link>
          )}
        </div>
      </div>

      {/* User */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-evolve-600/30 flex items-center justify-center text-xs font-bold text-evolve-300 shrink-0">
            {getInitials(displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-xs text-white/30 truncate">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 rounded-md text-white/30 hover:text-white hover:bg-white/5 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
