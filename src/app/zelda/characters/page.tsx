"use client";

import { useState } from "react";
import { ZELDA_CHARACTERS } from "@/data/zelda";

export default function CharactersPage() {
  const [revealedSpoilers, setRevealedSpoilers] = useState<Set<string>>(new Set());

  const toggleSpoiler = (id: string) => {
    setRevealedSpoilers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div style={{ backgroundColor: "#0a0a0f", color: "#ffffff", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: "'Cinzel', Georgia, serif", color: "#d4af37" }}
          >
            Characters
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>
            The heroes, villains, and companions of Hyrule across the ages
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ZELDA_CHARACTERS.map((character) => {
            const spoilerRevealed = revealedSpoilers.has(character.id);
            return (
              <div
                key={character.id}
                className="rounded-xl overflow-hidden flex flex-col"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {/* Color bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: character.color }}
                />

                <div className="p-5 flex flex-col flex-1">
                  {/* Avatar placeholder */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4"
                    style={{ backgroundColor: character.color }}
                  >
                    {character.name[0]}
                  </div>

                  {/* Name */}
                  <h2 className="font-semibold text-base mb-1">{character.name}</h2>

                  {/* Role badge */}
                  <span
                    className="inline-block text-xs px-2 py-0.5 rounded-full mb-3 w-fit"
                    style={{
                      backgroundColor: `${character.color}44`,
                      color: "rgba(255,255,255,0.75)",
                      border: `1px solid ${character.color}66`,
                    }}
                  >
                    {character.role}
                  </span>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed mb-4 flex-1"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {character.description}
                  </p>

                  {/* Spoiler section */}
                  <div>
                    {spoilerRevealed ? (
                      <div
                        className="rounded-lg p-3 mb-3"
                        style={{
                          backgroundColor: "rgba(212,175,55,0.08)",
                          border: "1px solid rgba(212,175,55,0.2)",
                        }}
                      >
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "rgba(255,255,255,0.7)" }}
                        >
                          {character.spoilerInfo}
                        </p>
                      </div>
                    ) : null}
                    <button
                      onClick={() => toggleSpoiler(character.id)}
                      className="w-full py-2 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        backgroundColor: spoilerRevealed
                          ? "rgba(212,175,55,0.15)"
                          : "rgba(255,255,255,0.05)",
                        color: spoilerRevealed
                          ? "#d4af37"
                          : "rgba(255,255,255,0.5)",
                        border: spoilerRevealed
                          ? "1px solid rgba(212,175,55,0.3)"
                          : "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {spoilerRevealed ? "▲ Hide Spoiler" : "▼ Reveal Spoiler"}
                    </button>
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
