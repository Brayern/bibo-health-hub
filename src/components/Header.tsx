import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out.",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  return (
    <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img src="/lovable-uploads/b3b956c9-9be1-495e-9970-ee5068ae0fd1.png" alt="Bibo Project" className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold text-primary">Bibo</h1>
            <p className="text-xs text-muted-foreground">Digital Health for All</p>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">Dashboard</Link>
          <Link to="/health-info" className="text-foreground hover:text-primary transition-colors">Health Info</Link>
          <Link to="/community" className="text-foreground hover:text-primary transition-colors">Community</Link>
          <Link to="/reminders" className="text-foreground hover:text-primary transition-colors">Reminders</Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="accent" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </nav>
        
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                <Link 
                  to="/dashboard" 
                  className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/health-info" 
                  className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  Health Info
                </Link>
                <Link 
                  to="/community" 
                  className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  Community
                </Link>
                <Link 
                  to="/reminders" 
                  className="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  Reminders
                </Link>
                
                <div className="border-t pt-4">
                  {user ? (
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        Welcome, {user.email}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button variant="accent" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;