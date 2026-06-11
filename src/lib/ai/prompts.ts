import type { AnalysisInput } from "@/types";

// ─── Phase 1 & 2: Analysis Prompt ────────────────────────────────────────────

export function buildAnalysisPrompt(input: AnalysisInput): string {
  const inputSection = input.url
    ? `Application URL: ${input.url}`
    : `Application Description: ${input.description}`;

  return `You are a senior product strategist, UX researcher, and technical architect with 15+ years of experience building category-defining products.

TASK: Perform a comprehensive analysis of the following application for the "App Evolution" platform.

${inputSection}
${input.targetAudience ? `Target Audience Context: ${input.targetAudience}` : ""}
${input.competitors?.length ? `Known Competitors: ${input.competitors.join(", ")}` : ""}
${input.goals?.length ? `Analysis Goals: ${input.goals.join(", ")}` : ""}

CRITICAL RULES:
- NEVER reference proprietary code, assets, or brand elements
- Analyze CONCEPTS, PATTERNS, and FUNCTIONALITY only
- Think like a $10M-funded startup founder trying to build something 10x better

Respond with a valid JSON object matching this exact schema:
{
  "appName": "string - inferred or given name",
  "appCategory": "string - e.g., 'Project Management SaaS', 'E-commerce Platform'",
  "targetAudience": "string - detailed description",
  "valueProposition": "string - core value proposition",
  "businessModel": "string - how it makes money",
  "technicalStack": ["array of inferred technologies"],
  "features": [
    {
      "id": "string",
      "name": "string",
      "description": "string - detailed description",
      "category": "core|secondary|nice-to-have",
      "complexity": "low|medium|high",
      "userValue": number (1-10)
    }
  ],
  "uxIssues": [
    {
      "id": "string",
      "severity": "critical|major|minor",
      "area": "string - e.g., 'Onboarding', 'Navigation', 'Search'",
      "description": "string - specific problem",
      "impact": "string - business/user impact",
      "recommendation": "string - specific fix"
    }
  ],
  "opportunities": [
    {
      "id": "string",
      "type": "ai|automation|ux|performance|conversion|feature",
      "title": "string",
      "description": "string - detailed opportunity",
      "estimatedImpact": "high|medium|low",
      "effort": "high|medium|low",
      "priority": number (1-10)
    }
  ],
  "competitiveAdvantages": ["array of strings"],
  "weaknesses": ["array of strings"],
  "marketPosition": "string - market positioning analysis",
  "overallScore": number (1-100),
  "summary": "string - executive summary 2-3 paragraphs"
}

Be exhaustive. Identify at minimum: 8 features, 5 UX issues, 8 opportunities.
Think deeply about AI integration, automation potential, and conversion optimization.`;
}

// ─── Phase 3 & 4: Design & Wireframe Prompt ──────────────────────────────────

export function buildWireframePrompt(analysisJson: string): string {
  return `You are a world-class UX/UI designer and design systems architect. You've designed products used by millions.

Based on this app analysis, design a superior product:

${analysisJson}

Create a complete design system and wireframes for an improved version. The new app should:
1. Fix ALL identified UX issues
2. Implement the highest-priority opportunities
3. Use modern, delightful design patterns
4. Minimize clicks to complete core tasks
5. Be accessible (WCAG 2.1 AA)
6. Be mobile-first

Respond with valid JSON:
{
  "designSystem": {
    "name": "string",
    "philosophy": "string - design philosophy",
    "colorPalette": {
      "primary": "string hex",
      "secondary": "string hex",
      "accent": "string hex",
      "background": "string hex",
      "surface": "string hex",
      "text": "string hex",
      "textMuted": "string hex",
      "border": "string hex",
      "success": "string hex",
      "warning": "string hex",
      "error": "string hex"
    },
    "typography": {
      "headingFont": "string",
      "bodyFont": "string",
      "monoFont": "string",
      "scale": {
        "xs": "string",
        "sm": "string",
        "base": "string",
        "lg": "string",
        "xl": "string",
        "2xl": "string",
        "3xl": "string",
        "4xl": "string"
      }
    },
    "spacing": "string - spacing philosophy",
    "borderRadius": "string",
    "shadows": "string",
    "animations": "string - motion design principles",
    "components": ["array of key component names"]
  },
  "screens": [
    {
      "id": "string",
      "name": "string - e.g., 'Landing Page'",
      "route": "string - e.g., '/'",
      "description": "string",
      "purpose": "string - what this screen achieves",
      "components": [
        { "type": "string", "label": "string", "props": {} }
      ],
      "userFlow": ["array of user actions on this screen"],
      "keyActions": ["primary CTAs"],
      "improvements": ["specific improvements over original"],
      "ascii": "string - ASCII art wireframe (use box drawing chars)"
    }
  ],
  "navigationFlow": "string - description of navigation architecture",
  "keyDesignDecisions": ["array of justified design decisions"],
  "accessibilityConsiderations": ["array of accessibility features"]
}

Design at minimum 6 screens: Landing, Dashboard, Core Feature 1, Core Feature 2, Settings, Onboarding.
Each ASCII wireframe should be detailed (15+ lines) showing actual layout.`;
}

