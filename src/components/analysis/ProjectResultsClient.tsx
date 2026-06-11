"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Loader2,
  BarChart3,
  Layers,
  Code2,
  Map,
} from "lucide-react";

import { cn, getPhaseProgress } from "@/lib/utils";
import { AnalysisProject, AnalysisStatus } from "@/types";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { AnalysisDocumentView } from "./AnalysisDocumentView";
import { WireframeView } from "./WireframeView";
import { CodeView } from "./CodeView";
import { RoadmapView } from "./RoadmapView";

// ─── Phase Metadata ───────────────────────────────────────────────────────────

interface PhaseInfo {
  number: number;
  status: AnalysisStatus;
  label: string;
  description: string;
  estimatedSeconds: number;
}

const PHASES: PhaseInfo[] = [
  {
    number: 1,
    status: "pending",
    label: "Initializing",
    description: "Setting up the analysis pipeline and loading project context.",
    estimatedSeconds: 10,
  },
  {
    number: 2,
    status: "analyzing",
    label: "Analyzing App",
    description:
      "Deep-diving into the application's UX, features, competitive position, and technical stack.",
    estimatedSeconds: 40,
  },
  {
    number: 3,
    status: "generating_document",
    label: "Creating Analysis Document",
    description:
      "Synthesising findings into a structured analysis with scores, opportunities, and recommendations.",
    estimatedSeconds: 30,
  },
  {
    number: 4,
    status: "generating_wireframes",
    label: "Generating Wireframes",
    description:
      "Designing an improved UI system with screen-by-screen wireframes and a coherent design language.",
    estimatedSeconds: 60,
  },
  {
    number: 5,
    status: "generating_code",
    label: "Writing Code",
    description:
      "Producing production-ready Next.js / Supabase source files, database schema, and API routes.",
    estimatedSeconds: 90,
  },
  {
    number: 6,
    status: "generating_roadmap",
    label: "Building Roadmap",
    description:
      "Creating a prioritised quarterly roadmap with KPIs, milestones, and growth strategy.",
    estimatedSeconds: 30,
  },
  {
    number: 7,
    status: "completed",
    label: "Finalising",
    description: "Packaging all artefacts and preparing the final deliverable.",
    estimatedSeconds: 5,
  },
];

const TERMINAL_STATUSES: AnalysisStatus[] = ["completed", "failed"];

function phaseIndexForStatus(status: AnalysisStatus): number {
  const map: Record<AnalysisStatus, number> = {
    pending: 0,
    analyzing: 1,
    generating_document: 2,
    generating_wireframes: 3,
    generating_code: 4,
    generating_roadmap: 5,
    completed: 6,
    failed: -1,
  };
  return map[status] ?? 0;
}

// ─── Subcomponent: PhaseRow ───────────────────────────────────────────────────

interface PhaseRowProps {
  phase: PhaseInfo;
  currentIndex: number;
  phaseIndex: number;
}

function PhaseRow({ phase, currentIndex, phaseIndex }: PhaseRowProps) {
  const isDone = phaseIndex < currentIndex;
  const isCurrent = phaseIndex === currentIndex;
  const isPending = phaseIndex > currentIndex;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-300",
        isCurrent && "bg-indigo-500/10 border border-indigo-500/20",
        isDone && "opacity-70",
      )}
    >
      {/* Icon */}
      <div className="mt-0.5 flex-shrink-0">
        {isDone ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : isCurrent ? (
          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
        ) : (
          <Circle className="h-4 w-4 text-white/20" />
        )}
      </div>

      {/* Label */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-medium leading-tight",
            isDone && "text-emerald-400",
            isCurrent && "text-white",
            isPending && "text-white/30",
          )}
        >
          Phase {phase.number} — {phase.label}
        </p>
        {isCurrent && (
          <p className="mt-0.5 text-xs text-white/50 leading-relaxed">
            {phase.description}
          </p>
        )}
      </div>

      {/* Badge */}
      <span
        className={cn(
          "ml-auto flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
          isDone && "bg-emerald-500/10 text-emerald-400",
          isCurrent && "bg-indigo-500/20 text-indigo-300 animate-pulse",
          isPending && "bg-white/5 text-white/20",
        )}
      >
        {isDone ? "Done" : isCurrent ? "Active" : "Queued"}
      </span>
    </div>
  );
}

// ─── Subcomponent: InProgressView ────────────────────────────────────────────

