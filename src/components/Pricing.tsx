import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Solo",
    price: "$49",
    description: "For individual developers shipping fast.",
    features: [
      "Up to 3 repositories",
      "AI-generated API docs",
      "PR-based doc updates",
      "Community support",
    ],
    cta: "Start free trial",
    featured: false,
  },
  {
    name: "Team",
    price: "$149",
    description: "For engineering teams up to 10 repos.",
    features: [
      "Up to 10 repositories",
      "Everything in Solo",
      "Custom voice & templates",
      "Team access controls",
      "Changelog generation",
      "Priority support",
    ],
    cta: "Start free trial",
    featured: true,
  },
];

const Pricing = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-4">PRICING</p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-[-0.04em] text-balance max-w-3xl mx-auto leading-[1]">
            Cheaper than the <span className="text-muted-foreground/70">hours you waste</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 flex flex-col ${
                plan.featured
                  ? "bg-foreground text-background"
                  : "card-soft"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-2xl font-semibold tracking-tight">{plan.name}</h3>
                {plan.featured && (
                  <span className="text-[10px] font-mono tracking-widest pill bg-primary text-primary-foreground px-2.5 py-1">
                    POPULAR
                  </span>
                )}
              </div>
              <p className={`text-sm mb-6 ${plan.featured ? "text-background/60" : "text-muted-foreground"}`}>
                {plan.description}
              </p>
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-[-0.04em]">{plan.price}</span>
                <span className={plan.featured ? "text-background/60" : "text-muted-foreground"}>/mo</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check className={`w-4 h-4 shrink-0 ${plan.featured ? "text-primary" : "text-primary"}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/auth">
                <Button
                  variant={plan.featured ? "hero" : "heroOutline"}
                  size="lg"
                  className="w-full h-12"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
