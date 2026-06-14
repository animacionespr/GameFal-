"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

function useInView(threshold = 0.15) {
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

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, inView } = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); return; }
      setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function ZeldaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    let t = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.min(window.innerHeight, 900);
    };
    resize();
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.4 + 0.2,
      base: Math.random() * 0.85 + 0.15,
      speed: Math.random() * 0.025 + 0.005,
      phase: Math.random() * Math.PI * 2,
    }));
    const embers = Array.from({ length: 35 }, () => ({
      x: Math.random(), y: Math.random() + 0.5,
      r: Math.random() * 2 + 0.6,
      vy: Math.random() * 0.0004 + 0.0001,
      vx: (Math.random() - 0.5) * 0.0002,
      a: Math.random() * 0.7 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      t += 0.008;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      // Sky gradient
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#020208");
      sky.addColorStop(0.35, "#050510");
      sky.addColorStop(0.7, "#080618");
      sky.addColorStop(1, "#0c0a1e");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);
      // Aurora bands
      [[0.2, "#7c3aed", 0.035], [0.6, "#d4af37", 0.025], [0.9, "#1e40af", 0.03]].forEach(([xf, color, alpha], i) => {
        const grd = ctx.createRadialGradient(
          W * (xf as number) + Math.sin(t + i * 2) * 60, H * 0.15, 0,
          W * (xf as number), H * 0.35, W * 0.38
        );
        grd.addColorStop(0, (color as string).replace("#", "rgba(") + `,${alpha})`
          .replace("rgba(", "rgba(")
          .replace(/rgba\(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2}),/, (_, r, g, b) =>
            `rgba(${parseInt(r,16)},${parseInt(g,16)},${parseInt(b,16)},`
          )
        );
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H * 0.6);
      });
      // Stars
      stars.forEach(s => {
        const o = s.base * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H * 0.8, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,248,220,${o})`;
        ctx.fill();
        if (s.r > 1.1) {
          ctx.save();
          ctx.strokeStyle = `rgba(255,248,200,${o * 0.25})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(s.x * W - s.r * 3, s.y * H * 0.8);
          ctx.lineTo(s.x * W + s.r * 3, s.y * H * 0.8);
          ctx.moveTo(s.x * W, s.y * H * 0.8 - s.r * 3);
          ctx.lineTo(s.x * W, s.y * H * 0.8 + s.r * 3);
          ctx.stroke();
          ctx.restore();
        }
      });
      // Embers
      embers.forEach(e => {
        e.y -= e.vy;
        e.x += e.vx + Math.sin(t * 30 * e.vy + e.phase) * 0.0003;
        if (e.y < -0.05) { e.y = 1.1; e.x = Math.random(); }
        if (e.x < 0 || e.x > 1) e.vx *= -1;
        ctx.save();
        ctx.beginPath();
        ctx.arc(e.x * W, e.y * H, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${e.a * (0.6 + 0.4 * Math.sin(t * 40 * e.vy + e.phase))})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#d4af37";
        ctx.fill();
        ctx.restore();
      });
      // Silhouette ground
      ctx.save();
      ctx.fillStyle = "#02020a";
      ctx.beginPath();
      ctx.moveTo(0, H * 0.82);
      for (let x = 0; x <= W; x += 4) {
        const mountain = Math.sin(x * 0.003) * 0.06 + Math.sin(x * 0.007 + 1) * 0.04 + Math.cos(x * 0.002) * 0.03;
        ctx.lineTo(x, H * (0.82 - mountain));
      }
      // Castle silhouette in center
      const cx = W / 2;
      ctx.lineTo(cx + 90, H * 0.82);
      ctx.lineTo(cx + 90, H * 0.65);
      ctx.lineTo(cx + 82, H * 0.65);
      ctx.lineTo(cx + 82, H * 0.60);
      ctx.lineTo(cx + 75, H * 0.55);
      ctx.lineTo(cx + 60, H * 0.65);
      ctx.lineTo(cx + 50, H * 0.58);
      ctx.lineTo(cx + 40, H * 0.68);
      ctx.lineTo(cx + 20, H * 0.52);
      ctx.lineTo(cx, H * 0.48);
      ctx.lineTo(cx - 20, H * 0.52);
      ctx.lineTo(cx - 40, H * 0.68);
      ctx.lineTo(cx - 50, H * 0.58);
      ctx.lineTo(cx - 60, H * 0.65);
      ctx.lineTo(cx - 75, H * 0.55);
      ctx.lineTo(cx - 82, H * 0.60);
      ctx.lineTo(cx - 82, H * 0.65);
      ctx.lineTo(cx - 90, H * 0.65);
      ctx.lineTo(cx - 90, H * 0.82);
      ctx.lineTo(W, H * 0.82);
      ctx.lineTo(W, H);
      ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />
  );
}

