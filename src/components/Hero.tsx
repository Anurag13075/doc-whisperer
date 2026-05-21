import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Star, GitMerge, FileText, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const TERMINAL_LINES = [
  { delay: 0,    text: "$ git merge feature/auth-v2",           type: "cmd" },
  { delay: 600,  text: "→ AutoDocs triggered on merge",          type: "info" },
  { delay: 1100, text: "→ scanning 12 changed files…",           type: "info" },
  { delay: 1700, text: "→ reading tests, history, signatures…",  type: "info" },
  { delay: 2300, text: "→ generating diff for auth.md…",         type: "info" },
  { delay: 2900, text: "✓ PR #247 opened → acme/docs",           type: "success" },
  { delay: 3400, text: "  2 sections updated · 0 conflicts",     type: "dim" },
];

const DIFF_LINES = [
  { type: "add",     text: "## POST /auth/refresh" },
  { type: "add",     text: "Returns a new JWT given a valid refresh token." },
  { type: "neutral", text: "" },
  { type: "add",     text: "**Request body**" },
  { type: "add",     text: '```json' },
  { type: "add",     text: '{ "refresh_token": "string" }' },
  { type: "add",     text: '```' },
  { type: "neutral", text: "" },
  { type: "remove",  text: "## POST /auth/token  ← deprecated" },
];

function TerminalLine({ line, show }: { line: typeof TERMINAL_LINES[0]; show: boolean }) {
  const color =
    line.type === "cmd"     ? "#e2e8f0" :
    line.type === "success" ? "#34d399" :
    line.type === "dim"     ? "#475569" : "#94a3b8";
  return (
    <div
      style={{
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: "11px",
        color,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(4px)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
        lineHeight: "1.7",
        whiteSpace: "nowrap",
      }}
    >
      {line.text}
    </div>
  );
}

function AnimatedTerminal() {
  const [visible, setVisible] = useState<boolean[]>(Array(TERMINAL_LINES.length).fill(false));
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    TERMINAL_LINES.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setVisible(v => { const n = [...v]; n[i] = true; return n; });
      }, line.delay));
    });
    // restart loop
    timers.push(setTimeout(() => {
      setVisible(Array(TERMINAL_LINES.length).fill(false));
      setCycle(c => c + 1);
    }, 5800));
    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  return (
    <div style={{
      background: "#0d1117",
      borderRadius: "12px",
      padding: "14px 16px",
      border: "1px solid rgba(255,255,255,0.08)",
      minHeight: "148px",
    }}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
        <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: "9px", color: "#475569", letterSpacing: "0.12em" }}>AUTODOCS · LIVE</span>
      </div>
      {TERMINAL_LINES.map((line, i) => (
        <TerminalLine key={`${cycle}-${i}`} line={line} show={visible[i]} />
      ))}
    </div>
  );
}

function DiffPreview() {
  return (
    <div style={{
      background: "#0d1117",
      borderRadius: "12px",
      padding: "14px 16px",
      border: "1px solid rgba(255,255,255,0.08)",
      overflow: "hidden",
    }}>
      <div style={{
        fontFamily: "monospace", fontSize: "9px", color: "#475569",
        letterSpacing: "0.12em", marginBottom: "10px", display: "flex",
        justifyContent: "space-between",
      }}>
        <span>auth.md — DIFF</span>
        <span style={{ color: "#34d399" }}>PR #247</span>
      </div>
      {DIFF_LINES.map((l, i) => (
        <div key={i} style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px",
          lineHeight: "1.65",
          paddingLeft: "8px",
          borderLeft: l.type === "add" ? "2px solid #34d399" : l.type === "remove" ? "2px solid #f87171" : "2px solid transparent",
          color: l.type === "add" ? "#86efac" : l.type === "remove" ? "#fca5a5" : "#475569",
          background: l.type === "add" ? "rgba(52,211,153,0.06)" : l.type === "remove" ? "rgba(248,113,113,0.06)" : "transparent",
          whiteSpace: "pre",
        }}>
          {l.type === "add" ? "+ " : l.type === "remove" ? "- " : "  "}{l.text}
        </div>
      ))}
    </div>
  );
}

const STEPS = [
  { icon: GitMerge, label: "Merge PR",        desc: "Any branch, any repo" },
  { icon: Zap,      label: "AI reads diff",   desc: "Code + tests + history" },
  { icon: FileText, label: "Docs PR opened",  desc: "Zero manual effort" },
];

