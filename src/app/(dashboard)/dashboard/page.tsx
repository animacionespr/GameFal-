import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Zap,
  ArrowRight,
  FileText,
  Code2,
  Map,
} from "lucide-react";
import { formatRelativeTime, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { AnalysisProject } from "@/types";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: projects }, { data: profile }] = await Promise.all([
    supabase
      .from("analyses")
      .select("id, input_url, input_description, status, current_phase, created_at, updated_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("profiles")
      .select("full_name, plan, analyses_used, analyses_limit")
      .eq("id", user!.id)
      .single(),
  ]);

  const typedProjects = (projects || []) as unknown as AnalysisProject[];
  const completed = typedProjects.filter((p) => p.status === "completed").length;
  const inProgress = typedProjects.filter((p) =>
    !["completed", "failed", "pending"].includes(p.status),
  ).length;
  const failed = typedProjects.filter((p) => p.status === "failed").length;

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "there";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {displayName} 👋
          </h1>
          <p className="text-white/50 mt-1">
            {typedProjects.length === 0
              ? "Start your first analysis to see the magic happen."
              : `${completed} analyses completed, ${inProgress} in progress.`}
          </p>
        </div>
        <Link
          href="/analyze"
          className="flex items-center gap-2 bg-evolve-600 hover:bg-evolve-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Analysis
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Analyses",
            value: typedProjects.length,
            icon: FileText,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
          },
          {
            label: "Completed",
            value: completed,
            icon: CheckCircle2,
            color: "text-green-400",
            bg: "bg-green-400/10",
          },
          {
            label: "In Progress",
            value: inProgress,
            icon: Zap,
            color: "text-evolve-400",
            bg: "bg-evolve-400/10",
          },
          {
            label: "This Month",
            value: profile?.analyses_used || 0,
            icon: TrendingUp,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
            suffix: `/${profile?.analyses_limit === -1 ? "∞" : profile?.analyses_limit || 3}`,
          },
        ].map((stat) => (
          <div key={stat.label} className="glass rounded-xl p-5">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-white font-mono">
              {stat.value}
              {stat.suffix && (
                <span className="text-white/30 text-base font-normal">{stat.suffix}</span>
              )}
            </div>
            <div className="text-xs text-white/40 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {typedProjects.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-evolve-600/20 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-evolve-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">
            Your first analysis awaits
          </h3>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            Submit any app URL or description and watch AI analyze, design, and generate a superior version in minutes.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 bg-evolve-600 hover:bg-evolve-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Start your first analysis
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent projects</h2>
            <Link
              href="/projects"
              className="text-sm text-evolve-400 hover:text-evolve-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {typedProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="glass rounded-xl p-5 flex items-center gap-4 hover:bg-white/8 transition-colors group block"
              >
                {/* Status icon */}
                <div className="shrink-0">
                  {project.status === "completed" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : project.status === "failed" ? (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-evolve-400 border-t-transparent animate-spin" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {project.input?.url || project.input?.description?.slice(0, 60) || "Untitled analysis"}
                  </p>
                  <p className="text-white/40 text-sm">
                    {formatRelativeTime(project.createdAt)}
                  </p>
                </div>

                {/* Phase indicators */}
                {project.status === "completed" && (
                  <div className="hidden md:flex items-center gap-3 shrink-0">
                    {[
                      { icon: FileText, label: "Doc", done: true },
                      { icon: Code2, label: "Code", done: true },
                      { icon: Map, label: "Roadmap", done: true },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-1 text-xs text-green-400"
                      >
                        <item.icon className="w-3 h-3" />
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}

                {/* Status badge */}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${getStatusColor(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>

                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick tips */}
      {typedProjects.length > 0 && (
        <div className="mt-8 glass rounded-xl p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-evolve-400" />
            Pro tips for better results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                tip: "Add target audience context",
                desc: "AI generates more relevant UX improvements when it knows who the users are.",
              },
              {
                tip: "List known competitors",
                desc: "Including competitor URLs helps the AI identify differentiating opportunities.",
              },
              {
                tip: "Specify your goals",
                desc: "Tell the AI what you want to improve: conversion, retention, engagement, etc.",
              },
            ].map((item) => (
              <div key={item.tip} className="bg-white/3 rounded-lg p-4">
                <div className="text-sm font-medium text-white mb-1">{item.tip}</div>
                <div className="text-xs text-white/40 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
