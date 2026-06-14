"use client";

import { TIMELINE_BRANCHES, ZELDA_GAMES } from "@/data/zelda";

const BRANCH_STYLES: Record<string, { bg: string; border: string; header: string }> = {
  adult: {
    bg: "rgba(30,58,95,0.3)",
    border: "rgba(30,58,95,0.8)",
    header: "#1e3a5f",
  },
  child: {
    bg: "rgba(26,71,49,0.3)",
    border: "rgba(26,71,49,0.8)",
    header: "#1a4731",
  },
  fallen: {
    bg: "rgba(74,25,66,0.3)",
    border: "rgba(74,25,66,0.8)",
    header: "#4a1942",
  },
};

const gameById = Object.fromEntries(ZELDA_GAMES.map((g) => [g.id, g]));

export default function TimelinePage() {
  const origin = TIMELINE_BRANCHES["origin"];
  const branches = ["adult", "child", "fallen"] as const;

  return (
    <div style={{ backgroundColor: "#0a0a0f", color: "#ffffff", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: "'Cinzel', Georgia, serif", color: "#d4af37" }}
          >
            The Zelda Timeline
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>
            The official chronology of Hyrule across three parallel branches
          </p>
        </div>

        {/* Before the Split */}
        <div className="mb-8">
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: "rgba(45,106,79,0.2)",
              border: "1px solid rgba(45,106,79,0.5)",
            }}
          >
            <div
              className="px-5 py-3"
              style={{ backgroundColor: "rgba(45,106,79,0.4)" }}
            >
              <h2
                className="font-bold text-sm uppercase tracking-widest"
                style={{ color: "#4dfff0", fontFamily: "'Cinzel', Georgia, serif" }}
              >
                {origin.name}
              </h2>
            </div>
            <div className="p-5">
              <p
                className="text-sm mb-4"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {origin.description}
              </p>
              <div className="flex flex-col gap-2">
                {origin.games.map((id, idx) => {
                  const game = gameById[id];
                  if (!game) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-3 rounded-lg px-4 py-3"
                      style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                    >
                      <span
                        className="text-xs font-mono w-5 text-center"
                        style={{ color: "#4dfff0" }}
                      >
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <span className="font-medium text-sm">{game.title}</span>
                        <span
                          className="ml-3 text-xs"
                          style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                          {game.year} · {game.platform}
                        </span>
                      </div>
                      {id === "ocarina-of-time" && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: "#d4af37", color: "#0a0a0f" }}
                        >
                          Timeline Split
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Split Arrow Visual */}
        <div className="relative flex justify-center mb-8">
          <div className="flex flex-col items-center">
            <div
              className="w-px h-6"
              style={{ backgroundColor: "#d4af37" }}
            />
            <div className="flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#d4af37", color: "#0a0a0f" }}>
              ▼ Timeline Branches Here ▼
            </div>
            <div className="flex gap-0 mt-2">
              {/* Left branch line */}
              <div
                className="w-1/3 h-px"
                style={{ backgroundColor: BRANCH_STYLES.adult.border }}
              />
              <div
                className="w-1/3 h-px"
                style={{ backgroundColor: BRANCH_STYLES.child.border }}
              />
              <div
                className="w-1/3 h-px"
                style={{ backgroundColor: BRANCH_STYLES.fallen.border }}
              />
            </div>
          </div>
        </div>

        {/* Three Branches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branches.map((branchKey) => {
            const branch = TIMELINE_BRANCHES[branchKey];
            const style = BRANCH_STYLES[branchKey];
            return (
              <div
                key={branchKey}
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: style.bg,
                  border: `1px solid ${style.border}`,
                }}
              >
                <div
                  className="px-5 py-3"
                  style={{ backgroundColor: style.header }}
                >
                  <h2
                    className="font-bold text-sm uppercase tracking-widest text-white"
                    style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                  >
                    {branch.name}
                  </h2>
                </div>
                <div className="p-4">
                  <p
                    className="text-xs mb-4 leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {branch.description}
                  </p>
                  <div className="flex flex-col gap-2">
                    {branch.games.map((id, idx) => {
                      const game = gameById[id];
                      if (!game) return null;
                      return (
                        <div
                          key={id}
                          className="flex items-start gap-3 rounded-lg px-3 py-2"
                          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                        >
                          <span
                            className="text-xs font-mono mt-0.5 shrink-0 w-4 text-center"
                            style={{ color: "rgba(255,255,255,0.35)" }}
                          >
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs leading-tight">
                              {game.title}
                            </div>
                            <div
                              className="text-xs mt-0.5"
                              style={{ color: "rgba(255,255,255,0.35)" }}
                            >
                              {game.year}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div
          className="mt-8 rounded-xl p-5"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <h3
            className="text-sm font-bold mb-3 uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Branch Legend
          </h3>
          <div className="flex flex-wrap gap-4">
            {branches.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: BRANCH_STYLES[b].header }}
                />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {TIMELINE_BRANCHES[b].name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
