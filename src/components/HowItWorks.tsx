import { GitMerge, Cpu, GitPullRequest } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: GitMerge,
    title: "PR merges to main",
    description: "Drop a 6-line GitHub Action into your repo. AutoDocs gets a webhook on every merge.",
  },
  {
    n: "02",
    icon: Cpu,
    title: "AI reads the diff",
    description: "Function signatures, docstrings, tests, git blame. We infer intent, not just describe code.",
  },
  {
    n: "03",
    icon: GitPullRequest,
    title: "Docs PR opened",
    description: "Only changed sections are regenerated. A clean PR lands in your docs repo for review.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-4">HOW IT WORKS</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.04em] text-balance max-w-3xl mx-auto leading-[1]">
            From merge to <span className="text-muted-foreground/70">merged docs</span> in 60 seconds
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((s) => (
            <div key={s.n} className="card-soft rounded-2xl p-7 relative">
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-xs tracking-widest text-muted-foreground">{s.n}</span>
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-tight">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
