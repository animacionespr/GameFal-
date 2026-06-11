import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, ArrowRight, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { formatRelativeTime, getStatusColor, getStatusLabel } from "@/lib/utils";
import type { AnalysisProject } from "@/types";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("analyses")
    .select("id, input_url, input_description, status, current_phase, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const typedProjects = (projects || []) as unknown as AnalysisProject[];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">All Projects</h1>
          <p className="text-white/50 mt-1">
            {typedProjects.length} total · {typedProjects.filter((p) => p.status === "completed").length} completed
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

      {typedProjects.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Clock className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
          <p className="text-white/40 mb-6">Start your first analysis to see results here.</p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 bg-evolve-600 hover:bg-evolve-500 text-white px-6 py-3 rounded-xl text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Start analysis
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {typedProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="glass rounded-xl p-5 flex items-center gap-4 hover:bg-white/8 transition-colors group"
            >
              <div className="shrink-0">
                {project.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : project.status === "failed" ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-evolve-400 border-t-transparent animate-spin" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {(project as unknown as Record<string, string>).input_url ||
                   (project as unknown as Record<string, string>).input_description?.slice(0, 80) ||
                   "Untitled analysis"}
                </p>
                <p className="text-white/40 text-sm">
                  {formatRelativeTime((project as unknown as Record<string, string>).created_at || project.createdAt)}
                </p>
              </div>

              <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${getStatusColor(project.status)}`}>
                {getStatusLabel(project.status)}
              </span>

              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
