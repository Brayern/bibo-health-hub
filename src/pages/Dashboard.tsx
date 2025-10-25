import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { HealthRiskAssessment } from "@/components/HealthRiskAssessment";
import { RiskTrends } from "@/components/RiskTrends";
import { 
  Heart, 
  Activity, 
  Target, 
  Moon, 
  Utensils, 
  Plus,
  TrendingUp,
  Calendar
} from "lucide-react";

interface HealthMetric {
  id: string;
  metric_type: string;
  value: number;
  unit: string;
  recorded_at: string;
  notes?: string;
}

interface HealthGoal {
  id: string;
  goal_type: string;
  target_value: number;
  target_unit: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // New metric form state
  const [newMetric, setNewMetric] = useState({
    metric_type: 'steps',
    value: '',
    unit: 'steps',
    notes: ''
  });

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    goal_type: 'steps',
    target_value: '',
    target_unit: 'steps',
    end_date: ''
  });

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMetrics();
      fetchGoals();
    }
  }, [user]);

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  };

  const fetchMetrics = async () => {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .order('recorded_at', { ascending: false })
      .limit(10);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch health metrics.",
      });
    } else {
      setMetrics(data || []);
    }
  };

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('health_goals')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch health goals.",
      });
    } else {
      setGoals(data || []);
    }
  };

  const addMetric = async () => {
    if (!newMetric.value || !user) return;

    const { error } = await supabase
      .from('health_metrics')
      .insert([{
        user_id: user.id,
        metric_type: newMetric.metric_type,
        value: parseFloat(newMetric.value),
        unit: newMetric.unit,
        notes: newMetric.notes || null
      }]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add health metric.",
      });
    } else {
      toast({
        title: "Success",
        description: "Health metric added successfully.",
      });
      setNewMetric({ metric_type: 'steps', value: '', unit: 'steps', notes: '' });
      fetchMetrics();
    }
  };

  const addGoal = async () => {
    if (!newGoal.target_value || !user) return;

    const { error } = await supabase
      .from('health_goals')
      .insert([{
        user_id: user.id,
        goal_type: newGoal.goal_type,
        target_value: parseFloat(newGoal.target_value),
        target_unit: newGoal.target_unit,
        start_date: new Date().toISOString().split('T')[0],
        end_date: newGoal.end_date || null
      }]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add health goal.",
      });
    } else {
      toast({
        title: "Success",
        description: "Health goal added successfully.",
      });
      setNewGoal({ goal_type: 'steps', target_value: '', target_unit: 'steps', end_date: '' });
      fetchGoals();
    }
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'heart_rate': return <Heart className="h-4 w-4" />;
      case 'steps': return <Activity className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      case 'weight': return <TrendingUp className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Health Dashboard</h1>
          <p className="text-muted-foreground">Track your wellness journey</p>
        </div>

        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="risk">Risk Assessment</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Health Metric
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="metric-type">Metric Type</Label>
                    <select
                      id="metric-type"
                      className="w-full p-2 border rounded-md"
                      value={newMetric.metric_type}
                      onChange={(e) => {
                        const type = e.target.value;
                        let unit = 'units';
                        switch (type) {
                          case 'steps': unit = 'steps'; break;
                          case 'heart_rate': unit = 'bpm'; break;
                          case 'weight': unit = 'kg'; break;
                          case 'sleep': unit = 'hours'; break;
                          case 'blood_pressure': unit = 'mmHg'; break;
                        }
                        setNewMetric({ ...newMetric, metric_type: type, unit });
                      }}
                    >
                      <option value="steps">Steps</option>
                      <option value="heart_rate">Heart Rate</option>
                      <option value="weight">Weight</option>
                      <option value="sleep">Sleep</option>
                      <option value="blood_pressure">Blood Pressure</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="metric-value">Value</Label>
                    <Input
                      id="metric-value"
                      type="number"
                      value={newMetric.value}
                      onChange={(e) => setNewMetric({ ...newMetric, value: e.target.value })}
                      placeholder="Enter value"
                    />
                  </div>
                  <div>
                    <Label htmlFor="metric-notes">Notes (optional)</Label>
                    <Input
                      id="metric-notes"
                      value={newMetric.notes}
                      onChange={(e) => setNewMetric({ ...newMetric, notes: e.target.value })}
                      placeholder="Add notes"
                    />
                  </div>
                  <Button onClick={addMetric} className="w-full">
                    Add Metric
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No metrics recorded yet. Add your first metric!
                      </p>
                    ) : (
                      metrics.map((metric) => (
                        <div key={metric.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            {getMetricIcon(metric.metric_type)}
                            <div>
                              <p className="font-medium capitalize">{metric.metric_type.replace('_', ' ')}</p>
                              {metric.notes && (
                                <p className="text-sm text-muted-foreground">{metric.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">
                              {metric.value} {metric.unit}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(metric.recorded_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Set New Goal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="goal-type">Goal Type</Label>
                    <select
                      id="goal-type"
                      className="w-full p-2 border rounded-md"
                      value={newGoal.goal_type}
                      onChange={(e) => {
                        const type = e.target.value;
                        let unit = 'units';
                        switch (type) {
                          case 'steps': unit = 'steps'; break;
                          case 'weight': unit = 'kg'; break;
                          case 'exercise': unit = 'minutes'; break;
                          case 'water': unit = 'glasses'; break;
                          case 'sleep': unit = 'hours'; break;
                        }
                        setNewGoal({ ...newGoal, goal_type: type, target_unit: unit });
                      }}
                    >
                      <option value="steps">Daily Steps</option>
                      <option value="weight">Weight Target</option>
                      <option value="exercise">Exercise Time</option>
                      <option value="water">Water Intake</option>
                      <option value="sleep">Sleep Duration</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="goal-value">Target Value</Label>
                    <Input
                      id="goal-value"
                      type="number"
                      value={newGoal.target_value}
                      onChange={(e) => setNewGoal({ ...newGoal, target_value: e.target.value })}
                      placeholder="Enter target"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-end-date">End Date (optional)</Label>
                    <Input
                      id="goal-end-date"
                      type="date"
                      value={newGoal.end_date}
                      onChange={(e) => setNewGoal({ ...newGoal, end_date: e.target.value })}
                    />
                  </div>
                  <Button onClick={addGoal} className="w-full">
                    Set Goal
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {goals.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No active goals. Set your first goal!
                      </p>
                    ) : (
                      goals.map((goal) => (
                        <div key={goal.id} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium capitalize">
                              {goal.goal_type.replace('_', ' ')} Goal
                            </h4>
                            <Badge variant="outline">Active</Badge>
                          </div>
                          <p className="text-lg font-semibold">
                            Target: {goal.target_value} {goal.target_unit}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Started: {new Date(goal.start_date).toLocaleDateString()}
                            {goal.end_date && (
                              <span>• Ends: {new Date(goal.end_date).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Nutrition Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nutrition tracking feature coming soon! Track your meals, calories, and macronutrients.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-6">
            <HealthRiskAssessment />
            <RiskTrends />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">{metrics.length}</p>
                  <p className="text-muted-foreground">Recorded entries</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Active Goals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">{goals.length}</p>
                  <p className="text-muted-foreground">Current targets</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">0</p>
                  <p className="text-muted-foreground">Days active</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;