import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Github } from "lucide-react";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-20 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center">
            <span className="font-mono font-bold text-background text-sm">{"</>"}</span>
          </div>
          <span className="font-mono font-bold tracking-[0.18em] text-sm">AUTODOCS</span>
        </Link>

        {/* Center pill nav */}
        <nav className="hidden md:flex items-center gap-1 card-soft rounded-full px-2 py-2 text-sm">
          <a href="#how" className="px-4 py-1.5 rounded-full hover:bg-muted transition-colors">How it works</a>
          <a href="#pricing" className="px-4 py-1.5 rounded-full hover:bg-muted transition-colors">Pricing</a>
          <a href="#faq" className="px-4 py-1.5 rounded-full hover:bg-muted transition-colors">FAQ</a>
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-2">
          <Button variant="heroOutline" size="sm" className="hidden sm:inline-flex h-10 px-4">
            <Github className="w-4 h-4" />
            Star on GitHub
          </Button>
          <Link to="/auth">
            <Button variant="hero" size="sm" className="h-10 px-5">
              Get started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
