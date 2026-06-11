import { create } from "zustand";
import type { AnalysisInput, AnalysisProject, AnalysisStatus } from "@/types";

// ─── State Shape ──────────────────────────────────────────────────────────────

interface AnalysisState {
  currentProject: AnalysisProject | null;
  projects: AnalysisProject[];
  isLoading: boolean;
  error: string | null;
  currentPhase: number;

  // Actions
  startAnalysis: (input: AnalysisInput) => Promise<void>;
  loadProjects: () => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  reset: () => void;
}

// ─── Polling interval (ms) ────────────────────────────────────────────────────

const POLL_INTERVAL = 3000;

const TERMINAL_STATUSES: AnalysisStatus[] = ["completed", "failed"];

// ─── Polling helper ───────────────────────────────────────────────────────────

function pollProject(
  id: string,
  onUpdate: (project: AnalysisProject) => void,
  onDone: (project: AnalysisProject) => void,
  onError: (message: string) => void,
): () => void {
  let cancelled = false;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const tick = async () => {
    if (cancelled) return;

    try {
      const res = await fetch(`/api/projects/${id}`);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        onError(body?.error ?? `Failed to fetch project status (${res.status})`);
        return;
      }

      const data: { project: AnalysisProject } = await res.json();
      const project = data.project;

      onUpdate(project);

      if (TERMINAL_STATUSES.includes(project.status)) {
        onDone(project);
        return;
      }

      if (!cancelled) {
        timeoutId = setTimeout(tick, POLL_INTERVAL);
      }
    } catch (err) {
      if (!cancelled) {
        onError(err instanceof Error ? err.message : "Network error while polling project");
      }
    }
  };

  timeoutId = setTimeout(tick, POLL_INTERVAL);

  return () => {
    cancelled = true;
    if (timeoutId !== null) clearTimeout(timeoutId);
  };
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAnalysis = create<AnalysisState>((set, get) => ({
  currentProject: null,
  projects: [],
  isLoading: false,
  error: null,
  currentPhase: 0,

  // ── startAnalysis ────────────────────────────────────────────────────────
  startAnalysis: async (input: AnalysisInput) => {
    set({ isLoading: true, error: null, currentPhase: 0 });

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Analysis request failed (${res.status})`);
      }

      const data: { project: AnalysisProject } = await res.json();
      const project = data.project;

      set({
        currentProject: project,
        currentPhase: project.currentPhase ?? 0,
        projects: [project, ...get().projects.filter((p) => p.id !== project.id)],
      });

      // Start polling
      await new Promise<void>((resolve, reject) => {
        const cancel = pollProject(
          project.id,
          (updated) => {
            set({
              currentProject: updated,
              currentPhase: updated.currentPhase ?? 0,
              projects: get().projects.map((p) =>
                p.id === updated.id ? updated : p,
              ),
            });
          },
          (final) => {
            set({
              currentProject: final,
              currentPhase: final.currentPhase ?? 0,
              isLoading: false,
              error: final.status === "failed" ? (final.error ?? "Analysis failed") : null,
              projects: get().projects.map((p) =>
                p.id === final.id ? final : p,
              ),
            });
            resolve();
          },
          (message) => {
            set({ isLoading: false, error: message });
            cancel();
            reject(new Error(message));
          },
        );
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  },

  // ── loadProjects ─────────────────────────────────────────────────────────
  loadProjects: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch("/api/projects");

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Failed to load projects (${res.status})`);
      }

      const data: { projects: AnalysisProject[] } = await res.json();

      set({ projects: data.projects, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load projects",
      });
    }
  },

  // ── loadProject ──────────────────────────────────────────────────────────
  loadProject: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      // Check cache first
      const cached = get().projects.find((p) => p.id === id);
      if (cached) {
        set({ currentProject: cached, currentPhase: cached.currentPhase ?? 0 });
      }

      const res = await fetch(`/api/projects/${id}`);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Failed to load project (${res.status})`);
      }

      const data: { project: AnalysisProject } = await res.json();
      const project = data.project;

      set({
        currentProject: project,
        currentPhase: project.currentPhase ?? 0,
        isLoading: false,
        projects: get().projects.some((p) => p.id === project.id)
          ? get().projects.map((p) => (p.id === project.id ? project : p))
          : [project, ...get().projects],
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load project",
      });
    }
  },

  // ── reset ────────────────────────────────────────────────────────────────
  reset: () => {
    set({
      currentProject: null,
      isLoading: false,
      error: null,
      currentPhase: 0,
    });
  },
}));
