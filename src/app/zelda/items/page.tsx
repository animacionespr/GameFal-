"use client";

import { ZELDA_ITEMS, ZELDA_GAMES } from "@/data/zelda";

const RARITY_STYLES: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  legendary: {
    bg: "rgba(212,175,55,0.15)",
    text: "#d4af37",
    border: "rgba(212,175,55,0.4)",
    label: "Legendary",
  },
  epic: {
    bg: "rgba(124,58,237,0.15)",
    text: "#a78bfa",
    border: "rgba(124,58,237,0.4)",
    label: "Epic",
  },
  rare: {
    bg: "rgba(37,99,235,0.15)",
    text: "#60a5fa",
    border: "rgba(37,99,235,0.4)",
    label: "Rare",
  },
  common: {
    bg: "rgba(107,114,128,0.15)",
    text: "#9ca3af",
    border: "rgba(107,114,128,0.4)",
    label: "Common",
  },
};

const gameById = Object.fromEntries(ZELDA_GAMES.map((g) => [g.id, g]));

export default function ItemsPage() {
  const sortedItems = [...ZELDA_ITEMS].sort((a, b) => {
    const order = ["legendary", "epic", "rare", "common"];
    return order.indexOf(a.rarity) - order.indexOf(b.rarity);
  });

  return (
    <div style={{ backgroundColor: "#0a0a0f", color: "#ffffff", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: "'Cinzel', Georgia, serif", color: "#d4af37" }}
          >
            Items & Relics
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>
            Legendary weapons, sacred artifacts, and iconic tools from across Hyrule
          </p>
        </div>

        {/* Rarity legend */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(RARITY_STYLES).map(([key, style]) => (
            <div
              key={key}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: style.bg,
                color: style.text,
                border: `1px solid ${style.border}`,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: style.text }}
              />
              {style.label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedItems.map((item) => {
            const rarity = RARITY_STYLES[item.rarity] ?? RARITY_STYLES.common;
            return (
              <div
                key={item.id}
                className="rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Top accent */}
                <div
                  className="h-0.5 w-full"
                  style={{ backgroundColor: rarity.text }}
                />

                <div className="p-5">
                  {/* Name + rarity */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-1">
                      <h2 className="font-semibold text-base mb-1">{item.name}</h2>
                      <span
                        className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: rarity.bg,
                          color: rarity.text,
                          border: `1px solid ${rarity.border}`,
                        }}
                      >
                        {rarity.label}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {item.description}
                  </p>

                  {/* Appears in */}
                  <div>
                    <p
                      className="text-xs font-medium mb-2 uppercase tracking-wider"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      Appears in ({item.games.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.games.map((gameId) => {
                        const game = gameById[gameId];
                        return (
                          <span
                            key={gameId}
                            className="text-xs px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: "rgba(255,255,255,0.05)",
                              color: "rgba(255,255,255,0.5)",
                            }}
                          >
                            {game ? game.title : gameId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
