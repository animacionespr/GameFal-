"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const SUGGESTIONS = [
  "¿Por dónde empiezo a jugar Zelda?",
  "¿Qué es el timeline de Zelda?",
  "Cuéntame sobre Ganondorf",
  "¿Cuál es el mejor Zelda?",
  "¿Qué es la Trifuerza?",
  "¿Quién es realmente Sheik?",
];

function TypingIndicator({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", gap: 5, padding: "12px 6px", alignItems: "center" }}>
      {[0, 0.2, 0.4].map((delay, i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
          animation: `bounce 1.2s ease-in-out ${delay}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }
      `}</style>
    </div>
  );
}

function SheikahEye() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" style={{ filter: "drop-shadow(0 0 8px #22d3ee)" }}>
      <circle cx="18" cy="18" r="16" fill="rgba(0,80,100,0.6)" stroke="#22d3ee" strokeWidth="1" />
      <ellipse cx="18" cy="18" rx="8" ry="10" fill="none" stroke="#22d3ee" strokeWidth="0.8" />
      <circle cx="18" cy="18" r="4" fill="#22d3ee" />
      <circle cx="18" cy="18" r="2" fill="#04040a" />
      <path d="M4 18 Q18 10 32 18" stroke="#22d3ee" strokeWidth="0.5" fill="none" opacity="0.4" />
      <path d="M4 18 Q18 26 32 18" stroke="#22d3ee" strokeWidth="0.5" fill="none" opacity="0.4" />
    </svg>
  );
}

export default function AIGuidePage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Salve, viajero. Soy el oráculo Sheikah — guardián del conocimiento de Hyrule. ¿Qué secretos deseas descubrir hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanLine, setScanLine] = useState(0);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const iv = setInterval(() => setScanLine(v => (v + 1) % 100), 30);
    return () => clearInterval(iv);
  }, []);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/zelda/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.reply ?? "La Piedra Sheikah no pudo responder en este momento." }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Error de conexión con la Piedra Sheikah. Inténtalo de nuevo." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020b10", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Share+Tech+Mono&display=swap');

        @keyframes scanline-move {
          0% { top: -2%; } 100% { top: 102%; }
        }
        @keyframes flicker {
          0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.85} 94%{opacity:1} 97%{opacity:0.9} 98%{opacity:1}
        }
        @keyframes glow-pulse {
          0%,100%{box-shadow:0 0 20px rgba(34,211,238,0.3),inset 0 0 30px rgba(34,211,238,0.05)}
          50%{box-shadow:0 0 40px rgba(34,211,238,0.5),inset 0 0 50px rgba(34,211,238,0.1)}
        }
        @keyframes text-appear {
          from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)}
        }
        .sheikah-msg { animation: text-appear 0.35s ease forwards; }
        .sheikah-input::placeholder { color: rgba(34,211,238,0.3); }
        .sheikah-input:focus { outline: none; }
        .suggestion-btn:hover { background: rgba(34,211,238,0.15) !important; color: #22d3ee !important; transform: translateY(-1px); }
        .suggestion-btn { transition: all 0.2s ease; }
        .send-btn:hover { background: rgba(34,211,238,0.2) !important; }
        .send-btn { transition: all 0.2s; }
      `}</style>

      {/* BG grid */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(34,211,238,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34,211,238,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }} />

      {/* Scan line */}
      <div style={{
        position: "fixed", left: 0, right: 0, height: 2, zIndex: 1, pointerEvents: "none",
        background: "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.3) 50%, transparent 100%)",
        animation: "scanline-move 4s linear infinite",
        opacity: 0.6,
      }} />

      {/* Ambient radial glow */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(34,211,238,0.06) 0%, transparent 70%)",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 2,
        maxWidth: 800, margin: "0 auto",
        padding: "0 16px",
        display: "flex", flexDirection: "column", minHeight: "100vh",
        animation: "flicker 8s ease infinite",
      }}>

        {/* Header */}
        <div style={{
          textAlign: "center",
          padding: "36px 0 24px",
          borderBottom: "1px solid rgba(34,211,238,0.15)",
        }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <div style={{
              padding: 12, borderRadius: "50%",
              background: "rgba(34,211,238,0.08)",
              border: "1px solid rgba(34,211,238,0.3)",
              animation: "glow-pulse 3s ease-in-out infinite",
            }}>
              <SheikahEye />
            </div>
          </div>
          <h1 style={{
            fontFamily: "'Cinzel', serif", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 900,
            color: "#22d3ee",
            textShadow: "0 0 20px rgba(34,211,238,0.8), 0 0 40px rgba(34,211,238,0.3)",
            letterSpacing: "0.12em",
            marginBottom: 6,
          }}>SHEIKAH ORACLE</h1>
          <p style={{
            fontSize: 12, color: "rgba(34,211,238,0.5)",
            fontFamily: "'Share Tech Mono', monospace",
            letterSpacing: "0.2em", textTransform: "uppercase",
          }}>
            ◆ SISTEMA ACTIVO · ZNKH-v2.7 ◆
          </p>
        </div>

        {/* Suggestions */}
        <div style={{ padding: "16px 0 8px", display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              className="suggestion-btn"
              onClick={() => send(s)}
              disabled={loading}
              style={{
                padding: "7px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                fontFamily: "'Share Tech Mono', monospace",
                background: "rgba(34,211,238,0.06)",
                border: "1px solid rgba(34,211,238,0.2)",
                color: "rgba(34,211,238,0.7)",
                letterSpacing: "0.04em",
              }}
            >{s}</button>
          ))}
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "16px 0",
          display: "flex", flexDirection: "column", gap: 16,
          minHeight: 300,
        }}>
          {messages.map((m, i) => (
            <div key={i} className="sheikah-msg" style={{
              display: "flex",
              flexDirection: m.role === "user" ? "row-reverse" : "row",
              gap: 12, alignItems: "flex-start",
            }}>
              {m.role === "ai" && (
                <div style={{ flexShrink: 0, marginTop: 4 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "rgba(34,211,238,0.1)",
                    border: "1px solid rgba(34,211,238,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <SheikahEye />
                  </div>
                </div>
              )}
              <div style={{
                maxWidth: "75%",
                padding: "14px 18px",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: m.role === "user"
                  ? "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(20,100,130,0.25))"
                  : "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
                border: m.role === "user"
                  ? "1px solid rgba(34,211,238,0.35)"
                  : "1px solid rgba(34,211,238,0.15)",
                boxShadow: m.role === "user"
                  ? "0 4px 20px rgba(34,211,238,0.15)"
                  : "none",
              }}>
                <p style={{
                  fontSize: 14, lineHeight: 1.75,
                  color: m.role === "user" ? "#fff" : "rgba(255,255,255,0.85)",
                  fontFamily: "'Share Tech Mono', monospace",
                  whiteSpace: "pre-wrap",
                }}>{m.text}</p>
              </div>
              {m.role === "user" && (
                <div style={{ flexShrink: 0, marginTop: 4 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, #0f766e, #0d9488)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 12px rgba(34,211,238,0.3)",
                    fontSize: 16,
                  }}>👤</div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <SheikahEye />
              </div>
              <div style={{
                padding: "10px 16px", borderRadius: "18px 18px 18px 4px",
                border: "1px solid rgba(34,211,238,0.15)",
                background: "rgba(255,255,255,0.03)",
              }}>
                <TypingIndicator color="#22d3ee" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div style={{
          borderTop: "1px solid rgba(34,211,238,0.15)",
          padding: "16px 0 24px",
          display: "flex", gap: 12,
        }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center",
            background: "rgba(34,211,238,0.05)",
            border: "1px solid rgba(34,211,238,0.25)",
            borderRadius: 14,
            paddingLeft: 16,
            boxShadow: "inset 0 0 20px rgba(34,211,238,0.03)",
            transition: "border-color 0.2s, box-shadow 0.2s",
          }}>
            <span style={{ fontSize: 14, color: "rgba(34,211,238,0.4)", marginRight: 8, fontFamily: "monospace" }}>›</span>
            <input
              ref={inputRef}
              className="sheikah-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Pregunta al oráculo Sheikah..."
              disabled={loading}
              style={{
                flex: 1, background: "none", border: "none",
                color: "#22d3ee", fontSize: 14,
                fontFamily: "'Share Tech Mono', monospace",
                padding: "14px 8px 14px 0",
                caretColor: "#22d3ee",
              }}
            />
          </div>
          <button
            className="send-btn"
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            style={{
              padding: "0 20px", borderRadius: 14,
              background: loading || !input.trim() ? "rgba(34,211,238,0.05)" : "rgba(34,211,238,0.12)",
              border: "1px solid rgba(34,211,238,0.3)",
              color: loading || !input.trim() ? "rgba(34,211,238,0.3)" : "#22d3ee",
              fontSize: 20, cursor: loading || !input.trim() ? "default" : "pointer",
              boxShadow: loading || !input.trim() ? "none" : "0 0 20px rgba(34,211,238,0.2)",
            }}
          >
            {loading ? (
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                border: "2px solid rgba(34,211,238,0.2)",
                borderTopColor: "#22d3ee",
                animation: "spin 0.8s linear infinite",
              }} />
            ) : "⟩"}
          </button>
        </div>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    </div>
  );
}
