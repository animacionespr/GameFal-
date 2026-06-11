import { buildAnalysisPrompt, buildWireframePrompt, buildCodePrompt, buildRoadmapPrompt } from "@/lib/ai/prompts";
import type { AnalysisDocument, WireframeSet } from "@/types";

describe("buildAnalysisPrompt", () => {
  it("includes URL when provided", () => {
    const prompt = buildAnalysisPrompt({ url: "https://notion.so" });
    expect(prompt).toContain("https://notion.so");
  });

  it("includes description when provided", () => {
    const prompt = buildAnalysisPrompt({
      description: "A project management tool for remote teams",
    });
    expect(prompt).toContain("project management tool");
  });

  it("includes target audience when provided", () => {
    const prompt = buildAnalysisPrompt({
      url: "https://example.com",
      targetAudience: "B2B SaaS founders",
    });
    expect(prompt).toContain("B2B SaaS founders");
  });

  it("includes competitors when provided", () => {
    const prompt = buildAnalysisPrompt({
      url: "https://example.com",
      competitors: ["Notion", "Linear"],
    });
    expect(prompt).toContain("Notion");
    expect(prompt).toContain("Linear");
  });

  it("includes JSON schema instructions", () => {
    const prompt = buildAnalysisPrompt({ url: "https://example.com" });
    expect(prompt).toContain("features");
    expect(prompt).toContain("uxIssues");
    expect(prompt).toContain("opportunities");
  });

  it("includes IP safety instruction", () => {
    const prompt = buildAnalysisPrompt({ url: "https://example.com" });
    expect(prompt.toLowerCase()).toContain("proprietary");
  });
});

describe("buildWireframePrompt", () => {
  const mockAnalysis: Partial<AnalysisDocument> = {
    appName: "TestApp",
    appCategory: "SaaS",
    features: [],
    uxIssues: [],
    opportunities: [],
  };

  it("includes analysis JSON", () => {
    const prompt = buildWireframePrompt(JSON.stringify(mockAnalysis));
    expect(prompt).toContain("TestApp");
  });

  it("requests ASCII wireframes", () => {
    const prompt = buildWireframePrompt("{}");
    expect(prompt).toContain("ASCII");
  });

  it("requests design system", () => {
    const prompt = buildWireframePrompt("{}");
    expect(prompt).toContain("designSystem");
  });
});

describe("buildCodePrompt", () => {
  it("includes required tech stack", () => {
    const prompt = buildCodePrompt("{}", "{}");
    expect(prompt).toContain("Next.js");
    expect(prompt).toContain("TypeScript");
    expect(prompt).toContain("Supabase");
    expect(prompt).toContain("Stripe");
  });

  it("requests production code", () => {
    const prompt = buildCodePrompt("{}", "{}");
    expect(prompt.toLowerCase()).toContain("production");
  });
});

describe("buildRoadmapPrompt", () => {
  it("requests milestones", () => {
    const prompt = buildRoadmapPrompt("{}", "{}");
    expect(prompt).toContain("milestones");
  });

  it("requests KPIs", () => {
    const prompt = buildRoadmapPrompt("{}", "{}");
    expect(prompt).toContain("kpis");
  });

  it("requests 12-month timeframe", () => {
    const prompt = buildRoadmapPrompt("{}", "{}");
    expect(prompt).toContain("12-month");
  });
});
