"use client";

import { useState, useRef, useEffect } from "react";
import { ZELDA_CHARACTERS } from "@/data/zelda";

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

const CHAR_DATA: Record<string, { initials: string; gradient: string; glow: string; accentBg: string }> = {
  link:        { initials: "L",  gradient: "linear-gradient(135deg, #1a7a40, #2d9e5c)", glow: "#34d399", accentBg: "rgba(52,211,153,0.1)" },
  zelda:       { initials: "Z",  gradient: "linear-gradient(135deg, #1e3a8a, #2563eb)", glow: "#60a5fa", accentBg: "rgba(96,165,250,0.1)" },
  ganondorf:   { initials: "G",  gradient: "linear-gradient(135deg, #7c2d12, #b45309)", glow: "#f97316", accentBg: "rgba(249,115,22,0.1)" },
  midna:       { initials: "M",  gradient: "linear-gradient(135deg, #4c1d95, #7c3aed)", glow: "#c4b5fd", accentBg: "rgba(196,181,253,0.1)" },
  sheik:       { initials: "S",  gradient: "linear-gradient(135deg, #0f766e, #0d9488)", glow: "#2dd4bf", accentBg: "rgba(45,212,191,0.1)" },
  impa:        { initials: "I",  gradient: "linear-gradient(135deg, #1e3a5f, #2563eb)", glow: "#93c5fd", accentBg: "rgba(147,197,253,0.1)" },
  fi:          { initials: "Fi", gradient: "linear-gradient(135deg, #1d4ed8, #60a5fa)", glow: "#bfdbfe", accentBg: "rgba(191,219,254,0.1)" },
  navi:        { initials: "N",  gradient: "linear-gradient(135deg, #0e7490, #22d3ee)", glow: "#67e8f9", accentBg: "rgba(103,232,249,0.1)" },
};

type Character = typeof ZELDA_CHARACTERS[0];

function CharacterCard({ char, index }: { char: Character; index: number }) {
  const [spoiler, setSpoiler] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { ref, inView } = useInView(0.05);
  const data = CHAR_DATA[char.id] ?? CHAR_DATA.link;

  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
      transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
    }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid ${hovered ? data.glow + "55" : "rgba(255,255,255,0.07)"}`,
          boxShadow: hovered
            ? `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px ${data.glow}22, 0 0 60px ${data.glow}12`
            : "0 4px 20px rgba(0,0,0,0.3)",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          background: "#06060f",
        }}
      >
        {/* Character visual header */}
        <div style={{
          height: 200,
          background: `linear-gradient(145deg, ${data.gradient.match(/linear-gradient\(135deg, ([^,]+),/)?.[1] ?? "#1a1a2e"}88 0%, rgba(4,4,10,0.9) 100%)`,
          position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          {/* Background atmospheric glow */}
          <div style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse 70% 80% at 50% 40%, ${data.glow}18 0%, transparent 70%)`,
            transition: "opacity 0.4s",
            opacity: hovered ? 1 : 0.5,
          }} />
          {/* Decorative circles */}
          <div style={{
            position: "absolute",
            width: 200, height: 200,
            borderRadius: "50%",
            border: `1px solid ${data.glow}15`,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
          }} />
          <div style={{
            position: "absolute",
            width: 150, height: 150,
            borderRadius: "50%",
            border: `1px solid ${data.glow}20`,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
          }} />
          {/* Initials circle */}
          <div style={{
            width: 90, height: 90, borderRadius: "50%",
            background: data.gradient,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: hovered
              ? `0 0 0 6px ${data.glow}20, 0 0 40px ${data.glow}50, 0 0 80px ${data.glow}20`
              : `0 0 0 3px ${data.glow}20, 0 0 20px ${data.glow}30`,
            transition: "box-shadow 0.4s",
            position: "relative", zIndex: 1,
          }}>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: data.initials.length > 1 ? 22 : 32,
              fontWeight: 900,
              color: "#fff",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}>{data.initials}</span>
          </div>
          {/* Role badge */}
          <div style={{
            position: "absolute", bottom: 14, left: 0, right: 0,
            display: "flex", justifyContent: "center",
          }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: data.glow, background: `${data.glow}15`,
              border: `1px solid ${data.glow}40`,
              padding: "4px 14px", borderRadius: 20,
              backdropFilter: "blur(4px)",
            }}>{char.role}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 20px 24px" }}>
          <h3 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 20, fontWeight: 700,
            color: hovered ? data.glow : "#fff",
            marginBottom: 12,
            transition: "color 0.25s",
            letterSpacing: "0.04em",
          }}>{char.name}</h3>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 18 }}>
            {char.description}
          </p>

          {char.spoilerInfo && (
            <div>
              <button
                onClick={() => setSpoiler(!spoiler)}
                style={{
                  width: "100%", padding: "10px 16px",
                  borderRadius: 10, border: `1px solid ${data.glow}30`,
                  background: spoiler ? `${data.glow}15` : "rgba(255,255,255,0.04)",
                  color: spoiler ? data.glow : "rgba(255,255,255,0.5)",
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'Cinzel', serif", letterSpacing: "0.06em",
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <span>{spoiler ? "🔓" : "🔒"}</span>
                {spoiler ? "Ocultar Spoiler" : "Revelar Secreto"}
              </button>
              {spoiler && (
                <div style={{
                  marginTop: 12, padding: "14px 16px",
                  borderRadius: 10,
                  background: `${data.glow}0d`,
                  border: `1px solid ${data.glow}25`,
                  borderLeft: `3px solid ${data.glow}`,
                }}>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                    ⚠️ {char.spoilerInfo}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CharactersPage() {
  const { ref: headerRef, inView: headerInView } = useInView(0.2);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#04040a" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');`}</style>

      <div style={{
        background: "linear-gradient(180deg, rgba(212,175,55,0.07) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(212,175,55,0.1)",
        padding: "56px 24px 44px",
      }}>
        <div ref={headerRef} style={{
          maxWidth: 1280, margin: "0 auto",
          opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(16px)",
          transition: "all 0.6s ease",
        }}>
          <p style={{ fontSize: 11, letterSpacing: "0.25em", color: "#d4af37", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Cinzel', serif" }}>Los Elegidos</p>
          <h1 style={{
            fontFamily: "'Cinzel', serif", fontSize: "clamp(2.2rem,5vw,4rem)", fontWeight: 900,
            background: "linear-gradient(135deg, #f5e27a, #d4af37, #b8922a)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            marginBottom: 14,
          }}>Personajes</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>
            Héroes, villanos y guardianes que moldean el destino de Hyrule
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 28 }}>
          {ZELDA_CHARACTERS.map((char, i) => (
            <CharacterCard key={char.id} char={char} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
