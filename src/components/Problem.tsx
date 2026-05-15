import { Zap, Sliders, GitBranch } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-time generation",
    description: "Every PR merge triggers a fresh scan. Docs are regenerated and a PR is opened in seconds.",
  },
  {
    icon: Sliders,
    title: "Customisable output",
    description: "Tune voice, depth, and structure. Match your existing docs style with templates and examples.",
  },
  {
    icon: GitBranch,
    title: "PR-first workflow",
    description: "Nothing ships without review. AutoDocs opens a PR against your docs repo for human approval.",
  },
];

const Problem = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-4">CORE CAPABILITIES</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.04em] text-balance max-w-3xl mx-auto leading-[1]">
            Everything you need to <span className="text-muted-foreground/70">keep docs in sync</span>
          </h2>
        </div>

        {/* Diff preview */}
        <div className="card-soft rounded-3xl overflow-hidden mb-10 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-6 border-r border-border">
              <p className="text-[11px] font-mono tracking-wider text-muted-foreground mb-3">SOURCE</p>
              <pre className="font-mono text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap">{`export async function refresh(
  token: string
): Promise<Session> {
  // rotates the refresh token
  // and returns a new JWT
}`}</pre>
            </div>
            <div className="p-6 bg-secondary/40">
              <p className="text-[11px] font-mono tracking-wider text-primary mb-3">GENERATED DOC</p>
              <div className="font-mono text-xs leading-relaxed">
                <div className="font-bold text-foreground"># refresh(token)</div>
                <div className="text-muted-foreground mt-2">Rotates the refresh token and returns a new session JWT. Call when the access token is near expiry.</div>
                <div className="mt-3 text-foreground"><span className="text-primary">Returns</span> · Session</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card-soft rounded-2xl p-7">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2 tracking-tight">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Problem;
