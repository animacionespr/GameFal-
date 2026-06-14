"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TriforceIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size * 0.875} viewBox="0 0 40 35" aria-hidden="true">
    <defs>
      <linearGradient id="tf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5e27a" />
        <stop offset="50%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#b8922a" />
      </linearGradient>
      <filter id="tf-glow">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <polygon points="20,0 30,17 10,17" fill="url(#tf-grad)" filter="url(#tf-glow)" />
    <polygon points="10,18 20,35 0,35" fill="url(#tf-grad)" filter="url(#tf-glow)" />
    <polygon points="30,18 40,35 20,35" fill="url(#tf-grad)" filter="url(#tf-glow)" />
  </svg>
);

const navLinks = [
  { href: "/zelda", label: "Home" },
  { href: "/zelda/games", label: "Games" },
  { href: "/zelda/timeline", label: "Timeline" },
  { href: "/zelda/characters", label: "Characters" },
  { href: "/zelda/items", label: "Items" },
  { href: "/zelda/ai-guide", label: "Sheikah AI" },
];

export default function ZeldaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/zelda" ? pathname === "/zelda" : pathname.startsWith(href);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700&display=swap');

        .cinzel { font-family: 'Cinzel', Georgia, serif; }
        .cinzel-deco { font-family: 'Cinzel Decorative', Georgia, serif; }

        .gold-text {
          background: linear-gradient(135deg, #f5e27a 0%, #d4af37 40%, #b8922a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .zelda-nav-link {
          position: relative;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 13px;
          letter-spacing: 0.08em;
          font-family: 'Cinzel', Georgia, serif;
          transition: all 0.2s ease;
          color: rgba(255,255,255,0.6);
        }
        .zelda-nav-link:hover { color: #d4af37; background: rgba(212,175,55,0.08); }
        .zelda-nav-link.active { color: #d4af37; }
        .zelda-nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 70%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #d4af37, transparent);
        }

        .zelda-mobile-link {
          display: block;
          padding: 12px 20px;
          font-family: 'Cinzel', Georgia, serif;
          font-size: 14px;
          letter-spacing: 0.08em;
          color: rgba(255,255,255,0.7);
          border-bottom: 1px solid rgba(212,175,55,0.08);
          transition: all 0.2s;
        }
        .zelda-mobile-link:hover, .zelda-mobile-link.active { color: #d4af37; background: rgba(212,175,55,0.06); }

        @keyframes triforce-pulse {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(212,175,55,0.6)); }
          50% { filter: drop-shadow(0 0 10px rgba(212,175,55,1)) drop-shadow(0 0 20px rgba(212,175,55,0.4)); }
        }
        .triforce-logo { animation: triforce-pulse 3s ease-in-out infinite; }

        @keyframes mobile-fade-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mobile-menu { animation: mobile-fade-in 0.2s ease forwards; }

        .hamburger span {
          display: block; width: 22px; height: 2px;
          background: rgba(255,255,255,0.7);
          transition: all 0.3s ease;
          margin: 4px 0;
        }
        .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(4px, 4px); }
        .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(4px, -4px); }

        * { scrollbar-width: thin; scrollbar-color: rgba(212,175,55,0.3) rgba(10,10,15,0.5); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(10,10,15,0.5); }
        ::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.3); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.6); }
      `}</style>

      <div style={{ minHeight: "100vh", backgroundColor: "#04040a", color: "#fff" }}>
        <nav
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            transition: "all 0.3s ease",
            backgroundColor: scrolled ? "rgba(4,4,10,0.96)" : "rgba(4,4,10,0.7)",
            borderBottom: scrolled
              ? "1px solid rgba(212,175,55,0.25)"
              : "1px solid rgba(212,175,55,0.08)",
            backdropFilter: "blur(16px)",
            boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
              <Link href="/zelda" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                <span className="triforce-logo"><TriforceIcon size={32} /></span>
                <span className="cinzel-deco gold-text" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em" }}>
                  Hyrule Archive
                </span>
              </Link>

              <div className="hidden md:flex" style={{ alignItems: "center", gap: 2 }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`zelda-nav-link ${isActive(link.href) ? "active" : ""}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <button
                className={`md:hidden hamburger ${mobileOpen ? "open" : ""}`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
                style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
              >
                <span /><span /><span />
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div
              className="mobile-menu md:hidden"
              style={{
                borderTop: "1px solid rgba(212,175,55,0.12)",
                backgroundColor: "rgba(4,4,10,0.98)",
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`zelda-mobile-link ${isActive(link.href) ? "active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        <main style={{ paddingTop: 64 }}>{children}</main>
      </div>
    </>
  );
}
