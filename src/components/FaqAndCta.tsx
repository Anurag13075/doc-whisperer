import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How does AutoDocs know what has changed?",
    a: "A small GitHub Action posts a webhook on every merge. We pull the diff via the GitHub API, scope changes to affected modules, and only regenerate doc sections that touch the diff.",
  },
  {
    q: "Where do the generated docs live in repo?",
    a: "AutoDocs opens a pull request in a separate docs repo of your choosing. Nothing is published without a human review and merge.",
  },
  {
    q: "Which languages and frameworks are supported in autodocs ?",
    a: "Anything with readable source. We work best on TypeScript, JavaScript, Python, Go, and Rust today, with strong support for REST and GraphQL endpoints.",
  },
  {
    q: "Do you store my source code here ?",
    a: "No. We pull diffs at request time, hand them to the model, write the result to your docs PR, and discard the working copy.",
  },
  {
    q: "Can I customise the writing style?",
    a: "Yes. Provide example pages, a style guide, or a tone  of prompt and AutoDocs will match it across every generation.",
  },
];

const FaqAndCta = () => {
  return (
    <>
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto my-2">
          <div className="text-center mb-12">
            <p className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-4">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-[-0.04em] text-balance leading-[1]">
              Frequently asked questions
            </h2>
          </div>

          <div className="card-soft rounded-3xl p-2">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border last:border-b-0 px-5 py-2 ">
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline py-5">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 py-2">
        <div className="max-w-5xl mx-auto card-soft rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="relative">
            <p className="text-xs font-mono tracking-[0.2em] text-muted-foreground mb-5">READY TO START?</p>
            <h2 className="text-5xl md:text-7xl font-bold tracking-[-0.04em] leading-[0.95] text-balance mb-6">
              Stop writing docs.
              <br />
              <span className="text-muted-foreground/60">Start merging them.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg">
              Connect a repo, drop in the Action, and watch your first docs PR open in under a minute.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth">
                <Button variant="hero" size="lg" className="h-12 px-7 text-[15px]">
                  Open dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="heroOutline" size="lg" className="h-12 px-7 text-[15px]">
                <Github className="w-5 h-4 " />
                Star on GitHub
               </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default FaqAndCta;
