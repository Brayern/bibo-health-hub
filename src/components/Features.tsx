import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Activity, 
  Bell, 
  MessageSquare, 
  BookOpen,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Health Platform",
    description: "Cross-platform web and mobile application providing comprehensive health management tools accessible anywhere, anytime.",
    badge: "Core Platform",
    gradient: "bg-gradient-primary"
  },
  {
    icon: Activity,
    title: "Wellness Dashboard",
    description: "Integrated tracking for exercise, nutrition, sleep patterns, and vital signs with personalized insights and recommendations.",
    badge: "Personal Health",
    gradient: "bg-gradient-secondary"
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Intelligent medication reminders, health screening alerts, and preventive care notifications tailored to individual needs.",
    badge: "Preventive Care",
    gradient: "bg-gradient-accent"
  },
  {
    icon: MessageSquare,
    title: "Community Forum",
    description: "Secure peer support network with expert guidance, health discussions, and community-driven wellness initiatives.",
    badge: "Community",
    gradient: "bg-gradient-trust"
  },
  {
    icon: BookOpen,
    title: "Health Education",
    description: "Evidence-based health information hub with verified content, educational resources, and interactive learning modules.",
    badge: "Education",
    gradient: "bg-gradient-primary"
  },
  {
    icon: BarChart3,
    title: "Impact Analytics",
    description: "Real-time health metrics, community progress tracking, and contribution measurement toward UN SDG 3 targets.",
    badge: "Analytics",
    gradient: "bg-gradient-secondary"
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Core Solutions
          </Badge>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Comprehensive Health Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our integrated platform combines technology, community, and evidence-based practices 
            to create a holistic approach to digital health and wellness.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-strong transition-smooth border-border/50 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${feature.gradient} rounded-lg flex items-center justify-center group-hover:scale-110 transition-bounce`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;