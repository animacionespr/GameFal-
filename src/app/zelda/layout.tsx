import Link from "next/link";

const TriforceIcon = () => (
  <svg width="28" height="25" viewBox="0 0 40 35" aria-hidden="true">
    <polygon points="20,0 30,17 10,17" fill="#d4af37" />
    <polygon points="10,18 20,35 0,35" fill="#d4af37" />
    <polygon points="30,18 40,35 20,35" fill="#d4af37" />
  </svg>
);

const navLinks = [
  { href: "/zelda", label: "Home" },
  { href: "/zelda/games", label: "Games" },
  { href: "/zelda/timeline", label: "Timeline" },
  { href: "/zelda/characters", label: "Characters" },
  { href: "/zelda/items", label: "Items" },
  { href: "/zelda/ai-guide", label: "AI Guide" },
];

export default function ZeldaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');
        .cinzel { font-family: 'Cinzel', Georgia, serif; }
      `}</style>
      <div className="min-h-screen bg-background text-white">
        <nav
          className="fixed top-0 left-0 right-0 z-50 border-b"
          style={{
            backgroundColor: "rgba(10,10,15,0.92)",
            borderColor: "rgba(212,175,55,0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link
                href="/zelda"
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <TriforceIcon />
                <span
                  className="cinzel text-xl font-bold tracking-wide"
                  style={{ color: "#d4af37" }}
                >
                  Hyrule Archive
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 text-white/70 hover:text-white hover:bg-white/5"
                    style={{
                      letterSpacing: "0.05em",
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="md:hidden flex items-center gap-1">
                {navLinks.slice(1).map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-2 py-1 text-xs text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-16">{children}</main>
      </div>
    </>
  );
}
