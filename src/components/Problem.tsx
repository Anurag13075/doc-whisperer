import { X, Check } from "lucide-react";

const Problem = () => {
  const oldWay = [
    "Write docs once, watch them rot",
    "New hires read source code to understand APIs",
    "Hours lost per integration, per incident",
    "Docs never match the actual implementation",
  ];

  const newWay = [
    "AI reads code + tests to infer intent",
    "Docs auto-update on every PR merge",
    "Explains why code exists, not just what it does",
    "Diffs against last version, updates only changes",
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
          The documentation <span className="text-gradient">problem</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16 text-lg">
          Every engineering team knows docs are broken. Here's what changes.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Old way */}
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-8">
            <h3 className="font-heading text-lg font-semibold mb-6 text-destructive">
              The old way
            </h3>
            <ul className="space-y-4">
              {oldWay.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* New way */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 border-glow">
            <h3 className="font-heading text-lg font-semibold mb-6 text-primary">
              With AutoDocs
            </h3>
            <ul className="space-y-4">
              {newWay.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
