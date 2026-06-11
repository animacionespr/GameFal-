"use client";

import { useState } from "react";
import {
  Monitor,
  Palette,
  Type,
  Navigation,
  MousePointer,
  Zap,
  CheckCircle2,
  ChevronRight,
  Layers,
  Eye,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { WireframeSet, WireframeScreen, DesignSystem, ColorPalette } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// ─── Props ────────────────────────────────────────────────────────────────────

interface WireframeViewProps {
  wireframes: WireframeSet;
}

// ─── Color Swatch Grid ────────────────────────────────────────────────────────

function ColorSwatches({ palette }: { palette: ColorPalette }) {
  const swatches = [
    { label: "Primary", value: palette.primary },
    { label: "Secondary", value: palette.secondary },
    { label: "Accent", value: palette.accent },
    { label: "Background", value: palette.background },
    { label: "Surface", value: palette.surface },
    { label: "Text", value: palette.text },
    { label: "Text Muted", value: palette.textMuted },
    { label: "Border", value: palette.border },
    { label: "Success", value: palette.success },
    { label: "Warning", value: palette.warning },
    { label: "Error", value: palette.error },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-11">
      {swatches.map((swatch) => (
        <div key={swatch.label} className="flex flex-col items-center gap-1.5">
          <div
            className="h-10 w-full rounded-lg border border-white/10 shadow-sm"
            style={{ backgroundColor: swatch.value }}
            title={swatch.value}
          />
          <span className="text-center text-[9px] leading-tight text-white/40">{swatch.label}</span>
          <span className="text-center font-mono text-[8px] text-white/25">{swatch.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Typography Scale ─────────────────────────────────────────────────────────

function TypographyScale({ design }: { design: DesignSystem }) {
  const { typography } = design;
  const scaleEntries = Object.entries(typography.scale) as [string, string][];

  const scaleMap: Record<string, string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-4 text-xs text-white/50">
        <span>
          Heading:{" "}
          <span className="font-medium text-white/80">{typography.headingFont}</span>
        </span>
        <span>
          Body:{" "}
          <span className="font-medium text-white/80">{typography.bodyFont}</span>
        </span>
        <span>
          Mono:{" "}
          <span className="font-mono font-medium text-white/80">{typography.monoFont}</span>
        </span>
      </div>
      <div className="space-y-1 rounded-xl border border-white/10 bg-white/5 p-4">
        {scaleEntries.map(([key, size]) => (
          <div key={key} className="flex items-baseline gap-3">
            <span className="w-8 flex-shrink-0 text-[10px] uppercase tracking-wide text-white/30">
              {key}
            </span>
            <span
              className={cn("text-white/70 leading-tight", scaleMap[key] ?? "text-base")}
              style={{ fontSize: size }}
            >
              The quick brown fox
            </span>
            <span className="ml-auto text-[10px] font-mono text-white/20">{size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Design System Panel ──────────────────────────────────────────────────────

function DesignSystemPanel({ design }: { design: DesignSystem }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-violet-400" />
            <CardTitle className="text-base">{design.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-white/60 leading-relaxed">{design.philosophy}</p>
        </CardContent>
      </Card>

      {/* Colors */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/10 text-violet-400">
            <Palette className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-sm font-semibold text-white">Color Palette</h3>
        </div>
        <ColorSwatches palette={design.colorPalette} />
      </section>

      {/* Typography */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/10 text-blue-400">
            <Type className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-sm font-semibold text-white">Typography Scale</h3>
        </div>
        <TypographyScale design={design} />
      </section>

      {/* Design tokens */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Spacing", value: design.spacing },
          { label: "Border Radius", value: design.borderRadius },
          { label: "Shadows", value: design.shadows },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-white/30">
              {label}
            </p>
            <p className="text-xs text-white/60 leading-relaxed">{value}</p>
          </div>
        ))}
      </div>

      {/* Animations */}
      {design.animations && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-white/30">
            Animations
          </p>
          <p className="text-xs text-white/60 leading-relaxed">{design.animations}</p>
        </div>
      )}

      {/* Component list */}
      {design.components?.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-white/30">
            UI Components ({design.components.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {design.components.map((comp) => (
              <span
                key={comp}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/60"
              >
                {comp}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Screen Sidebar Item ──────────────────────────────────────────────────────

function ScreenSidebarItem({
  screen,
  isActive,
  onClick,
}: {
  screen: WireframeScreen;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg px-3 py-2.5 text-left transition-all duration-200",
        "flex items-center gap-2.5",
        isActive
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-white/50 hover:bg-white/5 hover:text-white/80",
      )}
    >
      <Monitor className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium leading-tight">{screen.name}</p>
        <p className={cn("truncate text-[10px]", isActive ? "text-indigo-200" : "text-white/30")}>
          {screen.route}
        </p>
      </div>
      {isActive && <ChevronRight className="h-3 w-3 flex-shrink-0" />}
    </button>
  );
}

// ─── Screen Detail ────────────────────────────────────────────────────────────

function ScreenDetail({ screen }: { screen: WireframeScreen }) {
  return (
    <div className="space-y-5">
      {/* Screen header */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-white">{screen.name}</h2>
            <p className="font-mono text-xs text-indigo-400">{screen.route}</p>
            <p className="mt-2 text-sm text-white/60 leading-relaxed">{screen.description}</p>
          </div>
        </div>
        {screen.purpose && (
          <div className="mt-4 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-400">
              Purpose
            </p>
            <p className="mt-1 text-sm text-white/70">{screen.purpose}</p>
          </div>
        )}
      </div>

      {/* ASCII Wireframe */}
      {screen.ascii && (
        <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
            <Eye className="h-3.5 w-3.5 text-white/40" />
            <span className="text-xs font-medium text-white/40">Wireframe Preview</span>
            <div className="ml-auto flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500/60" />
              <div className="h-2 w-2 rounded-full bg-yellow-500/60" />
              <div className="h-2 w-2 rounded-full bg-green-500/60" />
            </div>
          </div>
          <ScrollArea className="h-80">
            <pre className="ascii-wireframe overflow-x-auto p-5 font-mono text-[11px] leading-relaxed text-green-400/80">
              {screen.ascii}
            </pre>
          </ScrollArea>
        </div>
      )}

      {/* User flow */}
      {screen.userFlow?.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Navigation className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">User Flow</h3>
          </div>
          <ol className="space-y-2">
            {screen.userFlow.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-[10px] font-bold text-cyan-400">
                  {i + 1}
                </span>
                <span className="text-sm text-white/60 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Key actions & improvements */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {screen.keyActions?.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Key Actions</h3>
            </div>
            <ul className="space-y-2">
              {screen.keyActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <Zap className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-400/70" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {screen.improvements?.length > 0 && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-white">Improvements</h3>
            </div>
            <ul className="space-y-2">
              {screen.improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                  {imp}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function WireframeView({ wireframes }: WireframeViewProps) {
  const [activeTab, setActiveTab] = useState<"design" | "screens">("design");
  const [selectedScreenId, setSelectedScreenId] = useState<string>(
    wireframes.screens[0]?.id ?? "",
  );

  const selectedScreen =
    wireframes.screens.find((s) => s.id === selectedScreenId) ?? wireframes.screens[0];

  return (
    <div className="space-y-6">
      {/* Top tab switcher */}
      <div className="flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1 w-fit">
        {(["design", "screens"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              "rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-all duration-200",
              activeTab === tab
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-white/40 hover:text-white/70",
            )}
          >
            {tab === "design" ? (
              <span className="flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5" />
                Design System
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                Screens ({wireframes.screens.length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Design System Tab */}
      {activeTab === "design" && (
        <div className="space-y-6">
          <DesignSystemPanel design={wireframes.designSystem} />

          {/* Key design decisions */}
          {wireframes.keyDesignDecisions?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <CardTitle className="text-base">Key Design Decisions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {wireframes.keyDesignDecisions.map((decision, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                      {decision}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Accessibility */}
          {wireframes.accessibilityConsiderations?.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-400" />
                  <CardTitle className="text-base">Accessibility Considerations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {wireframes.accessibilityConsiderations.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Navigation flow */}
          {wireframes.navigationFlow && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-indigo-400" />
                  <CardTitle className="text-base">Navigation Flow</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/60 leading-relaxed">{wireframes.navigationFlow}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Screens Tab */}
      {activeTab === "screens" && (
        <div className="flex gap-4">
          {/* Sidebar */}
          <div className="w-52 flex-shrink-0">
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="border-b border-white/10 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                  Screens
                </p>
              </div>
              <ScrollArea className="h-[600px]">
                <div className="space-y-0.5 p-2">
                  {wireframes.screens.map((screen) => (
                    <ScreenSidebarItem
                      key={screen.id}
                      screen={screen}
                      isActive={screen.id === selectedScreenId}
                      onClick={() => setSelectedScreenId(screen.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Navigation flow note */}
            {wireframes.navigationFlow && (
              <div className="mt-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-indigo-400">
                  Nav Flow
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-white/40 line-clamp-4">
                  {wireframes.navigationFlow}
                </p>
              </div>
            )}
          </div>

          {/* Screen detail */}
          <div className="min-w-0 flex-1">
            {selectedScreen ? (
              <ScreenDetail screen={selectedScreen} />
            ) : (
              <div className="flex h-48 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <p className="text-sm text-white/30">Select a screen</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
