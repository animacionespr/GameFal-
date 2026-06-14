"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const TriforceAvatar = () => (
  <div
    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
    style={{ backgroundColor: "#0d5c6e", border: "1px solid rgba(77,255,240,0.3)" }}
  >
    <svg width="14" height="12" viewBox="0 0 40 35">
      <polygon points="20,0 30,17 10,17" fill="#4dfff0" />
      <polygon points="10,18 20,35 0,35" fill="#4dfff0" />
      <polygon points="30,18 40,35 20,35" fill="#4dfff0" />
    </svg>
  </div>
);

const SUGGESTED_QUESTIONS = [
  "Where should I start?",
  "What's the Zelda timeline?",
  "Tell me about Ganondorf",
  "What are the best games?",
];

const TYPING_DOTS = [".", "..", "..."];

export default function AIGuidePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Greetings, traveler. I am the Sheikah Stone AI, keeper of ancient Hyrulean knowledge. The winds carry many questions — what wisdom do you seek from the archives of legend?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [typingDot, setTypingDot] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setTypingDot((prev) => (prev + 1) % TYPING_DOTS.length);
    }, 400);
    return () => clearInterval(interval);
  }, [isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/zelda/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = (await res.json()) as { reply: string };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "The Sheikah Stone flickers... The connection to the ancient archives has been lost. Please try again, hero.",
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div
      style={{
        backgroundColor: "#050d10",
        color: "#ffffff",
        minHeight: "100vh",
        backgroundImage:
          "radial-gradient(ellipse at center, rgba(13,92,110,0.15) 0%, transparent 70%)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 flex flex-col h-screen">
        {/* Header */}
        <div className="text-center mb-8 shrink-0">
          <div className="flex justify-center mb-3">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "rgba(13,92,110,0.4)",
                border: "2px solid rgba(77,255,240,0.4)",
                boxShadow: "0 0 30px rgba(77,255,240,0.15)",
              }}
            >
              <svg width="28" height="24" viewBox="0 0 40 35">
                <polygon points="20,0 30,17 10,17" fill="#4dfff0" />
                <polygon points="10,18 20,35 0,35" fill="#4dfff0" />
                <polygon points="30,18 40,35 20,35" fill="#4dfff0" />
              </svg>
            </div>
          </div>
          <h1
            className="text-3xl font-bold mb-1"
            style={{
              fontFamily: "'Cinzel', Georgia, serif",
              color: "#4dfff0",
            }}
          >
            Sheikah AI Guide
          </h1>
          <p style={{ color: "rgba(77,255,240,0.5)", fontSize: "0.85rem" }}>
            Ancient wisdom from the Sheikah Stone
          </p>
        </div>

        {/* Chat area */}
        <div
          className="flex-1 rounded-xl overflow-y-auto mb-4 p-4 flex flex-col gap-4"
          style={{
            backgroundColor: "rgba(13,92,110,0.08)",
            border: "1px solid rgba(77,255,240,0.15)",
            minHeight: 0,
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "assistant" && <TriforceAvatar />}

              <div
                className="max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? {
                        backgroundColor: "rgba(77,255,240,0.1)",
                        border: "1px solid rgba(77,255,240,0.2)",
                        color: "#ffffff",
                      }
                    : {
                        backgroundColor: "rgba(13,92,110,0.3)",
                        border: "1px solid rgba(77,255,240,0.1)",
                        color: "rgba(255,255,255,0.85)",
                      }
                }
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  H
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <TriforceAvatar />
              <div
                className="rounded-xl px-4 py-3 text-sm"
                style={{
                  backgroundColor: "rgba(13,92,110,0.3)",
                  border: "1px solid rgba(77,255,240,0.1)",
                  color: "#4dfff0",
                }}
              >
                The Sheikah Stone contemplates{TYPING_DOTS[typingDot]}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        <div className="flex flex-wrap gap-2 mb-3 shrink-0">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-40"
              style={{
                backgroundColor: "rgba(77,255,240,0.07)",
                color: "rgba(77,255,240,0.7)",
                border: "1px solid rgba(77,255,240,0.2)",
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-3 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Zelda lore, games, characters..."
            disabled={isLoading}
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              backgroundColor: "rgba(13,92,110,0.15)",
              border: "1px solid rgba(77,255,240,0.2)",
              color: "#ffffff",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(77,255,240,0.5)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(77,255,240,0.2)";
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40"
            style={{
              backgroundColor: "#0d5c6e",
              color: "#4dfff0",
              border: "1px solid rgba(77,255,240,0.3)",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
