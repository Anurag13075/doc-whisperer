import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Solo",
    price: "$49",
    period: "/mo",
    description: "For individual developers and small projects.",
    features: [
      "Up to 3 repositories",
      "Auto-generated API docs",
      "PR-based doc updates",
      "Hosted docs page",
      "Email support",
    ],
    cta: "Start free trial",
    featured: false,
  },
  {
    name: "Team",
    price: "$149",
    period: "/mo",
    description: "For engineering teams up to 10 repos.",
    features: [
      "Up to 10 repositories",
      "Everything in Solo",
      "Custom branding",
      "Priority support",
      "Team access controls",
      "Changelog generation",
    ],
    cta: "Start free trial",
    featured: true,
  },
];

const Pricing = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 tracking-tight">
          Simple <span className="text-gradient">pricing</span>
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16 text-lg">
          One engineer saved 2 hours/week = $5K/year. This costs $49/month. No contest.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 flex flex-col ${
                plan.featured
                  ? "border-primary/40 bg-primary/5 border-glow-strong"
                  : "border-border bg-card"
              }`}
            >
              {plan.featured && (
                <div className="text-xs font-mono text-primary mb-4 uppercase tracking-widest">
                  Most popular
                </div>
              )}
              <h3 className="font-heading text-2xl font-bold mb-1">
                {plan.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {plan.description}
              </p>
              <div className="mb-8">
                <span className="text-4xl font-heading font-bold">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.featured ? "hero" : "heroOutline"}
                size="lg"
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
