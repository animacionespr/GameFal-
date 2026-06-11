import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Brain,
  Code2,
  BarChart3,
  Rocket,
  CheckCircle2,
  Star,
  Globe,
  Layers,
  Shield,
  TrendingUp,
  Sparkles,
  Play,
  ChevronRight,
} from "lucide-react";

const PHASES = [
  {
    number: "01",
    title: "Analyze",
    description: "Submit a URL or describe any existing app. Our AI dissects its architecture, UX patterns, and business logic.",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    title: "Document",
    description: "Receive a comprehensive report: features, UX issues, opportunities, and competitive analysis.",
    icon: BarChart3,
    color: "from-purple-500 to-pink-500",
  },
  {
    number: "03",
    title: "Design",
    description: "AI creates a superior design system and wireframes addressing every identified pain point.",
    icon: Layers,
    color: "from-evolve-500 to-purple-500",
  },
  {
    number: "04",
    title: "Generate",
    description: "Get production-ready Next.js + TypeScript code with Supabase, Stripe, and AI features built in.",
    icon: Code2,
    color: "from-green-500 to-teal-500",
  },
  {
    number: "05",
    title: "Roadmap",
    description: "A 12-month product roadmap with KPIs, milestones, and go-to-market strategy included.",
    icon: Rocket,
    color: "from-orange-500 to-red-500",
  },
];

const FEATURES = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Claude AI analyzes app structure, UX patterns, and business logic to identify every opportunity.",
    tag: "Phase 1-2",
  },
  {
    icon: Layers,
    title: "Wireframe Generation",
    description: "Complete design system with color palettes, typography, and screen-by-screen wireframes.",
    tag: "Phase 3-4",
  },
  {
    icon: Code2,
    title: "Production Code",
    description: "Full-stack Next.js code with TypeScript, Tailwind, Supabase, Stripe integration, and tests.",
    tag: "Phase 5-6",
  },
  {
    icon: TrendingUp,
    title: "12-Month Roadmap",
    description: "Strategic roadmap with KPIs, milestones, monetization strategy, and growth plan.",
    tag: "Phase 7",
  },
  {
    icon: Shield,
    title: "Zero IP Violations",
    description: "We extract concepts and patterns only. Never copying code, assets, or proprietary content.",
    tag: "Legal",
  },
  {
    icon: Zap,
    title: "Ready in Minutes",
    description: "What takes months of research and planning is done in minutes with AI acceleration.",
    tag: "Speed",
  },
];

