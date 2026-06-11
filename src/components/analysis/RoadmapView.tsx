"use client";

import { useState } from "react";
import {
  Target,
  Flag,
  BarChart3,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Star,
  Layers,
  Cpu,
  Zap,
  Shield,
  ArrowUpRight,
} from "lucide-react";

import { cn, getPriorityColor, getImpactColor } from "@/lib/utils";
import { ProjectRoadmap, RoadmapMilestone, RoadmapItem } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ─── Props ────────────────────────────────────────────────────────────────────

interface RoadmapViewProps {
  roadmap: ProjectRoadmap;
}

// ─── Category Config ──────────────────────────────────────────────────────────

const categoryConfig: Record<
  string,
  { label: string; icon: React.ReactNode; class: string }
> = {
  feature: {
    label: "Feature",
    icon: <Layers className="h-3 w-3" />,
    class: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  },
  ai: {
    label: "AI",
    icon: <Cpu className="h-3 w-3" />,
    class: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
  performance: {
    label: "Performance",
    icon: <Zap className="h-3 w-3" />,
    class: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  security: {
    label: "Security",
    icon: <Shield className="h-3 w-3" />,
    class: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  monetization: {
    label: "Monetization",
    icon: <DollarSign className="h-3 w-3" />,
    class: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  },
  growth: {
    label: "Growth",
    icon: <TrendingUp className="h-3 w-3" />,
    class: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  },
};

// ─── Milestone Card ───────────────────────────────────────────────────────────

function MilestoneCard({
  milestone,
  index,
  isLast,
}: {
  milestone: RoadmapMilestone;
  index: number;
  isLast: boolean;
}) {
  const phaseColors = [
    "border-indigo-500/30 bg-indigo-500/5",
    "border-violet-500/30 bg-violet-500/5",
    "border-cyan-500/30 bg-cyan-500/5",
    "border-emerald-500/30 bg-emerald-500/5",
  ];
  const dotColors = ["bg-indigo-400", "bg-violet-400", "bg-cyan-400", "bg-emerald-400"];
  const textColors = ["text-indigo-400", "text-violet-400", "text-cyan-400", "text-emerald-400"];

  const colorIdx = index % phaseColors.length;

  return (
    <div className="relative flex-1 min-w-[200px]">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-full top-5 z-10 hidden h-px w-4 bg-white/10 md:block" />
      )}

      <div
        className={cn(
          "h-full rounded-2xl border p-5 transition-colors hover:border-opacity-60",
          phaseColors[colorIdx],
        )}
      >
        {/* Phase dot + label */}
        <div className="mb-3 flex items-center gap-2">
          <div className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0", dotColors[colorIdx])} />
          <span className={cn("text-[10px] font-bold uppercase tracking-widest", textColors[colorIdx])}>
            {milestone.phase}
          </span>
        </div>

        {/* Title & duration */}
        <h3 className="text-base font-semibold text-white leading-tight">{milestone.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-white/40">
          <Calendar className="h-3 w-3" />
          {milestone.duration}
        </div>

        {/* Goals */}
        {milestone.goals?.length > 0 && (
          <div className="mt-4">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/30">
              Goals
            </p>
            <ul className="space-y-1.5">
              {milestone.goals.map((goal, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-white/60">
                  <CheckCircle2 className={cn("mt-0.5 h-3 w-3 flex-shrink-0", textColors[colorIdx])} />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Features */}
        {milestone.features?.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/30">
              Features
            </p>
            <div className="flex flex-wrap gap-1">
              {milestone.features.map((feat, i) => (
                <span
                  key={i}
                  className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/50"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Success metrics */}
        {milestone.successMetrics?.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/30">
              Success Metrics
            </p>
            <ul className="space-y-1">
              {milestone.successMetrics.map((metric, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-white/50">
                  <Star className="mt-0.5 h-2.5 w-2.5 flex-shrink-0 text-amber-400/60" />
                  {metric}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Estimated cost */}
        {milestone.estimatedCost && (
          <div className="mt-4 border-t border-white/10 pt-3">
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <DollarSign className="h-3 w-3" />
              <span>{milestone.estimatedCost}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Roadmap Item Card ────────────────────────────────────────────────────────

function RoadmapItemCard({ item }: { item: RoadmapItem }) {
  const catConf = categoryConfig[item.category] ?? categoryConfig.feature;
  const priorityClass = getPriorityColor(item.priority);
  const impactClass = getImpactColor(item.expectedImpact as "high" | "medium" | "low");

  return (
    <div className="flex flex-col rounded-xl border border-white/10 bg-white/5 p-4 gap-3 hover:border-white/20 transition-colors">
      {/* Category + quarter */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            catConf.class,
          )}
        >
          {catConf.icon}
          {catConf.label}
        </span>
        <span className="text-[10px] font-mono text-white/30">{item.quarter}</span>
      </div>

      {/* Title & description */}
      <div>
        <h4 className="text-sm font-semibold text-white leading-tight">{item.title}</h4>
        <p className="mt-1 text-xs text-white/50 leading-relaxed">{item.description}</p>
      </div>

      {/* Priority + effort + impact */}
      <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize",
            priorityClass,
          )}
        >
          {item.priority}
        </span>
        <span className="text-[10px] text-white/30">
          Effort: <span className="text-white/50">{item.estimatedEffort}</span>
        </span>
        <span className={cn("text-[10px] font-semibold", impactClass)}>
          Impact: {item.expectedImpact}
        </span>
      </div>

      {/* Dependencies */}
      {item.dependencies?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.dependencies.map((dep, i) => (
            <span
              key={i}
              className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] text-white/30"
            >
              ↳ {dep}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KPICard({ kpi }: { kpi: { metric: string; target: string; timeline: string } }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
        {kpi.metric}
      </p>
      <p className="text-xl font-bold text-white leading-tight">{kpi.target}</p>
      <div className="flex items-center gap-1 text-xs text-white/40">
        <Calendar className="h-3 w-3" />
        {kpi.timeline}
      </div>
    </div>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────

function SectionHeading({
  icon,
  title,
  count,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
        {icon}
      </span>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {count !== undefined && (
        <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/40">
          {count}
        </span>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type CategoryFilter = RoadmapItem["category"] | "all";
type QuarterFilter = string;

export function RoadmapView({ roadmap }: RoadmapViewProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [quarterFilter, setQuarterFilter] = useState<QuarterFilter>("all");

  // Derive available filters from items
  const allCategories = Array.from(
    new Set(roadmap.items?.map((i) => i.category) ?? []),
  ) as RoadmapItem["category"][];
  const allQuarters = Array.from(
    new Set(roadmap.items?.map((i) => i.quarter) ?? []),
  ).sort();

  const filteredItems = (roadmap.items ?? []).filter((item) => {
    const catMatch = categoryFilter === "all" || item.category === categoryFilter;
    const qMatch = quarterFilter === "all" || item.quarter === quarterFilter;
    return catMatch && qMatch;
  });

  return (
    <div className="space-y-8">
      {/* ── Vision & Mission ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-400" />
              <CardTitle className="text-base">Vision</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/60 leading-relaxed">{roadmap.vision}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-violet-400" />
              <CardTitle className="text-base">Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/60 leading-relaxed">{roadmap.mission}</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Timeline ── */}
      {roadmap.milestones?.length > 0 && (
        <section>
          <SectionHeading
            icon={<Calendar className="h-4 w-4" />}
            title="Timeline"
            count={roadmap.milestones.length}
          />
          <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
            {roadmap.milestones.map((milestone, i) => (
              <MilestoneCard
                key={`${milestone.phase}-${i}`}
                milestone={milestone}
                index={i}
                isLast={i === roadmap.milestones.length - 1}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Roadmap Items ── */}
      {roadmap.items?.length > 0 && (
        <section>
          <SectionHeading
            icon={<Layers className="h-4 w-4" />}
            title="Roadmap Items"
            count={roadmap.items.length}
          />

          {/* Filters */}
          <div className="mb-4 flex flex-wrap gap-3">
            {/* Category filter */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-white/30 self-center mr-1">Category:</span>
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  categoryFilter === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70",
                )}
              >
                All
              </button>
              {allCategories.map((cat) => {
                const conf = categoryConfig[cat] ?? categoryConfig.feature;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      categoryFilter === cat
                        ? conf.class + " opacity-100"
                        : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70",
                    )}
                  >
                    {conf.icon}
                    {conf.label}
                  </button>
                );
              })}
            </div>

            {/* Quarter filter */}
            {allQuarters.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs text-white/30 self-center mr-1">Quarter:</span>
                <button
                  type="button"
                  onClick={() => setQuarterFilter("all")}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                    quarterFilter === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70",
                  )}
                >
                  All
                </button>
                {allQuarters.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuarterFilter(q)}
                    className={cn(
                      "rounded-full px-3 py-1 font-mono text-xs font-medium transition-colors",
                      quarterFilter === q
                        ? "bg-indigo-600 text-white"
                        : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70",
                    )}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Items grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <RoadmapItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-white/30">
              No items match the selected filters.
            </div>
          )}
        </section>
      )}

      {/* ── KPIs ── */}
      {roadmap.kpis?.length > 0 && (
        <section>
          <SectionHeading
            icon={<BarChart3 className="h-4 w-4" />}
            title="Key Performance Indicators"
            count={roadmap.kpis.length}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {roadmap.kpis.map((kpi, i) => (
              <KPICard key={`${kpi.metric}-${i}`} kpi={kpi} />
            ))}
          </div>
        </section>
      )}

      {/* ── Strategy Panels ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {roadmap.monetizationStrategy && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-400" />
                <CardTitle className="text-base">Monetization Strategy</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/60 leading-relaxed">{roadmap.monetizationStrategy}</p>
            </CardContent>
          </Card>
        )}

        {roadmap.growthStrategy && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-pink-400" />
                <CardTitle className="text-base">Growth Strategy</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/60 leading-relaxed">{roadmap.growthStrategy}</p>
            </CardContent>
          </Card>
        )}

        {roadmap.techDebtStrategy && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-amber-400" />
                <CardTitle className="text-base">Tech Debt Strategy</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/60 leading-relaxed">{roadmap.techDebtStrategy}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
