"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Target,
  DollarSign,
  Layers,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Shield,
  Star,
  ArrowUpRight,
} from "lucide-react";

import { cn, getSeverityColor, getImpactColor, getPriorityColor } from "@/lib/utils";
import { AnalysisDocument, AppFeature, UXIssue, Opportunity } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// ─── Props ────────────────────────────────────────────────────────────────────

interface AnalysisDocumentViewProps {
  document: AnalysisDocument;
}

// ─── Score Badge ──────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "from-emerald-500 to-green-400 shadow-emerald-500/30"
      : score >= 50
        ? "from-amber-500 to-yellow-400 shadow-amber-500/30"
        : "from-red-500 to-rose-400 shadow-red-500/30";

  return (
    <div
      className={cn(
        "relative flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full",
        "bg-gradient-to-br shadow-lg",
        color,
      )}
    >
      <span className="text-2xl font-bold text-white tabular-nums">{score}</span>
      <span className="absolute bottom-3 text-[10px] font-semibold uppercase tracking-widest text-white/70">
        /100
      </span>
    </div>
  );
}

// ─── Complexity Pill ──────────────────────────────────────────────────────────

const complexityConfig: Record<string, { label: string; class: string }> = {
  low: { label: "Low", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  medium: { label: "Med", class: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  high: { label: "High", class: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const categoryConfig: Record<string, { label: string; class: string }> = {
  core: { label: "Core", class: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20" },
  secondary: { label: "Secondary", class: "bg-violet-500/10 text-violet-300 border-violet-500/20" },
  "nice-to-have": { label: "Nice-to-have", class: "bg-white/5 text-white/40 border-white/10" },
};

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({ feature }: { feature: AppFeature }) {
  const cat = categoryConfig[feature.category] ?? categoryConfig.core;
  const cplx = complexityConfig[feature.complexity] ?? complexityConfig.medium;
  const valueWidth = `${(feature.userValue / 10) * 100}%`;

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3 hover:border-white/20 transition-colors">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white leading-tight">{feature.name}</h4>
          <p className="mt-1 text-xs text-white/50 leading-relaxed">{feature.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            cat.class,
          )}
        >
          {cat.label}
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            cplx.class,
          )}
        >
          {cplx.label} complexity
        </span>
      </div>
      {/* User value bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-white/40">
          <span>User value</span>
          <span className="font-semibold text-white/60">{feature.userValue}/10</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
            style={{ width: valueWidth }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── UX Issue Row ─────────────────────────────────────────────────────────────

function UXIssueRow({ issue }: { issue: UXIssue }) {
  const [open, setOpen] = useState(false);
  const sev = getSeverityColor(issue.severity);

  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left hover:border-white/20 transition-colors"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={cn(
            "mt-0.5 h-4 w-4 flex-shrink-0",
            issue.severity === "critical"
              ? "text-red-400"
              : issue.severity === "major"
                ? "text-orange-400"
                : "text-yellow-400",
          )}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                sev,
              )}
            >
              {issue.severity}
            </span>
            <span className="text-xs text-white/40">{issue.area}</span>
          </div>
          <p className="mt-1 text-sm font-medium text-white">{issue.description}</p>
          {open && (
            <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/30">Impact</p>
                <p className="mt-0.5 text-xs text-white/60">{issue.impact}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/30">
                  Recommendation
                </p>
                <p className="mt-0.5 text-xs text-white/60">{issue.recommendation}</p>
              </div>
            </div>
          )}
        </div>
        <ArrowUpRight
          className={cn(
            "h-3.5 w-3.5 flex-shrink-0 text-white/20 transition-transform",
            open && "rotate-90",
          )}
        />
      </div>
    </button>
  );
}

// ─── Opportunity Card ─────────────────────────────────────────────────────────

const oppTypeConfig: Record<string, { icon: React.ReactNode; class: string }> = {
  ai: {
    icon: <Zap className="h-3 w-3" />,
    class: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  },
  automation: {
    icon: <Zap className="h-3 w-3" />,
    class: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
  },
  ux: {
    icon: <Star className="h-3 w-3" />,
    class: "bg-pink-500/10 text-pink-300 border-pink-500/20",
  },
  performance: {
    icon: <BarChart3 className="h-3 w-3" />,
    class: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  },
  conversion: {
    icon: <DollarSign className="h-3 w-3" />,
    class: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  },
  feature: {
    icon: <Layers className="h-3 w-3" />,
    class: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
  },
};

function OpportunityCard({ opp }: { opp: Opportunity }) {
  const typeConf = oppTypeConfig[opp.type] ?? oppTypeConfig.feature;
  const impactColor = getImpactColor(opp.estimatedImpact);
  const effortColor = getImpactColor(
    opp.effort === "low" ? "high" : opp.effort === "medium" ? "medium" : "low",
  );

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3 hover:border-white/20 transition-colors">
      <div className="flex items-start gap-2">
        <span
          className={cn(
            "mt-0.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide flex-shrink-0",
            typeConf.class,
          )}
        >
          {typeConf.icon}
          {opp.type}
        </span>
        <span className="ml-auto text-xs font-semibold text-white/40">
          Priority {opp.priority}/10
        </span>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-white">{opp.title}</h4>
        <p className="mt-1 text-xs text-white/50 leading-relaxed">{opp.description}</p>
      </div>
      {/* Impact / Effort matrix row */}
      <div className="flex gap-4 border-t border-white/10 pt-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-white/30">Impact</p>
          <p className={cn("text-xs font-semibold capitalize", impactColor)}>
            {opp.estimatedImpact}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-white/30">Effort</p>
          <p className={cn("text-xs font-semibold capitalize", effortColor)}>{opp.effort}</p>
        </div>
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
    <div className="flex items-center gap-2 mb-4">
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

export function AnalysisDocumentView({ document: doc }: AnalysisDocumentViewProps) {
  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-5">
            <ScoreBadge score={doc.overallScore} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-2xl">{doc.appName}</CardTitle>
                <Badge variant="secondary">{doc.appCategory}</Badge>
              </div>
              <p className="mt-1 text-sm text-white/50">{doc.targetAudience}</p>
              <p className="mt-1 text-xs text-white/30">{doc.marketPosition}</p>
            </div>
          </div>
        </CardHeader>
        {doc.technicalStack?.length > 0 && (
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {doc.technicalStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/60"
                >
                  {tech}
                </span>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* ── Value Proposition & Business Model ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-400" />
              <CardTitle className="text-base">Value Proposition</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/60 leading-relaxed">{doc.valueProposition}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <CardTitle className="text-base">Business Model</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/60 leading-relaxed">{doc.businessModel}</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Features ── */}
      {doc.features?.length > 0 && (
        <section>
          <SectionHeading
            icon={<Layers className="h-4 w-4" />}
            title="Features"
            count={doc.features.length}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {doc.features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </section>
      )}

      {/* ── UX Issues ── */}
      {doc.uxIssues?.length > 0 && (
        <section>
          <SectionHeading
            icon={<AlertTriangle className="h-4 w-4" />}
            title="UX Issues"
            count={doc.uxIssues.length}
          />
          <div className="space-y-2">
            {doc.uxIssues
              .slice()
              .sort((a, b) => {
                const order = { critical: 0, major: 1, minor: 2 };
                return (order[a.severity] ?? 3) - (order[b.severity] ?? 3);
              })
              .map((issue) => (
                <UXIssueRow key={issue.id} issue={issue} />
              ))}
          </div>
        </section>
      )}

      {/* ── Opportunities ── */}
      {doc.opportunities?.length > 0 && (
        <section>
          <SectionHeading
            icon={<Lightbulb className="h-4 w-4" />}
            title="Opportunities"
            count={doc.opportunities.length}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {doc.opportunities
              .slice()
              .sort((a, b) => b.priority - a.priority)
              .map((opp) => (
                <OpportunityCard key={opp.id} opp={opp} />
              ))}
          </div>
        </section>
      )}

      {/* ── Competitive Analysis ── */}
      {(doc.competitiveAdvantages?.length > 0 || doc.weaknesses?.length > 0) && (
        <section>
          <SectionHeading icon={<BarChart3 className="h-4 w-4" />} title="Competitive Analysis" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Advantages */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-emerald-400">Advantages</h3>
              </div>
              <ul className="space-y-2">
                {doc.competitiveAdvantages.map((adv, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                    {adv}
                  </li>
                ))}
              </ul>
            </div>
            {/* Weaknesses */}
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-5">
              <div className="mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-400" />
                <h3 className="text-sm font-semibold text-red-400">Weaknesses</h3>
              </div>
              <ul className="space-y-2">
                {doc.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ── Summary ── */}
      {doc.summary && (
        <section>
          <SectionHeading icon={<Shield className="h-4 w-4" />} title="Summary" />
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <div className="prose prose-sm prose-invert max-w-none text-white/70">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{doc.summary}</ReactMarkdown>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
