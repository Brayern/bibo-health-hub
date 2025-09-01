import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Heart, Target, Globe, Award } from "lucide-react";

const outcomes = [
  {
    icon: TrendingUp,
    metric: "85%",
    title: "Increased Preventive Practices",
    description: "Users report significant improvement in preventive health behaviors and regular check-ups.",
    color: "text-success"
  },
  {
    icon: Heart,
    metric: "92%",
    title: "Improved Lifestyle Habits",
    description: "Better nutrition, exercise, and sleep patterns tracked across our community members.",
    color: "text-primary"
  },
  {
    icon: Users,
    metric: "50,000+",
    title: "Community Health Networks",
    description: "Strong peer support groups fostering collective wellness and knowledge sharing.",
    color: "text-secondary"
  },
  {
    icon: Target,
    metric: "12",
    title: "SDG 3 Targets Addressed",
    description: "Direct contribution to UN Sustainable Development Goal 3 health targets.",
    color: "text-accent"
  }
];

const sdgTargets = [
  "Reduce maternal mortality",
  "Reduce under-5 mortality",
  "Combat communicable diseases",
  "Reduce non-communicable diseases",
  "Strengthen substance abuse prevention",
  "Reduce road traffic deaths"
];

const Impact = () => {
  return (
    <section id="impact" className="py-20 bg-gradient-to-br from-primary-soft/20 to-secondary-soft/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            <Globe className="w-4 h-4 mr-2" />
            Global Impact
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Measurable Health Outcomes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform delivers tangible results that align with UN Sustainable Development Goals, 
            creating lasting positive change in global health and well-being.
          </p>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {outcomes.map((outcome, index) => (
            <Card key={index} className="text-center group hover:shadow-medium transition-smooth border-border/50 bg-card/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-bounce">
                  <outcome.icon className={`w-8 h-8 ${outcome.color}`} />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {outcome.metric}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {outcome.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {outcome.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* SDG Alignment */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-trust/5 border-trust/20">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-accent mr-3" />
                <h3 className="text-2xl font-bold text-foreground">
                  UN SDG 3 Alignment
                </h3>
              </div>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                The Bibo Project directly contributes to achieving United Nations Sustainable 
                Development Goal 3 targets for good health and well-being.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sdgTargets.map((target, index) => (
                  <div key={index} className="flex items-center p-3 bg-card rounded-lg border border-border/30">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-foreground">{target}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Impact;