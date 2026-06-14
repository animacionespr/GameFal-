"use client";

import { useState } from "react";
import { ZELDA_GAMES } from "@/data/zelda";

type Era = "all" | "origin" | "n64" | "switch" | "classic" | "handheld";

const ERA_LABELS: Record<Era, string> = {
  all: "All",
  origin: "Origin",
  n64: "N64 Era",
  switch: "Switch Era",
  classic: "Classic",
  handheld: "Handheld",
};

const TIMELINE_COLORS: Record<string, string> = {
  origin: "#2d6a4f",
  adult: "#1e3a5f",
  child: "#1a4731",
  fallen: "#4a1942",
};

const TIMELINE_LABELS: Record<string, string> = {
  origin: "Before Split",
  adult: "Adult Timeline",
  child: "Child Timeline",
  fallen: "Fallen Hero",
};

export default function GamesPage() {
  const [activeEra, setActiveEra] = useState<Era>("all");

  const filtered =
    activeEra === "all"
      ? ZELDA_GAMES
      : ZELDA_GAMES.filter((g) => g.era === activeEra);

  return (
    <div style={{ backgroundColor: "#0a0a0f", color: "#ffffff", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: "'Cinzel', Georgia, serif", color: "#d4af37" }}
          >
            Games Catalog
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>
            {ZELDA_GAMES.length} main series titles spanning four decades of legend
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(Object.keys(ERA_LABELS) as Era[]).map((era) => (
            <button
              key={era}
              onClick={() => setActiveEra(era)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor:
                  activeEra === era ? "#d4af37" : "rgba(255,255,255,0.05)",
                color: activeEra === era ? "#0a0a0f" : "rgba(255,255,255,0.65)",
                border:
                  activeEra === era
                    ? "1px solid #d4af37"
                    : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {ERA_LABELS[era]}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.35)" }}>
          Showing {filtered.length} game{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((game) => (
            <div
              key={game.id}
              className="rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Color bar */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: game.coverColor }}
              />

              <div className="p-5">
                {/* Title row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="font-semibold text-base leading-tight">
                    {game.title}
                  </h2>
                  <span
                    className="text-xs font-mono shrink-0 px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {game.year}
                  </span>
                </div>

                {/* Platform */}
                <p
                  className="text-xs mb-3"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {game.platform}
                </p>

                {/* Description */}
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {game.description.length > 140
                    ? game.description.slice(0, 137) + "…"
                    : game.description}
                </p>

                {/* Footer badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor:
                        TIMELINE_COLORS[game.timeline] || "#2d6a4f",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {TIMELINE_LABELS[game.timeline] || game.timeline}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: "rgba(212,175,55,0.15)",
                      color: "#d4af37",
                      border: "1px solid rgba(212,175,55,0.3)",
                    }}
                  >
                    ★ {game.rating}/10
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
