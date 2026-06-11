"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, CreditCard, Shield, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PLANS } from "@/lib/stripe";
import { cn } from "@/lib/utils";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface Props {
  user: SupabaseUser | null;
  profile: Record<string, unknown> | null;
  subscription: Record<string, unknown> | null;
}

export default function SettingsClient({ user, profile, subscription }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"profile" | "billing" | "security">("profile");
  const [fullName, setFullName] = useState((profile?.full_name as string) || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  const currentPlan = (profile?.plan as string) || "free";
  const planConfig = PLANS[currentPlan];

  async function saveProfile() {
    setIsSaving(true);
    setSaveMsg(null);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", user!.id);

    if (error) {
      setSaveMsg({ type: "error", text: "Failed to save profile." });
    } else {
      setSaveMsg({ type: "success", text: "Profile saved!" });
      router.refresh();
    }
    setIsSaving(false);
    setTimeout(() => setSaveMsg(null), 3000);
  }

  async function handleUpgrade(plan: string) {
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const { url } = await response.json();
    if (url) window.location.href = url;
  }

  async function handleManageBilling() {
    setIsPortalLoading(true);
    const response = await fetch("/api/stripe/portal", { method: "POST" });
    const { url } = await response.json();
    if (url) window.location.href = url;
    setIsPortalLoading(false);
  }

  const TABS = [
    { id: "profile" as const, icon: User, label: "Profile" },
    { id: "billing" as const, icon: CreditCard, label: "Billing" },
    { id: "security" as const, icon: Shield, label: "Security" },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="flex border-b border-white/5 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-evolve-500 text-white"
                : "border-transparent text-white/40 hover:text-white/70",
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === "profile" && (
        <div className="glass rounded-xl p-6 space-y-5">
          <h2 className="font-semibold text-white">Personal information</h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm text-white/60">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 focus:border-evolve-500/50 rounded-xl px-4 py-3 text-white placeholder:text-white/25 outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-white/60">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-white/40 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-white/30">Email cannot be changed</p>
            </div>
          </div>

          {saveMsg && (
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm",
                saveMsg.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20",
              )}
            >
              {saveMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {saveMsg.text}
            </div>
          )}

          <button
            onClick={saveProfile}
            disabled={isSaving}
            className="flex items-center gap-2 bg-evolve-600 hover:bg-evolve-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save changes
          </button>
        </div>
      )}

      {/* Billing tab */}
      {activeTab === "billing" && (
        <div className="space-y-4">
          {/* Current plan */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-white">Current plan</h2>
                <p className="text-white/50 text-sm mt-0.5">
                  {planConfig?.analysesPerMonth === -1
                    ? "Unlimited analyses"
                    : `${planConfig?.analysesPerMonth} analyses per month`}
                </p>
              </div>
              <span className={cn(
                "text-sm px-3 py-1 rounded-full font-medium capitalize",
                currentPlan === "pro" ? "bg-evolve-600/20 text-evolve-400" :
                currentPlan === "enterprise" ? "bg-purple-600/20 text-purple-400" :
                currentPlan === "starter" ? "bg-cyan-600/20 text-cyan-400" :
                "bg-white/5 text-white/40"
              )}>
                {currentPlan}
              </span>
            </div>

            {subscription && currentPlan !== "free" ? (
              <button
                onClick={handleManageBilling}
                disabled={isPortalLoading}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-xl text-sm transition-colors"
              >
                {isPortalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <CreditCard className="w-4 h-4" />
                Manage billing
              </button>
            ) : null}
          </div>

          {/* Upgrade options */}
          {currentPlan === "free" && (
            <div>
              <h3 className="text-sm font-medium text-white/60 mb-3">Upgrade your plan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {["starter", "pro", "enterprise"].map((planKey) => {
                  const plan = PLANS[planKey];
                  return (
                    <div
                      key={planKey}
                      className={cn(
                        "rounded-xl p-5 border",
                        planKey === "pro"
                          ? "border-evolve-500/30 bg-evolve-600/10"
                          : "border-white/10 bg-white/3"
                      )}
                    >
                      <div className="font-semibold text-white mb-1">{plan.name}</div>
                      <div className="text-2xl font-bold text-white mb-3">
                        ${plan.price}
                        <span className="text-sm font-normal text-white/40">/mo</span>
                      </div>
                      <ul className="space-y-1.5 mb-4">
                        {plan.features.slice(0, 3).map((f) => (
                          <li key={f} className="flex items-center gap-1.5 text-xs text-white/60">
                            <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => handleUpgrade(planKey)}
                        className={cn(
                          "w-full py-2 rounded-lg text-xs font-medium transition-colors",
                          planKey === "pro"
                            ? "bg-evolve-600 hover:bg-evolve-500 text-white"
                            : "bg-white/5 hover:bg-white/10 text-white"
                        )}
                      >
                        Upgrade to {plan.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security tab */}
      {activeTab === "security" && (
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-white">Security settings</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/3 rounded-xl">
              <div>
                <p className="text-sm font-medium text-white">Password</p>
                <p className="text-xs text-white/40">Change your account password</p>
              </div>
              <button className="text-sm text-evolve-400 hover:text-evolve-300 transition-colors">
                Update
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/3 rounded-xl">
              <div>
                <p className="text-sm font-medium text-white">Two-factor authentication</p>
                <p className="text-xs text-white/40">Add an extra layer of security</p>
              </div>
              <button className="text-sm text-evolve-400 hover:text-evolve-300 transition-colors">
                Enable
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/3 rounded-xl">
              <div>
                <p className="text-sm font-medium text-red-400">Delete account</p>
                <p className="text-xs text-white/40">Permanently delete your account and all data</p>
              </div>
              <button className="text-sm text-red-400 hover:text-red-300 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
