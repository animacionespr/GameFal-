// ─── Core Domain Types ────────────────────────────────────────────────────────

export type AnalysisStatus =
  | "pending"
  | "analyzing"
  | "generating_document"
  | "generating_wireframes"
  | "generating_code"
  | "generating_roadmap"
  | "completed"
  | "failed";

export type SubscriptionPlan = "free" | "starter" | "pro" | "enterprise";

// ─── Analysis Input ───────────────────────────────────────────────────────────

export interface AnalysisInput {
  url?: string;
  description?: string;
  targetAudience?: string;
  goals?: string[];
  competitors?: string[];
}

// ─── Phase 1 & 2: App Analysis Document ──────────────────────────────────────

export interface AppFeature {
  id: string;
  name: string;
  description: string;
  category: "core" | "secondary" | "nice-to-have";
  complexity: "low" | "medium" | "high";
  userValue: number; // 1-10
}

export interface UXIssue {
  id: string;
  severity: "critical" | "major" | "minor";
  area: string;
  description: string;
  impact: string;
  recommendation: string;
}

export interface Opportunity {
  id: string;
  type: "ai" | "automation" | "ux" | "performance" | "conversion" | "feature";
  title: string;
  description: string;
  estimatedImpact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  priority: number; // 1-10
}

export interface AnalysisDocument {
  appName: string;
  appCategory: string;
  targetAudience: string;
  valueProposition: string;
  businessModel: string;
  technicalStack: string[];
  features: AppFeature[];
  uxIssues: UXIssue[];
  opportunities: Opportunity[];
  competitiveAdvantages: string[];
  weaknesses: string[];
  marketPosition: string;
  overallScore: number; // 1-100
  summary: string;
}

// ─── Phase 3 & 4: Design & Wireframes ────────────────────────────────────────

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface TypographySystem {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  scale: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
  };
}

export interface WireframeComponent {
  type: string;
  label: string;
  props?: Record<string, unknown>;
  children?: WireframeComponent[];
}

export interface WireframeScreen {
  id: string;
  name: string;
  route: string;
  description: string;
  purpose: string;
  components: WireframeComponent[];
  userFlow: string[];
  keyActions: string[];
  improvements: string[];
  ascii: string; // ASCII art wireframe representation
}

export interface DesignSystem {
  name: string;
  philosophy: string;
  colorPalette: ColorPalette;
  typography: TypographySystem;
  spacing: string;
  borderRadius: string;
  shadows: string;
  animations: string;
  components: string[];
}

export interface WireframeSet {
  designSystem: DesignSystem;
  screens: WireframeScreen[];
  navigationFlow: string;
  keyDesignDecisions: string[];
  accessibilityConsiderations: string[];
}

// ─── Phase 5 & 6: Architecture & Code ────────────────────────────────────────

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
  description: string;
}

export interface DatabaseTable {
  name: string;
  description: string;
  columns: {
    name: string;
    type: string;
    constraints: string;
    description: string;
  }[];
  indexes: string[];
  rls: string[];
}

export interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  auth: boolean;
  requestBody?: string;
  responseExample?: string;
  rateLimited: boolean;
}

export interface ProjectArchitecture {
  name: string;
  description: string;
  techStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
    ai: string[];
  };
  folderStructure: string;
  databaseSchema: DatabaseTable[];
  apiEndpoints: APIEndpoint[];
  authStrategy: string;
  scalingStrategy: string;
  securityMeasures: string[];
}

export interface GeneratedCode {
  architecture: ProjectArchitecture;
  files: ProjectFile[];
  setupInstructions: string;
  deploymentGuide: string;
  envVariables: string;
  testingSuite: string;
}

// ─── Phase 7: Roadmap ────────────────────────────────────────────────────────

export interface RoadmapMilestone {
  phase: string;
  title: string;
  duration: string;
  goals: string[];
  features: string[];
  technicalWork: string[];
  successMetrics: string[];
  estimatedCost: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: "feature" | "ai" | "performance" | "security" | "monetization" | "growth";
  quarter: string;
  priority: "must-have" | "should-have" | "nice-to-have";
  estimatedEffort: string;
  expectedImpact: string;
  dependencies: string[];
}

export interface ProjectRoadmap {
  vision: string;
  mission: string;
  milestones: RoadmapMilestone[];
  items: RoadmapItem[];
  kpis: { metric: string; target: string; timeline: string }[];
  monetizationStrategy: string;
  growthStrategy: string;
  techDebtStrategy: string;
}

// ─── Full Analysis Project ────────────────────────────────────────────────────

export interface AnalysisProject {
  id: string;
  userId: string;
  input: AnalysisInput;
  status: AnalysisStatus;
  currentPhase: number;
  document?: AnalysisDocument;
  wireframes?: WireframeSet;
  generatedCode?: GeneratedCode;
  roadmap?: ProjectRoadmap;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Subscription & User ──────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  plan: SubscriptionPlan;
  analysesUsed: number;
  analysesLimit: number;
  createdAt: string;
}

export interface PlanFeatures {
  name: string;
  price: number;
  priceId: string;
  analysesPerMonth: number;
  features: string[];
  highlighted?: boolean;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface StreamChunk {
  type: "progress" | "result" | "error";
  phase?: number;
  message?: string;
  data?: unknown;
}