// ─── Phase 5 & 6: Architecture & Code Prompt ─────────────────────────────────

export function buildCodePrompt(
  analysisJson: string,
  wireframesJson: string,
): string {
  return `You are a senior full-stack architect and principal engineer. You build production-grade applications for Series A startups.

Based on this analysis and design system, generate a complete, production-ready Next.js application.

ANALYSIS:
${analysisJson}

DESIGN SYSTEM:
${wireframesJson}

TECH STACK (mandatory):
- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui
- Supabase (auth + PostgreSQL)
- Stripe (payments)
- Anthropic Claude API (AI features)
- Zod (validation)
- React Hook Form
- Zustand (state)
- Framer Motion (animations)
- Jest + Playwright (testing)

Generate production code. Respond with valid JSON:
{
  "architecture": {
    "name": "string",
    "description": "string",
    "techStack": {
      "frontend": ["array"],
      "backend": ["array"],
      "database": ["array"],
      "infrastructure": ["array"],
      "ai": ["array"]
    },
    "folderStructure": "string - tree-style folder structure",
    "databaseSchema": [
      {
        "name": "string",
        "description": "string",
        "columns": [
          { "name": "string", "type": "string", "constraints": "string", "description": "string" }
        ],
        "indexes": ["array of SQL index statements"],
        "rls": ["array of RLS policy descriptions"]
      }
    ],
    "apiEndpoints": [
      {
        "method": "GET|POST|PUT|PATCH|DELETE",
        "path": "string",
        "description": "string",
        "auth": boolean,
        "requestBody": "string optional",
        "responseExample": "string optional",
        "rateLimited": boolean
      }
    ],
    "authStrategy": "string",
    "scalingStrategy": "string",
    "securityMeasures": ["array"]
  },
  "files": [
    {
      "path": "string - relative path",
      "content": "string - COMPLETE production-ready code",
      "language": "typescript|sql|json|bash|yaml",
      "description": "string"
    }
  ],
  "setupInstructions": "string - step by step markdown",
  "deploymentGuide": "string - Vercel + Supabase deployment steps",
  "envVariables": "string - .env.local template",
  "testingSuite": "string - testing strategy and example test code"
}

REQUIREMENTS:
- Generate at minimum 12 complete files with full, working code
- Each file must be production-ready (no TODOs, no placeholder code)
- Include: layout.tsx, page.tsx (3+), API routes (4+), lib files (4+), components (5+)
- Include complete Supabase migration SQL
- Include Stripe integration
- Include AI feature code using Anthropic SDK
- All TypeScript must be strictly typed
- Include error boundaries and loading states`;
}

// ─── Phase 7: Roadmap Prompt ─────────────────────────────────────────────────

export function buildRoadmapPrompt(
  analysisJson: string,
  architectureJson: string,
): string {
  return `You are a startup strategist, product manager, and growth hacker who has taken 3 companies from 0 to $10M ARR.

Based on this analysis and architecture, create a comprehensive 12-month product roadmap.

ANALYSIS:
${analysisJson}

ARCHITECTURE OVERVIEW:
${architectureJson}

The roadmap should be ambitious but achievable with a team of 5 engineers + 1 designer.

Respond with valid JSON:
{
  "vision": "string - 3-year product vision",
  "mission": "string - current mission",
  "milestones": [
    {
      "phase": "string - e.g., 'Phase 1: Foundation'",
      "title": "string",
      "duration": "string - e.g., 'Months 1-3'",
      "goals": ["array"],
      "features": ["array of features to ship"],
      "technicalWork": ["array of technical tasks"],
      "successMetrics": ["array of measurable KPIs"],
      "estimatedCost": "string - rough estimate"
    }
  ],
  "items": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "category": "feature|ai|performance|security|monetization|growth",
      "quarter": "string - e.g., 'Q1 2025'",
      "priority": "must-have|should-have|nice-to-have",
      "estimatedEffort": "string - e.g., '2 weeks'",
      "expectedImpact": "string",
      "dependencies": ["array of item ids"]
    }
  ],
  "kpis": [
    { "metric": "string", "target": "string", "timeline": "string" }
  ],
  "monetizationStrategy": "string - detailed monetization plan",
  "growthStrategy": "string - go-to-market and growth strategy",
  "techDebtStrategy": "string - how to manage technical debt"
}

Include 4 phases (Q1-Q4), 16+ roadmap items, and 8+ KPIs.
Be specific, ambitious, and data-driven.`;
}
