import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Activity, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface HealthRiskForm {
  age: string;
  bmi: string;
  systolicBp: string;
  diastolicBp: string;
  glucoseLevel: string;
  smoking: boolean;
  alcoholConsumption: string;
  physicalActivity: string;
  familyHistory: boolean;
}

interface RiskAssessment {
  risk_level: 'low' | 'medium' | 'high';
  risk_score: number;
  health_tips: string[];
  created_at: string;
}

export const HealthRiskAssessment = () => {
  const [formData, setFormData] = useState<HealthRiskForm>({
    age: "",
    bmi: "",
    systolicBp: "",
    diastolicBp: "",
    glucoseLevel: "",
    smoking: false,
    alcoholConsumption: "none",
    physicalActivity: "moderate",
    familyHistory: false,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [latestAssessment, setLatestAssessment] = useState<RiskAssessment | null>(null);

  const handleInputChange = (field: keyof HealthRiskForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('assess-health-risk', {
        body: {
          age: parseInt(formData.age),
          bmi: parseFloat(formData.bmi),
          systolicBp: parseInt(formData.systolicBp),
          diastolicBp: parseInt(formData.diastolicBp),
          glucoseLevel: parseFloat(formData.glucoseLevel),
          smoking: formData.smoking,
          alcoholConsumption: formData.alcoholConsumption,
          physicalActivity: formData.physicalActivity,
          familyHistory: formData.familyHistory,
        }
      });

      if (error) throw error;

      setLatestAssessment(data.assessment);
      toast.success("Health risk assessment completed!");
    } catch (error: any) {
      console.error('Assessment error:', error);
      toast.error(error.message || "Failed to complete assessment");
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'high':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return '';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4" />;
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            AI Health Risk Assessment
          </CardTitle>
          <CardDescription>
            Enter your health information to get a personalized risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  required
                  min="1"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bmi">BMI (kg/m²)</Label>
                <Input
                  id="bmi"
                  type="number"
                  step="0.1"
                  value={formData.bmi}
                  onChange={(e) => handleInputChange('bmi', e.target.value)}
                  required
                  min="10"
                  max="60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="systolicBp">Systolic BP (mmHg)</Label>
                <Input
                  id="systolicBp"
                  type="number"
                  value={formData.systolicBp}
                  onChange={(e) => handleInputChange('systolicBp', e.target.value)}
                  required
                  min="70"
                  max="250"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diastolicBp">Diastolic BP (mmHg)</Label>
                <Input
                  id="diastolicBp"
                  type="number"
                  value={formData.diastolicBp}
                  onChange={(e) => handleInputChange('diastolicBp', e.target.value)}
                  required
                  min="40"
                  max="150"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="glucoseLevel">Glucose Level (mg/dL)</Label>
                <Input
                  id="glucoseLevel"
                  type="number"
                  step="0.1"
                  value={formData.glucoseLevel}
                  onChange={(e) => handleInputChange('glucoseLevel', e.target.value)}
                  required
                  min="50"
                  max="400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                <Select
                  value={formData.alcoholConsumption}
                  onValueChange={(value) => handleInputChange('alcoholConsumption', value)}
                >
                  <SelectTrigger id="alcoholConsumption">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="heavy">Heavy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="physicalActivity">Physical Activity</Label>
                <Select
                  value={formData.physicalActivity}
                  onValueChange={(value) => handleInputChange('physicalActivity', value)}
                >
                  <SelectTrigger id="physicalActivity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smoking">Smoking Status</Label>
                <Select
                  value={formData.smoking ? "yes" : "no"}
                  onValueChange={(value) => handleInputChange('smoking', value === "yes")}
                >
                  <SelectTrigger id="smoking">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="familyHistory">Family History</Label>
                <Select
                  value={formData.familyHistory ? "yes" : "no"}
                  onValueChange={(value) => handleInputChange('familyHistory', value === "yes")}
                >
                  <SelectTrigger id="familyHistory">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Assess My Risk'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {latestAssessment && (
        <Card>
          <CardHeader>
            <CardTitle>Your Risk Assessment Results</CardTitle>
            <CardDescription>
              Based on your health data from {new Date(latestAssessment.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg">
              <div className="flex items-center gap-3">
                {getRiskIcon(latestAssessment.risk_level)}
                <div>
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                  <Badge className={getRiskBadgeColor(latestAssessment.risk_level)}>
                    {latestAssessment.risk_level.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Risk Score</p>
                <p className="text-2xl font-bold">{latestAssessment.risk_score}/100</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Personalized Health Tips
              </h3>
              <ul className="space-y-2">
                {latestAssessment.health_tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 p-3 bg-accent rounded-lg">
                    <span className="text-primary font-semibold">{index + 1}.</span>
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
