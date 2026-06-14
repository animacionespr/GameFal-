"use client";

import { useState, useRef, useEffect } from "react";
import { ZELDA_GAMES } from "@/data/zelda";

const BRANCHES = [
  {
    id: "adult",
    label: "Adult Timeline",
    sublabel: "El Héroe Triunfa",
    color: "#60a5fa",
    bg: "linear-gradient(180deg, rgba(30,58,95,0.5) 0%, rgba(10,20,60,0.3) 100%)",
    border: "rgba(96,165,250,0.35)",
    glow: "rgba(96,165,250,0.2)",
    games: [
      { id: "wind-waker",         title: "The Wind Waker",      year: 2002 },
      { id: "phantom-hourglass",  title: "Phantom Hourglass",   year: 2007 },
      { id: "spirit-tracks",      title: "Spirit Tracks",       year: 2009 },
    ],
  },
  {
    id: "child",
    label: "Child Timeline",
    sublabel: "Link Regresa al Pasado",
    color: "#34d399",
    bg: "linear-gradient(180deg, rgba(26,71,58,0.5) 0%, rgba(10,40,30,0.3) 100%)",
    border: "rgba(52,211,153,0.35)",
    glow: "rgba(52,211,153,0.2)",
    games: [
      { id: "majoras-mask",        title: "Majora's Mask",          year: 2000 },
      { id: "twilight-princess",   title: "Twilight Princess",      year: 2006 },
      { id: "four-swords-adv",     title: "Four Swords Adventures", year: 2004 },
    ],
  },
  {
    id: "fallen",
    label: "Fallen Hero",
    sublabel: "Link es Derrotado",
    color: "#c4b5fd",
    bg: "linear-gradient(180deg, rgba(74,25,66,0.5) 0%, rgba(40,10,50,0.3) 100%)",
    border: "rgba(196,181,253,0.35)",
    glow: "rgba(196,181,253,0.2)",
    games: [
      { id: "alttp",              title: "A Link to the Past",       year: 1991 },
      { id: "links-awakening",    title: "Link's Awakening",         year: 1993 },
      { id: "oracle-ages",        title: "Oracle of Ages",           year: 2001 },
      { id: "oracle-seasons",     title: "Oracle of Seasons",        year: 2001 },
      { id: "albw",               title: "A Link Between Worlds",    year: 2013 },
      { id: "zelda1",             title: "The Legend of Zelda",      year: 1986 },
      { id: "zelda2",             title: "Zelda II: Adventure of Link", year: 1987 },
    ],
  },
];

