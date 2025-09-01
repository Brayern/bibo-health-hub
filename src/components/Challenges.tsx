import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Heart, Shield, Users } from "lucide-react";

const challenges = [
  {
    icon: AlertTriangle,
    title: "Limited Health Access",
    description: "Many communities lack access to verified health information and quality healthcare resources.",
    color: "text-warning"
  },
  {
    icon: Heart,
    title: "Lifestyle Diseases",
    description: "Rising rates of diabetes, heart disease, and obesity require preventive intervention strategies.",
    color: "text-destructive"
  },
  {
    icon: Shield,
    title: "Preventive Care Gap",
    description: "Low awareness about preventive care and early detection of health conditions.",
    color: "text-primary"
  },
  {
    icon: Users,
    title: "Community Disconnect",
    description: "Weak community health networks limit collective wellness and mutual support systems.",
    color: "text-secondary"
  }
];

const Challenges = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Health Challenges We Address
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Understanding the global health challenges is the first step toward 
            building effective solutions that empower communities worldwide.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {challenges.map((challenge, index) => (
            <Card key={index} className="group hover:shadow-medium transition-smooth border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center group-hover:scale-110 transition-bounce">
                  <challenge.icon className={`w-8 h-8 ${challenge.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {challenge.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {challenge.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Challenges;