function TriforceHero() {
  const [glow, setGlow] = useState(0);
  useEffect(() => {
    let dir = 1, v = 0;
    const iv = setInterval(() => {
      v += dir * 0.015;
      if (v >= 1) dir = -1;
      if (v <= 0) dir = 1;
      setGlow(v);
    }, 30);
    return () => clearInterval(iv);
  }, []);
  const g = glow;
  const shadow = `drop-shadow(0 0 ${8 + g * 12}px rgba(212,175,55,${0.6 + g * 0.4})) drop-shadow(0 0 ${20 + g * 30}px rgba(212,175,55,${0.2 + g * 0.3}))`;
  return (
    <svg width="160" height="140" viewBox="0 0 40 35" style={{ filter: shadow, transition: "filter 0.1s" }}>
      <defs>
        <linearGradient id="hero-tf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff8dc" />
          <stop offset="40%" stopColor="#f5e27a" />
          <stop offset="100%" stopColor="#b8922a" />
        </linearGradient>
      </defs>
      <polygon points="20,0 30,17 10,17" fill="url(#hero-tf)" />
      <polygon points="10,18 20,35 0,35" fill="url(#hero-tf)" />
      <polygon points="30,18 40,35 20,35" fill="url(#hero-tf)" />
    </svg>
  );
}

const sections = [
  {
    href: "/zelda/games",
    title: "Games Catalog",
    desc: "Los 19 juegos principales con plataformas, eras y línea temporal.",
    bg: "linear-gradient(135deg, rgba(26,92,58,0.9) 0%, rgba(10,50,30,0.95) 100%)",
    border: "rgba(52,211,153,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <rect x="2" y="6" width="20" height="14" rx="3" /><path d="M16 2v4M8 2v4M2 10h20" />
        <circle cx="8" cy="16" r="1.5" fill="currentColor" stroke="none" />
        <path d="M15 14h2m-1-1v2" />
      </svg>
    ),
    accent: "#34d399",
    tag: "19 juegos",
  },
  {
    href: "/zelda/timeline",
    title: "Línea Temporal",
    desc: "Las 3 ramas del timeline oficial: Adult, Child y Fallen Hero.",
    bg: "linear-gradient(135deg, rgba(30,58,95,0.9) 0%, rgba(10,20,60,0.95) 100%)",
    border: "rgba(96,165,250,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path d="M3 12h18M3 6l4 6-4 6M21 6l-4 6 4 6" />
      </svg>
    ),
    accent: "#60a5fa",
    tag: "3 ramas",
  },
  {
    href: "/zelda/characters",
    title: "Personajes",
    desc: "Héroes, villanos y compañeros que definen el universo de Zelda.",
    bg: "linear-gradient(135deg, rgba(74,25,66,0.9) 0%, rgba(40,10,40,0.95) 100%)",
    border: "rgba(196,181,253,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
    accent: "#c4b5fd",
    tag: "8 personajes",
  },
  {
    href: "/zelda/items",
    title: "Items & Reliquias",
    desc: "La Master Sword, la Trifuerza, la Ocarina y los artefactos legendarios.",
    bg: "linear-gradient(135deg, rgba(92,58,30,0.9) 0%, rgba(50,25,10,0.95) 100%)",
    border: "rgba(251,191,36,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path d="M14.5 3.5L20 9l-11 11-5.5-1.5L2 13 13 2l1.5 1.5z" /><path d="M14.5 3.5l6 6" />
      </svg>
    ),
    accent: "#fbbf24",
    tag: "10 items",
  },
  {
    href: "/zelda/ai-guide",
    title: "Sheikah AI",
    desc: "Pregunta cualquier cosa sobre Zelda a la Piedra Sheikah inteligente.",
    bg: "linear-gradient(135deg, rgba(13,92,110,0.9) 0%, rgba(5,40,60,0.95) 100%)",
    border: "rgba(34,211,238,0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 8v4M12 16h.01" />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.2" stroke="none" />
      </svg>
    ),
    accent: "#22d3ee",
    tag: "IA real",
  },
];

