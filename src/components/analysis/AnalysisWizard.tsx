"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Globe,
  FileText,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Zap,
  Target,
  Users,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn, isValidUrl } from "@/lib/utils";

const schema = z
  .object({
    inputType: z.enum(["url", "description"]),
    url: z.string().optional(),
    description: z.string().optional(),
    targetAudience: z.string().optional(),
    goals: z.array(z.string()).optional(),
    competitors: z.array(z.string()).optional(),
  })
  .refine(
    (data) =>
      data.inputType === "url"
        ? data.url && isValidUrl(data.url)
        : data.description && data.description.length >= 20,
    {
      message:
        "Please provide a valid URL or description (min 20 characters)",
      path: ["url"],
    },
  );

type FormData = z.infer<typeof schema>;

const GOAL_OPTIONS = [
  "Better conversion",
  "Improved retention",
  "Faster onboarding",
  "More engagement",
  "Better performance",
  "AI automation",
  "Cost reduction",
  "Enterprise features",
];

const STEPS = [
  { id: 1, title: "App Input", description: "URL or description", icon: Globe },
  { id: 2, title: "Context", description: "Audience & goals", icon: Target },
  { id: 3, title: "Review", description: "Confirm & launch", icon: Zap },
];

export default function AnalysisWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [inputType, setInputType] = useState<"url" | "description">("url");
  const [goals, setGoals] = useState<string[]>([]);
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [competitorInput, setCompetitorInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    defaultValues: { inputType: "url", goals: [], competitors: [] },
  });

  const urlValue = watch("url");
  const descValue = watch("description");

  async function validateStep(currentStep: number): Promise<boolean> {
    if (currentStep === 1) {
      if (inputType === "url") {
        if (!urlValue || !isValidUrl(urlValue)) {
          return false;
        }
      } else {
        if (!descValue || descValue.length < 20) {
          return false;
        }
      }
    }
    return true;
  }

  async function nextStep() {
    const valid = await validateStep(step);
    if (valid && step < 3) setStep(step + 1);
  }

  function toggleGoal(goal: string) {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  }

  function addCompetitor() {
    const trimmed = competitorInput.trim();
    if (trimmed && !competitors.includes(trimmed)) {
      setCompetitors((prev) => [...prev, trimmed]);
      setCompetitorInput("");
    }
  }

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: inputType === "url" ? data.url : undefined,
          description:
            inputType === "description" ? data.description : undefined,
          targetAudience: data.targetAudience || undefined,
          goals: goals.length > 0 ? goals : undefined,
          competitors: competitors.length > 0 ? competitors : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to start analysis");
      }

      router.push(`/projects/${result.projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  }

  const inputValid =
    inputType === "url"
      ? urlValue && isValidUrl(urlValue)
      : descValue && descValue.length >= 20;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, index) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step > s.id && setStep(s.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                step === s.id
                  ? "bg-evolve-600/20 text-evolve-400 border border-evolve-500/20"
                  : step > s.id
                  ? "text-green-400 cursor-pointer hover:bg-white/5"
                  : "text-white/30 cursor-not-allowed",
              )}
            >
              <s.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{s.title}</span>
              <span className="sm:hidden">{s.id}</span>
            </button>
            {index < STEPS.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-white/20" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Input */}
      {step === 1 && (
        <div className="glass rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              What app do you want to evolve?
            </h2>
            <p className="text-white/50 text-sm">
              Provide a URL or describe the app you want to analyze and improve upon.
            </p>
          </div>

          {/* Input type toggle */}
          <div className="flex rounded-xl overflow-hidden border border-white/10 p-1 gap-1 bg-white/3">
            {(["url", "description"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setInputType(type)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                  inputType === type
                    ? "bg-evolve-600 text-white shadow-sm"
                    : "text-white/50 hover:text-white",
                )}
              >
                {type === "url" ? (
                  <>
                    <Globe className="w-4 h-4" />
                    App URL
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Description
                  </>
                )}
              </button>
            ))}
          </div>

          {inputType === "url" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Application URL
              </label>
              <input
                {...register("url")}
                type="url"
                placeholder="https://your-competitor.com"
                className={cn(
                  "w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-white/25 outline-none transition-all font-mono text-sm",
                  urlValue && isValidUrl(urlValue)
                    ? "border-green-500/40 focus:border-green-500/60"
                    : "border-white/10 focus:border-evolve-500/50",
                )}
              />
              <p className="text-xs text-white/30">
                We&apos;ll extract the app&apos;s concepts and patterns — never its code or assets.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                App Description
              </label>
              <textarea
                {...register("description")}
                rows={5}
                placeholder="Describe the app: what it does, who uses it, its core features, pricing model, navigation flow, and any known strengths/weaknesses..."
                className="w-full bg-white/5 border border-white/10 focus:border-evolve-500/50 rounded-xl px-4 py-3 text-white placeholder:text-white/25 outline-none transition-all resize-none text-sm leading-relaxed"
              />
              <p className="text-xs text-white/30">
                {descValue?.length || 0} chars · Minimum 20 · More detail = better analysis
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={nextStep}
              disabled={!inputValid}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all",
                inputValid
                  ? "bg-evolve-600 hover:bg-evolve-500 text-white"
                  : "bg-white/5 text-white/30 cursor-not-allowed",
              )}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Context */}
      {step === 2 && (
        <div className="glass rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Add context for a better analysis
            </h2>
            <p className="text-white/50 text-sm">
              Optional but highly recommended. This significantly improves AI output quality.
            </p>
          </div>

          {/* Target audience */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-evolve-400" />
              Target audience
            </label>
            <input
              {...register("targetAudience")}
              type="text"
              placeholder="e.g., SMB project managers, freelance designers, B2B SaaS founders..."
              className="w-full bg-white/5 border border-white/10 focus:border-evolve-500/50 rounded-xl px-4 py-3 text-white placeholder:text-white/25 outline-none transition-all text-sm"
            />
          </div>

          {/* Goals */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white/70 flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-evolve-400" />
              Analysis goals
            </label>
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    goals.includes(goal)
                      ? "bg-evolve-600/20 text-evolve-400 border-evolve-500/30"
                      : "bg-white/3 text-white/50 border-white/10 hover:border-white/20 hover:text-white",
                  )}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* Competitors */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">
              Known competitors (optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={competitorInput}
                onChange={(e) => setCompetitorInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCompetitor())}
                placeholder="e.g., Notion, Linear, Figma..."
                className="flex-1 bg-white/5 border border-white/10 focus:border-evolve-500/50 rounded-xl px-4 py-2.5 text-white placeholder:text-white/25 outline-none transition-all text-sm"
              />
              <button
                type="button"
                onClick={addCompetitor}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
              >
                <Plus className="w-4 h-4 text-white/60" />
              </button>
            </div>
            {competitors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {competitors.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1.5 bg-white/5 text-white/70 border border-white/10 px-2.5 py-1 rounded-lg text-xs"
                  >
                    {c}
                    <button
                      type="button"
                      onClick={() => setCompetitors((prev) => prev.filter((x) => x !== c))}
                    >
                      <X className="w-3 h-3 hover:text-red-400 transition-colors" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-evolve-600 hover:bg-evolve-500 text-white transition-all"
            >
              Review
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="glass rounded-2xl p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">
              Ready to analyze
            </h2>
            <p className="text-white/50 text-sm">
              The AI will execute all 7 phases. This takes 2-5 minutes.
            </p>
          </div>

          {/* Summary */}
          <div className="space-y-3">
            <div className="bg-white/3 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4 text-evolve-400 shrink-0" />
                <span className="text-white/50">Input:</span>
                <span className="text-white font-mono text-xs truncate">
                  {inputType === "url"
                    ? watch("url")
                    : `"${watch("description")?.slice(0, 60)}..."`}
                </span>
              </div>
              {watch("targetAudience") && (
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-white/50">Audience:</span>
                  <span className="text-white/80">{watch("targetAudience")}</span>
                </div>
              )}
              {goals.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-white/50">Goals:</span>
                  <span className="text-white/80">{goals.join(", ")}</span>
                </div>
              )}
            </div>

            {/* What will be generated */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { phase: "1-2", title: "Analysis Document", desc: "Features, UX issues, opportunities" },
                { phase: "3-4", title: "Design + Wireframes", desc: "Design system, 6+ screen wireframes" },
                { phase: "5-6", title: "Production Code", desc: "Full-stack Next.js + 12 files" },
                { phase: "7", title: "12-Month Roadmap", desc: "Milestones, KPIs, strategy" },
              ].map((item) => (
                <div key={item.phase} className="bg-white/3 rounded-xl p-3.5 flex items-start gap-3">
                  <span className="text-xs bg-evolve-600/20 text-evolve-400 px-1.5 py-0.5 rounded font-mono shrink-0">
                    Phase {item.phase}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <div className="text-xs text-white/40">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/50 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold transition-all",
                isSubmitting
                  ? "bg-evolve-600/50 text-white/50 cursor-not-allowed"
                  : "bg-evolve-600 hover:bg-evolve-500 text-white glow-sm",
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Launching...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Launch Analysis
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
