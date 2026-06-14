"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const TriforceAnimated = () => {
  const [opacity, setOpacity] = useState(0.7);

  useEffect(() => {
    let dir = 1;
    const interval = setInterval(() => {
      setOpacity((prev) => {
        const next = prev + dir * 0.02;
        if (next >= 1) dir = -1;
        if (next <= 0.6) dir = 1;
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      width="120"
      height="105"
      viewBox="0 0 40 35"
      style={{ opacity, filter: "drop-shadow(0 0 12px #d4af37)" }}
    >
      <polygon points="20,0 30,17 10,17" fill="#d4af37" />
      <polygon points="10,18 20,35 0,35" fill="#d4af37" />
      <polygon points="30,18 40,35 20,35" fill="#d4af37" />
    </svg>
  );
};

const featuredSections = [
  {
    href: "/zelda/games",
    title: "Games Catalog",
    description: "All 19 main series games with details, timelines, and era classifications.",
    icon: "🎮",
    accent: "#1a5c3a",
  },
  {
    href: "/zelda/timeline",
    title: "Zelda Timeline",
    description: "The official three-branch timeline with every game in chronological order.",
    icon: "⏳",
    accent: "#1e3a5f",
  },
  {
    href: "/zelda/characters",
    title: "Characters",
    description: "Heroes, villains, and companions that define the Zelda universe.",
    icon: "⚔️",
    accent: "#4a1942",
  },
  {
    href: "/zelda/items",
    title: "Items & Relics",
    description: "Legendary weapons, sacred artifacts, and iconic tools from across Hyrule.",
    icon: "🗡️",
    accent: "#5c3a1e",
  },
  {
    href: "/zelda/ai-guide",
    title: "Sheikah AI Guide",
    description: "Ask the Sheikah Stone anything about the Zelda universe. Powered by AI.",
    icon: "🔮",
    accent: "#0d5c6e",
  },
];

const recentNews = [
  {
    date: "May 2023",
    title: "Tears of the Kingdom Launches",
    body: "The sequel to Breath of the Wild arrives with Ultrahand, Fuse, and a vertical Hyrule. Critics award perfect scores across the board.",
  },
  {
    date: "Feb 2023",
    title: "Zelda: Tears of the Kingdom Final Trailer",
    body: "Nintendo revealed the full title and release date, confirming ancient Zonai civilization as central to the plot.",
  },
  {
    date: "Nov 2021",
    title: "Skyward Sword HD Released",
    body: "The origin of the Zelda timeline arrives on Switch with updated controls and quality-of-life improvements for modern players.",
  },
  {
    date: "Sep 2019",
    title: "Link's Awakening Remake",
    body: "The GB classic returns in a gorgeous diorama art style on Switch, introducing a new dungeon builder feature.",
  },
];

export default function ZeldaHomePage() {
  return (
    <div style={{ backgroundColor: "#0a0a0f", color: "#ffffff", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(212,175,55,0.12) 0%, rgba(10,10,15,0) 60%), #0a0a0f",
          paddingTop: "5rem",
          paddingBottom: "4rem",
          textAlign: "center",
        }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center mb-6">
            <TriforceAnimated />
          </div>
          <h1
            className="text-5xl sm:text-7xl font-bold mb-4"
            style={{
              fontFamily: "'Cinzel', Georgia, serif",
              background: "linear-gradient(135deg, #d4af37 0%, #f5e27a 50%, #b8922a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Hyrule Archive
          </h1>
          <p className="text-xl sm:text-2xl mb-8" style={{ color: "rgba(255,255,255,0.65)" }}>
            La enciclopedia definitiva de The Legend of Zelda
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {[
              { value: "19", label: "Main Games" },
              { value: "40+", label: "Years of Legend" },
              { value: "3", label: "Timeline Branches" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div
                  className="text-4xl font-bold"
                  style={{ color: "#d4af37", fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/zelda/games"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #b8922a 0%, #d4af37 100%)",
              color: "#0a0a0f",
            }}
          >
            Explore the Archive
          </Link>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2
          className="text-2xl font-bold mb-8"
          style={{ fontFamily: "'Cinzel', Georgia, serif", color: "#d4af37" }}
        >
          Explore the Archive
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group block rounded-xl p-6 transition-all duration-200 hover:-translate-y-1"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-4"
                style={{ backgroundColor: section.accent }}
              >
                {section.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-[#d4af37] transition-colors">
                {section.title}
              </h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent News */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <h2
          className="text-2xl font-bold mb-8"
          style={{ fontFamily: "'Cinzel', Georgia, serif", color: "#d4af37" }}
        >
          Chronicles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentNews.map((news) => (
            <div
              key={news.title}
              className="rounded-xl p-5"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="text-xs font-medium mb-2 uppercase tracking-widest"
                style={{ color: "#d4af37" }}
              >
                {news.date}
              </div>
              <h3 className="font-semibold mb-2">{news.title}</h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                {news.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="text-center py-10 mt-8"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.8rem",
        }}
      >
        <div className="flex justify-center mb-3">
          <svg width="20" height="18" viewBox="0 0 40 35" style={{ opacity: 0.4 }}>
            <polygon points="20,0 30,17 10,17" fill="#d4af37" />
            <polygon points="10,18 20,35 0,35" fill="#d4af37" />
            <polygon points="30,18 40,35 20,35" fill="#d4af37" />
          </svg>
        </div>
        <p>Hyrule Archive — Fan site. Not affiliated with Nintendo.</p>
        <p className="mt-1">
          The Legend of Zelda is a trademark of Nintendo Co., Ltd.
        </p>
      </footer>
    </div>
  );
}
