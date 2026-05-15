import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-40 pb-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 pill bg-primary text-primary-foreground px-4 py-1.5 text-xs font-medium mb-10 shadow-[var(--glow-primary)]">
          <Star className="w-3.5 h-3.5 fill-current" />
          247 Stargazers on GitHub
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.04em] text-balance mb-8">
          Documentation that
          <br />
          <span className="inline-flex items-center gap-4 align-middle">
            <span className="inline-flex items-center px-5 py-1 rounded-2xl bg-foreground text-background font-mono text-[0.78em] tracking-tight">
              writes
            </span>
            itself.
          </span>
        </h1>

        {/* Subhead */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-balance">
          AI reads your code, tests, and git history, then opens a PR against your docs repo on every merge. Your API reference is always live.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-20">
          <Link to="/auth">
            <Button variant="hero" size="lg" className="h-12 px-7 text-[15px]">
              Open dashboard
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Button variant="heroOutline" size="lg" className="h-12 px-7 text-[15px]">
            <Github className="w-4 h-4" />
            Star on GitHub
          </Button>
        </div>

        {/* Product preview card */}
        <div className="relative max-w-4xl mx-auto">
          <div className="card-soft rounded-3xl overflow-hidden text-left">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
                  <span className="font-mono font-bold text-background text-[10px]">{"</>"}</span>
                </div>
                <span className="font-mono font-bold tracking-[0.18em] text-xs">AUTODOCS</span>
                <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full border border-primary/40 text-primary">DASHBOARD</span>
              </div>
              <span className="text-[10px] font-mono tracking-[0.18em] text-muted-foreground">LIVE</span>
            </div>

            {/* Body */}
            <div className="grid md:grid-cols-[280px_1fr] gap-0">
              {/* Left rail */}
              <div className="p-5 border-r border-border space-y-4 bg-secondary/40">
                <div>
                  <p className="text-[11px] font-mono tracking-wider text-muted-foreground mb-2">REPO</p>
                  <div className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-mono">
                    acme/api-server
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-mono tracking-wider text-muted-foreground mb-2">DOCS REPO</p>
                  <div className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-mono">
                    acme/docs
                  </div>
                </div>
                <button className="w-full pill bg-primary text-primary-foreground py-2.5 text-sm font-medium shadow-[var(--glow-primary)]">
                  Generate docs
                </button>
              </div>

              {/* Right preview */}
              <div className="p-5">
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  <span className="ml-auto text-[10px] font-mono tracking-wider text-muted-foreground">PR #247</span>
                </div>
                <div className="font-mono text-xs leading-relaxed space-y-1">
                  <div className="text-muted-foreground">$ git merge feature/auth-v2</div>
                  <div className="text-muted-foreground">→ scanning 12 changed files…</div>
                  <div className="text-muted-foreground">→ updating auth.md, middleware.md</div>
                  <div className="text-primary">✓ PR opened against acme/docs</div>
                  <div className="pl-3 text-muted-foreground">2 sections updated · 0 conflicts</div>
                  <div className="mt-3 px-3 py-2 rounded-lg bg-muted text-foreground border border-border">
                    <span className="text-primary">+</span> ## POST /auth/refresh
                    <br />
                    <span className="text-primary">+</span> Returns a new JWT given a valid refresh token.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs font-mono tracking-wider text-muted-foreground text-center">
            FRAME 086 / 125 · LIVE PREVIEW
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
