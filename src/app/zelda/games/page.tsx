"use client";

import { useState, useRef, useEffect } from "react";
import { ZELDA_GAMES } from "@/data/zelda";

type Game = typeof ZELDA_GAMES[0];

const ERA_FILTERS = [
  { id: "all", label: "All" },
  { id: "origin", label: "Origin" },
  { id: "n64", label: "N64 Era" },
  { id: "switch", label: "Switch" },
  { id: "classic", label: "Classic" },
  { id: "handheld", label: "Handheld" },
];

const TC: Record<string, { text: string; bg: string; border: string }> = {
  split:  { text: "#f5e27a", bg: "rgba(212,175,55,0.15)",  border: "rgba(212,175,55,0.5)"  },
  adult:  { text: "#60a5fa", bg: "rgba(30,58,95,0.4)",     border: "rgba(96,165,250,0.4)"  },
  child:  { text: "#34d399", bg: "rgba(26,71,58,0.4)",     border: "rgba(52,211,153,0.4)"  },
  fallen: { text: "#c4b5fd", bg: "rgba(74,25,66,0.4)",     border: "rgba(196,181,253,0.4)" },
  origin: { text: "#fbbf24", bg: "rgba(120,80,20,0.4)",    border: "rgba(251,191,36,0.4)"  },
};

function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function GameCard({ game, index }: { game: Game; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const { ref, inView } = useInView();
  const tc = TC[game.timeline] ?? TC.fallen;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 14, y: -((e.clientY - r.top) / r.height - 0.5) * 14 });
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }); }}
      onMouseMove={onMove}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(${hovered ? -8 : 0}px)`
          : "translateY(30px)",
        transition: inView ? "transform 0.12s ease, box-shadow 0.3s ease" : `opacity 0.5s ease ${index * 0.04}s, transform 0.5s ease ${index * 0.04}s`,
        borderRadius: 18,
        overflow: "hidden",
        willChange: "transform",
        boxShadow: hovered
          ? `0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px ${tc.border}, 0 0 40px ${tc.text}18`
          : "0 4px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* Cover */}
      <div style={{
        height: 150,
        background: `linear-gradient(145deg, ${game.coverColor}ee 0%, ${game.coverColor}55 70%, rgba(4,4,10,0.85) 100%)`,
        position: "relative",
        display: "flex", alignItems: "flex-end",
        padding: "0 16px 14px",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: hovered ? `radial-gradient(ellipse 80% 60% at 50% 0%, ${tc.text}18 0%, transparent 70%)` : "transparent",
          transition: "background 0.4s",
        }} />
        <span style={{
          position: "absolute", top: 14, right: 14,
          fontSize: 13, fontWeight: 800, fontFamily: "'Cinzel', serif",
          color: "rgba(255,255,255,0.95)", background: "rgba(0,0,0,0.45)",
          padding: "4px 10px", borderRadius: 8, backdropFilter: "blur(6px)", letterSpacing: "0.04em",
        }}>{game.year}</span>
        <div style={{ position: "absolute", top: 16, left: 14, display: "flex", gap: 3 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{
              width: 7, height: 7, borderRadius: "50%",
              background: i < Math.round(game.rating / 2) ? "#d4af37" : "rgba(255,255,255,0.18)",
              boxShadow: i < Math.round(game.rating / 2) ? "0 0 6px #d4af37" : "none",
            }} />
          ))}
        </div>
        <span style={{
          fontSize: 11.5, color: "rgba(255,255,255,0.8)",
          background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)",
          padding: "4px 10px", borderRadius: 8, letterSpacing: "0.04em", fontWeight: 500,
        }}>{game.platform}</span>
      </div>

      {/* Body */}
      <div style={{
        padding: "18px 18px 20px",
        background: "linear-gradient(180deg, rgba(8,6,20,0.97) 0%, rgba(4,4,10,0.99) 100%)",
        borderTop: `1px solid ${tc.border}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 }}>
          <h3 style={{
            fontFamily: "'Cinzel', serif", fontSize: 15.5, fontWeight: 700,
            color: hovered ? tc.text : "#fff", lineHeight: 1.3, flex: 1,
            transition: "color 0.25s",
          }}>{game.title}</h3>
          <span style={{
            fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
            color: tc.text, background: tc.bg, border: `1px solid ${tc.border}`,
            padding: "3px 9px", borderRadius: 20, letterSpacing: "0.07em", textTransform: "uppercase",
          }}>{game.timeline}</span>
        </div>
        <p style={{
          fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.65,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{game.description}</p>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${game.rating * 10}%`,
              background: `linear-gradient(90deg, ${tc.text}88, ${tc.text})`, borderRadius: 2,
            }} />
          </div>
          <span style={{ fontSize: 12, color: tc.text, fontWeight: 700, minWidth: 20 }}>{game.rating}</span>
        </div>
      </div>
    </div>
  );
}

export default function GamesPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? ZELDA_GAMES : ZELDA_GAMES.filter(g => g.era === filter);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#04040a" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');`}</style>

      <div style={{
        background: "linear-gradient(180deg, rgba(212,175,55,0.07) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(212,175,55,0.1)",
        padding: "56px 24px 44px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#d4af37", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Cinzel', serif" }}>El Legado Completo</p>
          <h1 style={{
            fontFamily: "'Cinzel', serif", fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900,
            background: "linear-gradient(135deg, #f5e27a, #d4af37, #b8922a)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: 14,
          }}>Games Catalog</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>
            {ZELDA_GAMES.length} juegos · {filtered.length} mostrando
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 32 }}>
            {ERA_FILTERS.map(f => {
              const active = filter === f.id;
              return (
                <button key={f.id} onClick={() => setFilter(f.id)} style={{
                  padding: "9px 22px", borderRadius: 30, fontSize: 13, fontWeight: 700,
                  fontFamily: "'Cinzel', serif", letterSpacing: "0.07em", cursor: "pointer", border: "none",
                  background: active ? "linear-gradient(135deg, #f5e27a, #d4af37, #b8922a)" : "rgba(255,255,255,0.05)",
                  color: active ? "#04040a" : "rgba(255,255,255,0.55)",
                  boxShadow: active ? "0 4px 20px rgba(212,175,55,0.4), 0 0 0 1px rgba(212,175,55,0.6)" : "0 0 0 1px rgba(255,255,255,0.1)",
                  transform: active ? "translateY(-1px)" : "none",
                  transition: "all 0.2s ease",
                }}>{f.label}</button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 20 }}>
            {Object.entries(TC).map(([key, c]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.text, boxShadow: `0 0 6px ${c.text}` }} />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "capitalize", letterSpacing: "0.06em" }}>{key}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 24 }}>
          {filtered.map((game, i) => <GameCard key={game.id} game={game} index={i} />)}
        </div>
      </div>
    </div>
  );
}
