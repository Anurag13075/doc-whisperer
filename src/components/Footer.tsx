const Footer = () => {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-heading font-bold text-lg">
          auto<span className="text-primary">docs</span>
        </div>
        <nav className="flex gap-8 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Docs</a>
          <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
          <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </nav>
        <p className="text-sm text-muted-foreground">
          © 2026 AutoDocs. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