function FlowSteps() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0", marginTop: "28px", justifyContent: "center" }}>
      {STEPS.map((step, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "6px", minWidth: "90px",
          }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <step.icon size={15} color="#94a3b8" />
            </div>
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#e2e8f0", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{step.label}</span>
            <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#475569", whiteSpace: "nowrap" }}>{step.desc}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, rgba(148,163,184,0.3), rgba(148,163,184,0.1))", margin: "0 4px", marginBottom: "22px" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// Animated gradient orbs background
function BackgroundOrbs() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* Top center glow */}
      <div style={{
        position: "absolute", top: "-120px", left: "50%", transform: "translateX(-50%)",
        width: "700px", height: "500px",
        background: "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)",
        filter: "blur(1px)",
      }} />
      {/* Left subtle */}
      <div style={{
        position: "absolute", top: "100px", left: "-100px",
        width: "400px", height: "400px",
        background: "radial-gradient(ellipse at center, rgba(52,211,153,0.07) 0%, transparent 70%)",
      }} />
      {/* Right subtle */}
      <div style={{
        position: "absolute", top: "200px", right: "-80px",
        width: "350px", height: "350px",
        background: "radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 70%)",
      }} />
      {/* Grid lines */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)",
      }} />
    </div>
  );
}

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pt-40 pb-24 px-6"
      style={{ overflow: "hidden" }}
    >
      <BackgroundOrbs />

      <div className="max-w-5xl mx-auto text-center" style={{ position: "relative", zIndex: 1 }}>

        {/* Badge */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 pill bg-primary text-primary-foreground px-4 py-1.5 text-xs font-medium mb-10 shadow-[var(--glow-primary)]"
            style={{ textDecoration: "none" }}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            247 Stargazers on GitHub
            <ArrowRight className="w-3 h-3 opacity-70" />
          </a>
        </div>

        {/* Headline */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.55s ease 0.1s, transform 0.55s ease 0.1s",
          }}
        >
          <h1
            className="font-bold text-balance mb-8"
            style={{
              fontSize: "clamp(2.75rem, 8vw, 6.5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            Documentation that
            <br />
            <span style={{ display: "inline-flex", alignItems: "center", gap: "1rem", verticalAlign: "middle" }}>
              <span
                className="font-mono"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.15em 0.45em",
                  borderRadius: "0.5rem",
                  background: "var(--foreground)",
                  color: "var(--background)",
                  fontSize: "0.78em",
                  letterSpacing: "-0.02em",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* shimmer sweep */}
                <span style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
                  animation: "shimmer 3s ease-in-out infinite",
                }} />
                writes
              </span>
              itself.
            </span>
          </h1>
        </div>

        {/* Subhead */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.55s ease 0.2s, transform 0.55s ease 0.2s",
          }}
        >
          <p
            className="text-muted-foreground text-balance mx-auto mb-10 leading-relaxed"
            style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", maxWidth: "540px" }}
          >
            AI reads your code, tests, and git history — then opens a PR against your docs repo on every merge. Your API reference is{" "}
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>always live.</span>
          </p>
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.55s ease 0.3s, transform 0.55s ease 0.3s",
          }}
        >
          <Link to="/auth">
            <Button variant="hero" size="lg" className="h-12 px-7" style={{ fontSize: "15px" }}>
              Open dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <Button variant="heroOutline" size="lg" className="h-12 px-7" style={{ fontSize: "15px" }}>
              <Github className="w-4 h-4" />
              Star on GitHub
            </Button>
          </a>
        </div>

        {/* Social proof avatars */}
        <div
          className="flex items-center justify-center gap-3 mb-16"
          style={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.55s ease 0.4s",
          }}
        >
          <div style={{ display: "flex" }}>
            {["#6366f1","#34d399","#f59e0b","#ec4899","#14b8a6"].map((c, i) => (
              <div key={i} style={{
                width: "26px", height: "26px", borderRadius: "50%",
                background: c, border: "2px solid var(--background)",
                marginLeft: i === 0 ? 0 : "-8px",
                opacity: 0.85,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "9px", fontWeight: 700, color: "#fff",
              }}>
                {["A","B","C","D","E"][i]}
              </div>
            ))}
          </div>
          <span className="text-muted-foreground" style={{ fontSize: "12px" }}>
            Trusted by <span style={{ color: "var(--foreground)", fontWeight: 500 }}>240+ teams</span> keeping docs in sync
          </span>
        </div>

        {/* Product preview */}
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) perspective(1200px) rotateX(0deg)" : "translateY(24px) perspective(1200px) rotateX(3deg)",
            transition: "opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s",
            position: "relative", maxWidth: "900px", margin: "0 auto",
          }}
        >
          {/* Glow behind card */}
          <div style={{
            position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
            width: "60%", height: "50%",
            background: "radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)",
            filter: "blur(40px)", zIndex: 0, pointerEvents: "none",
          }} />

          <div
            className="card-soft rounded-3xl overflow-hidden text-left"
            style={{ position: "relative", zIndex: 1 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 border-b border-border" style={{ paddingTop: "14px", paddingBottom: "14px" }}>
              <div className="flex items-center" style={{ gap: "10px" }}>
                <div
                  className="flex items-center justify-center rounded-md bg-foreground"
                  style={{ width: "28px", height: "28px" }}
                >
                  <span className="font-mono font-bold text-background" style={{ fontSize: "10px" }}>{"</>"}</span>
                </div>
                <span className="font-mono font-bold" style={{ letterSpacing: "0.18em", fontSize: "11px" }}>AUTODOCS</span>
                <span
                  className="font-mono text-primary"
                  style={{
                    fontSize: "9px", padding: "2px 8px", borderRadius: "999px",
                    border: "1px solid rgba(var(--primary-rgb),0.4)",
                    marginLeft: "4px",
                  }}
                >
                  DASHBOARD
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{
                  width: "7px", height: "7px", borderRadius: "50%",
                  background: "#34d399",
                  boxShadow: "0 0 6px #34d399",
                  display: "inline-block",
                  animation: "pulse-dot 2s ease-in-out infinite",
                }} />
                <span className="font-mono text-muted-foreground" style={{ fontSize: "10px", letterSpacing: "0.18em" }}>LIVE</span>
              </div>
            </div>

            {/* Body — 3 column on large, stacked on mobile */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>

              {/* Left: config */}
              <div
                className="border-b md:border-b-0 md:border-r border-border"
                style={{ padding: "20px", background: "rgba(var(--secondary-rgb),0.4)", display: "flex", flexDirection: "column", gap: "16px" }}
              >
                <div>
                  <p className="font-mono text-muted-foreground" style={{ fontSize: "10px", letterSpacing: "0.14em", marginBottom: "8px" }}>SOURCE REPO</p>
                  <div className="rounded-xl border border-border bg-card font-mono" style={{ padding: "8px 12px", fontSize: "13px" }}>
                    acme/api-server
                  </div>
                </div>
                <div>
                  <p className="font-mono text-muted-foreground" style={{ fontSize: "10px", letterSpacing: "0.14em", marginBottom: "8px" }}>DOCS REPO</p>
                  <div className="rounded-xl border border-border bg-card font-mono" style={{ padding: "8px 12px", fontSize: "13px" }}>
                    acme/docs
                  </div>
                </div>
                <div>
                  <p className="font-mono text-muted-foreground" style={{ fontSize: "10px", letterSpacing: "0.14em", marginBottom: "8px" }}>TRIGGER</p>
                  <div className="rounded-xl border border-border bg-card font-mono" style={{ padding: "8px 12px", fontSize: "13px", color: "#34d399" }}>
                    on: push → main
                  </div>
                </div>
                <button className="pill bg-primary text-primary-foreground font-medium shadow-[var(--glow-primary)]" style={{ padding: "10px 0", fontSize: "13px", width: "100%", marginTop: "auto" }}>
                  Generate docs
                </button>
              </div>

              {/* Middle: terminal */}
              <div className="border-b md:border-b-0 md:border-r border-border" style={{ padding: "20px" }}>
                <p className="font-mono text-muted-foreground" style={{ fontSize: "10px", letterSpacing: "0.14em", marginBottom: "12px" }}>ACTIVITY</p>
                <AnimatedTerminal />
                <FlowSteps />
              </div>

              {/* Right: diff */}
              <div style={{ padding: "20px" }}>
                <p className="font-mono text-muted-foreground" style={{ fontSize: "10px", letterSpacing: "0.14em", marginBottom: "12px" }}>GENERATED DIFF</p>
                <DiffPreview />
                <div style={{ marginTop: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {[
                    { label: "2 files changed", color: "#34d399" },
                    { label: "0 conflicts",      color: "#94a3b8" },
                    { label: "PR ready",         color: "#6366f1" },
                  ].map(tag => (
                    <span key={tag.label} style={{
                      fontFamily: "monospace", fontSize: "10px",
                      padding: "3px 10px", borderRadius: "999px",
                      border: `1px solid ${tag.color}40`,
                      color: tag.color,
                      background: `${tag.color}0f`,
                    }}>{tag.label}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <p className="font-mono text-muted-foreground text-center" style={{ marginTop: "14px", fontSize: "10px", letterSpacing: "0.18em" }}>
            LIVE PREVIEW · UPDATES ON EVERY MERGE
          </p>
        </div>
      </div>

      {/* keyframes injected once */}
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          60%  { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px #34d399; }
          50%       { opacity: 0.4; box-shadow: 0 0 2px #34d399; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
