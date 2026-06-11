import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProjectResultsClient } from "@/components/analysis/ProjectResultsClient";
import type { AnalysisProject } from "@/types";

export const metadata = { title: "Project Results" };

export default async function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: project, error } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user!.id)
    .single();

  if (error || !project) {
    notFound();
  }

  // Map DB columns to our type
  const typedProject: AnalysisProject = {
    id: project.id,
    userId: project.user_id,
    input: {
      url: project.input_url,
      description: project.input_description,
      targetAudience: project.target_audience,
      goals: project.goals,
    },
    status: project.status,
    currentPhase: project.current_phase || 0,
    document: project.analysis_document,
    wireframes: project.wireframes,
    generatedCode: project.generated_code,
    roadmap: project.roadmap,
    error: project.error_message,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  };

  return <ProjectResultsClient project={typedProject} />;
}
