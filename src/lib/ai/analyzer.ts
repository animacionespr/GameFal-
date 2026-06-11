import Anthropic from "@anthropic-ai/sdk";
import type {
  AnalysisInput,
  AnalysisDocument,
  WireframeSet,
  GeneratedCode,
  ProjectRoadmap,
} from "@/types";
import {
  buildAnalysisPrompt,
  buildWireframePrompt,
  buildCodePrompt,
  buildRoadmapPrompt,
} from "./prompts";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-sonnet-4-6";
const MAX_TOKENS = 8192;

async function callClaude(prompt: string, systemContext?: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: prompt },
  ];

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system:
      systemContext ||
      "You are an expert software architect and product strategist. Always respond with valid, parseable JSON unless instructed otherwise. Never truncate JSON responses.",
    messages,
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  return content.text;
}

function extractJSON(text: string): unknown {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Extract JSON from markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {
        // Continue to next strategy
      }
    }

    // Find the outermost JSON object or array
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch {
        throw new Error("Could not parse JSON from response");
      }
    }

    throw new Error("No JSON found in response");
  }
}

// ─── Phase 1 & 2: Analyze Application ────────────────────────────────────────

export async function analyzeApplication(
  input: AnalysisInput,
): Promise<AnalysisDocument> {
  const prompt = buildAnalysisPrompt(input);
  const response = await callClaude(prompt);
  const parsed = extractJSON(response) as AnalysisDocument;

  if (!parsed.features || !parsed.uxIssues || !parsed.opportunities) {
    throw new Error("Invalid analysis document structure");
  }

  return parsed;
}

// ─── Phase 3 & 4: Generate Design & Wireframes ───────────────────────────────

export async function generateWireframes(
  document: AnalysisDocument,
): Promise<WireframeSet> {
  const prompt = buildWireframePrompt(JSON.stringify(document, null, 2));
  const response = await callClaude(prompt);
  const parsed = extractJSON(response) as WireframeSet;

  if (!parsed.designSystem || !parsed.screens) {
    throw new Error("Invalid wireframe structure");
  }

  return parsed;
}

// ─── Phase 5 & 6: Generate Code ──────────────────────────────────────────────

export async function generateCode(
  document: AnalysisDocument,
  wireframes: WireframeSet,
): Promise<GeneratedCode> {
  const analysisJson = JSON.stringify(
    {
      appName: document.appName,
      appCategory: document.appCategory,
      features: document.features,
      opportunities: document.opportunities,
      overallScore: document.overallScore,
    },
    null,
    2,
  );

  const wireframesJson = JSON.stringify(
    {
      designSystem: wireframes.designSystem,
      screens: wireframes.screens.map((s) => ({
        name: s.name,
        route: s.route,
        purpose: s.purpose,
        keyActions: s.keyActions,
        improvements: s.improvements,
      })),
    },
    null,
    2,
  );

  const prompt = buildCodePrompt(analysisJson, wireframesJson);
  const response = await callClaude(prompt, undefined);
  const parsed = extractJSON(response) as GeneratedCode;

  if (!parsed.architecture || !parsed.files) {
    throw new Error("Invalid generated code structure");
  }

  return parsed;
}

// ─── Phase 7: Generate Roadmap ────────────────────────────────────────────────

export async function generateRoadmap(
  document: AnalysisDocument,
  code: GeneratedCode,
): Promise<ProjectRoadmap> {
  const analysisJson = JSON.stringify(
    {
      appName: document.appName,
      opportunities: document.opportunities,
      weaknesses: document.weaknesses,
      overallScore: document.overallScore,
      summary: document.summary,
    },
    null,
    2,
  );

  const architectureJson = JSON.stringify(
    {
      name: code.architecture.name,
      techStack: code.architecture.techStack,
      apiEndpoints: code.architecture.apiEndpoints.length,
      databaseTables: code.architecture.databaseSchema.length,
    },
    null,
    2,
  );

  const prompt = buildRoadmapPrompt(analysisJson, architectureJson);
  const response = await callClaude(prompt);
  const parsed = extractJSON(response) as ProjectRoadmap;

  if (!parsed.milestones || !parsed.items) {
    throw new Error("Invalid roadmap structure");
  }

  return parsed;
}

// ─── Streaming Progress Updates ──────────────────────────────────────────────

export interface ProgressCallback {
  (phase: number, message: string, data?: unknown): void;
}

export async function runFullAnalysis(
  input: AnalysisInput,
  onProgress: ProgressCallback,
): Promise<{
  document: AnalysisDocument;
  wireframes: WireframeSet;
  generatedCode: GeneratedCode;
  roadmap: ProjectRoadmap;
}> {
  onProgress(1, "Analyzing application structure, features, and UX patterns...");
  const document = await analyzeApplication(input);
  onProgress(2, "Analysis complete. Identifying opportunities...", document);

  onProgress(3, "Designing superior architecture and creating wireframes...");
  const wireframes = await generateWireframes(document);
  onProgress(4, "Design system and wireframes complete.", wireframes);

  onProgress(5, "Generating production-ready code architecture...");
  const generatedCode = await generateCode(document, wireframes);
  onProgress(6, "Code generation complete.", generatedCode);

  onProgress(7, "Building 12-month product roadmap...");
  const roadmap = await generateRoadmap(document, generatedCode);
  onProgress(7, "Roadmap complete. All phases done!", roadmap);

  return { document, wireframes, generatedCode, roadmap };
}
