import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-health.jpg";
import { Users, Heart, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Digital health community" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Digital Health for
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Everyone</span>
          </h1>
          
          {/* Description */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Bibo for (Body in Body out) leverages technology to provide accessible health information, 
            wellness tracking, and community support, empowering individuals and communities 
            to live healthier lives.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="hero" 
              size="lg" 
              className="shadow-glow"
              onClick={() => navigate("/auth")}
            >
              Explore Platform
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/health-info")}
            >
              Learn More
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">50K+</div>
              <div className="text-sm text-muted-foreground">Community Members</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary-soft rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-2xl font-bold text-foreground">95%</div>
              <div className="text-sm text-muted-foreground">Health Improvement</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-soft rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div className="text-2xl font-bold text-foreground">1M+</div>
              <div className="text-sm text-muted-foreground">Health Insights</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;