const chronicles = [
  { date: "Mayo 2023", title: "Tears of the Kingdom", body: "La secuela de Breath of the Wild llega con Ultrahand, Fuse y un Hyrule vertical. Puntuaciones perfectas en todo el mundo.", era: "#1a5c3a" },
  { date: "2021", title: "Skyward Sword HD en Switch", body: "El origen del timeline llega a Switch con controles renovados y mejoras de calidad de vida para jugadores modernos.", era: "#1e3a5f" },
  { date: "2019", title: "Link's Awakening Remake", body: "El clásico de Game Boy regresa con un arte estilo diorama y un constructor de mazmorras sorpresa.", era: "#4a1942" },
  { date: "2017", title: "Breath of the Wild", body: "Nintendo reinventa la saga con mundo abierto. GOTY universal. El inicio de una nueva era para Zelda.", era: "#5c3a1e" },
];

function SectionCard({ s, i }: { s: typeof sections[0]; i: number }) {
  const { ref, inView } = useInView(0.1);
  const [hovered, setHovered] = useState(false);
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(30px)",
      transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
    }}>
      <Link
        href={s.href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "block",
          textDecoration: "none",
          borderRadius: 16,
          padding: "28px 24px",
          background: s.bg,
          border: `1px solid ${hovered ? s.border.replace("0.3", "0.7") : s.border}`,
          boxShadow: hovered
            ? `0 0 30px ${s.accent}22, 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`
            : "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
          transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div style={{ color: s.accent, padding: 10, background: `${s.accent}18`, borderRadius: 10 }}>
            {s.icon}
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
            color: s.accent, background: `${s.accent}18`,
            padding: "4px 10px", borderRadius: 20,
            textTransform: "uppercase",
          }}>
            {s.tag}
          </span>
        </div>
        <h3 style={{
          fontFamily: "'Cinzel', Georgia, serif",
          fontSize: 18, fontWeight: 700,
          color: hovered ? s.accent : "#fff",
          marginBottom: 8,
          transition: "color 0.2s",
        }}>
          {s.title}
        </h3>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{s.desc}</p>
        <div style={{
          marginTop: 16, display: "flex", alignItems: "center", gap: 6,
          fontSize: 13, color: s.accent, fontWeight: 600,
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(0)" : "translateX(-8px)",
          transition: "all 0.2s ease",
        }}>
          Explorar →
        </div>
      </Link>
    </div>
  );
}