const PRICING = [
  {
    name: "Free",
    price: 0,
    description: "Explore the platform",
    features: ["3 analyses per month", "Basic analysis document", "Text wireframes", "Community support"],
    cta: "Start Free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Starter",
    price: 49,
    description: "For solo founders",
    features: ["20 analyses per month", "Full analysis document", "Detailed wireframes", "Code architecture", "Email support"],
    cta: "Get Started",
    href: "/signup?plan=starter",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 149,
    description: "For serious builders",
    features: ["100 analyses per month", "Production-ready code", "12-month roadmap", "Priority support", "Export to GitHub", "5 team seats"],
    cta: "Start Building",
    href: "/signup?plan=pro",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: 499,
    description: "For agencies & teams",
    features: ["Unlimited analyses", "Custom AI models", "White-label option", "SSO/SAML", "Dedicated support", "Unlimited seats"],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

const TESTIMONIALS = [
  {
    quote: "We analyzed our competitor's SaaS in 10 minutes and had a complete blueprint for a better version by afternoon. This is insane.",
    author: "Marcus Chen",
    title: "Founder, BuildFast",
    rating: 5,
  },
  {
    quote: "The code quality is production-grade. Saved us 3 weeks of architecture planning and got us to market 2 months earlier.",
    author: "Sofia Rodriguez",
    title: "CTO, LaunchKit",
    rating: 5,
  },
  {
    quote: "As a solo founder, App Evolution is like having a senior product team on demand. The UX analysis alone is worth 10x the price.",
    author: "James Park",
    title: "Solo Founder",
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Grid background */}
      <div className="fixed inset-0 bg-grid-pattern bg-[size:40px_40px] opacity-100 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-radial from-evolve-950/50 via-background to-background pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-evolve-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">App Evolution</span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/70 hover:text-white transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-evolve-600 hover:bg-evolve-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-evolve-600/10 border border-evolve-500/20 rounded-full px-4 py-1.5 text-sm text-evolve-400 mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Claude AI</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Analyze any app.
            <br />
            <span className="text-gradient">Generate something better.</span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Submit a URL or description. Get a comprehensive analysis, wireframes, production-ready code,
            and a 12-month roadmap — all in minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group flex items-center gap-2 bg-evolve-600 hover:bg-evolve-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 glow-sm hover:glow-md"
            >
              Start analyzing for free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors px-6 py-4">
              <Play className="w-5 h-5" />
              Watch 2-min demo
            </button>
          </div>

          <p className="mt-6 text-sm text-white/30">
            No credit card required · 3 free analyses · Cancel anytime
          </p>
        </div>

        {/* Hero graphic — platform mockup */}
        <div className="max-w-5xl mx-auto mt-20 relative">
          <div className="rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm overflow-hidden">
            {/* Mockup header */}
            <div className="border-b border-white/10 px-4 py-3 flex items-center gap-2 bg-white/3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 bg-white/5 rounded-md h-6 mx-4 flex items-center px-3">
                <span className="text-xs text-white/30">app.evolution.ai/analyze</span>
              </div>
            </div>

            {/* Mockup content */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Input panel */}
              <div className="glass rounded-xl p-5">
                <div className="text-xs text-white/40 mb-3 uppercase tracking-wider">Input</div>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-lg p-3 text-sm text-white/70 font-mono">
                    https://notion.so
                  </div>
                  <div className="text-xs text-white/30">+ Target audience, goals...</div>
                  <div className="bg-evolve-600 rounded-lg py-2 text-sm text-white text-center font-medium">
                    Analyze →
                  </div>
                </div>
              </div>

              {/* Analysis phases */}
              <div className="glass rounded-xl p-5">
                <div className="text-xs text-white/40 mb-3 uppercase tracking-wider">Analysis Progress</div>
                <div className="space-y-2.5">
                  {["Analyzing app structure", "Creating document", "Generating wireframes", "Writing code", "Building roadmap"].map((phase, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${i < 3 ? "bg-green-500/20" : i === 3 ? "bg-evolve-500/30 animate-pulse" : "bg-white/5"}`}>
                        {i < 3 && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                        {i === 3 && <div className="w-2 h-2 rounded-full bg-evolve-400" />}
                      </div>
                      <span className={`text-xs ${i < 3 ? "text-green-400" : i === 3 ? "text-evolve-400" : "text-white/30"}`}>{phase}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results preview */}
              <div className="glass rounded-xl p-5">
                <div className="text-xs text-white/40 mb-3 uppercase tracking-wider">Results</div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">Features found</span>
                    <span className="text-white font-mono">14</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">UX issues</span>
                    <span className="text-red-400 font-mono">8</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">Opportunities</span>
                    <span className="text-green-400 font-mono">12</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">Overall score</span>
                    <span className="text-yellow-400 font-mono">67/100</span>
                  </div>
                  <div className="h-px bg-white/5 my-2" />
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">Code files</span>
                    <span className="text-cyan-400 font-mono">24</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute -inset-px bg-gradient-to-r from-evolve-600/20 via-purple-600/20 to-cyan-600/20 rounded-2xl blur-xl -z-10" />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">7 phases. Minutes to complete.</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              From URL to production-ready app in a workflow refined for maximum output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PHASES.map((phase, index) => (
              <div key={phase.number} className="relative">
                {index < PHASES.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-white/20 to-transparent z-10" />
                )}
                <div className="glass rounded-xl p-5 h-full hover:bg-white/8 transition-colors duration-200">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center mb-4 opacity-90`}>
                    <phase.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs text-white/30 font-mono mb-1">{phase.number}</div>
                  <h3 className="font-semibold text-white mb-2">{phase.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 bg-white/2">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to{" "}
              <span className="text-gradient">outbuild the competition</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Not a template generator. A full product strategy engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="glass rounded-xl p-6 hover:bg-white/8 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-evolve-600/20 border border-evolve-500/20 flex items-center justify-center group-hover:bg-evolve-600/30 transition-colors">
                    <feature.icon className="w-5 h-5 text-evolve-400" />
                  </div>
                  <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded-md">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "10x", label: "Faster than manual analysis" },
            { value: "7", label: "AI-powered phases" },
            { value: "24", label: "Files generated per analysis" },
            { value: "100%", label: "Original, IP-safe code" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Founders who moved{" "}
            <span className="text-gradient">10x faster</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial) => (
              <div key={testimonial.author} className="glass rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-white text-sm">{testimonial.author}</div>
                  <div className="text-white/40 text-xs">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-white/2">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-white/50 text-lg">
              Start free. Scale as you build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 relative ${
                  plan.highlighted
                    ? "bg-evolve-600/20 border-2 border-evolve-500/50"
                    : "glass"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-evolve-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-bold text-white text-lg mb-1">{plan.name}</h3>
                  <p className="text-white/40 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    {plan.price > 0 && (
                      <span className="text-white/40 text-sm">/month</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-evolve-600 hover:bg-evolve-500 text-white"
                      : "bg-white/10 hover:bg-white/15 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-2xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-evolve-600/10 via-purple-600/5 to-transparent" />
            <div className="relative">
              <Globe className="w-12 h-12 text-evolve-400 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to outbuild your competition?
              </h2>
              <p className="text-white/50 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of founders using App Evolution to move 10x faster.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-evolve-600 hover:bg-evolve-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all glow-sm hover:glow-md"
              >
                Start for free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="mt-4 text-sm text-white/30">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-evolve-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-white">App Evolution</span>
          </div>
          <p className="text-white/30 text-sm">
            © 2026 App Evolution. Built with AI. Never copies IP.
          </p>
          <div className="flex gap-6 text-sm text-white/30">
            <a href="/privacy" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="/contact" className="hover:text-white/60 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