function InProgressView({ project }: { project: AnalysisProject }) {
  const currentIndex = phaseIndexForStatus(project.status);
  const currentPhase = PHASES[currentIndex] ?? PHASES[0];
  const progress = getPhaseProgress(project.status);

  const remainingSeconds = PHASES.slice(currentIndex + 1).reduce(
    (acc, p) => acc + p.estimatedSeconds,
    0,
  );
  const remainingLabel =
    remainingSeconds < 60
      ? `~${remainingSeconds}s remaining`
      : `~${Math.ceil(remainingSeconds / 60)}m remaining`;

  return (
    <div className="flex flex-col gap-6">
      {/* Phase counter hero */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-indigo-400">
          In Progress
        </p>
        <p className="mt-2 text-6xl font-bold text-white tabular-nums">
          {currentIndex + 1}
          <span className="text-3xl font-light text-white/30"> / 7</span>
        </p>
        <p className="mt-2 text-lg font-medium text-white/80">{currentPhase.label}</p>
        <p className="mt-1 text-sm text-white/40">{currentPhase.description}</p>

        {/* Progress bar */}
        <div className="mt-6 space-y-2">
          <Progress value={progress} className="h-2.5" />
          <div className="flex items-center justify-between text-xs text-white/40">
            <span>{progress}% complete</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {remainingLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Phase list */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-1">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-white/30">
          Pipeline
        </p>
        {PHASES.map((phase, idx) => (
          <PhaseRow
            key={phase.number}
            phase={phase}
            currentIndex={currentIndex}
            phaseIndex={idx}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Subcomponent: ErrorView ──────────────────────────────────────────────────

function ErrorView({ error }: { error?: string }) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
      <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
      <h3 className="mt-4 text-xl font-semibold text-white">Analysis Failed</h3>
      <p className="mt-2 text-sm text-white/50 max-w-md mx-auto">
        {error ?? "An unexpected error occurred during analysis. Please try again."}
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface ProjectResultsClientProps {
  project: AnalysisProject;
}

export function ProjectResultsClient({ project: initialProject }: ProjectResultsClientProps) {
  const [project, setProject] = useState<AnalysisProject>(initialProject);

  // Polling
  useEffect(() => {
    if (TERMINAL_STATUSES.includes(project.status)) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/projects/${project.id}`);
        if (!res.ok) return;
        const data = await res.json();
        const updated: AnalysisProject = data?.data ?? data;
        if (updated?.status !== project.status || updated?.currentPhase !== project.currentPhase) {
          setProject(updated);
        }
        if (TERMINAL_STATUSES.includes(updated?.status)) {
          clearInterval(interval);
        }
      } catch {
        // silently ignore network errors during polling
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [project.id, project.status, project.currentPhase]);

  // Failed
  if (project.status === "failed") {
    return <ErrorView error={project.error} />;
  }

  // In progress
  if (!TERMINAL_STATUSES.includes(project.status)) {
    return <InProgressView project={project} />;
  }

  // Completed — determine which tabs are available
  const hasAnalysis = !!project.document;
  const hasWireframes = !!project.wireframes;
  const hasCode = !!project.generatedCode;
  const hasRoadmap = !!project.roadmap;

  return (
    <Tabs defaultValue="analysis" className="w-full">
      <TabsList className="mb-2 flex-wrap h-auto gap-1">
        {hasAnalysis && (
          <TabsTrigger value="analysis" className="gap-2">
            <BarChart3 className="h-3.5 w-3.5" />
            Analysis
          </TabsTrigger>
        )}
        {hasWireframes && (
          <TabsTrigger value="wireframes" className="gap-2">
            <Layers className="h-3.5 w-3.5" />
            Wireframes
          </TabsTrigger>
        )}
        {hasCode && (
          <TabsTrigger value="code" className="gap-2">
            <Code2 className="h-3.5 w-3.5" />
            Code
          </TabsTrigger>
        )}
        {hasRoadmap && (
          <TabsTrigger value="roadmap" className="gap-2">
            <Map className="h-3.5 w-3.5" />
            Roadmap
          </TabsTrigger>
        )}
      </TabsList>

      {hasAnalysis && (
        <TabsContent value="analysis">
          <AnalysisDocumentView document={project.document!} />
        </TabsContent>
      )}
      {hasWireframes && (
        <TabsContent value="wireframes">
          <WireframeView wireframes={project.wireframes!} />
        </TabsContent>
      )}
      {hasCode && (
        <TabsContent value="code">
          <CodeView code={project.generatedCode!} />
        </TabsContent>
      )}
      {hasRoadmap && (
        <TabsContent value="roadmap">
          <RoadmapView roadmap={project.roadmap!} />
        </TabsContent>
      )}
    </Tabs>
  );
}
