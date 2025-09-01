import { Button } from "@/components/ui/button";
import biboIcon from "@/assets/bibo-icon.png";
import { Heart, Mail, Github, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-trust text-trust-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={biboIcon} alt="Bibo Project" className="w-10 h-10" />
              <div>
                <h3 className="text-xl font-bold">The Bibo Project</h3>
                <p className="text-trust-foreground/70 text-sm">Digital Health for All</p>
              </div>
            </div>
            <p className="text-trust-foreground/80 mb-6 max-w-md leading-relaxed">
              Empowering communities worldwide with accessible health information, 
              wellness tracking, and peer support to achieve UN SDG 3: Good Health and Well-being.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-trust-foreground/70 hover:text-trust-foreground">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-trust-foreground/70 hover:text-trust-foreground">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-trust-foreground/70 hover:text-trust-foreground">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Platform Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-trust-foreground/70 hover:text-trust-foreground transition-colors">Features</a></li>
              <li><a href="#" className="text-trust-foreground/70 hover:text-trust-foreground transition-colors">Dashboard</a></li>
              <li><a href="#" className="text-trust-foreground/70 hover:text-trust-foreground transition-colors">Community</a></li>
              <li><a href="#" className="text-trust-foreground/70 hover:text-trust-foreground transition-colors">Education</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-trust-foreground/70 hover:text-trust-foreground transition-colors">Health Guide</a></li>
              <li><a href="#" className="text-trust-foreground/70 hover:text-trust-foreground transition-colors">Research</a></li>
              <li><a href="#" className="text-trust-foreground/70 hover:text-trust-foreground transition-colors">UN SDG 3</a></li>
              <li><a href="#" className="text-trust-foreground/70 hover:text-trust-foreground transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="border-t border-trust-foreground/20 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h4 className="font-semibold mb-2 flex items-center justify-center">
              <Mail className="w-5 h-5 mr-2" />
              Stay Updated
            </h4>
            <p className="text-trust-foreground/70 text-sm mb-4">
              Get the latest health insights and platform updates
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-3 py-2 bg-trust-foreground/10 border border-trust-foreground/20 rounded-md text-sm text-trust-foreground placeholder:text-trust-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button variant="accent" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-trust-foreground/20 pt-8 text-center">
          <p className="text-trust-foreground/60 text-sm flex items-center justify-center">
            Made with <Heart className="w-4 h-4 mx-1 text-accent" /> for global health
            <span className="mx-2">•</span>
            © 2024 The Bibo Project
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;