export default function ZeldaHomePage() {
  const { ref: chroniclesRef, inView: chroniclesInView } = useInView();

  return (
    <div style={{ backgroundColor: "#04040a", color: "#fff" }}>
      {/* Hero */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <ZeldaCanvas />
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(4,4,10,0.3) 60%, rgba(4,4,10,0.8) 100%)",
        }} />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <TriforceHero />
          </div>
          <div style={{
            fontFamily: "'Cinzel Decorative', Georgia, serif",
            fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 20,
            background: "linear-gradient(135deg, #fff8dc 0%, #f5e27a 30%, #d4af37 60%, #b8922a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "none",
            letterSpacing: "0.02em",
          }}>
            Hyrule Archive
          </div>
          <p style={{
            fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
            color: "rgba(255,255,255,0.65)",
            marginBottom: 12,
            fontFamily: "'Cinzel', Georgia, serif",
            letterSpacing: "0.08em",
          }}>
            La enciclopedia definitiva de
          </p>
          <p style={{
            fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 600,
            color: "rgba(255,255,255,0.9)",
            letterSpacing: "0.15em",
            marginBottom: 48,
          }}>
            THE LEGEND OF ZELDA
          </p>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "center", gap: "clamp(24px,6vw,64px)", marginBottom: 48 }}>
            {[
              { target: 19, suffix: "", label: "Juegos" },
              { target: 40, suffix: "+", label: "Años de leyenda" },
              { target: 3, suffix: "", label: "Ramas del timeline" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: "clamp(2rem,5vw,3rem)",
                  fontWeight: 900,
                  background: "linear-gradient(135deg, #f5e27a, #d4af37)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  <CountUp target={s.target} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/zelda/games" style={{
              padding: "14px 32px", borderRadius: 10, fontWeight: 700, fontSize: 14,
              fontFamily: "'Cinzel', Georgia, serif", letterSpacing: "0.08em",
              background: "linear-gradient(135deg, #d4af37, #b8922a)",
              color: "#04040a", textDecoration: "none",
              boxShadow: "0 4px 20px rgba(212,175,55,0.4), 0 0 0 1px rgba(212,175,55,0.3)",
              transition: "all 0.2s",
            }}>
              Explorar el Archivo
            </Link>
            <Link href="/zelda/ai-guide" style={{
              padding: "14px 32px", borderRadius: 10, fontWeight: 700, fontSize: 14,
              fontFamily: "'Cinzel', Georgia, serif", letterSpacing: "0.08em",
              background: "rgba(34,211,238,0.08)",
              border: "1px solid rgba(34,211,238,0.3)",
              color: "#22d3ee", textDecoration: "none",
              transition: "all 0.2s",
            }}>
              Sheikah AI Guide
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Cinzel', Georgia, serif" }}>Scroll</span>
          <div style={{
            width: 1, height: 40,
            background: "linear-gradient(180deg, rgba(212,175,55,0.6), transparent)",
            animation: "pulse 2s ease-in-out infinite",
          }} />
          <style>{`@keyframes pulse { 0%,100%{opacity:0.4}50%{opacity:1} }`}</style>
        </div>
      </section>

      {/* Sections */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, letterSpacing: "0.2em", color: "#d4af37", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Cinzel', Georgia, serif" }}>El Universo</p>
          <h2 style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: "clamp(1.8rem,4vw,2.8rem)",
            fontWeight: 700,
            background: "linear-gradient(135deg, #f5e27a, #d4af37)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Explora Hyrule
          </h2>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, transparent, #d4af37, transparent)", margin: "16px auto 0" }} />
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {sections.map((s, i) => <SectionCard key={s.href} s={s} i={i} />)}
        </div>
      </section>

      {/* Chronicles */}
      <section style={{
        borderTop: "1px solid rgba(212,175,55,0.1)",
        background: "linear-gradient(180deg, transparent, rgba(212,175,55,0.03) 50%, transparent)",
      }}>
        <div ref={chroniclesRef} style={{
          maxWidth: 1280, margin: "0 auto", padding: "80px 24px",
          opacity: chroniclesInView ? 1 : 0,
          transform: chroniclesInView ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 12, letterSpacing: "0.2em", color: "#d4af37", textTransform: "uppercase", marginBottom: 12, fontFamily: "'Cinzel', Georgia, serif" }}>Historia</p>
            <h2 style={{ fontFamily: "'Cinzel', Georgia, serif", fontSize: "clamp(1.8rem,4vw,2.4rem)", fontWeight: 700, color: "#fff" }}>
              Crónicas de Hyrule
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {chronicles.map((c, i) => (
              <div key={c.title} style={{
                borderRadius: 14, padding: "24px 20px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderLeft: `3px solid ${c.era}`,
                opacity: chroniclesInView ? 1 : 0,
                transform: chroniclesInView ? "translateY(0)" : "translateY(16px)",
                transition: `all 0.5s ease ${i * 0.1}s`,
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#d4af37", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10, fontFamily: "'Cinzel', Georgia, serif" }}>
                  {c.date}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: "#fff" }}>{c.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(212,175,55,0.08)",
        padding: "40px 24px",
        textAlign: "center",
      }}>
        <svg width="24" height="21" viewBox="0 0 40 35" style={{ marginBottom: 14, opacity: 0.4 }}>
          <polygon points="20,0 30,17 10,17" fill="#d4af37" />
          <polygon points="10,18 20,35 0,35" fill="#d4af37" />
          <polygon points="30,18 40,35 20,35" fill="#d4af37" />
        </svg>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", fontFamily: "'Cinzel', Georgia, serif", letterSpacing: "0.05em" }}>
          Hyrule Archive — Fan site. Not affiliated with Nintendo.
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", marginTop: 6 }}>
          The Legend of Zelda™ is a trademark of Nintendo Co., Ltd.
        </p>
      </footer>
    </div>
  );
}
