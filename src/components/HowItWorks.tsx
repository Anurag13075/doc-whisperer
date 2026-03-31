import { GitPullRequest, Cpu, FileCheck } from "lucide-react";

const steps = [
  {
    icon: GitPullRequest,
    title: "PR merges",
    description: "A GitHub Action triggers AutoDocs on every merge to your main branch.",
    code: "on: push\n  branches: [main]",
  },
  {
    icon: Cpu,
    title: "AI scans changes",
    description: "Reads function signatures, docstrings, test cases, and git blame to understand intent.",
    code: "→ analyzing 12 files\n→ context: auth module",
  },
  {
    icon: FileCheck,
    title: "Docs PR opened",
    description: "Only changed sections are regenerated. A PR is opened for review against your docs repo.",
    code: "PR #247: Update auth.md\n+2 sections, -0 conflicts",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
          How it <span className="text-gradient">works</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16 text-lg">
          Three steps. Zero manual documentation effort.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-border bg-card p-8 hover:border-primary/30 hover:border-glow transition-all duration-300 group"
            >
              <div className="text-muted-foreground text-xs font-mono mb-4">
                0{i + 1}
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <step.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                {step.description}
              </p>
              <div className="code-block text-xs">
                <code className="text-primary/80 whitespace-pre">{step.code}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
