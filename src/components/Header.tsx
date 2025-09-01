import { Button } from "@/components/ui/button";
import biboIcon from "@/assets/bibo-icon.png";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src={biboIcon} alt="Bibo Project" className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold text-primary">The Bibo Project</h1>
            <p className="text-xs text-muted-foreground">Digital Health for All</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
          <a href="#impact" className="text-foreground hover:text-primary transition-colors">Impact</a>
          <a href="#community" className="text-foreground hover:text-primary transition-colors">Community</a>
          <Button variant="accent" size="sm">
            Join Platform
          </Button>
        </nav>
        
        <Button variant="outline" size="sm" className="md:hidden">
          Menu
        </Button>
      </div>
    </header>
  );
};

export default Header;