function useInView(threshold = 0.1) {
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

function GameNode({ title, year, color, index }: { title: string; year: number; color: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView(0.05);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateX(0)" : "translateX(-20px)",
      transition: `opacity 0.4s ease ${index * 0.06}s, transform 0.4s ease ${index * 0.06}s`,
      display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
      borderRadius: 10, cursor: "default",
      background: hovered ? `rgba(255,255,255,0.06)` : "transparent",
    }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
        background: color,
        boxShadow: hovered ? `0 0 14px ${color}, 0 0 6px ${color}` : `0 0 6px ${color}80`,
        transition: "box-shadow 0.3s",
      }} />
      <div style={{ flex: 1, borderLeft: `1px solid ${color}30`, paddingLeft: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: hovered ? "#fff" : "rgba(255,255,255,0.85)", transition: "color 0.2s" }}>
          {title}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2, letterSpacing: "0.08em" }}>{year}</div>
      </div>
      {hovered && (
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}` }} />
      )}
    </div>
  );
}

function BranchColumn({ branch, index }: { branch: typeof BRANCHES[0]; index: number }) {
  const { ref, inView } = useInView(0.1);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`,
      borderRadius: 20,
      border: `1px solid ${branch.border}`,
      background: branch.bg,
      backdropFilter: "blur(8px)",
      overflow: "hidden",
      boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
    }}>
      {/* Branch header */}
      <div style={{
        padding: "20px 20px 16px",
        borderBottom: `1px solid ${branch.border}`,
        background: `linear-gradient(135deg, ${branch.glow}, transparent)`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 12, height: 12, borderRadius: "50%",
            background: branch.color, boxShadow: `0 0 10px ${branch.color}`,
          }} />
          <h3 style={{
            fontFamily: "'Cinzel', serif", fontSize: 16, fontWeight: 700,
            color: branch.color, letterSpacing: "0.05em",
          }}>{branch.label}</h3>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.06em" }}>{branch.sublabel}</p>
        <div style={{
          marginTop: 10, display: "inline-block",
          fontSize: 11, fontWeight: 700,
          color: branch.color, background: `${branch.color}15`,
          border: `1px solid ${branch.border}`,
          padding: "3px 10px", borderRadius: 20, letterSpacing: "0.08em",
        }}>
          {branch.games.length} juegos
        </div>
      </div>

      {/* Games */}
      <div style={{ padding: "12px 8px" }}>
        <div style={{
          marginLeft: 14, borderLeft: `2px solid ${branch.color}30`,
          paddingLeft: 0,
        }}>
          {branch.games.map((g, i) => (
            <GameNode key={g.id} title={g.title} year={g.year} color={branch.color} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TimelinePage() {
  const { ref: heroRef, inView: heroInView } = useInView(0.2);
  const { ref: splitRef, inView: splitInView } = useInView(0.2);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#04040a" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');`}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(180deg, rgba(212,175,55,0.07) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(212,175,55,0.1)",
        padding: "56px 24px 44px",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#d4af37", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Cinzel', serif" }}>Canon Oficial</p>
          <h1 style={{
            fontFamily: "'Cinzel', serif", fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900,
            background: "linear-gradient(135deg, #f5e27a, #d4af37, #b8922a)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: 14,
          }}>Línea Temporal</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>
            El timeline oficial de Nintendo · Hyrule Historia
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Origin */}
        <div ref={heroRef} style={{
          textAlign: "center", marginBottom: 60,
          opacity: heroInView ? 1 : 0,
          transform: heroInView ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}>
          <div style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center",
            padding: "28px 48px",
            borderRadius: 20,
            background: "linear-gradient(135deg, rgba(120,80,20,0.4), rgba(60,30,5,0.6))",
            border: "1px solid rgba(251,191,36,0.4)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(251,191,36,0.1)",
          }}>
            <svg width="48" height="42" viewBox="0 0 40 35" style={{ filter: "drop-shadow(0 0 12px #fbbf24)" }}>
              <polygon points="20,0 30,17 10,17" fill="#fbbf24" />
              <polygon points="10,18 20,35 0,35" fill="#fbbf24" />
              <polygon points="30,18 40,35 20,35" fill="#fbbf24" />
            </svg>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 22, fontWeight: 900, color: "#fbbf24", marginTop: 12, letterSpacing: "0.05em" }}>
              El Origen
            </h2>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
              {[
                { title: "Skyward Sword", year: 2011, note: "El inicio de todo" },
                { title: "The Minish Cap", year: 2004, note: "Antes de Ocarina" },
                { title: "Four Swords", year: 2002, note: "Antes de Ocarina" },
                { title: "Ocarina of Time", year: 1998, note: "El gran punto de quiebre" },
              ].map(g => (
                <div key={g.title} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "8px 20px", borderRadius: 8,
                  background: "rgba(0,0,0,0.3)",
                  border: g.title === "Ocarina of Time" ? "1px solid rgba(251,191,36,0.6)" : "1px solid rgba(251,191,36,0.15)",
                }}>
                  <span style={{ fontSize: 14, fontWeight: g.title === "Ocarina of Time" ? 700 : 500, color: "#fff" }}>{g.title}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{g.year}</span>
                  {g.title === "Ocarina of Time" && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: "#fbbf24",
                      background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.4)",
                      padding: "2px 8px", borderRadius: 10, letterSpacing: "0.08em",
                    }}>SPLIT</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Split indicator */}
        <div ref={splitRef} style={{
          textAlign: "center", marginBottom: 48,
          opacity: splitInView ? 1 : 0,
          transition: "opacity 0.6s ease 0.2s",
        }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", top: "50%", left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }} />
            <div style={{
              position: "relative", zIndex: 1,
              background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(100,50,5,0.4))",
              border: "1px solid rgba(212,175,55,0.5)",
              borderRadius: 30, padding: "10px 24px",
              backdropFilter: "blur(8px)",
            }}>
              <span style={{ fontFamily: "'Cinzel', serif", fontSize: 13, fontWeight: 700, color: "#d4af37", letterSpacing: "0.1em" }}>
                ⟨ TIMELINE SPLIT ⟩
              </span>
            </div>
          </div>
          {/* Branch lines */}
          <div style={{ display: "flex", justifyContent: "space-around", padding: "0 10%", marginTop: 24 }}>
            {BRANCHES.map(b => (
              <div key={b.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 1, height: 32, background: `linear-gradient(180deg, rgba(212,175,55,0.4), ${b.color})` }} />
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: b.color, boxShadow: `0 0 10px ${b.color}` }} />
              </div>
            ))}
          </div>
        </div>

        {/* 3 branches */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24,
        }}>
          {BRANCHES.map((b, i) => <BranchColumn key={b.id} branch={b} index={i} />)}
        </div>

        {/* Legend */}
        <div style={{
          marginTop: 56, padding: "24px", borderRadius: 16,
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
          textAlign: "center",
        }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", fontFamily: "'Cinzel', serif", lineHeight: 1.8 }}>
            Basado en <span style={{ color: "#d4af37" }}>Hyrule Historia</span> (2011) y{" "}
            <span style={{ color: "#d4af37" }}>Encyclopedia</span> (2017) — publicaciones oficiales de Nintendo
          </p>
        </div>
      </div>
    </div>
  );
}
