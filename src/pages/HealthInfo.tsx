import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Brain, 
  Dumbbell, 
  Apple, 
  Stethoscope,
  BookOpen,
  ExternalLink,
  Users,
  Award,
  Clock
} from "lucide-react";

const HealthInfo = () => {
  const healthTopics = [
    {
      id: 1,
      category: "Physical Health",
      icon: Dumbbell,
      color: "bg-green-100 text-green-800",
      articles: [
        {
          title: "Benefits of Regular Exercise",
          summary: "Learn how consistent physical activity can improve your overall health and longevity.",
          readTime: "5 min read",
          tags: ["Exercise", "Fitness", "Health"]
        },
        {
          title: "Understanding Heart Health",
          summary: "Essential information about maintaining cardiovascular health through lifestyle choices.",
          readTime: "7 min read",
          tags: ["Heart", "Cardio", "Prevention"]
        },
        {
          title: "Building Muscle and Strength",
          summary: "A comprehensive guide to strength training for beginners and intermediate levels.",
          readTime: "10 min read",
          tags: ["Strength", "Muscle", "Training"]
        }
      ]
    },
    {
      id: 2,
      category: "Mental Health",
      icon: Brain,
      color: "bg-purple-100 text-purple-800",
      articles: [
        {
          title: "Managing Stress and Anxiety",
          summary: "Practical techniques for reducing stress and managing anxiety in daily life.",
          readTime: "6 min read",
          tags: ["Stress", "Anxiety", "Mental Wellness"]
        },
        {
          title: "The Importance of Sleep",
          summary: "How quality sleep affects your mental health and cognitive performance.",
          readTime: "8 min read",
          tags: ["Sleep", "Recovery", "Brain Health"]
        },
        {
          title: "Mindfulness and Meditation",
          summary: "Introduction to mindfulness practices that can improve mental clarity and emotional balance.",
          readTime: "5 min read",
          tags: ["Mindfulness", "Meditation", "Wellness"]
        }
      ]
    },
    {
      id: 3,
      category: "Nutrition",
      icon: Apple,
      color: "bg-orange-100 text-orange-800",
      articles: [
        {
          title: "Balanced Diet Fundamentals",
          summary: "Understanding macronutrients and creating a sustainable, healthy eating plan.",
          readTime: "9 min read",
          tags: ["Nutrition", "Diet", "Macros"]
        },
        {
          title: "Hydration and Health",
          summary: "The critical role of proper hydration in maintaining optimal body function.",
          readTime: "4 min read",
          tags: ["Hydration", "Water", "Health"]
        },
        {
          title: "Meal Planning for Success",
          summary: "Strategies for planning and preparing nutritious meals that fit your lifestyle.",
          readTime: "12 min read",
          tags: ["Meal Prep", "Planning", "Nutrition"]
        }
      ]
    },
    {
      id: 4,
      category: "Preventive Care",
      icon: Stethoscope,
      color: "bg-blue-100 text-blue-800",
      articles: [
        {
          title: "Regular Health Screenings",
          summary: "Important health screenings and when to schedule them for optimal prevention.",
          readTime: "7 min read",
          tags: ["Prevention", "Screening", "Healthcare"]
        },
        {
          title: "Vaccination and Immunity",
          summary: "Understanding the importance of vaccines in maintaining community and personal health.",
          readTime: "6 min read",
          tags: ["Vaccines", "Immunity", "Prevention"]
        },
        {
          title: "Early Warning Signs",
          summary: "Recognizing early symptoms that warrant medical attention and action.",
          readTime: "8 min read",
          tags: ["Symptoms", "Prevention", "Health"]
        }
      ]
    }
  ];

  const healthResources = [
    {
      name: "World Health Organization",
      description: "Global health information and guidelines",
      url: "https://www.who.int"
    },
    {
      name: "Centers for Disease Control",
      description: "Disease prevention and health promotion resources",
      url: "https://www.cdc.gov"
    },
    {
      name: "Mayo Clinic",
      description: "Comprehensive medical information and health advice",
      url: "https://www.mayoclinic.org"
    },
    {
      name: "American Heart Association",
      description: "Heart health and cardiovascular disease information",
      url: "https://www.heart.org"
    }
  ];

  const healthTips = [
    "Aim for at least 150 minutes of moderate exercise per week",
    "Drink 8 glasses of water daily to stay properly hydrated",
    "Get 7-9 hours of quality sleep each night",
    "Include 5 servings of fruits and vegetables in your daily diet",
    "Practice stress management techniques like deep breathing",
    "Schedule regular check-ups with your healthcare provider",
    "Limit processed foods and added sugars",
    "Take breaks from screens every 20 minutes"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Health Information</h1>
          <p className="text-muted-foreground">Evidence-based health information and resources</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Health Topics */}
            {healthTopics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <Card key={topic.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${topic.color.replace('text-', 'bg-').replace('-800', '-200')}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      {topic.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-1 gap-4">
                      {topic.articles.map((article, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-lg">{article.title}</h4>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {article.readTime}
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3">{article.summary}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                              {article.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Button variant="ghost" size="sm">
                              <BookOpen className="h-4 w-4 mr-1" />
                              Read Article
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* External Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Trusted Health Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {healthResources.map((resource, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">{resource.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                      <Button variant="outline" size="sm" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          Visit Site
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Health Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Daily Health Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthTips.slice(0, 4).map((tip, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4">
                  View More Tips
                </Button>
              </CardContent>
            </Card>

            {/* Health Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Health Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Physical Health</span>
                  <Badge variant="secondary">12 articles</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mental Health</span>
                  <Badge variant="secondary">8 articles</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nutrition</span>
                  <Badge variant="secondary">15 articles</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Preventive Care</span>
                  <Badge variant="secondary">10 articles</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Community Highlight */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community Highlight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm font-medium">Most Discussed Topic</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      "Mental Health and Wellness" has been the most active discussion this week
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Join Discussion
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Information */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Heart className="h-5 w-5" />
                  Emergency Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Emergency: 911</p>
                  <p>Poison Control: 1-800-222-1222</p>
                  <p>Crisis Text Line: Text HOME to 741741</p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Always seek immediate medical attention for emergencies
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInfo;