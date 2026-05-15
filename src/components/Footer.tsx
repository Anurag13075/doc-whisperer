const Footer = () => {
  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
            <span className="font-mono font-bold text-background text-xs">{"</>"}</span>
          </div>
          <span className="font-mono font-bold tracking-[0.18em] text-xs">AUTODOCS</span>
        </div>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
        </nav>
        <p className="text-xs font-mono tracking-wider text-muted-foreground">
          © 2026 AUTODOCS
        </p>
      </div>
    </footer>
  );
};

export default Footer;
