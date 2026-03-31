import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-6">
        <div className="font-heading font-bold text-lg">
          auto<span className="text-primary">docs</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#" className="hover:text-foreground transition-colors">Docs</a>
        </nav>
        <Link to="/auth">
          <Button variant="hero" size="sm">
            Get started
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
