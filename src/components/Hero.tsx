import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
      
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono mb-8">
          <Zap className="w-3.5 h-3.5" />
          Docs that update themselves
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
          Your docs are{" "}
          <span className="text-gradient">always wrong.</span>
          <br />
          Until now.
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body leading-relaxed">
          AI reads your code, tests, and git history to generate and maintain API documentation that's always in sync. 
          Every PR merge triggers an update. Zero manual effort.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" className="text-base px-8 py-6">
            Start for free
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
          <Button variant="heroOutline" size="lg" className="text-base px-8 py-6">
            See it in action
          </Button>
        </div>

        {/* Terminal preview */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="code-block text-left border-glow">
            <div className="flex gap-1.5 mb-4">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-accent/60" />
              <div className="w-3 h-3 rounded-full bg-primary/60" />
            </div>
            <code className="text-muted-foreground font-mono text-sm leading-relaxed">
              <span className="text-primary">$</span> git merge feature/auth-v2<br />
              <span className="text-muted-foreground/60">→ autodocs scanning 12 changed files...</span><br />
              <span className="text-muted-foreground/60">→ updating auth.md, middleware.md</span><br />
              <span className="text-primary">✓</span> <span className="text-foreground">PR #247 opened against docs repo</span><br />
              <span className="text-muted-foreground/60">  2 sections updated, 0 conflicts</span>
            </code>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
