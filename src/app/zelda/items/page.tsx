"use client";

import { useState, useRef, useEffect } from "react";
import { ZELDA_ITEMS, ZELDA_GAMES } from "@/data/zelda";

const RARITY: Record<string, { label: string; color: string; bg: string; border: string; glow: string; shadow: string }> = {
  legendary: {
    label: "Legendary",
    color: "#f5e27a",
    bg: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(120,80,10,0.3))",
    border: "rgba(212,175,55,0.5)",
    glow: "#d4af37",
    shadow: "rgba(212,175,55,0.3)",
  },
  epic: {
    label: "Epic",
    color: "#c4b5fd",
    bg: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(74,25,100,0.3))",
    border: "rgba(167,139,250,0.45)",
    glow: "#a78bfa",
    shadow: "rgba(167,139,250,0.25)",
  },
  rare: {
    label: "Rare",
    color: "#60a5fa",
    bg: "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(20,50,100,0.3))",
    border: "rgba(96,165,250,0.45)",
    glow: "#60a5fa",
    shadow: "rgba(96,165,250,0.2)",
  },
  common: {
    label: "Common",
    color: "rgba(255,255,255,0.6)",
    bg: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
    border: "rgba(255,255,255,0.12)",
    glow: "rgba(255,255,255,0.5)",
    shadow: "rgba(255,255,255,0.05)",
  },
};

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const ITEM_ICONS: Record<string, string> = {
  "master-sword": "⚔️",
  "triforce": "△",
  "ocarina": "🎵",
  "hookshot": "🪝",
  "bow-of-light": "🏹",
  "hylian-shield": "🛡️",
  "wind-waker": "🌊",
  "lens-of-truth": "👁️",
  "bomb": "💣",
  "boomerang": "🪃",
};

type Item = typeof ZELDA_ITEMS[0];

function ItemCard({ item, index }: { item: Item; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView();
  const r = RARITY[item.rarity] ?? RARITY.common;
  const gameNames = item.games.map(gid => ZELDA_GAMES.find(g => g.id === gid)?.title ?? gid);
  const icon = ITEM_ICONS[item.id] ?? "✦";

  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
      transition: `opacity 0.5s ease ${index * 0.06}s, transform 0.5s ease ${index * 0.06}s`,
    }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: 20,
          background: hovered ? r.bg : "rgba(8,6,20,0.9)",
          border: `1px solid ${hovered ? r.border : "rgba(255,255,255,0.07)"}`,
          padding: "24px 22px",
          boxShadow: hovered
            ? `0 16px 40px rgba(0,0,0,0.5), 0 0 60px ${r.shadow}, inset 0 1px 0 rgba(255,255,255,0.08)`
            : "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Rarity glow ring + icon */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{
            width: 70, height: 70, borderRadius: 16,
            background: hovered ? r.bg : "rgba(255,255,255,0.04)",
            border: `1px solid ${r.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: item.id === "triforce" ? 28 : 32,
            boxShadow: hovered ? `0 0 30px ${r.shadow}, 0 0 8px ${r.glow}40` : "none",
            transition: "all 0.35s ease",
            position: "relative",
          }}>
            {/* Particle ring for legendary */}
            {item.rarity === "legendary" && hovered && (
              <div style={{
                position: "absolute", inset: -4,
                borderRadius: 20,
                border: "1px solid rgba(212,175,55,0.4)",
                animation: "spin 3s linear infinite",
              }} />
            )}
            {icon}
          </div>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 800, letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: r.color,
              background: `${r.glow}18`,
              border: `1px solid ${r.border}`,
              padding: "4px 12px", borderRadius: 20,
              boxShadow: hovered ? `0 0 10px ${r.shadow}` : "none",
              transition: "box-shadow 0.3s",
            }}>{r.label}</span>
          </div>
        </div>

        <h3 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 18, fontWeight: 700,
          color: hovered ? r.color : "#fff",
          marginBottom: 10,
          transition: "color 0.25s",
          letterSpacing: "0.03em",
        }}>{item.name}</h3>

        <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: 18 }}>
          {item.description}
        </p>

        {/* Appears in */}
        <div>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'Cinzel', serif" }}>
            Aparece en
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {gameNames.slice(0, 5).map(name => (
              <span key={name} style={{
                fontSize: 11, fontWeight: 500,
                color: "rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "3px 9px", borderRadius: 8,
              }}>{name}</span>
            ))}
            {gameNames.length > 5 && (
              <span style={{
                fontSize: 11, color: r.color,
                background: `${r.glow}12`,
                border: `1px solid ${r.border}`,
                padding: "3px 9px", borderRadius: 8,
              }}>+{gameNames.length - 5} más</span>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

const ORDER = ["legendary", "epic", "rare", "common"];

export default function ItemsPage() {
  const [filter, setFilter] = useState("all");
  const sorted = [...ZELDA_ITEMS].sort((a, b) => ORDER.indexOf(a.rarity) - ORDER.indexOf(b.rarity));
  const filtered = filter === "all" ? sorted : sorted.filter(i => i.rarity === filter);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#04040a" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');`}</style>

      <div style={{
        background: "linear-gradient(180deg, rgba(212,175,55,0.07) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(212,175,55,0.1)",
        padding: "56px 24px 44px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#d4af37", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Cinzel', serif" }}>Artefactos Sagrados</p>
          <h1 style={{
            fontFamily: "'Cinzel', serif", fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900,
            background: "linear-gradient(135deg, #f5e27a, #d4af37, #b8922a)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: 14,
          }}>Items & Reliquias</h1>

          {/* Rarity filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 28 }}>
            {[{ id: "all", label: "Todos" }, ...ORDER.map(r => ({ id: r, label: RARITY[r].label }))].map(f => {
              const active = filter === f.id;
              const rar = f.id !== "all" ? RARITY[f.id] : null;
              return (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  padding: "9px 22px", borderRadius: 30, fontSize: 13, fontWeight: 700,
                  fontFamily: "'Cinzel', serif", letterSpacing: "0.07em",
                  cursor: "pointer", border: "none",
                  background: active
                    ? (rar ? rar.bg : "linear-gradient(135deg, #f5e27a, #d4af37)")
                    : "rgba(255,255,255,0.05)",
                  color: active ? (rar ? rar.color : "#04040a") : "rgba(255,255,255,0.5)",
                  boxShadow: active && rar ? `0 4px 20px ${rar.shadow}` : active ? "0 4px 20px rgba(212,175,55,0.4)" : "0 0 0 1px rgba(255,255,255,0.1)",
                  outline: active && rar ? `1px solid ${rar.border}` : "none",
                  transform: active ? "translateY(-1px)" : "none",
                  transition: "all 0.2s ease",
                }}>{f.label}</button>
              );
            })}
          </div>

          {/* Rarity legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 20 }}>
            {ORDER.map(key => {
              const r = RARITY[key];
              return (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: r.color, boxShadow: `0 0 8px ${r.glow}` }} />
                  <span style={{ fontSize: 12, color: r.color, fontWeight: 600, letterSpacing: "0.06em" }}>{r.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {filtered.map((item, i) => <ItemCard key={item.id} item={item} index={i} />)}
        </div>
      </div>
    </div>
  );
}
